
import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  ShieldAlert, 
  Wallet, 
  TrendingUp, 
  Eye, 
  MoreVertical, 
  Ban, 
  CheckCircle,
  Plus,
  Minus,
  Activity,
  Mail,
  Smartphone
} from 'lucide-react';
import { User } from '../types.ts';

const AdminUserManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdjustingBalance, setIsAdjustingBalance] = useState<User | null>(null);
  const [adjustAmount, setAdjustAmount] = useState('');

  const [users, setUsers] = useState<User[]>([
    { 
      id: '1', 
      username: 'pro_marketer', 
      email: 'pro@marketer.com', 
      balance: 154.20, 
      currency: 'USD', 
      isAdmin: false,
      status: 'active',
      totalSpent: 1240.50,
      profitContribution: 310.12,
      lastLogin: '2h ago'
    },
    { 
      id: '2', 
      username: 'agency_x', 
      email: 'contact@agencyx.com', 
      balance: 25.00, 
      currency: 'USD', 
      isAdmin: false,
      status: 'active',
      totalSpent: 4500.00,
      profitContribution: 1125.00,
      lastLogin: '1d ago'
    },
    { 
      id: '3', 
      username: 'bad_actor', 
      email: 'scammer@fake.com', 
      balance: 0.00, 
      currency: 'USD', 
      isAdmin: false,
      status: 'banned',
      totalSpent: 0.00,
      profitContribution: 0.00,
      lastLogin: '15d ago'
    }
  ]);

  const toggleBan = (userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId 
        ? { ...u, status: u.status === 'active' ? 'banned' : 'active' } 
        : u
    ));
  };

  const handleBalanceAdjust = (type: 'add' | 'subtract') => {
    if (!isAdjustingBalance || !adjustAmount) return;
    const amount = parseFloat(adjustAmount);
    setUsers(prev => prev.map(u => 
      u.id === isAdjustingBalance.id 
        ? { ...u, balance: type === 'add' ? u.balance + amount : u.balance - amount } 
        : u
    ));
    setIsAdjustingBalance(null);
    setAdjustAmount('');
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">User Infrastructure</h2>
          <p className="text-slate-500 font-medium">Manage permissions, balances, and security for all panel members.</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text"
            placeholder="Search username or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-slate-200 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
          />
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-800/30 border-b border-slate-800">
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Identity</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Balance</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Spent</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Profit Contribution</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Last Login</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredUsers.map(u => (
                <tr key={u.id} className={`group hover:bg-white/[0.02] transition-colors ${u.status === 'banned' ? 'opacity-50' : ''}`}>
                  <td className="px-6 py-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-black text-xs text-blue-500">
                        {u.username.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-black text-white">{u.username}</div>
                        <div className="text-[10px] font-bold text-slate-500">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="text-sm font-black text-emerald-500">${u.balance.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-6 text-slate-400 text-xs font-bold">
                    ${u.totalSpent?.toFixed(2)}
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center text-blue-400 text-xs font-black">
                      <TrendingUp size={12} className="mr-1.5" />
                      ${u.profitContribution?.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-6 text-[10px] font-black text-slate-500 uppercase">
                    {u.lastLogin}
                  </td>
                  <td className="px-6 py-6">
                    <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                      u.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button onClick={() => setIsAdjustingBalance(u)} className="p-2.5 bg-slate-800 text-slate-400 rounded-xl hover:text-white transition-all" title="Adjust Wallet">
                        <Wallet size={16} />
                      </button>
                      <button className="p-2.5 bg-slate-800 text-slate-400 rounded-xl hover:text-white transition-all" title="Impersonate (Support Mode)">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => toggleBan(u.id)} className={`p-2.5 rounded-xl transition-all ${
                        u.status === 'active' ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                      }`} title={u.status === 'active' ? 'Ban User' : 'Unban User'}>
                        {u.status === 'active' ? <Ban size={16} /> : <CheckCircle size={16} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Balance Modal */}
      {isAdjustingBalance && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-3xl animate-in zoom-in-95 duration-300">
            <h3 className="text-xl font-black text-white mb-2 text-center">Wallet Adjustment</h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center mb-6">User: @{isAdjustingBalance.username}</p>

            <div className="space-y-6">
              <div className="relative">
                <input 
                  type="number"
                  placeholder="0.00"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  className="w-full bg-slate-800 border border-white/5 rounded-2xl py-5 px-6 text-3xl font-black text-white text-center outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="flex space-x-3">
                <button 
                  onClick={() => handleBalanceAdjust('add')}
                  className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center space-x-2 transition-all active:scale-95"
                >
                  <Plus size={16} />
                  <span>Add Credit</span>
                </button>
                <button 
                  onClick={() => handleBalanceAdjust('subtract')}
                  className="flex-1 py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center space-x-2 transition-all active:scale-95"
                >
                  <Minus size={16} />
                  <span>Deduct Funds</span>
                </button>
              </div>
              
              <button onClick={() => setIsAdjustingBalance(null)} className="w-full py-3 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">
                Cancel Operation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Meta Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex items-center space-x-4">
          <div className="p-3 bg-blue-600/10 text-blue-500 rounded-2xl"><Users size={24} /></div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Total Accounts</p>
            <p className="text-2xl font-black text-white">{users.length}</p>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex items-center space-x-4">
          <div className="p-3 bg-emerald-600/10 text-emerald-500 rounded-2xl"><Activity size={24} /></div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Global Liquid Pool</p>
            <p className="text-2xl font-black text-white">${users.reduce((acc, curr) => acc + curr.balance, 0).toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex items-center space-x-4">
          <div className="p-3 bg-amber-600/10 text-amber-500 rounded-2xl"><ShieldAlert size={24} /></div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Blocked Profiles</p>
            <p className="text-2xl font-black text-white">{users.filter(u => u.status === 'banned').length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserManager;
