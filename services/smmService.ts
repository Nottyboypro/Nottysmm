
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where,
  updateDoc,
  doc,
  writeBatch,
  orderBy,
  limit
} from "firebase/firestore";
import { db, auth } from "./firebase.ts";
import { SMMService, OrderStatus, Order, User, Ticket, SystemLog, Coupon } from '../types.ts';

const PROVIDER_URL = 'https://mesumax.com/api/v2';
const PROVIDER_KEY = '3b7b44254918068c3e891907c533ac30f8ec72d7'; 

const CORS_PROXY = 'https://corsproxy.io/?'; 

const USD_TO_INR_RATE = 87; 
const FIXED_PROFIT_ADDITION = 100.00; 

export class SMMServiceAPI {
  // ... (Existing connect and getServices methods remain unchanged)
  private static async connect(params: Record<string, string | number>) {
    const body = new URLSearchParams();
    body.append('key', PROVIDER_KEY);
    for (const [key, value] of Object.entries(params)) {
      body.append(key, value.toString());
    }

    const proxyUrl = `https://corsproxy.io/?${PROVIDER_URL}`;

    try {
      const response = await fetch(proxyUrl, {
        method: 'POST',
        body: body,
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      const text = await response.text();
      try {
        const data = JSON.parse(text);
        if (data.error) {
           console.error("Mesumax API Error:", data.error);
           throw new Error(typeof data.error === 'string' ? data.error : JSON.stringify(data.error));
        }
        return data;
      } catch (jsonError) {
        console.error("Invalid JSON response:", text);
        throw new Error("Invalid response from provider.");
      }

    } catch (error: any) {
      console.error("API Connection Failed:", error.message || String(error));
      throw error;
    }
  }

  static async getServices(): Promise<SMMService[]> {
    try {
      const data = await this.connect({ action: 'services' });
      const rawServices = Array.isArray(data) ? data : [];

      return rawServices.map((item: any) => {
        const providerRateUSD = parseFloat(item.rate);
        const providerRateINR = providerRateUSD * USD_TO_INR_RATE;
        const sellingRate = providerRateINR + FIXED_PROFIT_ADDITION;

        return {
          service: Number(item.service),
          name: item.name,
          rate: sellingRate.toFixed(2),
          min: item.min,
          max: item.max,
          category: item.category,
          type: item.type || 'Default',
          description: `High Quality ${item.category} - Instant Start`,
          dripfeed: !!item.dripfeed,
          refill: !!item.refill,
          cancel: !!item.cancel
        };
      });
    } catch (error: any) {
      console.error("Failed to fetch services.", error);
      return [];
    }
  }

  static async getProviderBalance(): Promise<{ balance: string; currency: string }> {
    try {
      const data = await this.connect({ action: 'balance' });
      const balanceUSD = parseFloat(data.balance || '0');
      const balanceINR = (balanceUSD * USD_TO_INR_RATE).toFixed(2);
      return { balance: balanceINR, currency: 'INR' };
    } catch (error) {
      return { balance: '0.00', currency: 'INR' };
    }
  }

  static async placeOrder(user: User, serviceId: number, link: string, quantity: number): Promise<Order> {
    const services = await this.getServices();
    const service = services.find(s => s.service === serviceId);
    
    if (!service) throw new Error("Service not available currently. Please refresh.");
    
    const ratePer1000 = parseFloat(service.rate);
    const charge = (ratePer1000 * quantity) / 1000;
    const profit = (FIXED_PROFIT_ADDITION * quantity) / 1000;

    if (user.balance < charge) {
      throw new Error("Insufficient balance. Please add funds.");
    }

    const response = await this.connect({
      action: 'add',
      service: serviceId,
      link: link,
      quantity: quantity
    });

    if (!response.order) {
      throw new Error("Provider failed to accept order. " + (response.error || ""));
    }

    const newOrder: Order = {
      id: Math.floor(100000 + Math.random() * 900000).toString(),
      providerOrderId: response.order.toString(),
      userId: auth.currentUser?.uid,
      username: user.username,
      serviceId: serviceId,
      serviceName: service.name,
      link: link,
      quantity: quantity,
      charge: charge,
      profit: profit,
      status: OrderStatus.PENDING,
      createdAt: new Date().toLocaleString(),
      timestamp: Date.now(),
      canRefill: service.refill,
      remains: quantity.toString(),
      start_count: '0'
    };

    await addDoc(collection(db, "orders"), newOrder);

    const userRef = doc(db, "users", auth.currentUser!.uid);
    await updateDoc(userRef, {
      balance: user.balance - charge,
      totalSpent: (user.totalSpent || 0) + charge
    });

    return newOrder;
  }

  static async syncOrders(): Promise<Order[]> {
    if (!auth.currentUser) return [];

    const q = query(collection(db, "orders"), where("userId", "==", auth.currentUser.uid));
    
    try {
      const snap = await getDocs(q);
      const localOrders = snap.docs.map(snapshot => ({ ...snapshot.data(), firestoreId: snapshot.id } as Order & { firestoreId: string }));

      localOrders.sort((a, b) => {
        if (a.timestamp && b.timestamp) return b.timestamp - a.timestamp;
        return (b.createdAt || '').localeCompare(a.createdAt || '');
      });

      const activeOrders = localOrders.filter(o => 
        o.status !== OrderStatus.COMPLETED && 
        o.status !== OrderStatus.CANCELLED &&
        o.status !== OrderStatus.PARTIAL && 
        o.providerOrderId 
      );

      if (activeOrders.length === 0) return localOrders;

      const orderIds = activeOrders.map(o => o.providerOrderId).join(',');
      
      const response = await this.connect({
        action: 'status',
        orders: orderIds
      });

      const batch = writeBatch(db);
      let updatesCount = 0;

      activeOrders.forEach(order => {
        if (order.providerOrderId && response[order.providerOrderId]) {
          const apiData = response[order.providerOrderId];
          if(apiData.error) return;

          let newStatus = order.status;
          const apiStatusLower = apiData.status?.toLowerCase() || '';

          if (apiStatusLower === 'completed') newStatus = OrderStatus.COMPLETED;
          else if (apiStatusLower === 'processing') newStatus = OrderStatus.PROCESSING;
          else if (apiStatusLower === 'in progress') newStatus = OrderStatus.IN_PROGRESS;
          else if (apiStatusLower === 'pending') newStatus = OrderStatus.PENDING;
          else if (apiStatusLower === 'partial') newStatus = OrderStatus.PARTIAL;
          else if (apiStatusLower === 'canceled' || apiStatusLower === 'cancelled') newStatus = OrderStatus.CANCELLED;

          if (newStatus !== order.status || (apiData.remains && apiData.remains !== order.remains)) {
            const orderRef = doc(db, "orders", order.firestoreId as string);
            batch.update(orderRef, {
              status: newStatus,
              remains: apiData.remains || order.remains,
              start_count: apiData.start_count || order.start_count
            });
            updatesCount++;
            
            order.status = newStatus;
            order.remains = apiData.remains;
            order.start_count = apiData.start_count;
          }
        }
      });

      if (updatesCount > 0) {
        await batch.commit();
      }
      
      return localOrders;

    } catch (e: any) {
      console.error("Sync Error:", e.message || String(e));
      return [];
    }
  }

  static async getUserOrders(): Promise<Order[]> {
    return this.syncOrders();
  }

  static async requestRefill(internalOrderId: string): Promise<any> {
    const q = query(collection(db, "orders"), where("id", "==", internalOrderId));
    const snap = await getDocs(q);
    
    if (snap.empty) throw new Error("Order not found");
    
    const orderDoc = snap.docs[0];
    const orderData = orderDoc.data() as Order;

    if (!orderData.providerOrderId) throw new Error("This order is not linked to Mesumax.");

    const response = await this.connect({ 
      action: 'refill', 
      order: orderData.providerOrderId 
    });

    if (response.error) throw new Error(response.error);

    await updateDoc(orderDoc.ref, { refillStatus: 'Requested' });
    return response;
  }

  // --- Real DB Utilities for Admin & Features ---

  static async getAllOrders(): Promise<Order[]> {
    const snap = await getDocs(collection(db, "orders"));
    const orders = snap.docs.map(doc => doc.data() as Order);
    return orders.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  }

  static async getAllUsers(): Promise<User[]> {
    const snap = await getDocs(collection(db, "users"));
    return snap.docs.map(doc => doc.data() as User);
  }

  static async createTransaction(userId: string, amount: number, method: string, bonus: number = 0) {
    await addDoc(collection(db, "transactions"), {
      userId,
      amount,
      bonus,
      method,
      status: 'Completed',
      date: new Date().toLocaleString(),
      timestamp: Date.now()
    });
  }

  static async getTransactions(userId?: string): Promise<any[]> {
    let q;
    if (userId) {
      q = query(collection(db, "transactions"), where("userId", "==", userId));
    } else {
      q = query(collection(db, "transactions"));
    }
    const snap = await getDocs(q);
    const txs = snap.docs.map(doc => ({id: doc.id, ...doc.data()}));
    return txs.sort((a: any, b: any) => b.timestamp - a.timestamp);
  }

  static async createTicket(ticket: Ticket) {
    await addDoc(collection(db, "tickets"), ticket);
  }

  static async getTickets(userId?: string): Promise<Ticket[]> {
    let q;
    if (userId) {
       q = query(collection(db, "tickets"), where("userId", "==", userId));
    } else {
       q = query(collection(db, "tickets"));
    }
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({id: doc.id, ...doc.data()} as Ticket));
  }

  static async getLogs(): Promise<SystemLog[]> {
    const snap = await getDocs(collection(db, "logs"));
    return snap.docs.map(doc => doc.data() as SystemLog);
  }
  
  static async getCoupons(): Promise<Coupon[]> {
    const snap = await getDocs(collection(db, "coupons"));
    return snap.docs.map(doc => doc.data() as Coupon);
  }
}
