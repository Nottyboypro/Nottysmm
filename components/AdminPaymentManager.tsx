
import React, { useState } from 'react';
import { CreditCard, Wallet, Bitcoin, CheckCircle, XCircle, Search, Filter, ArrowDownToLine, ShieldAlert, History } from 'lucide-react';

const AdminPaymentManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'methods' | 'deposits' | 'audit'>('methods');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Payment Infrastructure</h2>
          <p className="text-slate-500 font-medium">Configure gateways and approve manual credit requests.</p>
        </div>
        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-2xl">
          {['methods', 'deposits', 'audit'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl">
        {activeTab === 'methods' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[
              { id: 'stripe', name: 'Stripe (Card)', icon: CreditCard, color: 'text-blue-500', status: 'Active' },
              { id: 'coinbase', name: 'Coinbase (Crypto)', icon: Bitcoin, color: 'text-orange-500', status: 'Active' },
              { id: 'manual', name: 'Manual Bank/Ease', icon: Wallet, color: 'text-emerald-500', status: 'Active' },
            ].map(gateway => (
              <div key={gateway.id} className="p-6 bg-slate-800/30 rounded-3xl border border-white/5 space-y-6">
                <div className="flex items-center justify-between">
                  <div className={`p-4 rounded-2xl bg-slate-900 ${gateway.color}`}>
                    <gateway.icon size={24} />
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${gateway.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                    {gateway.status}
                  </div>
                </div>
                <div>
                  <h4 className="font-black text-white">{gateway.name}</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Fee: 2.5% • Min: $5.00</p>
                </div>
                <div className="flex space-x-2 pt-2">
                  <button className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Config</button>
                  <button className="flex-1 py-3 bg-rose-600/10 text-rose-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Disable</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'deposits' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">User / Method</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Amount</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Proof</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Time</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {[
                  { user: 'agency_x', method: 'Manual Bank', amount: '$2,000.00', time: '12m ago' },
                  { user: 'notty_fan', method: 'Stripe', amount: '$50.00', time: '45m ago' },
                ].map((dep, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-6">
                      <div className="text-sm font-black text-white">@{dep.user}</div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase">{dep.method}</div>
                    </td>
                    <td className="px-6 py-6 text-emerald-400 font-black">{dep.amount}</td>
                    <td className="px-6 py-6">
                      <button className="text-blue-500 hover:underline text-xs font-black uppercase tracking-widest">View File</button>
                    </td>
                    <td className="px-6 py-6 text-[10px] text-slate-500 font-black uppercase">{dep.time}</td>
                    <td className="px-6 py-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500/20"><CheckCircle size={16} /></button>
                        <button className="p-2 bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500/20"><XCircle size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'audit' && (
           <div className="space-y-6">
              <div className="p-6 bg-blue-600/5 border border-blue-500/10 rounded-[2rem] flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <ShieldAlert className="text-blue-500" size={32} />
                  <div>
                    <h4 className="font-black text-white">Wallet Integrity Audit</h4>
                    <p className="text-xs text-slate-500 font-medium">Comparing total user balances against actual gateway collections.</p>
                  </div>
                </div>
                <button className="px-8 py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg">Run Audit</button>
              </div>
              
              <div className="space-y-4">
                {[
                  { event: 'User @agency_x manual credit approved', val: '+$2,000.00', admin: 'Admin-01', time: '1h ago' },
                  { event: 'User @bad_actor payment chargeback flag', val: '-$45.00', admin: 'SYSTEM', time: '5h ago' },
                ].map((log, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-800/20 rounded-2xl border border-white/5">
                    <div className="flex items-center space-x-3">
                      <History size={16} className="text-slate-500" />
                      <div>
                        <p className="text-xs font-bold text-slate-200">{log.event}</p>
                        <p className="text-[9px] text-slate-600 font-black uppercase">By {log.admin}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xs font-black ${log.val.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{log.val}</div>
                      <div className="text-[9px] text-slate-600 font-black uppercase">{log.time}</div>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default AdminPaymentManager;
