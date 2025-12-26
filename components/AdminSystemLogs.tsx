
import React, { useState, useEffect } from 'react';
import { Activity, Terminal, ShieldAlert, Cpu, Zap, RefreshCw, Key, Copy, Check } from 'lucide-react';
import { SystemLog } from '../types.ts';
import { SMMServiceAPI } from '../services/smmService.ts';

const AdminSystemLogs: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const masterApiKey = "NT-SYS-MASTER-KEY-PROTECTED";
  const [logs, setLogs] = useState<SystemLog[]>([]);

  useEffect(() => {
    // In a real app, this would fetch from a 'logs' collection
    SMMServiceAPI.getLogs().then(data => setLogs(data)).catch(() => setLogs([]));
  }, []);

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
            </div>
          </div>
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
            <p className="text-xs text-slate-500 font-medium">Use this key to authorize external panel-to-panel requests.</p>
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
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono no-scrollbar bg-slate-950/50">
            {logs.length === 0 ? (
                <div className="p-8 text-center text-slate-600 text-xs font-black uppercase tracking-widest">No system logs available in database</div>
            ) : logs.map((log) => (
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
      </div>
    </div>
  );
};

export default AdminSystemLogs;
