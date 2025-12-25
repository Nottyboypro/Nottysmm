
import React, { useState } from 'react';
import { TrendingUp, Users, Percent, Target, Layers, ArrowUpRight, Save, ShieldCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const AdminPricingManager: React.FC = () => {
  const [globalMarkup, setGlobalMarkup] = useState(25);
  
  const profitData = [
    { name: 'Standard', margin: 25, color: '#3b82f6' },
    { name: 'VIP', margin: 15, color: '#10b981' },
    { name: 'Reseller', margin: 8, color: '#8b5cf6' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Revenue Architecture</h2>
          <p className="text-slate-500 font-medium">Define profit margins and automated markup logic across tiers.</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-900/30">
          <Save size={18} />
          <span>Sync All Markups</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl font-black text-white flex items-center">
                 <Percent className="mr-3 text-blue-500" size={24} />
                 Global Margin Control
               </h3>
               <span className="text-3xl font-black text-blue-500">{globalMarkup}%</span>
            </div>
            
            <div className="space-y-6">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={globalMarkup} 
                onChange={(e) => setGlobalMarkup(parseInt(e.target.value))}
                className="w-full h-3 bg-slate-800 rounded-full appearance-none cursor-pointer accent-blue-600" 
              />
              <div className="flex justify-between text-[10px] font-black text-slate-600 uppercase tracking-widest px-1">
                <span>Safe (0%)</span>
                <span>Balanced (25%)</span>
                <span>Aggressive (50%)</span>
                <span>Hyper (100%)</span>
              </div>
              <div className="p-4 bg-blue-600/5 border border-blue-500/20 rounded-2xl flex items-start space-x-3">
                <ShieldCheck size={18} className="text-blue-500 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  Applying this markup will recalculate the selling price for <span className="text-white font-bold">1,248 services</span>. Provider costs are fetched in real-time.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl">
            <h3 className="text-xl font-black text-white mb-8 flex items-center">
              <Users className="mr-3 text-blue-500" size={24} />
              User Group Pricing
            </h3>
            <div className="space-y-4">
              {['Standard', 'VIP', 'Reseller'].map((group, i) => (
                <div key={group} className="flex items-center justify-between p-5 bg-slate-800/30 rounded-2xl border border-white/5 hover:border-blue-500/20 transition-all group">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl ${i === 0 ? 'bg-blue-600' : i === 1 ? 'bg-emerald-600' : 'bg-purple-600'} text-white`}>
                      <Target size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-black text-white">{group} Tier</div>
                      <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{i === 0 ? 'Default users' : i === 1 ? '50+ Orders' : 'Reseller API Only'}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <span className="text-xs font-black text-slate-300">Margin: <span className="text-white">+{profitData[i].margin}%</span></span>
                      <div className="text-[9px] text-slate-500 font-black uppercase">Automated Rule</div>
                    </div>
                    <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-500 transition-colors">
                      <ArrowUpRight size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl flex flex-col">
          <h3 className="text-xl font-black text-white mb-2">Margin Analytics</h3>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-10">Revenue Yield by Tier</p>
          
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={profitData}>
                <XAxis dataKey="name" hide />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '1rem' }}
                />
                <Bar dataKey="margin" radius={[10, 10, 10, 10]}>
                  {profitData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-800/50 rounded-2xl">
              <span className="text-[10px] font-black text-slate-500 uppercase">Avg. Markup</span>
              <p className="text-lg font-black text-white">18.4%</p>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-2xl">
              <span className="text-[10px] font-black text-slate-500 uppercase">Gross Yield</span>
              <p className="text-lg font-black text-emerald-400">+$2.1k</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPricingManager;
