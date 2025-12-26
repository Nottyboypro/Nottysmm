
import React, { useState } from 'react';
import { CreditCard, Wallet, Bitcoin } from 'lucide-react';

const AdminPaymentManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'methods' | 'deposits'>('methods');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Payment Infrastructure</h2>
          <p className="text-slate-500 font-medium">Configure gateways.</p>
        </div>
        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-2xl">
          {['methods', 'deposits'].map(tab => (
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
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                  <tr><td colSpan={3} className="px-6 py-12 text-center text-slate-500 font-bold uppercase tracking-widest">No pending manual deposits</td></tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPaymentManager;
