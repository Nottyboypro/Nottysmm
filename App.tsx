
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, ShoppingBag, History, Wallet, LifeBuoy, 
  ShieldCheck, Bell, LogOut, Menu, Bot, PackageSearch, Settings2
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
import AdminPaymentManager from './components/AdminPaymentManager.tsx';
import AdminSystemLogs from './components/AdminSystemLogs.tsx';
import AdminCouponManager from './components/AdminCouponManager.tsx';
import AdminCMSManager from './components/AdminCMSManager.tsx';
import AdminPricingManager from './components/AdminPricingManager.tsx';
import AISupport from './components/AISupport.tsx';
import Auth from './components/Auth.tsx';
import UserProfile from './components/UserProfile.tsx';
import { SMMServiceAPI } from './services/smmService.ts';
import { AuthService } from './services/authService.ts';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
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
        onClick={() => setActiveTab(id)}
        className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all duration-200 ${
          isActive 
            ? 'bg-blue-600 text-white shadow-lg' 
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }`}
      >
        <Icon size={18} />
        <span className={`${!isSidebarOpen && 'hidden md:hidden'} font-medium text-xs`}>{label}</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-200">
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} hidden md:flex flex-col bg-slate-900 border-r border-slate-800 transition-all duration-300 fixed inset-y-0 left-0 z-50`}>
        <div className="p-6 flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg"><ShoppingBag className="text-white" size={24} /></div>
          <h1 className={`text-xl font-bold ${!isSidebarOpen && 'hidden'}`}>NOTTY<span className="text-blue-500">SMM</span></h1>
        </div>
        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto no-scrollbar pb-10">
          <NavItem id="dashboard" label="Dashboard" icon={LayoutDashboard} />
          <NavItem id="new-order" label="New Order" icon={ShoppingBag} />
          <NavItem id="services" label="Services" icon={Menu} />
          <NavItem id="history" label="Order History" icon={History} />
          <NavItem id="wallet" label="Add Funds" icon={Wallet} />
          <NavItem id="support" label="Support" icon={LifeBuoy} />
          <NavItem id="ai-support" label="AI Support" icon={Bot} />
          {user?.isAdmin && (
            <>
              <div className="px-4 py-6 text-[9px] font-black text-blue-500 uppercase">Admin Infrastructure</div>
              <NavItem id="admin" label="Analytics" icon={ShieldCheck} />
              <NavItem id="admin-orders" label="Order Flow" icon={PackageSearch} />
              <NavItem id="admin-users" label="User Manager" icon={Settings2} />
            </>
          )}
          <div className="pt-6 mt-6 border-t border-slate-800 px-4">
            <button onClick={handleLogout} className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-all duration-200">
              <LogOut size={18} />
              <span className={`${!isSidebarOpen && 'hidden md:hidden'} font-medium text-xs`}>Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-800 rounded-lg hidden md:block"><Menu size={20} /></button>
            <div>
              <h2 className="text-lg font-semibold capitalize">{activeTab.replace('-', ' ')}</h2>
              <span className="text-[10px] font-black text-blue-500 uppercase">User ID: #{user?.id}</span>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] text-slate-500 uppercase font-black">Cloud Wallet</span>
              <span className="text-xl font-black text-emerald-500">₹{user?.balance.toFixed(2)}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black">{user?.username.substring(0, 2).toUpperCase()}</div>
          </div>
        </header>

        <div className="p-6 max-w-7xl mx-auto">
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
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
