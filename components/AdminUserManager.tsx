
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Wallet, 
  TrendingUp, 
  Ban, 
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { User } from '../types.ts';
import { SMMServiceAPI } from '../services/smmService.ts';

const AdminUserManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const data = await SMMServiceAPI.getAllUsers();
    setUsers(data);
    setLoading(false);
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
          <p className="text-slate-500 font-medium">Real-time database of all registered accounts.</p>
        </div>
        
        <div className="flex space-x-2">
            <button onClick={loadUsers} className="p-3 bg-slate-800 rounded-2xl text-slate-400 hover:text-white">
                <RefreshCw size={18} />
            </button>
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
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Last Login</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                   <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-bold">Loading Database...</td></tr>
              ) : filteredUsers.length === 0 ? (
                   <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-bold uppercase tracking-widest">No users found</td></tr>
              ) : filteredUsers.map(u => (
                <tr key={u.id} className={`group hover:bg-white/[0.02] transition-colors`}>
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
                    <div className="text-sm font-black text-emerald-500">₹{u.balance.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-6 text-slate-400 text-xs font-bold">
                    ₹{u.totalSpent?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-6 py-6 text-[10px] font-black text-slate-500 uppercase">
                    {u.lastLogin}
                  </td>
                  <td className="px-6 py-6">
                    <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                      u.status === 'banned' ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'
                    }`}>
                      {u.status || 'Active'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUserManager;
