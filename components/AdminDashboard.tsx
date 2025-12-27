
import React, { useState, useEffect } from 'react';
import { 
  DollarSign, Users, Layers, RefreshCw, Clock, Zap, ShieldCheck, 
  Globe, Activity, TrendingUp, AlertTriangle, Package, HeartPulse
} from 'lucide-react';
import { SMMServiceAPI } from '../services/smmService.ts';

const AdminStat = ({ label, value, icon: Icon, color = "blue", subValue }: any) => {
  const colorMap: any = {
    blue: "text-blue-400 bg-blue-500/10",
    emerald: "text-emerald-400 bg-emerald-500/10",
    amber: "text-amber-400 bg-amber-500/10",
    rose: "text-rose-400 bg-rose-500/10",
    purple: "text-purple-400 bg-purple-500/10"
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] hover:border-slate-700 transition-all group shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-4 rounded-2xl ${colorMap[color] || colorMap.blue} transition-transform group-hover:scale-110 shadow-lg`}>
          <Icon size={24} />
        </div>
        {subValue && <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{subValue}</span>}
      </div>
      <div className="text-3xl font-black text-white mb-1 tracking-tighter">{value}</div>
      <div className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black">{label}</div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [providerBalance, setProviderBalance] = useState('0.00');
  const [stats, setStats] = useState({
    revenue: 0,
    profit: 0,
    spending: 0,
    users: 0,
    orders: 0,
    ordersToday: 0,
    refills: 0,
    failures: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const bal = await SMMServiceAPI.getProviderBalance();
    setProviderBalance(bal.balance);

    const allOrders = await SMMServiceAPI.getAllOrders();
    const allUsers = await SMMServiceAPI.getAllUsers();
    
    const today = new Date().toLocaleDateString();
    const revenue = allOrders.reduce((acc, o) => acc + (o.charge || 0), 0);
    const profit = allOrders.reduce((acc, o) => acc + (o.profit || 0), 0);
    const spending = allOrders.reduce((acc, o) => acc + (o.providerSpending || 0), 0);
    const ordersToday = allOrders.filter(o => o.createdAt.includes(today)).length;
    const refills = allOrders.filter(o => o.refillStatus === 'Requested').length;
    const failures = allOrders.filter(o => o.status === 'Failed').length;

    setStats({
      revenue, profit, spending, users: allUsers.length,
      orders: allOrders.length, ordersToday, refills, failures
    });
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-900/60 p-10 rounded-[3rem] border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] -mr-48 -mt-48"></div>
        <div className="flex items-center space-x-6 relative z-10">
          <div className="p-6 bg-blue-600 rounded-[2rem] shadow-2xl shadow-blue-900/50 transform -rotate-3">
            <ShieldCheck size={40} className="text-white" />
          </div>
          <div>
            <h2 className="text-4xl font-black text-white tracking-tight">Mainframe Authority</h2>
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] flex items-center bg-emerald-500/10 px-3 py-1 rounded-full">
                <Activity size={12} className="mr-2" /> All Systems Nominal
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
          <div className="bg-slate-800/80 backdrop-blur-md p-6 rounded-[1.5rem] border border-white/5 shadow-xl">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Provider Liquidity</span>
            <div className="flex items-center space-x-3">
              <span className="text-2xl font-black text-emerald-400 tracking-tighter">₹{providerBalance}</span>
              <button onClick={fetchData} className="p-2 hover:bg-slate-700 rounded-xl text-slate-400 transition-all active:rotate-180">
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStat label="Total Revenue" value={`₹${stats.revenue.toFixed(2)}`} icon={DollarSign} color="blue" subValue="Gross" />
        <AdminStat label="Total Profit" value={`₹${stats.profit.toFixed(2)}`} icon={TrendingUp} color="emerald" subValue="Net Yield" />
        <AdminStat label="Provider Spending" value={`₹${stats.spending.toFixed(2)}`} icon={Package} color="purple" subValue="Cost Basis" />
        <AdminStat label="Active Users" value={stats.users} icon={Users} color="blue" subValue="Identity" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStat label="Orders Today" value={stats.ordersToday} icon={Zap} color="amber" />
        <AdminStat label="Refill Queue" value={stats.refills} icon={Clock} color="purple" />
        <AdminStat label="API Failures" value={stats.failures} icon={AlertTriangle} color="rose" />
        <AdminStat label="System Uptime" value="99.99%" icon={HeartPulse} color="emerald" />
      </div>

      <div className="bg-slate-900/40 border border-slate-800 p-12 rounded-[3rem] text-center shadow-inner relative overflow-hidden">
         <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]"></div>
         <div className="relative z-10">
            <h3 className="text-slate-500 font-black uppercase tracking-[0.3em] text-xs">Infrastructure Master Sync</h3>
            <p className="text-slate-400 mt-3 max-w-lg mx-auto font-medium">Monitoring all user interactions and provider handshakes through the NOTTY unified relay.</p>
         </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
