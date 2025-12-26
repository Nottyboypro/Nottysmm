
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
  AlertCircle
} from 'lucide-react';
import { User, Order, OrderStatus } from '../types.ts';

const StatCard = ({ title, value, icon: Icon, color, bg }: any) => (
  <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl transition-all hover:border-slate-700 group">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-2xl ${bg} ${color} transition-transform group-hover:scale-110`}>
        <Icon size={22} />
      </div>
      <div className="flex flex-col items-end">
        <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Real-time</span>
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mt-1"></div>
      </div>
    </div>
    <div className="flex flex-col">
      <span className="text-2xl font-black text-white mb-0.5 tracking-tight">{value}</span>
      <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">{title}</span>
    </div>
  </div>
);

const Dashboard: React.FC<{ user: User, orders: Order[] }> = ({ user, orders }) => {
  
  // Real Stats Calculation
  const totalOrders = orders.length;
  const activeOrders = orders.filter(o => o.status === OrderStatus.PENDING || o.status === OrderStatus.IN_PROGRESS || o.status === OrderStatus.PROCESSING).length;
  const completedOrders = orders.filter(o => o.status === OrderStatus.COMPLETED).length;
  const refillRequests = orders.filter(o => o.refillStatus === 'Requested').length;

  // Real Chart Data
  const chartData = orders.reduce((acc: any[], order) => {
    // Group by date (DD/MM)
    const dateObj = new Date(order.timestamp || Date.now());
    const dateKey = `${dateObj.getDate()}/${dateObj.getMonth() + 1}`;
    
    const existing = acc.find(item => item.name === dateKey);
    if (existing) {
      existing.spend += order.charge;
    } else {
      acc.push({ name: dateKey, spend: order.charge });
    }
    return acc;
  }, []).slice(-7).reverse(); // Last 7 unique days (approx)

  // Fallback for empty chart
  if(chartData.length === 0) {
    chartData.push({ name: 'Today', spend: 0 });
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard 
          title="Wallet Balance" 
          value={`₹${user.balance.toFixed(2)}`} 
          icon={Wallet} 
          color="text-emerald-400"
          bg="bg-emerald-500/10" 
        />
        <StatCard 
          title="Total Orders" 
          value={totalOrders} 
          icon={Package} 
          color="text-blue-400"
          bg="bg-blue-500/10" 
        />
        <StatCard 
          title="Active Relay" 
          value={activeOrders} 
          icon={TrendingUp} 
          color="text-purple-400"
          bg="bg-purple-500/10" 
        />
        <StatCard 
          title="Completed" 
          value={completedOrders} 
          icon={CheckCircle} 
          color="text-blue-500"
          bg="bg-blue-600/10" 
        />
        <StatCard 
          title="Refill Requests" 
          value={refillRequests} 
          icon={RefreshCcw} 
          color="text-orange-400"
          bg="bg-orange-500/10" 
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="text-xl font-black text-white tracking-tight flex items-center">
                <History className="mr-2 text-blue-500" size={20} />
                Your Spending Analytics
              </h3>
              <p className="text-sm text-slate-500 font-medium">Real-time budget flow based on your orders (₹)</p>
            </div>
          </div>
          
          <div className="h-72 w-full">
            {chartData.length > 0 && chartData[0].spend === 0 && totalOrders === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-600 font-bold uppercase tracking-widest text-xs">
                    No Order Data Available
                </div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                    <defs>
                    <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} dx={-10} />
                    <Tooltip 
                    formatter={(value: any) => [`₹${value.toFixed(2)}`, 'Spend']}
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '1rem' }}
                    itemStyle={{ fontSize: '12px' }}
                    />
                    <Area type="monotone" dataKey="spend" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSpend)" strokeWidth={3} />
                </AreaChart>
                </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl flex flex-col">
          <h3 className="text-xl font-black text-white mb-6">Account Status</h3>
          <div className="space-y-4 flex-1">
            <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-2xl border border-white/5">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600/10 text-blue-500 rounded-lg">
                  <AlertCircle size={16} />
                </div>
                <span className="text-xs font-bold text-slate-300">Total Spent</span>
              </div>
              <span className="text-sm font-black text-white">₹{user.totalSpent?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-2xl border border-white/5">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-600/10 text-emerald-500 rounded-lg">
                  <CheckCircle size={16} />
                </div>
                <span className="text-xs font-bold text-slate-300">Account Status</span>
              </div>
              <span className="text-sm font-black text-emerald-500 uppercase">{user.status || 'Active'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
