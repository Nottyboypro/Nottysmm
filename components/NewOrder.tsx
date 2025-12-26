
import React, { useState, useEffect } from 'react';
import { SMMServiceAPI } from '../services/smmService.ts';
import { SMMService, User, Order } from '../types.ts';
import { 
  AlertCircle, 
  CheckCircle2, 
  Zap, 
  Link as LinkIcon, 
  ListOrdered,
  Loader2,
  Package,
  Activity
} from 'lucide-react';

interface NewOrderProps {
  user: User;
  setUser: (u: User) => void;
  addOrder: (o: Order) => void;
}

const NewOrder: React.FC<NewOrderProps> = ({ user, setUser, addOrder }) => {
  const [services, setServices] = useState<SMMService[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const [selectedServiceId, setSelectedServiceId] = useState<number | ''>('');
  const [link, setLink] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Load Services on Mount
  useEffect(() => {
    let mounted = true;
    SMMServiceAPI.getServices().then(data => {
      if (mounted) {
        setServices(data);
        const cats = Array.from(new Set(data.map(s => s.category)));
        setCategories(cats);
        if (cats.length > 0) setSelectedCategory(cats[0]);
      }
    }).catch(err => {
      if (mounted) {
        setStatus({ type: 'error', message: 'Failed to sync with Mesumax API. ' + err.message });
      }
    });
    return () => { mounted = false; };
  }, []);

  const filteredServices = services.filter(s => s.category === selectedCategory);
  const currentService = services.find(s => s.service === selectedServiceId);
  
  // Rule: User Price is already calculated in SMMServiceAPI as (Rate * 87 + 100)
  // Total Cost = (Rate Per 1000 * Quantity) / 1000
  const calculatedCharge = currentService && quantity 
    ? (parseFloat(currentService.rate) * Number(quantity) / 1000).toFixed(2) 
    : '0.00';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (!selectedServiceId || !link || !quantity || !currentService) return;

    if (user.balance < parseFloat(calculatedCharge)) {
      setStatus({ type: 'error', message: 'Insufficient Funds. Please recharge your wallet.' });
      return;
    }

    setLoading(true);
    try {
      const newOrder = await SMMServiceAPI.placeOrder(
        user,
        Number(selectedServiceId), 
        link, 
        Number(quantity)
      );

      addOrder(newOrder);
      setUser({ ...user, balance: user.balance - parseFloat(calculatedCharge) });
      
      setStatus({ 
        type: 'success', 
        message: `Order Successful! ID: ${newOrder.id}` 
      });

      setLink('');
      setQuantity('');
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Critical handover failure with provider.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
          
          <div className="flex items-center space-x-3 mb-10">
            <div className="p-3 bg-blue-600/10 text-blue-500 rounded-xl">
              <Package size={20} />
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Deploy Relay Order</h2>
          </div>

          {status && (
            <div className={`mb-8 p-5 rounded-2xl flex items-start space-x-4 border animate-in slide-in-from-top-2 duration-300 ${
              status.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}>
              {status.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
              <div className="text-sm font-bold leading-relaxed">{status.message}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Market Segment</label>
                <select 
                  value={selectedCategory} 
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedServiceId('');
                  }} 
                  className="w-full bg-slate-800/50 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all cursor-pointer appearance-none"
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Mesumax Power Map</label>
                <select 
                  value={selectedServiceId} 
                  onChange={(e) => setSelectedServiceId(Number(e.target.value))} 
                  className="w-full bg-slate-800/50 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all cursor-pointer appearance-none" 
                  required
                >
                  <option value="">Choose deployment...</option>
                  {filteredServices.map(s => <option key={s.service} value={s.service}>{s.name} — ₹{s.rate}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Destination URL</label>
              <div className="relative group">
                <LinkIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input type="url" placeholder="https://instagram.com/p/..." value={link} onChange={(e) => setLink(e.target.value)} className="w-full bg-slate-800/50 border border-white/5 rounded-2xl pl-12 pr-5 py-4 text-sm font-bold text-slate-200 outline-none focus:ring-2 focus:ring-blue-600 transition-all" required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Quantity</label>
                <div className="relative group">
                  <ListOrdered className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input type="number" placeholder={`Min: ${currentService?.min || 100}`} value={quantity} onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : '')} className="w-full bg-slate-800/50 border border-white/5 rounded-2xl pl-12 pr-5 py-4 text-sm font-bold text-slate-200 outline-none focus:ring-2 focus:ring-blue-600" required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Estimated Charge</label>
                <div className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-2xl font-black text-emerald-500 flex items-center justify-between">
                  <span className="text-slate-700 font-bold">₹</span>
                  <span>{calculatedCharge}</span>
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className={`w-full py-5 rounded-[1.5rem] font-black text-xl flex items-center justify-center space-x-3 shadow-2xl transition-all active:scale-[0.98] ${loading ? 'bg-slate-800 text-slate-600' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}>
              {loading ? <><Loader2 className="animate-spin" size={24} /><span>Relaying...</span></> : <><span>Deploy Order</span><Zap size={24} className="fill-current" /></>}
            </button>
          </form>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl flex flex-col h-full sticky top-24">
        <h3 className="text-xl font-black text-white mb-6 flex items-center uppercase tracking-tight">
          <Activity className="mr-3 text-blue-500" size={24} />
          Protocol Mapping
        </h3>
        {currentService ? (
          <div className="space-y-6 flex-1">
            <div className="p-5 bg-blue-600/5 border border-blue-500/20 rounded-3xl">
              <p className="text-sm font-bold text-slate-300 italic">"{currentService.description}"</p>
            </div>
            
            <div className="p-5 bg-slate-800/30 border border-white/5 rounded-3xl space-y-4">
               <div className="flex items-center justify-between">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mesumax ID</span>
                 <span className="text-xs font-black text-blue-400">P-ID #{currentService.service}</span>
               </div>
               <div className="flex items-center justify-between">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Profit Margin</span>
                 <div className="text-right">
                   <div className="text-xs font-black text-emerald-500">+ ₹100 / 1k</div>
                   <div className="text-[9px] font-bold text-slate-600 uppercase">Fixed Logic Applied</div>
                 </div>
               </div>
               <div className="flex items-center justify-between">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Limits</span>
                 <span className="text-xs font-black text-white">{currentService.min.toLocaleString()} — {currentService.max.toLocaleString()}</span>
               </div>
            </div>

            <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center space-x-3">
              <CheckCircle2 size={14} className="text-emerald-500" />
              <span className="text-[9px] font-black text-emerald-500 uppercase">Auto-sync with Mesumax Cloud Active</span>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center opacity-20 py-20">
            <Package size={64} className="text-slate-500 mb-6" />
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest text-center">Protocol Standby</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewOrder;
