
import React, { useState } from 'react';
import { Tag, Plus, X, Calendar, UserCheck, Copy, Check, Hash } from 'lucide-react';
import { Coupon } from '../types.ts';

const AdminCouponManager: React.FC = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [coupons, setCoupons] = useState<Coupon[]>([
    { id: '1', code: 'NOTTY20', type: 'Percentage', value: 20, usageLimit: 100, usedCount: 42, expiry: '2023-12-31', status: 'Active' },
    { id: '2', code: 'WELCOME5', type: 'Fixed', value: 5, usageLimit: 500, usedCount: 500, expiry: '2023-10-01', status: 'Expired' },
  ]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Promotions Hub</h2>
          <p className="text-slate-500 font-medium">Drive sales with high-conversion discount coupons.</p>
        </div>
        <button 
          onClick={() => setShowCreate(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-900/30 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" />
          <span>New Coupon</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map(coupon => (
          <div key={coupon.id} className={`bg-slate-900 border ${coupon.status === 'Active' ? 'border-blue-500/20 shadow-blue-950/20' : 'border-slate-800 opacity-60'} p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group transition-all`}>
            {coupon.status === 'Active' && <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-2xl -mr-16 -mt-16"></div>}
            
            <div className="flex items-start justify-between mb-6 relative z-10">
              <div className="p-3 bg-slate-800 rounded-2xl text-blue-500">
                <Tag size={20} />
              </div>
              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${coupon.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-800 text-slate-500'}`}>
                {coupon.status}
              </span>
            </div>

            <div className="space-y-4 relative z-10">
              <div>
                <div className="text-2xl font-black text-white tracking-widest font-mono">{coupon.code}</div>
                <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">
                  {coupon.type === 'Percentage' ? `${coupon.value}% OFF` : `$${coupon.value} Discount`}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black text-slate-600 uppercase">
                  <span>Usage: {coupon.usedCount} / {coupon.usageLimit}</span>
                  <span>{Math.round((coupon.usedCount / coupon.usageLimit) * 100)}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full bg-blue-600 transition-all`} style={{ width: `${(coupon.usedCount / coupon.usageLimit) * 100}%` }}></div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center text-slate-500 space-x-1.5">
                  <Calendar size={12} />
                  <span className="text-[10px] font-black uppercase tracking-tight">Until {coupon.expiry}</span>
                </div>
                <button className="text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-400">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-3xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-white tracking-tight">Deploy Coupon</h3>
              <button onClick={() => setShowCreate(false)} className="p-2 hover:bg-slate-800 rounded-full text-slate-500">
                <X size={24} />
              </button>
            </div>
            
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Coupon Code</label>
                  <input type="text" placeholder="WINTER50" className="w-full bg-slate-800 border border-white/5 rounded-2xl px-5 py-4 text-sm font-black text-white outline-none focus:ring-2 focus:ring-blue-600" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Type</label>
                  <select className="w-full bg-slate-800 border border-white/5 rounded-2xl px-5 py-4 text-sm font-black text-white outline-none appearance-none">
                    <option>Percentage</option>
                    <option>Fixed Amount</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Discount Value</label>
                  <input type="number" placeholder="20" className="w-full bg-slate-800 border border-white/5 rounded-2xl px-5 py-4 text-sm font-black text-white outline-none focus:ring-2 focus:ring-blue-600" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Usage Limit</label>
                  <input type="number" placeholder="100" className="w-full bg-slate-800 border border-white/5 rounded-2xl px-5 py-4 text-sm font-black text-white outline-none focus:ring-2 focus:ring-blue-600" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Expiry Date</label>
                <input type="date" className="w-full bg-slate-800 border border-white/5 rounded-2xl px-5 py-4 text-sm font-black text-white outline-none focus:ring-2 focus:ring-blue-600" />
              </div>

              <button className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-900/30 transition-all">
                Activate Promotion
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCouponManager;
