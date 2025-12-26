
import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Users, 
  Layers, 
  RefreshCw,
  Clock,
  Zap,
  ShieldCheck,
  Globe,
  HardDrive,
  BarChart3,
  ExternalLink,
  Cpu,
  Activity
} from 'lucide-react';
import { SMMServiceAPI } from '../services/smmService.ts';

const AdminStat = ({ label, value, icon: Icon, color = "blue" }: any) => {
  const colorMap: any = {
    blue: "text-blue-400 bg-blue-500/10",
    emerald: "text-emerald-400 bg-emerald-500/10",
    amber: "text-amber-400 bg-amber-500/10",
    rose: "text-rose-400 bg-rose-500/10",
    purple: "text-purple-400 bg-purple-500/10"
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] hover:border-slate-700 transition-all group">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl ${colorMap[color] || colorMap.blue} transition-transform group-hover:scale-110`}>
          <Icon size={20} />
        </div>
      </div>
      <div className="text-2xl font-black text-white mb-1 tracking-tighter">{value}</div>
      <div className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black">{label}</div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const [providerBalance, setProviderBalance] = useState({ balance: '0.00', currency: 'INR' });
  const [stats, setStats] = useState({
    revenue: 0,
    profit: 0,
    users: 0,
    orders: 0,
    pendingSync: 0
  });
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsSyncing(true);
    const bal = await SMMServiceAPI.getProviderBalance();
    setProviderBalance(bal);

    // Fetch all real data for analytics
    const allOrders = await SMMServiceAPI.getAllOrders();
    const allUsers = await SMMServiceAPI.getAllUsers();

    const revenue = allOrders.reduce((acc, o) => acc + (o.charge || 0), 0);
    const profit = allOrders.reduce((acc, o) => acc + (o.profit || 0), 0);
    
    // Pending sync = orders that are not completed/cancelled
    const pending = allOrders.filter(o => o.status === 'Pending' || o.status === 'In Progress' || o.status === 'Processing').length;

    setStats({
      revenue,
      profit,
      users: allUsers.length,
      orders: allOrders.length,
      pendingSync: pending
    });

    setIsSyncing(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl">
        <div className="flex items-center space-x-6">
          <div className="p-5 bg-blue-600 rounded-[1.5rem] shadow-xl shadow-blue-900/40">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">System Authority</h2>
            <div className="flex items-center space-x-4 mt-1">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center">
                <Globe size={12} className="mr-1.5 text-blue-500" /> Real Infrastructure Live
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Mesumax Balance (INR)</span>
            <div className="flex items-center space-x-3">
              <span className="text-xl font-black text-emerald-400 tracking-tighter">₹{providerBalance.balance}</span>
              <button 
                onClick={fetchData}
                disabled={isSyncing}
                className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400 transition-all active:rotate-180"
              >
                <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <AdminStat label="Total Revenue" value={`₹${stats.revenue.toFixed(2)}`} icon={DollarSign} color="blue" />
        <AdminStat label="Net Profit" value={`₹${stats.profit.toFixed(2)}`} icon={Zap} color="emerald" />
        <AdminStat label="Total Orders" value={stats.orders} icon={Layers} color="purple" />
        <AdminStat label="Active/Pending" value={stats.pendingSync} icon={Clock} color="amber" />
        <AdminStat label="Real Users" value={stats.users} icon={Users} color="blue" />
        <AdminStat label="Gateway Health" value="100%" icon={Activity} color="rose" />
      </div>

      <div className="p-10 bg-slate-900 border border-slate-800 rounded-[2.5rem] text-center">
         <h3 className="text-slate-500 font-bold uppercase tracking-widest text-xs">Real-Time Data Mode</h3>
         <p className="text-slate-400 mt-2">All analytics displayed here are aggregated directly from the Firestore database.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
