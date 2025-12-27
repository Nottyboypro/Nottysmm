
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, ShoppingBag, History, Wallet, LifeBuoy, 
  ShieldCheck, Bell, LogOut, Menu, Bot, PackageSearch, Settings2,
  MailQuestion, Percent, Ticket as TicketIcon, CreditCard, Monitor, Activity,
  X, User as UserIcon, Send, MessageCircle, Globe, Megaphone
} from 'lucide-react';
import { auth } from './services/firebase.ts';
import { onAuthStateChanged } from 'firebase/auth';
import { User, Order } from './types.ts';
import Dashboard from './components/Dashboard.tsx';
import Services from './components/Services.tsx';
import NewOrder from './components/NewOrder.tsx';
import OrderHistory from './components/OrderHistory.tsx';
import AddFunds from './components/AddFunds.tsx';
import SupportTickets from './components/SupportTickets.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import ServiceManager from './components/ServiceManager.tsx';
import AdminOrderManager from './components/AdminOrderManager.tsx';
import AdminUserManager from './components/AdminUserManager.tsx';
import AdminTicketManager from './components/AdminTicketManager.tsx';
import AdminPricingManager from './components/AdminPricingManager.tsx';
import AdminPaymentManager from './components/AdminPaymentManager.tsx';
import AdminCouponManager from './components/AdminCouponManager.tsx';
import AdminSystemLogs from './components/AdminSystemLogs.tsx';
import AdminCMSManager from './components/AdminCMSManager.tsx';
import AdminProviderManager from './components/AdminProviderManager.tsx';
import AdminNewsManager from './components/AdminNewsManager.tsx';
import AISupport from './components/AISupport.tsx';
import Auth from './components/Auth.tsx';
import UserProfile from './components/UserProfile.tsx';
import { SMMServiceAPI } from './services/smmService.ts';
import { AuthService } from './services/authService.ts';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const profile = await AuthService.getCurrentUserProfile(fbUser.uid);
        if (profile) {
          setUser(profile);
          setIsAuthenticated(true);
          const userOrders = await SMMServiceAPI.getUserOrders();
          setOrders(userOrders);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await AuthService.logout();
    setActiveTab('dashboard');
  };

  const addOrder = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
  };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center font-black uppercase tracking-widest text-slate-500">Connecting to Cloud...</div>;
  if (!isAuthenticated) return <Auth onLogin={(u) => { setUser(u); setIsAuthenticated(true); }} />;

  const NavItem = ({ id, label, icon: Icon }: { id: string, label: string, icon: any }) => {
    const isActive = activeTab === id;
    return (
      <button
        onClick={() => {
          setActiveTab(id);
          setSidebarOpen(false);
        }}
        className={`flex items-center space-x-3 w-full px-4 py-3.5 rounded-2xl transition-all duration-200 ${
          isActive 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }`}
      >
        <Icon size={18} />
        <span className="font-bold text-sm">{label}</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-[#050810] flex text-slate-200 overflow-x-hidden pb-20 md:pb-0">
      <aside className={`fixed inset-y-0 left-0 z-[100] w-72 bg-[#0a0f1d] border-r border-white/5 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isSidebarOpen ? 'translate-x-0 shadow-2xl shadow-blue-950/50' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-600/30"><ShoppingBag className="text-white" size={24} /></div>
            <h1 className="text-2xl font-black tracking-tighter">NOTTY<span className="text-blue-500">SMM</span></h1>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden p-2 text-slate-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto no-scrollbar pb-10">
          <div className="px-4 py-2 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-2">User Interface</div>
          <NavItem id="dashboard" label="Home Hub" icon={LayoutDashboard} />
          <NavItem id="new-order" label="Fast Order" icon={ShoppingBag} />
          <NavItem id="services" label="Global Catalog" icon={Menu} />
          <NavItem id="history" label="Order Flow" icon={History} />
          <NavItem id="wallet" label="Add Balance" icon={Wallet} />
          <NavItem id="support" label="Support Desk" icon={LifeBuoy} />
          <NavItem id="ai-support" label="AI Assistant" icon={Bot} />
          
          {user?.isAdmin && (
            <>
              <div className="px-4 py-6 text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-2">Authority Control</div>
              <NavItem id="admin" label="Analytics" icon={ShieldCheck} />
              <NavItem id="admin-orders" label="Order Relay" icon={PackageSearch} />
              <NavItem id="admin-users" label="Users" icon={Settings2} />
              <NavItem id="admin-providers" label="Provider Nodes" icon={Globe} />
              <NavItem id="admin-news" label="News Engine" icon={Megaphone} />
              <NavItem id="admin-pricing" label="Profit Logic" icon={Percent} />
              <NavItem id="admin-coupons" label="Promo Hub" icon={TicketIcon} />
              <NavItem id="admin-cms" label="Branding" icon={Monitor} />
              <NavItem id="admin-logs" label="System Audit" icon={Activity} />
            </>
          )}
          
          <div className="pt-6 mt-6 border-t border-white/5 px-4">
            <button onClick={handleLogout} className="flex items-center space-x-3 w-full px-4 py-4 rounded-2xl text-rose-500 hover:bg-rose-500/10 transition-all font-black uppercase text-[10px] tracking-widest">
              <LogOut size={18} />
              <span>Logout Terminal</span>
            </button>
          </div>
        </nav>
      </aside>

      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex-1 transition-all duration-300 md:ml-72 min-h-screen flex flex-col">
        <header className="sticky top-0 z-40 bg-[#050810]/80 backdrop-blur-xl border-b border-white/5 px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={() => setSidebarOpen(true)} className="p-2.5 bg-slate-900 border border-white/5 rounded-xl md:hidden text-slate-400 hover:text-white transition-all shadow-lg active:scale-90">
              <Menu size={20} />
            </button>
            <div className="hidden md:block">
              <h2 className="text-xl font-black text-white capitalize tracking-tight">{activeTab.replace('admin-', '').replace('-', ' ')}</h2>
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">SECURE NODE: {user?.username}</span>
            </div>
            <div className="md:hidden flex items-center space-x-2">
               <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-600/20"><ShoppingBag size={18} /></div>
               <span className="font-black text-lg tracking-tighter">NOTTY</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 md:space-x-6">
            <div className="flex flex-col items-end">
              <span className="text-[8px] text-slate-600 uppercase font-black tracking-widest leading-none">Credit</span>
              <span className="text-lg md:text-xl font-black text-emerald-500 tracking-tighter">₹{user?.balance.toFixed(2)}</span>
            </div>
            <button 
              onClick={() => setActiveTab('profile')}
              className="w-10 h-10 md:w-12 md:h-12 rounded-[1rem] bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-black text-white shadow-xl shadow-blue-900/30 transition-all hover:scale-105 active:scale-95 border border-white/10"
            >
              {user?.username.substring(0, 1).toUpperCase()}
            </button>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full flex-1">
          {activeTab === 'dashboard' && user && <Dashboard user={user} orders={orders} />}
          {activeTab === 'services' && <Services />}
          {activeTab === 'new-order' && user && <NewOrder user={user} setUser={setUser} addOrder={addOrder} />}
          {activeTab === 'history' && <OrderHistory orders={orders} setOrders={setOrders} />}
          {activeTab === 'wallet' && user && <AddFunds user={user} setUser={setUser} />}
          {activeTab === 'support' && user && <SupportTickets user={user} />}
          {activeTab === 'ai-support' && <AISupport />}
          {activeTab === 'profile' && user && <UserProfile user={user} setUser={setUser} />}
          
          {user?.isAdmin && (
            <>
              {activeTab === 'admin' && <AdminDashboard />}
              {activeTab === 'admin-orders' && <AdminOrderManager />}
              {activeTab === 'admin-users' && <AdminUserManager />}
              {activeTab === 'admin-providers' && <AdminProviderManager />}
              {activeTab === 'admin-news' && <AdminNewsManager />}
              {activeTab === 'admin-tickets' && <AdminTicketManager />}
              {activeTab === 'admin-pricing' && <AdminPricingManager />}
              {activeTab === 'admin-coupons' && <AdminCouponManager />}
              {activeTab === 'admin-cms' && <AdminCMSManager />}
              {activeTab === 'admin-logs' && <AdminSystemLogs />}
            </>
          )}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0f1d]/90 backdrop-blur-2xl border-t border-white/5 flex items-center justify-around py-2 px-2 md:hidden">
        {[
          { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
          { id: 'new-order', label: 'Order', icon: ShoppingBag },
          { id: 'wallet', label: 'Funds', icon: Wallet },
          { id: 'support', label: 'Support', icon: LifeBuoy },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center w-full py-2 rounded-2xl transition-all duration-300 ${
              activeTab === item.id ? 'text-blue-500 scale-110' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <item.icon size={22} className={activeTab === item.id ? 'fill-blue-500/10' : ''} />
            <span className="text-[10px] font-black uppercase tracking-widest mt-1">{item.label}</span>
          </button>
        ))}
      </nav>

      <a 
        href="https://t.me/NOTTYSupportChat" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-24 right-4 z-[60] bg-[#229ED9] p-4 rounded-full shadow-2xl shadow-blue-600/50 text-white animate-bounce md:bottom-8 md:right-8 transition-transform hover:scale-110 active:scale-90"
      >
        <Send size={28} />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-950 rounded-full"></div>
      </a>
    </div>
  );
};

export default App;
