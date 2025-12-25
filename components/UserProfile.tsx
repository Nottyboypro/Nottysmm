
import React, { useState } from 'react';
import { Shield, Key, List, Lock, Copy, Check, RefreshCw, Smartphone } from 'lucide-react';
import { User, ActivityLog } from '../types.ts';

const UserProfile: React.FC<{ user: User; setUser: (u: User) => void }> = ({ user, setUser }) => {
  const [activeTab, setActiveTab] = useState<'security' | 'api' | 'logs'>('security');
  const [copied, setCopied] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });

  const logs: ActivityLog[] = [
    { id: '1', event: 'Password changed successfully', ip: '192.168.1.1', time: '2023-11-01 10:20:15' },
    { id: '2', event: 'API Key generated', ip: '192.168.1.1', time: '2023-10-28 15:45:02' },
    { id: '3', event: 'Wallet recharge: $50.00', ip: '192.168.1.1', time: '2023-10-25 09:12:33' },
    { id: '4', event: 'New Login', ip: '45.12.33.10', time: '2023-10-25 09:10:00' },
  ];

  const generateKey = () => {
    const newKey = Array.from({ length: 32 }, () => Math.random().toString(36)[2]).join('');
    setUser({ ...user, apiKey: newKey });
  };

  const copyKey = () => {
    if (user.apiKey) {
      navigator.clipboard.writeText(user.apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800">
        {[
          { id: 'security', label: 'Security', icon: Shield },
          { id: 'api', label: 'Reseller API', icon: Key },
          { id: 'logs', label: 'Activity Logs', icon: List },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <tab.icon size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl">
        {activeTab === 'security' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-black text-white tracking-tight">Security Settings</h3>
              <p className="text-sm text-slate-500 mt-1">Manage your account protection and password.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Current Password</label>
                  <input
                    type="password"
                    className="w-full bg-slate-800/50 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:ring-2 focus:ring-blue-600 outline-none"
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">New Password</label>
                  <input
                    type="password"
                    className="w-full bg-slate-800/50 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:ring-2 focus:ring-blue-600 outline-none"
                    placeholder="Min 8 chars"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Confirm New Password</label>
                  <input
                    type="password"
                    className="w-full bg-slate-800/50 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:ring-2 focus:ring-blue-600 outline-none"
                    placeholder="••••••••"
                  />
                </div>
                <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
                  Update Password
                </button>
              </div>

              <div className="p-6 bg-blue-600/5 border border-blue-500/10 rounded-[2rem] space-y-4">
                <div className="flex items-center space-x-3 text-blue-400">
                  <Smartphone size={24} />
                  <h4 className="font-black text-sm uppercase tracking-widest">Two-Factor Auth</h4>
                </div>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                  Add an extra layer of security to your account by enabling 2FA. You will need a mobile app like Google Authenticator.
                </p>
                <button className="w-full py-3 border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">
                  Enable 2FA
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'api' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-white tracking-tight">API Access</h3>
                <p className="text-sm text-slate-500 mt-1">Integrate our services into your own platform.</p>
              </div>
              <button
                onClick={generateKey}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                <RefreshCw size={14} />
                <span>Reset Key</span>
              </button>
            </div>

            {user.apiKey ? (
              <div className="space-y-6">
                <div className="p-6 bg-slate-950/50 border border-white/5 rounded-[1.5rem] relative group">
                  <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest block mb-2">Your Secret API Key</label>
                  <div className="flex items-center justify-between">
                    <code className="text-sm font-black text-blue-400 tracking-wider font-mono">
                      {user.apiKey}
                    </code>
                    <button
                      onClick={copyKey}
                      className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                    >
                      {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="p-4 bg-slate-800/30 border border-white/5 rounded-2xl">
                      <h5 className="text-[10px] font-black text-white uppercase mb-2">API Documentation</h5>
                      <p className="text-xs text-slate-500 mb-3">View full endpoint documentation and examples.</p>
                      <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Read Docs</button>
                   </div>
                   <div className="p-4 bg-slate-800/30 border border-white/5 rounded-2xl">
                      <h5 className="text-[10px] font-black text-white uppercase mb-2">Whitelist IP</h5>
                      <p className="text-xs text-slate-500 mb-3">Restrict API access to specific server IPs.</p>
                      <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Manage IPs</button>
                   </div>
                </div>
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
                <div className="p-6 bg-slate-800 rounded-full text-slate-500">
                  <Key size={48} />
                </div>
                <div className="max-w-xs">
                  <h4 className="font-black text-white">No API Key Generated</h4>
                  <p className="text-xs text-slate-500 mt-1">Click the button below to generate your unique credentials for reselling.</p>
                </div>
                <button
                  onClick={generateKey}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                >
                  Generate My First Key
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-black text-white tracking-tight">Activity History</h3>
              <p className="text-sm text-slate-500 mt-1">Review recent security-related events on your account.</p>
            </div>

            <div className="overflow-hidden border border-white/5 rounded-3xl">
              <table className="w-full text-left">
                <thead className="bg-slate-800/50">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Event</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">IP Address</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 text-xs font-bold text-slate-200">{log.event}</td>
                      <td className="px-6 py-4 text-xs font-mono text-slate-500">{log.ip}</td>
                      <td className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase">{log.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
