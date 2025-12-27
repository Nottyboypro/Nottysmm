
import React, { useState, useEffect } from 'react';
import { Tag, Plus, X, Calendar, Trash2, Percent, DollarSign, ListOrdered, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { Coupon } from '../types.ts';
import { SMMServiceAPI } from '../services/smmService.ts';

const AdminCouponManager: React.FC = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [code, setCode] = useState('');
  const [type, setType] = useState<'Percentage' | 'Fixed'>('Percentage');
  const [value, setValue] = useState('');
  const [usageLimit, setUsageLimit] = useState('');
  const [expiry, setExpiry] = useState('');

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    const data = await SMMServiceAPI.getCoupons();
    setCoupons(data);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await SMMServiceAPI.createCoupon({
        code: code.toUpperCase(),
        type,
        value: parseFloat(value),
        usageLimit: parseInt(usageLimit),
        usedCount: 0,
        expiry,
        status: 'Active'
      });
      setShowCreate(false);
      loadCoupons();
      // Reset form
      setCode('');
      setValue('');
      setUsageLimit('');
      setExpiry('');
    } catch (e) {
      alert("Handshake error with coupon nodes.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Decommission this discount protocol?")) return;
    await SMMServiceAPI.deleteCoupon(id);
    loadCoupons();
  };

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
          <span>Create Coupon</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.length === 0 ? (
            <div className="col-span-full p-20 text-center bg-slate-900/40 rounded-[3rem] border border-slate-800 border-dashed">
                <Tag size={48} className="mx-auto text-slate-700 mb-4" />
                <p className="text-slate-500 font-black uppercase tracking-[0.2em]">Zero Active Promo Nodes Detected</p>
            </div>
        ) : coupons.map(coupon => (
          <div key={coupon.id} className={`bg-slate-900 border ${coupon.status === 'Active' ? 'border-blue-500/20 shadow-blue-950/20' : 'border-slate-800 opacity-60'} p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group transition-all`}>
            {coupon.status === 'Active' && <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-2xl -mr-16 -mt-16"></div>}
            
            <div className="flex items-start justify-between mb-6 relative z-10">
              <div className="p-4 bg-slate-800 rounded-2xl text-blue-500 shadow-xl group-hover:scale-110 transition-transform">
                <Tag size={20} />
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${coupon.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                    {coupon.status}
                </span>
                <button onClick={() => handleDelete(coupon.id)} className="p-2 text-slate-700 hover:text-rose-500 transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>

            <div className="space-y-5 relative z-10">
              <div>
                <div className="text-2xl font-black text-white tracking-widest font-mono uppercase">{coupon.code}</div>
                <div className="flex items-center text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">
                  {coupon.type === 'Percentage' ? <Percent size={10} className="mr-1" /> : <DollarSign size={10} className="mr-1" />}
                  {coupon.type === 'Percentage' ? `${coupon.value}% OFF` : `₹${coupon.value} Discount`}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="p-3 bg-slate-800/50 rounded-xl border border-white/5">
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest block mb-1">Redeemed</span>
                    <span className="text-sm font-black text-white">{coupon.usedCount} / {coupon.usageLimit}</span>
                 </div>
                 <div className="p-3 bg-slate-800/50 rounded-xl border border-white/5">
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest block mb-1">Status</span>
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Global Link</span>
                 </div>
              </div>

              <div className="flex items-center text-slate-500 space-x-1.5 pt-4 border-t border-white/5">
                <Calendar size={12} className="text-slate-700" />
                <span className="text-[10px] font-black uppercase tracking-widest">Expiry: {coupon.expiry}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 shadow-3xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-white tracking-tight">Deploy New Protocol</h3>
              <button onClick={() => setShowCreate(false)} className="p-2 hover:bg-slate-800 rounded-full text-slate-500 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Promo Identifier (Code)</label>
                <input 
                  type="text" required
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  placeholder="e.g. NOTTY50"
                  className="w-full bg-slate-800 border border-white/5 rounded-2xl px-6 py-4 text-sm font-black text-white outline-none focus:ring-2 focus:ring-blue-600 uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Logic Type</label>
                  <select 
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full bg-slate-800 border border-white/5 rounded-2xl px-6 py-4 text-sm font-black text-white outline-none appearance-none"
                  >
                    <option value="Percentage">Percentage</option>
                    <option value="Fixed">Fixed Amount</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Yield Value</label>
                  <input 
                    type="number" required
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    placeholder={type === 'Percentage' ? '%' : '₹'}
                    className="w-full bg-slate-800 border border-white/5 rounded-2xl px-6 py-4 text-sm font-black text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Usage Limit</label>
                  <div className="relative">
                    <ListOrdered size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                    <input 
                      type="number" required
                      value={usageLimit}
                      onChange={e => setUsageLimit(e.target.value)}
                      placeholder="Total Uses"
                      className="w-full bg-slate-800 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-sm font-black text-white outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Decommission Date</label>
                  <input 
                    type="date" required
                    value={expiry}
                    onChange={e => setExpiry(e.target.value)}
                    className="w-full bg-slate-800 border border-white/5 rounded-2xl px-6 py-4 text-sm font-black text-white outline-none"
                  />
                </div>
              </div>

              <button disabled={loading} className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[1.5rem] font-black text-lg transition-all shadow-xl shadow-blue-900/30 flex items-center justify-center space-x-3">
                {loading ? <RefreshCw className="animate-spin" /> : <CheckCircle2 />}
                <span>{loading ? 'Transmitting...' : 'Authorize Coupon'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCouponManager;
