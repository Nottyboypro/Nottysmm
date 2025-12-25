
import React, { useState, useEffect } from 'react';
import { SMMServiceAPI } from '../services/smmService.ts';
import { SMMService, User } from '../types.ts';
import { 
  AlertCircle, 
  CheckCircle2, 
  ChevronDown, 
  Zap, 
  Layers, 
  Clock, 
  Info, 
  Link as LinkIcon, 
  ListOrdered,
  Loader2,
  Trash2
} from 'lucide-react';

const NewOrder: React.FC<{ user: User, setUser: (u: User) => void }> = ({ user, setUser }) => {
  const [orderType, setOrderType] = useState<'single' | 'mass'>('single');
  const [services, setServices] = useState<SMMService[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  
  // Single Order State
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState<number | ''>('');
  const [link, setLink] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  
  // Dripfeed State
  const [isDripfeed, setIsDripfeed] = useState(false);
  const [runs, setRuns] = useState<number | ''>('');
  const [interval, setInterval] = useState<number | ''>('');
  
  // Mass Order State
  const [massOrderText, setMassOrderText] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    SMMServiceAPI.getServices().then(data => {
      setServices(data);
      const cats = Array.from(new Set(data.map(s => s.category)));
      setCategories(cats);
      if (cats.length > 0) setSelectedCategory(cats[0]);
    });
  }, []);

  const filteredServices = services.filter(s => s.category === selectedCategory);
  const currentService = services.find(s => s.service === selectedServiceId);
  
  // Calculation Logic
  const totalQuantity = isDripfeed && runs && quantity ? Number(runs) * Number(quantity) : Number(quantity || 0);
  const calculatedCharge = currentService && totalQuantity 
    ? (parseFloat(currentService.rate) * totalQuantity / 1000).toFixed(4) 
    : '0.0000';

  const validateLink = (url: string) => {
    return url.startsWith('http://') || url.startsWith('https://');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (orderType === 'single') {
      if (!selectedServiceId || !link || !quantity || !currentService) return;

      if (!validateLink(link)) {
        setStatus({ type: 'error', message: 'Invalid link format. Must start with http:// or https://' });
        return;
      }

      if (Number(quantity) < Number(currentService.min) || Number(quantity) > Number(currentService.max)) {
        setStatus({ type: 'error', message: `Quantity must be between ${currentService.min} and ${currentService.max}` });
        return;
      }

      if (user.balance < parseFloat(calculatedCharge)) {
        setStatus({ type: 'error', message: 'Insufficient balance. Please add funds.' });
        return;
      }

      setLoading(true);
      try {
        const response = await SMMServiceAPI.placeOrder(
          Number(selectedServiceId), 
          link, 
          Number(quantity),
          isDripfeed ? Number(runs) : undefined,
          isDripfeed ? Number(interval) : undefined
        );
        setUser({ ...user, balance: user.balance - parseFloat(calculatedCharge) });
        setStatus({ 
          type: 'success', 
          message: `Order placed successfully! Order ID: ${response.orderId}` 
        });
        setLink('');
        setQuantity('');
        setRuns('');
        setInterval('');
        setIsDripfeed(false);
      } catch (err: any) {
        setStatus({ type: 'error', message: err.message || 'Failed to place order.' });
      } finally {
        setLoading(false);
      }
    } else {
      // Mass Order logic
      const lines = massOrderText.split('\n').filter(l => l.trim());
      if (lines.length === 0) return;

      setLoading(true);
      let successCount = 0;
      let totalMassCharge = 0;

      for (const line of lines) {
        const parts = line.split('|');
        if (parts.length < 3) continue;

        const sId = Number(parts[0].trim());
        const l = parts[1].trim();
        const q = Number(parts[2].trim());

        const svc = services.find(s => s.service === sId);
        if (!svc) continue;

        const charge = (parseFloat(svc.rate) * q / 1000);
        if (user.balance - totalMassCharge < charge) break;

        try {
          await SMMServiceAPI.placeOrder(sId, l, q);
          successCount++;
          totalMassCharge += charge;
        } catch (e) {
          console.error('Mass order line failed', e);
        }
      }

      setUser({ ...user, balance: user.balance - totalMassCharge });
      setStatus({ 
        type: successCount > 0 ? 'success' : 'error', 
        message: successCount > 0 ? `Successfully placed ${successCount} orders.` : 'Failed to place any orders from list.'
      });
      setMassOrderText('');
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl">
          {/* Order Type Tabs */}
          <div className="flex bg-slate-800/50 p-1.5 rounded-2xl mb-8">
            <button 
              onClick={() => { setOrderType('single'); setStatus(null); }}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                orderType === 'single' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Zap size={16} />
              <span>Single Order</span>
            </button>
            <button 
              onClick={() => { setOrderType('mass'); setStatus(null); }}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                orderType === 'mass' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Layers size={16} />
              <span>Mass Order</span>
            </button>
          </div>

          {status && (
            <div className={`mb-8 p-5 rounded-2xl flex items-start space-x-4 border animate-in slide-in-from-top-4 ${
              status.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}>
              {status.type === 'success' ? <CheckCircle2 className="shrink-0" size={24} /> : <AlertCircle className="shrink-0" size={24} />}
              <div className="text-sm font-bold leading-relaxed">{status.message}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {orderType === 'single' ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Category</label>
                    <div className="relative">
                      <select 
                        value={selectedCategory}
                        onChange={(e) => {
                          setSelectedCategory(e.target.value);
                          setSelectedServiceId('');
                        }}
                        className="w-full bg-slate-800/50 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-slate-200 focus:ring-2 focus:ring-blue-600 appearance-none outline-none transition-all"
                      >
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                      <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={18} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Service</label>
                    <div className="relative">
                      <select 
                        value={selectedServiceId}
                        onChange={(e) => setSelectedServiceId(Number(e.target.value))}
                        className="w-full bg-slate-800/50 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-slate-200 focus:ring-2 focus:ring-blue-600 appearance-none outline-none transition-all"
                        required
                      >
                        <option value="">Select service...</option>
                        {filteredServices.map(s => (
                          <option key={s.service} value={s.service}>{s.name} — ${s.rate}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={18} />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Link</label>
                  <div className="relative group">
                    <LinkIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                      type="url"
                      placeholder="https://instagram.com/p/..."
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      className="w-full bg-slate-800/50 border border-white/5 rounded-2xl pl-12 pr-5 py-4 text-sm font-bold text-slate-200 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Quantity</label>
                    <div className="relative group">
                      <ListOrdered className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                      <input 
                        type="number"
                        placeholder={`Min: ${currentService?.min || 0}`}
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : '')}
                        className="w-full bg-slate-800/50 border border-white/5 rounded-2xl pl-12 pr-5 py-4 text-sm font-bold text-slate-200 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Total Cost</label>
                    <div className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-2xl font-black text-emerald-500 tracking-tighter flex items-center justify-between">
                      <span className="text-slate-600">$</span>
                      <span>{calculatedCharge}</span>
                    </div>
                  </div>
                </div>

                {/* Drip-feed Option */}
                {currentService?.dripfeed && (
                  <div className="p-6 bg-slate-800/30 rounded-3xl border border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Clock className="text-blue-500" size={20} />
                        <span className="text-sm font-black text-white uppercase tracking-wider">Enable Drip-feed</span>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setIsDripfeed(!isDripfeed)}
                        className={`w-12 h-6 rounded-full transition-all relative ${isDripfeed ? 'bg-blue-600' : 'bg-slate-700'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isDripfeed ? 'right-1' : 'left-1'}`}></div>
                      </button>
                    </div>
                    
                    {isDripfeed && (
                      <div className="grid grid-cols-2 gap-4 pt-4 animate-in zoom-in-95 duration-300">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Runs</label>
                          <input 
                            type="number"
                            value={runs}
                            onChange={(e) => setRuns(e.target.value ? Number(e.target.value) : '')}
                            placeholder="e.g. 5"
                            className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-sm font-bold text-white focus:ring-2 focus:ring-blue-600 outline-none"
                            required={isDripfeed}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Interval (mins)</label>
                          <input 
                            type="number"
                            value={interval}
                            onChange={(e) => setInterval(e.target.value ? Number(e.target.value) : '')}
                            placeholder="e.g. 60"
                            className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-sm font-bold text-white focus:ring-2 focus:ring-blue-600 outline-none"
                            required={isDripfeed}
                          />
                        </div>
                        <div className="col-span-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider bg-slate-900/50 p-3 rounded-lg">
                          Total Quantity: <span className="text-white">{totalQuantity}</span> ({runs} runs x {quantity})
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mass Order Input</label>
                  <span className="text-[10px] text-slate-600 font-bold">Format: service_id | link | quantity</span>
                </div>
                <textarea 
                  rows={8}
                  value={massOrderText}
                  onChange={(e) => setMassOrderText(e.target.value)}
                  placeholder="101 | https://instagram.com/notty | 1000&#10;102 | https://instagram.com/another | 500"
                  className="w-full bg-slate-800/50 border border-white/5 rounded-2xl p-6 text-sm font-mono text-slate-200 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                ></textarea>
                <button 
                  type="button" 
                  onClick={() => setMassOrderText('')}
                  className="text-xs text-red-500 font-bold flex items-center space-x-1 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={14} />
                  <span>Clear List</span>
                </button>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading || (orderType === 'single' && (!selectedServiceId || !link || !quantity))}
              className={`w-full py-5 rounded-[1.5rem] font-black text-xl flex items-center justify-center space-x-3 transition-all active:scale-[0.98] shadow-2xl ${
                loading 
                  ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/30'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{orderType === 'single' ? 'Submit Order' : 'Submit Mass Orders'}</span>
                  <Zap size={24} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl h-full flex flex-col">
          <h3 className="text-xl font-black text-white mb-6 flex items-center">
            <Info className="mr-2 text-blue-500" size={20} />
            Service Info
          </h3>
          
          {currentService ? (
            <div className="space-y-6 flex-1">
              <div className="p-4 bg-blue-600/5 border border-blue-500/20 rounded-2xl">
                <p className="text-sm font-bold text-slate-200 leading-relaxed">
                  {currentService.description || "Premium high-retention service with instant delivery."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Min order', value: currentService.min },
                  { label: 'Max order', value: currentService.max },
                  { label: 'Refill', value: currentService.refill ? 'Yes' : 'No', color: currentService.refill ? 'text-emerald-400' : 'text-slate-500' },
                  { label: 'Cancel', value: currentService.cancel ? 'Yes' : 'No', color: currentService.cancel ? 'text-blue-400' : 'text-slate-500' },
                ].map((stat, i) => (
                  <div key={i} className="bg-slate-800/30 p-4 rounded-2xl border border-white/5">
                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{stat.label}</span>
                    <p className={`text-lg font-black mt-1 ${stat.color || 'text-white'}`}>{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-slate-950/50 p-6 rounded-2xl border border-white/5">
                <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Service Guidelines</h5>
                <ul className="space-y-2">
                  <li className="flex items-center text-xs text-slate-400">
                    <div className="w-1 h-1 bg-blue-500 rounded-full mr-2"></div>
                    Ensure link is public and accessible.
                  </li>
                  <li className="flex items-center text-xs text-slate-400">
                    <div className="w-1 h-1 bg-blue-500 rounded-full mr-2"></div>
                    Do not place multiple orders for same link.
                  </li>
                  <li className="flex items-center text-xs text-slate-400">
                    <div className="w-1 h-1 bg-blue-500 rounded-full mr-2"></div>
                    Delivery starts within 0-60 mins.
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-30">
              <div className="p-8 bg-slate-800 rounded-full">
                <Zap size={48} className="text-slate-500" />
              </div>
              <p className="text-sm font-black text-slate-500 uppercase tracking-widest">Select a service to view specs</p>
            </div>
          )}
          
          <div className="mt-8 pt-6 border-t border-white/5">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-3xl text-white shadow-xl">
              <h4 className="font-black text-lg mb-2">Reseller API</h4>
              <p className="text-blue-100 text-xs font-bold leading-relaxed mb-4">Integrate NOTTY SMM into your own panel for wholesale rates.</p>
              <button className="w-full bg-white text-blue-600 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-50 transition-all">
                View Documentation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewOrder;
