
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where,
  updateDoc,
  doc,
  writeBatch,
  getDoc,
  orderBy,
  limit,
  arrayUnion,
  increment,
  setDoc,
  deleteDoc,
  Timestamp
} from "firebase/firestore";
import { db, auth } from "./firebase.ts";
import { SMMService, OrderStatus, Order, User, Ticket, SystemLog, Coupon, Provider, PanelConfig } from '../types.ts';

const DEFAULT_PROVIDER_URL = 'https://mesumax.com/api/v2';
const DEFAULT_PROVIDER_KEY = '3b7b44254918068c3e891907c533ac30f8ec72d7'; 

const USD_TO_INR_RATE = 87; 

export class SMMServiceAPI {
  private static async connect(url: string, key: string, params: Record<string, string | number>) {
    const body = new URLSearchParams();
    body.append('key', key);
    for (const [key, value] of Object.entries(params)) {
      body.append(key, value.toString());
    }

    const proxyUrl = `https://corsproxy.io/?${url}`;

    try {
      const response = await fetch(proxyUrl, {
        method: 'POST',
        body: body,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      return data;
    } catch (error: any) {
      this.logSystem('API', `Provider Connection Failed`, error.message, 'Critical');
      throw error;
    }
  }

  static async logSystem(type: SystemLog['type'], message: string, details: string, severity: SystemLog['severity']) {
    try {
      await addDoc(collection(db, "logs"), {
        type, message, details, severity,
        time: new Date().toLocaleString(),
        timestamp: Date.now()
      });
    } catch (e) {
      console.error("Logging failed", e);
    }
  }

  // --- Provider Management ---
  static async getProviders(): Promise<Provider[]> {
    const snap = await getDocs(collection(db, "providers"));
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Provider));
  }

  static async addProvider(provider: Omit<Provider, 'id'>) {
    await addDoc(collection(db, "providers"), provider);
  }

  static async updateProvider(id: string, provider: Partial<Provider>) {
    await updateDoc(doc(db, "providers", id), provider);
  }

  static async deleteProvider(id: string) {
    await deleteDoc(doc(db, "providers", id));
  }

  // --- Announcement Management ---
  static async getAnnouncements(): Promise<any[]> {
    try {
      const q = query(collection(db, "announcements"), orderBy("timestamp", "desc"));
      const snap = await getDocs(q);
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      // Fallback if index not ready
      const snap = await getDocs(collection(db, "announcements"));
      return snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as any))
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    }
  }

  static async addAnnouncement(content: string, type: 'info' | 'warning' | 'success') {
    await addDoc(collection(db, "announcements"), {
      content, type,
      timestamp: Date.now(),
      date: new Date().toLocaleString()
    });
  }

  static async deleteAnnouncement(id: string) {
    await deleteDoc(doc(db, "announcements", id));
  }

  // --- Order Management (Admin) ---
  static async updateOrderStatus(orderId: string, status: OrderStatus, refund: boolean = false) {
    const orderRef = doc(db, "orders", orderId);
    const orderSnap = await getDoc(orderRef);
    if (!orderSnap.exists()) return;

    const order = orderSnap.data() as Order;
    
    if (refund && order.userId && (order.status !== OrderStatus.CANCELLED && order.status !== OrderStatus.FAILED)) {
      const userRef = doc(db, "users", order.userId);
      await updateDoc(userRef, { balance: increment(order.charge) });
      await this.logSystem('WALLET', `Auto Refund`, `₹${order.charge} returned to user ${order.userId} for Order #${orderId}`, 'Info');
    }

    await updateDoc(orderRef, { status });
    await this.logSystem('ADMIN', `Order Update`, `Order #${orderId} set to ${status}`, 'Info');
  }

  static async syncOrderWithProvider(firestoreId: string, providerOrderId: string, providerUrl: string, providerKey: string) {
    try {
      const data = await this.connect(providerUrl, providerKey, { action: 'status', order: providerOrderId });
      if (data.status) {
        let mappedStatus = OrderStatus.PENDING;
        const s = data.status.toLowerCase();
        if (s.includes('completed')) mappedStatus = OrderStatus.COMPLETED;
        if (s.includes('progress')) mappedStatus = OrderStatus.IN_PROGRESS;
        if (s.includes('partial')) mappedStatus = OrderStatus.PARTIAL;
        if (s.includes('canceled') || s.includes('cancelled')) mappedStatus = OrderStatus.CANCELLED;
        if (s.includes('processing')) mappedStatus = OrderStatus.PROCESSING;
        if (s.includes('fail')) mappedStatus = OrderStatus.FAILED;

        await updateDoc(doc(db, "orders", firestoreId), { 
          status: mappedStatus,
          remains: data.remains || "0",
          start_count: data.start_count || "0"
        });
      }
    } catch (e) {
      console.error("Order sync failed", e);
    }
  }

  static async syncAllActiveOrders() {
    const q = query(collection(db, "orders"), where("status", "in", [OrderStatus.PENDING, OrderStatus.PROCESSING, OrderStatus.IN_PROGRESS]));
    const snap = await getDocs(q);
    
    for (const d of snap.docs) {
      const order = d.data() as Order;
      if (order.providerOrderId) {
        await this.syncOrderWithProvider(d.id, order.providerOrderId, DEFAULT_PROVIDER_URL, DEFAULT_PROVIDER_KEY);
      }
    }
  }

  // --- Transaction Verification ---
  static async getPendingTransactions(): Promise<any[]> {
    // FIX: Using in-memory sort to avoid requiring composite index on status + timestamp
    try {
      const q = query(collection(db, "transactions"), where("status", "==", "Pending"));
      const snap = await getDocs(q);
      return snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as any))
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    } catch (e) {
      console.error("Failed to fetch pending transactions", e);
      return [];
    }
  }

  static async verifyTransaction(txId: string, approve: boolean) {
    const txRef = doc(db, "transactions", txId);
    const txSnap = await getDoc(txRef);
    if (!txSnap.exists()) return;

    const tx = txSnap.data();
    if (tx.status !== 'Pending') return;

    if (approve) {
      const userRef = doc(db, "users", tx.userId);
      await updateDoc(userRef, { balance: increment(tx.amount + (tx.bonus || 0)) });
      await updateDoc(txRef, { status: 'Completed' });
      await this.logSystem('WALLET', `Deposit Approved`, `Manual deposit of ₹${tx.amount} approved for UID: ${tx.userId}`, 'Info');
    } else {
      await updateDoc(txRef, { status: 'Rejected' });
      await this.logSystem('WALLET', `Deposit Rejected`, `Manual deposit of ₹${tx.amount} rejected for UID: ${tx.userId}`, 'Warning');
    }
  }

  // --- Standard Logic ---
  static async getServices(): Promise<SMMService[]> {
    try {
      const data = await this.connect(DEFAULT_PROVIDER_URL, DEFAULT_PROVIDER_KEY, { action: 'services' });
      const rawServices = Array.isArray(data) ? data : [];
      const configDoc = await getDoc(doc(db, "config", "panel"));
      const markup = configDoc.exists() ? configDoc.data().globalMarkup : 35;

      return rawServices.map((item: any) => {
        const providerRateUSD = parseFloat(item.rate);
        const providerRateINR = providerRateUSD * USD_TO_INR_RATE;
        const sellingRate = providerRateINR + (providerRateINR * (markup / 100));

        return {
          service: Number(item.service),
          name: item.name,
          rate: sellingRate.toFixed(2),
          originalRate: providerRateINR.toFixed(2),
          min: item.min,
          max: item.max,
          category: item.category,
          type: item.type || 'Default',
          description: `High Quality ${item.category}`,
          dripfeed: !!item.dripfeed,
          refill: !!item.refill,
          cancel: !!item.cancel,
          enabled: true
        };
      });
    } catch (error) {
      return [];
    }
  }

  /**
   * Fetches orders for the current user.
   * FIX: Performed sorting in JavaScript to avoid composite index requirement (userId + timestamp).
   */
  static async getUserOrders(): Promise<Order[]> {
    if (!auth.currentUser) return [];
    try {
      const q = query(collection(db, "orders"), where("userId", "==", auth.currentUser.uid));
      const snap = await getDocs(q);
      return snap.docs
        .map(doc => ({ ...doc.data(), id: doc.id } as any))
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    } catch (e) {
      console.error("Failed to fetch user orders:", e);
      return [];
    }
  }

  static async placeOrder(user: User, serviceId: number, link: string, quantity: number): Promise<Order> {
    const services = await this.getServices();
    const service = services.find(s => s.service === serviceId);
    if (!service) throw new Error("Service unavailable.");

    const charge = (parseFloat(service.rate) * quantity) / 1000;
    const providerSpending = (parseFloat(service.originalRate || '0') * quantity) / 1000;
    const profit = charge - providerSpending;

    if (user.balance < charge) throw new Error("Insufficient balance.");

    const response = await this.connect(DEFAULT_PROVIDER_URL, DEFAULT_PROVIDER_KEY, {
      action: 'add', service: serviceId, link, quantity
    });

    const newOrder: Order = {
      id: Math.floor(100000 + Math.random() * 900000).toString(),
      providerOrderId: response.order.toString(),
      userId: auth.currentUser?.uid,
      username: user.username,
      serviceId,
      serviceName: service.name,
      link,
      quantity,
      charge,
      profit,
      providerSpending,
      status: OrderStatus.PENDING,
      createdAt: new Date().toLocaleString(),
      timestamp: Date.now(),
      canRefill: service.refill,
      remains: quantity.toString(),
      start_count: '0'
    };

    await addDoc(collection(db, "orders"), newOrder);
    await updateDoc(doc(db, "users", auth.currentUser!.uid), {
      balance: increment(-charge),
      totalSpent: increment(charge),
      profitContribution: increment(profit)
    });

    return newOrder;
  }

  static async getAllOrders(): Promise<Order[]> {
    try {
      const snap = await getDocs(query(collection(db, "orders"), orderBy("timestamp", "desc")));
      return snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as any));
    } catch (e) {
      // Fallback if index not ready
      const snap = await getDocs(collection(db, "orders"));
      return snap.docs
        .map(doc => ({ ...doc.data(), id: doc.id } as any))
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    }
  }

  static async getAllUsers(): Promise<User[]> {
    const snap = await getDocs(collection(db, "users"));
    return snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as User));
  }

  static async updateUserBalance(userId: string, amount: number, isAddition: boolean) {
    await updateDoc(doc(db, "users", userId), {
      balance: increment(isAddition ? amount : -amount)
    });
  }

  static async getTickets(userId?: string): Promise<Ticket[]> {
    try {
      let q = userId ? query(collection(db, "tickets"), where("userId", "==", userId)) : collection(db, "tickets");
      const snap = await getDocs(q);
      return snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Ticket))
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    } catch (e) {
      console.error("Failed to fetch tickets", e);
      return [];
    }
  }

  static async replyToTicket(ticketId: string, reply: string, role: 'admin' | 'user') {
    await updateDoc(doc(db, "tickets", ticketId), {
      status: role === 'admin' ? 'Answered' : 'Open',
      lastUpdate: new Date().toLocaleString(),
      messages: arrayUnion({ role, text: reply, time: new Date().toLocaleTimeString() })
    });
  }

  static async getPanelConfig(): Promise<PanelConfig> {
    const docSnap = await getDoc(doc(db, "config", "panel"));
    return docSnap.exists() ? docSnap.data() as PanelConfig : {
      name: 'NOTTY SMM',
      logo: '',
      favicon: '',
      banner: 'Welcome to NOTTY SMM Panel',
      bannerEnabled: true,
      globalMarkup: 35,
      terms: 'Standard Terms',
      privacy: 'Standard Privacy'
    };
  }

  static async updatePanelConfig(config: Partial<PanelConfig>) {
    await setDoc(doc(db, "config", "panel"), config, { merge: true });
  }

  static async getLogs(): Promise<SystemLog[]> {
    try {
      const snap = await getDocs(query(collection(db, "logs"), orderBy("timestamp", "desc"), limit(100)));
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as SystemLog));
    } catch (e) {
      const snap = await getDocs(collection(db, "logs"));
      return snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as SystemLog))
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
        .slice(0, 100);
    }
  }

  static async clearLogs() {
    const snap = await getDocs(collection(db, "logs"));
    const batch = writeBatch(db);
    snap.docs.forEach(d => batch.delete(d.ref));
    await batch.commit();
  }

  static async syncOrders(): Promise<Order[]> {
    return this.getUserOrders();
  }

  static async createTicket(ticket: Ticket) {
    await addDoc(collection(db, "tickets"), ticket);
  }

  static async closeTicket(ticketId: string) {
    await updateDoc(doc(db, "tickets", ticketId), { status: 'Closed' });
  }

  static async deleteTicket(ticketId: string) {
    await deleteDoc(doc(db, "tickets", ticketId));
  }

  static async createTransaction(userId: string, amount: number, method: string, bonus: number, status: string = 'Pending') {
    await addDoc(collection(db, "transactions"), {
      userId, amount, method, bonus, status,
      date: new Date().toLocaleString(),
      timestamp: Date.now()
    });
  }

  /**
   * Fetches transactions for the current user.
   * FIX: Performed sorting in JavaScript to avoid composite index requirement.
   */
  static async getTransactions(userId: string): Promise<any[]> {
    try {
      const q = query(collection(db, "transactions"), where("userId", "==", userId));
      const snap = await getDocs(q);
      return snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a: any, b: any) => (b.timestamp || 0) - (a.timestamp || 0));
    } catch (e) {
      console.error("Failed to fetch transactions:", e);
      return [];
    }
  }

  static async getProviderBalance(): Promise<{ balance: string; currency: string }> {
    try {
      const data = await this.connect(DEFAULT_PROVIDER_URL, DEFAULT_PROVIDER_KEY, { action: 'balance' });
      return { balance: (parseFloat(data.balance) * USD_TO_INR_RATE).toFixed(2), currency: 'INR' };
    } catch (error) {
      return { balance: '0.00', currency: 'INR' };
    }
  }

  static async updateUserRole(userId: string, group: User['group']) {
    await updateDoc(doc(db, "users", userId), { group });
  }

  static async setUserStatus(userId: string, status: 'active' | 'banned') {
    await updateDoc(doc(db, "users", userId), { status });
  }

  static async createCoupon(coupon: Omit<Coupon, 'id'>) {
    await addDoc(collection(db, "coupons"), coupon);
  }

  static async deleteCoupon(id: string) {
    await deleteDoc(doc(db, "coupons", id));
  }

  static async getCoupons(): Promise<Coupon[]> {
    const snap = await getDocs(collection(db, "coupons"));
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Coupon));
  }

  static async requestRefill(orderId: string) {
    const orderRef = doc(db, "orders", orderId);
    const orderSnap = await getDoc(orderRef);
    if (!orderSnap.exists()) return;
    const orderData = orderSnap.data() as Order;
    await this.connect(DEFAULT_PROVIDER_URL, DEFAULT_PROVIDER_KEY, { action: 'refill', order: orderData.providerOrderId || '' });
    await updateDoc(orderRef, { refillStatus: 'Requested' });
  }
}
