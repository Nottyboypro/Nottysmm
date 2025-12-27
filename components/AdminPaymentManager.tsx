
import React, { useState, useEffect } from 'react';
import { CreditCard, Wallet, Bitcoin, Settings, CheckCircle2, ShieldAlert, Activity, ArrowRight, RefreshCw, Check, X, Clock } from 'lucide-react';
import { SMMServiceAPI } from '../services/smmService.ts';

const AdminPaymentManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'methods' | 'deposits'>('methods');
  const [loadingGateway, setLoadingGateway] = useState<string | null>(null);
  const [pendingTransactions, setPendingTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'deposits') {
      loadPending();
    }
  }, [activeTab]);

  const loadPending = async () => {
    setLoading(true);
    const data = await SMMServiceAPI.getPendingTransactions();
    setPendingTransactions(data);
    setLoading(false);
  };

  const gateways = [
    { id: 'stripe', name: 'Stripe Global (Cards)', icon: CreditCard, color: 'text-blue-500', status: 'Active', fee: '2.5% + ₹10', min: '₹100' },
    { id: 'coinbase', name: 'Coinbase Commerce', icon: Bitcoin, color: 'text-orange-500', status: 'Active', fee: '1%', min: '₹500' },
    { id: 'phonepe', name: 'PhonePe (UPI/QR)', icon: Wallet, color: 'text-purple-500', status: 'Active', fee: '0%', min: '₹1' },
    { id: 'binance', name: 'Binance Pay', icon: Activity, color: 'text-yellow-500', status: 'Inactive', fee: '0.5%', min: '₹1000' },
  ];

  const handleToggle = (id: string) => {
    setLoadingGateway(id);
    setTimeout(() => setLoadingGateway(null), 1000);
  };

  const handleVerify = async (txId: string, approve: boolean) => {
    if (!confirm(`Are you sure you want to ${approve ? 'approve' : 'reject'} this transaction?`)) return;
    await SMMServiceAPI.verifyTransaction(txId, approve);
    loadPending();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Financial Infrastructure</h2>
          <p className="text-slate-500 font-medium">Coordinate payment gateways and monitor incoming capital flow.</p>
        </div>
        <div className="flex bg-slate-900 border border-slate-800 p-1.5 rounded-2xl shadow-xl">
          {[
            { id: 'methods', label: 'Gateways', icon: Settings },
            { id: 'deposits', label: 'History & Queue', icon: Activity }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <tab.icon size={14} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
        {activeTab === 'methods' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {gateways.map(gateway => (
              <div key={gateway.id} className="group p-8 bg-slate-800/30 rounded-[2rem] border border-white/5 space-y-8 hover:border-blue-500/30 transition-all shadow-xl">
                <div className="flex items-center justify-between">
                  <div className={`p-4 rounded-2xl bg-slate-900 border border-white/5 shadow-inner ${gateway.color} group-hover:scale-110 transition-transform`}>
                    <gateway.icon size={28} />
                  </div>
                  <button 
                    onClick={() => handleToggle(gateway.id)}
                    className={`w-12 h-6 rounded-full transition-all relative ${gateway.status === 'Active' ? 'bg-blue-600' : 'bg-slate-700'}`}
                  >
                     <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${gateway.status === 'Active' ? 'right-1' : 'left-1'} ${loadingGateway === gateway.id ? 'animate-pulse' : ''}`}></div>
                  </button>
                </div>
                <div>
                  <h4 className="text-lg font-black text-white">{gateway.name}</h4>
                  <div className="space-y-2 mt-3">
                     <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black text-slate-600 uppercase">Service Fee</span>
                        <span className="text-[10px] font-black text-white">{gateway.fee}</span>
                     </div>
                     <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black text-slate-600 uppercase">Minimum Node</span>
                        <span className="text-[10px] font-black text-white">{gateway.min}</span>
                     </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/5">
                   <div className={`flex items-center text-[10px] font-black uppercase tracking-widest ${gateway.status === 'Active' ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {gateway.status === 'Active' ? <CheckCircle2 size={12} className="mr-2" /> : <ShieldAlert size={12} className="mr-2" />}
                      {gateway.status === 'Active' ? 'Protocol Online' : 'Node Disconnected'}
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'deposits' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
               <h4 className="text-xs font-black text-white uppercase tracking-[0.2em]">Manual Deposit Verification Queue</h4>
               <button onClick={loadPending} className="p-2 text-slate-500 hover:text-white transition-colors"><RefreshCw size={18} className={loading ? 'animate-spin' : ''} /></button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-800/20">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Client Node</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Source / Method</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Amount Injection</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Time Buffer</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Auth</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                    {pendingTransactions.length === 0 ? (
                      <tr><td colSpan={5} className="px-6 py-24 text-center">
                          <Activity size={48} className="mx-auto text-slate-800 mb-4 opacity-20" />
                          <p className="text-xs font-black text-slate-600 uppercase tracking-widest opacity-20">No capital handshakes requiring manual intervention</p>
                      </td></tr>
                    ) : pendingTransactions.map(tx => (
                      <tr key={tx.id} className="hover:bg-white/[0.02] transition-all">
                        <td className="px-6 py-6">
                           <div className="text-xs font-black text-white uppercase">UID: {tx.userId}</div>
                        </td>
                        <td className="px-6 py-6">
                           <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{tx.method}</div>
                        </td>
                        <td className="px-6 py-6">
                           <div className="text-sm font-black text-emerald-500 tracking-tighter">₹{tx.amount.toFixed(2)}</div>
                           {tx.bonus > 0 && <div className="text-[8px] font-black text-blue-500 uppercase">Bonus: ₹{tx.bonus.toFixed(2)}</div>}
                        </td>
                        <td className="px-6 py-6">
                           <div className="flex items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                              <Clock size={10} className="mr-1.5" /> {tx.date.split(',')[0]}
                           </div>
                        </td>
                        <td className="px-6 py-6 text-right">
                           <div className="flex items-center justify-end space-x-2">
                              <button 
                                onClick={() => handleVerify(tx.id, true)}
                                className="p-2.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white rounded-xl transition-all"
                              >
                                <Check size={16} />
                              </button>
                              <button 
                                onClick={() => handleVerify(tx.id, false)}
                                className="p-2.5 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-xl transition-all"
                              >
                                <X size={16} />
                              </button>
                           </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="p-10 bg-blue-600 rounded-[3rem] shadow-2xl relative overflow-hidden group cursor-pointer">
         <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px] -mr-48 -mt-48 transition-all group-hover:bg-white/10"></div>
         <div className="flex items-center justify-between relative z-10">
            <div className="space-y-2">
               <h3 className="text-3xl font-black text-white tracking-tighter uppercase">Master Settlement Node</h3>
               <p className="text-blue-100 font-bold max-w-lg">Request manual payouts from system liquidity or configure external bank bridges.</p>
            </div>
            <div className="p-6 bg-white rounded-full text-blue-600 shadow-2xl transition-transform group-hover:rotate-45">
               <ArrowRight size={32} />
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminPaymentManager;
