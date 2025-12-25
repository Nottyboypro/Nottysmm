
import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Users, 
  Layers, 
  AlertTriangle,
  Server,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Clock,
  Zap,
  ShieldCheck,
  Globe,
  HardDrive,
  BarChart3
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { SMMServiceAPI } from '../services/smmService.ts';

const adminPerformanceData = [
  { name: '00:00', revenue: 400, profit: 120 },
  { name: '04:00', revenue: 300, profit: 90 },
  { name: '08:00', revenue: 900, profit: 270 },
  { name: '12:00', revenue: 1200, profit: 360 },
  { name: '16:00', revenue: 1500, profit: 450 },
  { name: '20:00', revenue: 1100, profit: 330 },
  { name: '23:59', revenue: 800, profit: 240 },
];

const AdminStat = ({ label, value, trend, icon: Icon, trendUp, color = "blue" }: any) => {
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
        <div className={`flex items-center text-[10px] font-black uppercase tracking-widest ${trendUp ? 'text-emerald-400' : 'text-rose-400'}`}>
          {trendUp ? <ArrowUpRight size={12} className="mr-1" /> : <ArrowDownRight size={12} className="mr-1" />}
          {trend}
        </div>
      </div>
      <div className="text-2xl font-black text-white mb-1 tracking-tighter">{value}</div>
      <div className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black">{label}</div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const [providerBalance, setProviderBalance] = useState({ balance: '0.00', currency: 'USD' });
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    setIsSyncing(true);
    const data = await SMMServiceAPI.getProviderBalance();
    setProviderBalance(data);
    setTimeout(() => setIsSyncing(false), 800);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl">
        <div className="flex items-center space-x-6">
          <div className="p-5 bg-blue-600 rounded-[1.5rem] shadow-xl shadow-blue-900/40">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">Control Center</h2>
            <div className="flex items-center space-x-4 mt-1">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center">
                <Globe size={12} className="mr-1.5 text-blue-500" /> System Online
              </span>
              <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center">
                <HardDrive size={12} className="mr-1.5 text-emerald-500" /> DB Cluster Healthy
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">Provider Funds</span>
            <div className="flex items-center space-x-3">
              <span className="text-xl font-black text-emerald-400 tracking-tighter">${providerBalance.balance}</span>
              <button 
                onClick={fetchBalance}
                disabled={isSyncing}
                className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400 transition-all active:rotate-180"
              >
                <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>
          <button className="h-full px-8 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-900/20 active:scale-95">
            Admin Settings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <AdminStat label="Daily Revenue" value="$4,150.20" trend="+12%" icon={DollarSign} trendUp={true} color="blue" />
        <AdminStat label="Est. Profit" value="$1,037.55" trend="+8%" icon={Zap} trendUp={true} color="emerald" />
        <AdminStat label="Orders Today" value="842" trend="+45" icon={Layers} trendUp={true} color="purple" />
        <AdminStat label="Refill Queue" value="14" trend="-3" icon={Clock} trendUp={false} color="amber" />
        <AdminStat label="Active Users" value="2,482" trend="+12" icon={Users} trendUp={true} color="blue" />
        <AdminStat label="API Health" value="99.98%" trend="stable" icon={Activity} trendUp={true} color="rose" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4 relative z-10">
            <div>
              <h3 className="text-xl font-black text-white tracking-tight flex items-center">
                <BarChart3 className="mr-2 text-blue-500" size={20} />
                Financial Performance
              </h3>
              <p className="text-sm text-slate-500 font-medium">Tracking Gross Revenue vs. White-label Profit</p>
            </div>
          </div>
          
          <div className="h-80 w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={adminPerformanceData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} dy={10} className="font-black uppercase" />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} dx={-10} className="font-black" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '1.5rem', padding: '1rem', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: '900' }}
                  labelStyle={{ color: '#64748b', fontSize: '10px', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: '900' }}
                />
                <Area type="monotone" dataKey="revenue" name="REVENUE" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={4} />
                <Area type="monotone" dataKey="profit" name="PROFIT" stroke="#10b981" fillOpacity={1} fill="url(#colorProfit)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-white tracking-tight">Refill Queue</h3>
            <span className="bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Priority</span>
          </div>
          
          <div className="space-y-4 flex-1">
            {[
              { id: '12845', user: 'pro_marketer', status: 'Pending', time: '12m ago', qty: '10,000' },
              { id: '12839', user: 'agency_x', status: 'Processing', time: '45m ago', qty: '5,000' },
              { id: '12831', user: 'johndoe', status: 'Pending', time: '1h ago', qty: '1,000' },
              { id: '12822', user: 'notty_fan', status: 'Pending', time: '3h ago', qty: '25,000' },
            ].map((refill, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-2xl border border-white/5 hover:border-amber-500/20 transition-all cursor-default group">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-slate-900 rounded-xl text-amber-500">
                    <Clock size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-black text-white">Order #{refill.id}</div>
                    <div className="text-[9px] text-slate-500 font-black uppercase tracking-tighter">@{refill.user} • {refill.time}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-black text-slate-200">{refill.qty}</div>
                  <div className={`text-[8px] font-black uppercase tracking-widest ${refill.status === 'Processing' ? 'text-blue-400' : 'text-amber-500'}`}>
                    {refill.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest transition-all">
            Manage All Refills
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl">
          <h3 className="text-xl font-black text-white mb-6 flex items-center tracking-tight">
            <Server className="mr-2 text-blue-400" size={20} />
            Provider Nodes
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-6 bg-blue-600/5 rounded-[1.5rem] border border-blue-500/20">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-600 rounded-xl text-white">
                  <Zap size={20} />
                </div>
                <div>
                  <div className="font-black text-white">Mesumax V2 (Main)</div>
                  <div className="text-xs font-bold text-slate-500">API Latency: 120ms</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black text-emerald-400">ONLINE</div>
                <div className="text-[9px] text-slate-500 font-black uppercase mt-0.5">Primary Node</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: 'SMM-X Fallback', load: '12%', status: 'Standby', color: 'text-slate-500' },
                { name: 'BulkNode Backup', load: '0%', status: 'Disconnected', color: 'text-rose-500' },
              ].map((node, i) => (
                <div key={i} className="flex items-center justify-between p-5 bg-slate-800/30 rounded-2xl border border-white/5">
                  <div>
                    <div className="text-xs font-black text-slate-300">{node.name}</div>
                    <div className="text-[9px] font-bold text-slate-500">Load: {node.load}</div>
                  </div>
                  <div className={`text-[9px] font-black uppercase tracking-widest ${node.color}`}>
                    {node.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl">
          <h3 className="text-xl font-black text-white mb-6 flex items-center tracking-tight">
            <Activity className="mr-2 text-blue-400" size={20} />
            Critical Events
          </h3>
          <div className="space-y-4">
            {[
              { type: 'security', msg: 'Multiple failed logins from IP 103.21.x.x', time: '5m ago', icon: AlertTriangle, iconColor: 'text-rose-500', bg: 'bg-rose-500/10' },
              { type: 'system', msg: 'Service #101 markup adjusted to 35%', time: '18m ago', icon: ShieldCheck, iconColor: 'text-blue-500', bg: 'bg-blue-500/10' },
              { type: 'wallet', msg: 'User @agency_x manual credit +$2,000.00', time: '1h ago', icon: DollarSign, iconColor: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            ].map((event, i) => (
              <div key={i} className="flex items-start space-x-4 p-4 border border-white/5 rounded-2xl hover:bg-white/[0.02] transition-colors">
                <div className={`p-2.5 rounded-xl ${event.bg} ${event.iconColor}`}>
                  <event.icon size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-100 leading-relaxed">{event.msg}</p>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1 block">{event.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
