
import React, { useState } from 'react';
import { Activity, Terminal, ShieldAlert, Cpu, Zap, RefreshCw, AlertTriangle, Info, Key, Copy, Check } from 'lucide-react';
import { SystemLog } from '../types.ts';

const AdminSystemLogs: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const masterApiKey = "NT-SYS-69f1b631444de8c6d9bde8f9f3f2e6b51bde57d3-MASTER-PRO";

  const [logs, setLogs] = useState<SystemLog[]>([
    { id: '1', type: 'API', severity: 'Info', message: 'Order #12845 status synced: COMPLETED', details: 'Provider response: HTTP 200 {status: 1}', time: '2m ago' },
    { id: '2', type: 'SECURITY', severity: 'Warning', message: 'Suspicious IP access: 103.44.x.x', details: 'User @bad_actor logged in from proxy', time: '15m ago' },
    { id: '3', type: 'CRON', severity: 'Info', message: 'Balance sync completed successfully', details: 'Updated 14 provider balances', time: '30m ago' },
    { id: '4', type: 'WALLET', severity: 'Critical', message: 'Gateway callback signature mismatch', details: 'Stripe webhook failed validation', time: '1h ago' },
  ]);

  const copyKey = () => {
    navigator.clipboard.writeText(masterApiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSeverityColor = (sev: string) => {
    switch(sev) {
      case 'Critical': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case 'Warning': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      default: return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl">
        <div className="flex items-center space-x-6">
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-[1.5rem] shadow-xl text-blue-500 relative">
             <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
             <Activity size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">System Monitoring</h2>
            <div className="flex items-center space-x-4 mt-1">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center">
                <Zap size={12} className="mr-1.5 text-amber-500" /> CRON: ACTIVE
              </span>
              <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center">
                <Cpu size={12} className="mr-1.5 text-blue-500" /> LOAD: 4.2%
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
           <button className="px-6 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">Clear Logs</button>
           <button className="px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-blue-900/30">Download Archive</button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="flex items-center space-x-4 mb-6 relative z-10">
          <div className="p-3 bg-emerald-600/10 text-emerald-500 rounded-xl">
            <Key size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black text-white tracking-tight">Master System API Credentials</h3>
            <p className="text-xs text-slate-500 font-medium">Use this key to authorize external panel-to-panel or infrastructure requests.</p>
          </div>
        </div>
        
        <div className="bg-slate-950 border border-white/5 rounded-2xl p-6 flex items-center justify-between group relative z-10">
           <code className="text-xs font-mono font-black text-blue-400 break-all select-all">
             {masterApiKey}
           </code>
           <button 
             onClick={copyKey}
             className="ml-4 p-3 bg-slate-900 hover:bg-slate-800 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all active:scale-95"
           >
             {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3 bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col h-[600px]">
          <div className="p-6 bg-slate-800/50 border-b border-slate-800 flex items-center justify-between">
             <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center">
               <Terminal className="mr-3 text-blue-500" size={18} />
               Live System Output
             </h3>
             <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Real-time Stream</span>
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono no-scrollbar bg-slate-950/50">
            {logs.map((log) => (
              <div key={log.id} className="group p-4 bg-slate-900/50 border border-white/[0.03] rounded-2xl hover:border-white/10 transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${getSeverityColor(log.severity)}`}>
                      {log.severity}
                    </span>
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">[{log.type}]</span>
                    <span className="text-xs font-bold text-slate-200">{log.message}</span>
                  </div>
                  <span className="text-[9px] font-black text-slate-700 uppercase">{log.time}</span>
                </div>
                <div className="text-[10px] text-slate-600 pl-4 border-l border-slate-800 mt-2 italic">
                  {log.details}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl">
              <h4 className="text-xl font-black text-white mb-6 flex items-center">
                <RefreshCw className="mr-2 text-blue-500" size={20} />
                Cron Jobs
              </h4>
              <div className="space-y-4">
                 {[
                   { name: 'Order Sync', int: 'Every 5m', status: 'Healthy', color: 'text-emerald-500' },
                   { name: 'Refill Sync', int: 'Every 15m', status: 'Healthy', color: 'text-emerald-500' },
                   { name: 'Provider Bal', int: 'Every 1h', status: 'Syncing', color: 'text-blue-500' },
                   { name: 'Audit Log', int: 'Every 24h', status: 'Idle', color: 'text-slate-500' },
                 ].map((cron, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-2xl border border-white/5">
                      <div>
                        <div className="text-xs font-black text-slate-200">{cron.name}</div>
                        <div className="text-[9px] text-slate-600 font-bold uppercase">{cron.int}</div>
                      </div>
                      <div className={`text-[9px] font-black uppercase tracking-widest ${cron.color}`}>
                        {cron.status}
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-gradient-to-br from-rose-900/40 to-slate-900 border border-rose-500/20 rounded-[2.5rem] p-8 shadow-2xl">
             <h4 className="text-xl font-black text-white mb-4 flex items-center">
                <ShieldAlert className="mr-2 text-rose-500" size={20} />
                Alert Center
             </h4>
             <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start space-x-3 mb-4">
                <AlertTriangle className="text-rose-500 shrink-0 mt-0.5" size={16} />
                <p className="text-[10px] text-slate-400 font-bold leading-relaxed">
                  3 failed provider API calls in last 5 minutes. Checking node health...
                </p>
             </div>
             <button className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">View Incident</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSystemLogs;
