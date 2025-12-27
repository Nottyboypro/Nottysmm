
import React from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  Wallet, 
  Package, 
  CheckCircle, 
  RefreshCcw, 
  TrendingUp, 
  History,
  AlertCircle,
  Send,
  MessageCircle,
  Bell,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { User, Order, OrderStatus } from '../types.ts';

const StatCard = ({ title, value, icon: Icon, color, bg }: any) => (
  <div className="bg-slate-900 border border-slate-800 p-5 rounded-[2rem] transition-all hover:border-blue-600/30 group shadow-xl">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-2xl ${bg} ${color} transition-transform group-hover:scale-110 shadow-lg`}>
        <Icon size={22} />
      </div>
      <div className="flex flex-col items-end">
        <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Live Node</span>
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mt-1"></div>
      </div>
    </div>
    <div className="flex flex-col">
      <span className="text-2xl font-black text-white mb-0.5 tracking-tighter">{value}</span>
      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{title}</span>
    </div>
  </div>
);

const Dashboard: React.FC<{ user: User, orders: Order[] }> = ({ user, orders }) => {
  
  const totalOrders = orders.length;
  const activeOrders = orders.filter(o => o.status === OrderStatus.PENDING || o.status === OrderStatus.IN_PROGRESS || o.status === OrderStatus.PROCESSING).length;
  const completedOrders = orders.filter(o => o.status === OrderStatus.COMPLETED).length;

  const chartData = orders.reduce((acc: any[], order) => {
    const dateObj = new Date(order.timestamp || Date.now());
    const dateKey = `${dateObj.getDate()}/${dateObj.getMonth() + 1}`;
    
    const existing = acc.find(item => item.name === dateKey);
    if (existing) {
      existing.spend += order.charge;
    } else {
      acc.push({ name: dateKey, spend: order.charge });
    }
    return acc;
  }, []).slice(-7).reverse();

  if(chartData.length === 0) {
    chartData.push({ name: 'Init', spend: 0 });
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-800 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-white/15 transition-all"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter">Welcome, {user.username}!</h2>
            <p className="text-blue-100 font-bold mt-2 uppercase text-[10px] tracking-[0.2em] opacity-80">Global SMM Infrastructure Active</p>
          </div>
          <div className="flex items-center space-x-3">
             <a 
              href="https://t.me/NOTTYUpdates" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all flex items-center"
             >
               <Bell size={14} className="mr-2" /> Live Updates
             </a>
             <a 
              href="https://t.me/NOTTYSupportChat" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-3 bg-[#229ED9] hover:bg-[#1E88C1] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all flex items-center"
             >
               <Send size={14} className="mr-2" /> Support
             </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
        <StatCard title="Liquidity" value={`₹${user.balance.toFixed(2)}`} icon={Wallet} color="text-emerald-400" bg="bg-emerald-500/10" />
        <StatCard title="Orders" value={totalOrders} icon={Package} color="text-blue-400" bg="bg-blue-500/10" />
        <StatCard title="Relay" value={activeOrders} icon={TrendingUp} color="text-purple-400" bg="bg-purple-500/10" />
        <StatCard title="Completed" value={completedOrders} icon={CheckCircle} color="text-blue-500" bg="bg-blue-600/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden h-[400px]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-white tracking-tight flex items-center uppercase">
              <History className="mr-3 text-blue-500" size={20} />
              Spending Analytics
            </h3>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                  <defs>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#475569" fontSize={9} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#475569" fontSize={9} tickLine={false} axisLine={false} dx={-10} />
                  <Tooltip 
                  formatter={(value: any) => [`₹${value.toFixed(2)}`, 'Spend']}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '1rem' }}
                  itemStyle={{ fontSize: '11px', fontWeight: 'bold', color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="spend" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSpend)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
           {/* Community Card */}
           <div className="bg-[#0c162d] border border-blue-500/20 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl group-hover:bg-blue-600/20 transition-all"></div>
              <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-4">Telegram Relay</h3>
              <div className="flex flex-col space-y-4">
                 <a 
                  href="https://t.me/NOTTYUpdates" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-slate-900/50 hover:bg-slate-900 border border-white/5 rounded-2xl transition-all group/link"
                 >
                   <div className="flex items-center space-x-3">
                     <div className="p-2.5 bg-blue-500 text-white rounded-xl shadow-lg"><Bell size={16} /></div>
                     <div>
                       <div className="text-xs font-black text-white">Update Channel</div>
                       <div className="text-[9px] font-bold text-slate-500">Live Service Alerts</div>
                     </div>
                   </div>
                   <ChevronRight size={16} className="text-slate-700 group-hover/link:text-blue-500 transition-all" />
                 </a>

                 <a 
                  href="https://t.me/NOTTYSupportChat" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-slate-900/50 hover:bg-slate-900 border border-white/5 rounded-2xl transition-all group/link"
                 >
                   <div className="flex items-center space-x-3">
                     <div className="p-2.5 bg-emerald-500 text-white rounded-xl shadow-lg"><MessageCircle size={16} /></div>
                     <div>
                       <div className="text-xs font-black text-white">Support Group</div>
                       <div className="text-[9px] font-bold text-slate-500">24/7 Peer Assistance</div>
                     </div>
                   </div>
                   <ChevronRight size={16} className="text-slate-700 group-hover/link:text-emerald-500 transition-all" />
                 </a>
              </div>
           </div>

           {/* Quick Status */}
           <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem] shadow-xl">
             <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Account Verified</h3>
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Tier Group</span>
                  <span className="text-[10px] font-black text-blue-400 uppercase bg-blue-500/10 px-2 py-1 rounded-md">{user.group || 'Standard'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Total Lifetime Spend</span>
                  <span className="text-[10px] font-black text-white">₹{user.totalSpent?.toFixed(2) || '0.00'}</span>
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
