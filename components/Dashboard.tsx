
import React, { useState } from 'react';
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
import { User } from '../types.ts';

const weeklyData = [
  { name: 'Mon', spend: 20 },
  { name: 'Tue', spend: 45 },
  { name: 'Wed', spend: 30 },
  { name: 'Thu', spend: 70 },
  { name: 'Fri', spend: 55 },
  { name: 'Sat', spend: 90 },
  { name: 'Sun', spend: 40 },
];

const monthlyData = [
  { name: 'Week 1', spend: 240 },
  { name: 'Week 2', spend: 310 },
  { name: 'Week 3', spend: 180 },
  { name: 'Week 4', spend: 450 },
];

const StatCard = ({ title, value, icon: Icon, color, bg }: any) => (
  <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl transition-all hover:border-slate-700 group">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-2xl ${bg} ${color} transition-transform group-hover:scale-110`}>
        <Icon size={22} />
      </div>
      <div className="flex flex-col items-end">
        <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Live Status</span>
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mt-1"></div>
      </div>
    </div>
    <div className="flex flex-col">
      <span className="text-2xl font-black text-white mb-0.5 tracking-tight">{value}</span>
      <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">{title}</span>
    </div>
  </div>
);

// Fix: Completed Dashboard component definition and added default export
const Dashboard: React.FC<{ user: User }> = ({ user }) => {
  const [graphType, setGraphType] = useState<'daily' | 'monthly'>('daily');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 1.2 User Dashboard Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard 
          title="Wallet Balance" 
          value={`$${user.balance.toFixed(2)}`} 
          icon={Wallet} 
          color="text-emerald-400"
          bg="bg-emerald-500/10" 
        />
        <StatCard 
          title="Total Orders" 
          value="1,248" 
          icon={Package} 
          color="text-blue-400"
          bg="bg-blue-500/10" 
        />
        <StatCard 
          title="Active Orders" 
          value="12" 
          icon={TrendingUp} 
          color="text-purple-400"
          bg="bg-purple-500/10" 
        />
        <StatCard 
          title="Completed" 
          value="1,120" 
          icon={CheckCircle} 
          color="text-blue-500"
          bg="bg-blue-600/10" 
        />
        <StatCard 
          title="Pending Refills" 
          value="3" 
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
                Spend Analytics
              </h3>
              <p className="text-sm text-slate-500 font-medium">Monitoring your marketing budget flow</p>
            </div>
            <div className="flex bg-slate-800 p-1 rounded-xl">
              <button 
                onClick={() => setGraphType('daily')}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${graphType === 'daily' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-white'}`}
              >
                Weekly
              </button>
              <button 
                onClick={() => setGraphType('monthly')}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${graphType === 'monthly' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-white'}`}
              >
                Monthly
              </button>
            </div>
          </div>
          
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={graphType === 'daily' ? weeklyData : monthlyData}>
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
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '1rem' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="spend" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSpend)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl flex flex-col">
          <h3 className="text-xl font-black text-white mb-6">Support Status</h3>
          <div className="space-y-4 flex-1">
            <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-2xl border border-white/5">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600/10 text-blue-500 rounded-lg">
                  <AlertCircle size={16} />
                </div>
                <span className="text-xs font-bold text-slate-300">Open Tickets</span>
              </div>
              <span className="text-sm font-black text-white">2</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-2xl border border-white/5">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-600/10 text-emerald-500 rounded-lg">
                  <CheckCircle size={16} />
                </div>
                <span className="text-xs font-bold text-slate-300">Resolved Today</span>
              </div>
              <span className="text-sm font-black text-white">14</span>
            </div>
          </div>
          <button className="w-full mt-6 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
            Get Priority Help
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
