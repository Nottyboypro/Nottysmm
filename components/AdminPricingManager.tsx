
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Users, Percent, Target, Layers, ArrowUpRight, Save, 
  ShieldCheck, AlertCircle, Sparkles, UserCheck
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { SMMServiceAPI } from '../services/smmService.ts';

const AdminPricingManager: React.FC = () => {
  const [globalMarkup, setGlobalMarkup] = useState(0);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    SMMServiceAPI.getPanelConfig().then(cfg => {
      setGlobalMarkup(cfg.globalMarkup || 0);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    await SMMServiceAPI.updatePanelConfig({ globalMarkup });
    alert("Global markup rules deployed across all catalog services.");
  };

  const tierData = [
    { name: 'Standard', margin: globalMarkup, color: '#3b82f6' },
    { name: 'VIP', margin: Math.max(0, globalMarkup - 10), color: '#10b981' },
    { name: 'Reseller', margin: Math.max(0, globalMarkup - 15), color: '#8b5cf6' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Revenue Architecture</h2>
          <p className="text-slate-500 font-medium">Define automated markup logic and margin logic across all user tiers.</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center space-x-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all shadow-2xl shadow-blue-900/40 group active:scale-95"
        >
          <Save size={18} className="group-hover:rotate-12 transition-transform" />
          <span>Deploy Profit Rules</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <div className="bg-slate-900 border border-slate-800 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[80px] -mr-32 -mt-32 transition-all group-hover:bg-blue-600/10"></div>
            <div className="flex items-center justify-between mb-10">
               <div className="flex items-center space-x-4">
                  <div className="p-4 bg-blue-600/10 text-blue-500 rounded-2xl shadow-inner">
                    <Percent size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">Global Markup Control</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Automatic Yield Generation</p>
                  </div>
               </div>
               <div className="text-5xl font-black text-blue-500 tracking-tighter">{globalMarkup}<span className="text-2xl text-slate-700 ml-1">%</span></div>
            </div>
            
            <div className="space-y-8">
              <input 
                type="range" min="0" max="100" 
                value={globalMarkup} 
                onChange={(e) => setGlobalMarkup(parseInt(e.target.value))}
                className="w-full h-4 bg-slate-800 rounded-full appearance-none cursor-pointer accent-blue-600 hover:accent-blue-500 transition-all" 
              />
              <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">
                <span className="flex flex-col items-center"><span>Base Cost</span><span className="w-1 h-1 bg-slate-700 rounded-full mt-2"></span></span>
                <span className="flex flex-col items-center"><span>Standard</span><span className="w-1 h-1 bg-slate-700 rounded-full mt-2"></span></span>
                <span className="flex flex-col items-center"><span>Aggressive</span><span className="w-1 h-1 bg-slate-700 rounded-full mt-2"></span></span>
                <span className="flex flex-col items-center"><span>Reseller Target</span><span className="w-1 h-1 bg-slate-700 rounded-full mt-2"></span></span>
              </div>
              <div className="p-6 bg-blue-600/5 border border-blue-500/10 rounded-[2rem] flex items-start space-x-4">
                <ShieldCheck size={24} className="text-blue-500 shrink-0 mt-1" />
                <div className="space-y-1">
                  <p className="text-sm text-slate-300 leading-relaxed font-semibold">
                    Markup will be applied on top of the base node cost + ₹100 fixed relay fee.
                  </p>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.1em]">Targeting 1,248 catalog services across Cloud Relay Nodes.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-10 rounded-[3rem] shadow-2xl">
            <h3 className="text-2xl font-black text-white mb-8 flex items-center">
              <Users className="mr-4 text-emerald-500" size={28} />
              User Group Pricing Logic
            </h3>
            <div className="space-y-4">
              {[
                { name: 'Standard', icon: Users, desc: 'Default verified accounts', diff: 0, color: 'text-blue-500' },
                { name: 'VIP', icon: Sparkles, desc: 'High volume nodes (50+ Orders)', diff: -10, color: 'text-emerald-500' },
                { name: 'Reseller', icon: UserCheck, desc: 'API Reseller Partners', diff: -15, color: 'text-purple-500' },
              ].map((group, i) => (
                <div key={group.name} className="flex items-center justify-between p-6 bg-slate-800/30 rounded-[2rem] border border-white/5 hover:border-blue-500/20 transition-all group cursor-default">
                  <div className="flex items-center space-x-5">
                    <div className={`p-4 rounded-2xl bg-slate-900 border border-white/5 shadow-lg group-hover:scale-110 transition-transform ${group.color}`}>
                      <group.icon size={22} />
                    </div>
                    <div>
                      <div className="text-base font-black text-white">{group.name} Tier</div>
                      <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{group.desc}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-8">
                    <div className="text-right">
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Active Margin</div>
                      <div className={`text-xl font-black ${group.color}`}>+{Math.max(0, globalMarkup + group.diff)}%</div>
                    </div>
                    <button className="p-3 hover:bg-slate-700 rounded-xl text-slate-600 transition-colors">
                      <ArrowUpRight size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-10 rounded-[3rem] shadow-2xl flex flex-col relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl"></div>
          <h3 className="text-2xl font-black text-white mb-2">Tier Analytics</h3>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-12">Comparative Gross Profit Margin</p>
          
          <div className="flex-1 min-h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tierData}>
                <XAxis dataKey="name" hide />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '1.5rem', padding: '15px' }}
                />
                <Bar dataKey="margin" radius={[15, 15, 15, 15]} barSize={50}>
                  {tierData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-10 grid grid-cols-1 gap-4">
            <div className="p-6 bg-slate-800/80 backdrop-blur-md rounded-[1.5rem] border border-white/5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg"><AlertCircle size={16} /></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg. Yield</span>
              </div>
              <p className="text-2xl font-black text-white tracking-tighter">₹{(globalMarkup * 1.5).toFixed(1)}/k</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPricingManager;
