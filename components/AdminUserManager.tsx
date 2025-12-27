
import React, { useState, useEffect } from 'react';
import { 
  Search, Wallet, TrendingUp, Ban, CheckCircle, RefreshCw, 
  User as UserIcon, Plus, Minus, UserMinus, ShieldAlert, History, Shield,
  X, ChevronRight
} from 'lucide-react';
import { User } from '../types.ts';
import { SMMServiceAPI } from '../services/smmService.ts';

const AdminUserManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [adjustAmount, setAdjustAmount] = useState('');
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const data = await SMMServiceAPI.getAllUsers();
    setUsers(data);
    setLoading(false);
  };

  const handleBalance = async (isAdd: boolean) => {
    if (!selectedUser || !adjustAmount) return;
    await SMMServiceAPI.updateUserBalance(selectedUser.id, parseFloat(adjustAmount), isAdd);
    setAdjustAmount('');
    loadUsers();
    setSelectedUser(null);
  };

  const handleRoleUpdate = async (group: User['group']) => {
    if (!selectedUser) return;
    setIsUpdatingRole(true);
    await SMMServiceAPI.updateUserRole(selectedUser.id, group);
    setIsUpdatingRole(false);
    loadUsers();
    setSelectedUser(null);
  };

  const toggleBan = async (user: User) => {
    const newStatus = user.status === 'banned' ? 'active' : 'banned';
    await SMMServiceAPI.setUserStatus(user.id, newStatus);
    loadUsers();
    setSelectedUser(null);
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.id.includes(searchTerm)
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Identity Directory</h2>
          <p className="text-slate-500 font-medium">Control wallet liquidity and access authorization for all nodes.</p>
        </div>
        
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text"
              placeholder="Search User ID or Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
            />
          </div>
          <button onClick={loadUsers} className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 hover:text-white transition-all">
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-800/30 border-b border-slate-800">
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Client Identity</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Available Credit</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Tier / Profit</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Authorization</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                   <tr><td colSpan={5} className="px-8 py-20 text-center text-slate-500 font-bold">Accessing Encrypted Nodes...</td></tr>
              ) : filteredUsers.map(u => (
                <tr key={u.id} className="group hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => setSelectedUser(u)}>
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center font-black text-blue-500 text-sm shadow-inner">
                        {u.username.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-black text-white">{u.username}</div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase">UID: #{u.id} • {u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-lg font-black text-emerald-500 tracking-tighter">₹{u.balance.toFixed(2)}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="inline-flex items-center px-2 py-0.5 rounded-lg bg-blue-600/10 text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-600/20 mb-1">
                      {u.group || 'Standard'}
                    </div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Yield: ₹{u.profitContribution?.toFixed(2) || '0'}</div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                      u.status === 'banned' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    }`}>
                      {u.status === 'banned' ? <ShieldAlert size={10} className="mr-2" /> : <CheckCircle size={10} className="mr-2" />}
                      {u.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-2.5 bg-slate-800 hover:bg-blue-600 hover:text-white rounded-xl text-slate-500 transition-all"><Shield size={16} /></button>
                      <button className="p-2.5 bg-slate-800 hover:bg-rose-600 hover:text-white rounded-xl text-slate-500 transition-all"><UserMinus size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[3rem] p-10 shadow-3xl animate-in zoom-in-95 duration-300 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-blue-600 rounded-[1.2rem] flex items-center justify-center text-white font-black text-xl shadow-2xl">
                  {selectedUser.username.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">{selectedUser.username}</h3>
                  <span className="text-xs font-bold text-slate-500 uppercase">Identity Infrastructure</span>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-slate-800 rounded-full text-slate-500 transition-colors"><X size={24} /></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Liquidity Injection (INR)</label>
                  <div className="relative group">
                    <Wallet className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    <input 
                      type="number" 
                      value={adjustAmount}
                      onChange={(e) => setAdjustAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-14 pr-6 py-5 text-2xl font-black text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => handleBalance(true)} className="py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center space-x-2 shadow-xl shadow-emerald-900/20">
                      <Plus size={18} /><span>Add</span>
                    </button>
                    <button onClick={() => handleBalance(false)} className="py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center space-x-2 shadow-xl shadow-rose-900/20">
                      <Minus size={18} /><span>Subtract</span>
                    </button>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                   <button onClick={() => toggleBan(selectedUser)} className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest transition-all ${
                    selectedUser.status === 'banned' ? 'bg-emerald-600/10 text-emerald-500' : 'bg-rose-600/10 text-rose-500'
                  }`}>
                    {selectedUser.status === 'banned' ? 'Unban Node Access' : 'Ban Client Node'}
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Pricing Group Allocation</label>
                <div className="space-y-3">
                  {['Standard', 'VIP', 'Reseller'].map((group) => (
                    <button
                      key={group}
                      onClick={() => handleRoleUpdate(group as any)}
                      disabled={isUpdatingRole || selectedUser.group === group}
                      className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all group ${
                        selectedUser.group === group || (!selectedUser.group && group === 'Standard')
                          ? 'bg-blue-600 border-blue-500 text-white shadow-xl'
                          : 'bg-slate-800/40 border-white/5 text-slate-400 hover:border-blue-500/50 hover:text-blue-400'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                         <Shield size={16} />
                         <span className="text-xs font-black uppercase tracking-widest">{group}</span>
                      </div>
                      <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-all" />
                    </button>
                  ))}
                </div>
                
                <div className="p-5 bg-blue-600/5 border border-blue-500/10 rounded-2xl">
                   <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase tracking-widest">
                     Changing the user's group will automatically apply the global margin rules for that tier.
                   </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManager;
