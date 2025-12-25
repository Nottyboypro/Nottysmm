
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  History, 
  Wallet, 
  LifeBuoy, 
  ShieldCheck, 
  Bell, 
  LogOut,
  Menu,
  X,
  Bot,
  User as UserIcon,
  CheckCircle2,
  AlertCircle,
  Settings2,
  Users,
  PackageSearch,
  DollarSign,
  Ticket,
  Activity,
  CreditCard,
  Palette
} from 'lucide-react';
import { User, Notification } from './types.ts';
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
import AdminPricingManager from './components/AdminPricingManager.tsx';
import AdminPaymentManager from './components/AdminPaymentManager.tsx';
import AdminCouponManager from './components/AdminCouponManager.tsx';
import AdminSystemLogs from './components/AdminSystemLogs.tsx';
import AdminCMSManager from './components/AdminCMSManager.tsx';
import AISupport from './components/AISupport.tsx';
import Auth from './components/Auth.tsx';
import UserProfile from './components/UserProfile.tsx';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', title: 'Order Completed', message: 'Your order #12845 is now finished.', time: '2m ago', read: false, type: 'order' },
    { id: '2', title: 'Wallet Recharge', message: 'Successfully added $50.00 to your wallet.', time: '1h ago', read: true, type: 'wallet' },
  ]);

  // Listen for /admin route
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/admin') {
      setActiveTab('admin');
    }
  }, []);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    
    const path = window.location.pathname;
    // If the user lands on /admin but isn't an admin, reset to dashboard
    if (path === '/admin' && !userData.isAdmin) {
      setActiveTab('dashboard');
      window.history.replaceState({}, '', '/');
    } else if (path === '/admin' && userData.isAdmin) {
      setActiveTab('admin');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setActiveTab('dashboard');
    window.history.pushState({}, '', '/');
  };

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  const NavItem = ({ id, label, icon: Icon }: { id: string, label: string, icon: any }) => {
    const isActive = activeTab === id;
    return (
      <button
        onClick={() => {
          setActiveTab(id);
          setMobileMenuOpen(false);
          // Update URL for admin
          if (id === 'admin') {
             window.history.pushState({}, '', '/admin');
          } else {
             window.history.pushState({}, '', '/');
          }
        }}
        className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all duration-200 ${
          isActive 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
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
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } hidden md:flex flex-col bg-slate-900 border-r border-slate-800 transition-all duration-300 fixed inset-y-0 left-0 z-50`}
      >
        <div className="p-6 flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <ShoppingBag className="text-white" size={24} />
          </div>
          <h1 className={`text-xl font-bold tracking-tight ${!isSidebarOpen && 'hidden'}`}>
            NOTTY<span className="text-blue-500">SMM</span>
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto no-scrollbar pb-10">
          <div className={`px-4 py-2 text-[9px] font-black text-slate-600 uppercase tracking-widest ${!isSidebarOpen && 'hidden'}`}>General</div>
          <NavItem id="dashboard" label="Dashboard" icon={LayoutDashboard} />
          <NavItem id="new-order" label="New Order" icon={ShoppingBag} />
          <NavItem id="services" label="Services" icon={Menu} />
          <NavItem id="history" label="Order History" icon={History} />
          <NavItem id="wallet" label="Add Funds" icon={Wallet} />
          <NavItem id="support" label="Support" icon={LifeBuoy} />
          <NavItem id="ai-support" label="AI Support" icon={Bot} />
          
          <div className="pt-4 mt-4 border-t border-slate-800 space-y-1">
            <NavItem id="profile" label="Account Settings" icon={UserIcon} />
            
            {/* STRICT ADMIN SECTION */}
            {user?.isAdmin && (
              <>
                <div className={`px-4 py-6 text-[9px] font-black text-blue-500 uppercase tracking-widest ${!isSidebarOpen && 'hidden'}`}>Admin Power</div>
                <NavItem id="admin" label="Analytics" icon={ShieldCheck} />
                <NavItem id="admin-orders" label="Order Flow" icon={PackageSearch} />
                <NavItem id="service-manager" label="Services Master" icon={Settings2} />
                <NavItem id="admin-users" label="Users Master" icon={Users} />
                <NavItem id="admin-pricing" label="Profit Engine" icon={DollarSign} />
                <NavItem id="admin-payments" label="Gateways" icon={CreditCard} />
                <NavItem id="admin-coupons" label="Promotions" icon={Ticket} />
                <NavItem id="admin-cms" label="Panel Branding" icon={Palette} />
                <NavItem id="admin-system" label="System Pulse" icon={Activity} />
              </>
            )}
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-900 sticky bottom-0">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-3 text-slate-400 hover:text-red-400 transition-colors"
          >
            <LogOut size={18} />
            <span className={!isSidebarOpen ? 'hidden' : ''}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        {/* Header */}
        <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleSidebar}
              className="p-2 hover:bg-slate-800 rounded-lg hidden md:block"
            >
              <Menu size={20} />
            </button>
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 hover:bg-slate-800 rounded-lg md:hidden"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-semibold capitalize tracking-tight">{activeTab.replace('-', ' ')}</h2>
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all relative"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-4 w-80 bg-slate-900 border border-slate-800 rounded-3xl shadow-3xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
                  <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-800/50">
                    <span className="text-xs font-black uppercase tracking-widest text-white">Alerts</span>
                    <button onClick={() => setNotifications([])} className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Clear All</button>
                  </div>
                  <div className="max-h-96 overflow-y-auto divide-y divide-slate-800">
                    {notifications.length > 0 ? notifications.map(n => (
                      <div key={n.id} className={`p-4 hover:bg-white/[0.02] transition-colors cursor-default ${!n.read ? 'bg-blue-600/5' : ''}`}>
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${n.type === 'order' ? 'text-blue-500' : 'text-emerald-500'}`}>
                            {n.type === 'order' ? <ShoppingBag size={16} /> : <CheckCircle2 size={16} />}
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-slate-100">{n.title}</h4>
                            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{n.message}</p>
                            <span className="text-[9px] font-bold text-slate-600 uppercase mt-2 block">{n.time}</span>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="p-12 text-center">
                        <Bell className="mx-auto text-slate-800 mb-2" size={32} />
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">No new alerts</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Available</span>
              <span className="text-xl font-black text-emerald-500 tracking-tighter">${user?.balance.toFixed(2)}</span>
            </div>
            
            <button 
              onClick={() => setActiveTab('profile')}
              className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center border border-white/10 shadow-lg shadow-blue-900/20 hover:scale-105 transition-all"
            >
              <span className="text-sm font-black text-white">
                {user?.username.substring(0, 2).toUpperCase()}
              </span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6 max-w-7xl mx-auto">
          {activeTab === 'dashboard' && user && <Dashboard user={user} />}
          {activeTab === 'services' && <Services />}
          {activeTab === 'new-order' && user && <NewOrder user={user} setUser={setUser} />}
          {activeTab === 'history' && <OrderHistory />}
          {activeTab === 'wallet' && user && <AddFunds user={user} setUser={setUser} />}
          {activeTab === 'support' && <SupportTickets />}
          {activeTab === 'ai-support' && <AISupport />}
          {activeTab === 'profile' && user && <UserProfile user={user} setUser={setUser} />}
          
          {/* Admin Routes Protection */}
          {user?.isAdmin && (
            <>
              {activeTab === 'admin' && <AdminDashboard />}
              {activeTab === 'admin-orders' && <AdminOrderManager />}
              {activeTab === 'admin-users' && <AdminUserManager />}
              {activeTab === 'admin-pricing' && <AdminPricingManager />}
              {activeTab === 'admin-payments' && <AdminPaymentManager />}
              {activeTab === 'admin-coupons' && <AdminCouponManager />}
              {activeTab === 'admin-cms' && <AdminCMSManager />}
              {activeTab === 'admin-system' && <AdminSystemLogs />}
              {activeTab === 'service-manager' && <ServiceManager />}
            </>
          )}
        </div>
      </main>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/50 md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="w-72 h-full bg-slate-900 p-6 flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <ShoppingBag className="text-blue-500" size={24} />
                <h1 className="text-xl font-bold">NOTTY SMM</h1>
              </div>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <nav className="flex-1 space-y-2 pb-10 overflow-y-auto">
              <NavItem id="dashboard" label="Dashboard" icon={LayoutDashboard} />
              <NavItem id="new-order" label="New Order" icon={ShoppingBag} />
              <NavItem id="services" label="Services" icon={Menu} />
              <NavItem id="history" label="Order History" icon={History} />
              <NavItem id="wallet" label="Add Funds" icon={Wallet} />
              <NavItem id="support" label="Support" icon={LifeBuoy} />
              <NavItem id="ai-support" label="AI Support" icon={Bot} />
              <NavItem id="profile" label="Account Settings" icon={UserIcon} />
              
              {/* MOBILE ADMIN SECTION */}
              {user?.isAdmin && (
                <div className="pt-4 mt-4 border-t border-slate-800">
                  <div className="px-4 py-2 text-[9px] font-black text-blue-500 uppercase tracking-widest">Admin Control</div>
                  <NavItem id="admin" label="Analytics" icon={ShieldCheck} />
                  <NavItem id="admin-orders" label="Order Flow" icon={PackageSearch} />
                  <NavItem id="service-manager" label="Services Master" icon={Settings2} />
                  <NavItem id="admin-users" label="Users Master" icon={Users} />
                  <NavItem id="admin-pricing" label="Profit Engine" icon={DollarSign} />
                  <NavItem id="admin-payments" label="Gateways" icon={CreditCard} />
                  <NavItem id="admin-coupons" label="Promotions" icon={Ticket} />
                  <NavItem id="admin-cms" label="Panel Branding" icon={Palette} />
                  <NavItem id="admin-system" label="System Pulse" icon={Activity} />
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
