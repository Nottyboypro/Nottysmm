
import React, { useState, useEffect } from 'react';
import { 
  Palette, Upload, Type, Megaphone, FileText, Mail, Save, RefreshCw, 
  ImageIcon, Globe, Bell, ShieldCheck, Eye, LayoutTemplate, Bot
} from 'lucide-react';
import { SMMServiceAPI } from '../services/smmService.ts';
import { PanelConfig } from '../types.ts';

const AdminCMSManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'banner' | 'legal' | 'emails'>('general');
  const [config, setConfig] = useState<PanelConfig | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    SMMServiceAPI.getPanelConfig().then(setConfig);
  }, []);

  const handleUpdate = (updates: Partial<PanelConfig>) => {
    if (!config) return;
    setConfig({ ...config, ...updates });
  };

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    await SMMServiceAPI.updatePanelConfig(config);
    setSaving(false);
    alert("System Branding & Infrastructure Updated.");
  };

  if (!config) return <div className="text-center p-20 font-black text-slate-500 uppercase tracking-widest animate-pulse">Accessing CMS...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Identity Engine</h2>
          <p className="text-slate-500 font-medium">Customize branding, legal protocols, and system communications.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-3 bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all shadow-2xl shadow-blue-900/40 active:scale-95 disabled:bg-slate-800"
        >
          {saving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
          <span>{saving ? 'Processing...' : 'Sync Identity'}</span>
        </button>
      </div>

      <div className="flex bg-slate-900 border border-slate-800 p-2 rounded-[2rem] w-full lg:w-max shadow-xl overflow-x-auto no-scrollbar">
        {[
          { id: 'general', label: 'Identity', icon: Palette },
          { id: 'banner', label: 'Broadcast', icon: Megaphone },
          { id: 'legal', label: 'Protocols', icon: FileText },
          { id: 'emails', label: 'Relay Mail', icon: Mail },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-3 px-8 py-3.5 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <tab.icon size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
        {activeTab === 'general' && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
            <div className="space-y-10">
              <div className="space-y-4">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center ml-1">
                  <Type className="mr-2 text-blue-500" size={16} /> Panel Name (Master)
                </label>
                <input 
                  type="text" value={config.name}
                  onChange={(e) => handleUpdate({ name: e.target.value })}
                  className="w-full bg-slate-800 border border-white/5 rounded-2xl px-8 py-5 text-base font-black text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center ml-1">
                    <ImageIcon className="mr-2 text-blue-500" size={16} /> Branding Logo
                  </label>
                  <div className="h-44 bg-slate-950 border-2 border-dashed border-slate-800 rounded-[2rem] flex flex-col items-center justify-center group hover:border-blue-500/50 transition-all cursor-pointer shadow-inner">
                    <Upload size={28} className="text-slate-700 group-hover:text-blue-500 mb-3" />
                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Select Vector/PNG</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center ml-1">
                    <Globe className="mr-2 text-blue-500" size={16} /> Web Favicon
                  </label>
                  <div className="h-44 bg-slate-950 border-2 border-dashed border-slate-800 rounded-[2rem] flex flex-col items-center justify-center group hover:border-blue-500/50 transition-all cursor-pointer shadow-inner">
                    <Upload size={28} className="text-slate-700 group-hover:text-blue-500 mb-3" />
                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">32x32px .ico</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/20 border border-white/5 p-10 rounded-[3rem] space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl"></div>
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Live Identity Preview</h4>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              </div>
              <div className="p-8 bg-slate-950 rounded-[2rem] border border-white/5 flex items-center space-x-6 shadow-2xl">
                 <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-900/30">
                   <LayoutTemplate size={28} />
                 </div>
                 <div>
                   <div className="text-2xl font-black text-white">{config.name}</div>
                   <div className="text-[10px] text-blue-500 font-black uppercase tracking-widest mt-1">Authorized Node Control</div>
                 </div>
              </div>
              <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/5 flex items-center space-x-4">
                 <div className="p-2 bg-slate-800 rounded-lg"><Bot size={16} className="text-slate-500" /></div>
                 <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase tracking-widest">Branding applied across AI Support and System Logs.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'banner' && (
          <div className="space-y-10 max-w-2xl">
            <div className="flex items-center justify-between p-8 bg-slate-800/40 rounded-[2.5rem] border border-white/5 shadow-xl">
              <div className="flex items-center space-x-6">
                <div className="p-4 bg-blue-600/10 text-blue-500 rounded-2xl"><Bell size={32} /></div>
                <div>
                  <h4 className="text-xl font-black text-white">Broadcast Protocol</h4>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Persistent banner message for all clients.</p>
                </div>
              </div>
              <button 
                onClick={() => handleUpdate({ bannerEnabled: !config.bannerEnabled })}
                className={`w-16 h-8 rounded-full transition-all relative shadow-inner ${config.bannerEnabled ? 'bg-blue-600' : 'bg-slate-800'}`}
              >
                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all shadow-md ${config.bannerEnabled ? 'right-1' : 'left-1'}`}></div>
              </button>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Message Content (Markdown Supported)</label>
              <textarea 
                value={config.banner}
                onChange={(e) => handleUpdate({ banner: e.target.value })}
                rows={5}
                className="w-full bg-slate-800 border border-white/5 rounded-3xl p-8 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-blue-600 transition-all resize-none shadow-inner"
              />
            </div>

            <div className="p-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex items-center space-x-4">
               <div className="p-2 bg-amber-500 rounded-xl text-white shadow-lg"><Megaphone size={16}/></div>
               <div>
                  <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest block mb-1">Active Preview:</span>
                  <p className="text-xs font-bold text-white italic">{config.banner}</p>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'legal' && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                 <h4 className="text-sm font-black text-white uppercase tracking-widest flex items-center px-2">
                   <ShieldCheck size={20} className="mr-3 text-blue-500" /> Terms of Engagement
                 </h4>
                 <textarea 
                   value={config.terms}
                   onChange={(e) => handleUpdate({ terms: e.target.value })}
                   rows={15}
                   className="w-full bg-slate-800 border border-white/5 rounded-[2rem] p-8 text-xs font-medium text-slate-400 outline-none focus:ring-2 focus:ring-blue-600 leading-relaxed shadow-inner no-scrollbar"
                 />
              </div>
              <div className="space-y-6">
                 <h4 className="text-sm font-black text-white uppercase tracking-widest flex items-center px-2">
                   <FileText size={20} className="mr-3 text-emerald-500" /> Privacy Protocols
                 </h4>
                 <textarea 
                   value={config.privacy}
                   onChange={(e) => handleUpdate({ privacy: e.target.value })}
                   rows={15}
                   className="w-full bg-slate-800 border border-white/5 rounded-[2rem] p-8 text-xs font-medium text-slate-400 outline-none focus:ring-2 focus:ring-blue-600 leading-relaxed shadow-inner no-scrollbar"
                 />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'emails' && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
               <div className="lg:col-span-1 space-y-6">
                  <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] px-2">Relay Templates</h4>
                  <div className="space-y-3">
                     {['Master Welcome', 'Sync Completed', 'Credit Warning', 'Ticket Resolved'].map((t, i) => (
                       <button key={i} className={`w-full text-left px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${i === 1 ? 'bg-blue-600 text-white border-blue-500 shadow-xl' : 'bg-slate-800/40 text-slate-500 border-white/5 hover:text-slate-300'}`}>
                         {t}
                       </button>
                     ))}
                  </div>
               </div>
               <div className="lg:col-span-3 space-y-6">
                  <div className="flex items-center justify-between px-2">
                     <h4 className="text-sm font-black text-white uppercase tracking-widest">Protocol Editor: Sync Completed</h4>
                     <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center bg-blue-600/10 px-4 py-2 rounded-xl">
                       <Eye size={14} className="mr-2" /> Live Preview
                     </button>
                  </div>
                  <textarea 
                    defaultValue="Hello {{username}},\n\nYour order sequence #{{order_id}} has successfully handshaked with our cloud nodes.\n\nTotal Charge: {{charge}}\nService Identity: {{service_name}}\n\nRegards,\nThe NOTTY Support Relay"
                    rows={12}
                    className="w-full bg-slate-950 border border-white/5 rounded-[2rem] p-8 text-sm font-mono text-blue-400 outline-none focus:ring-2 focus:ring-blue-600 leading-relaxed shadow-inner"
                  />
                  <div className="p-8 bg-slate-800/30 rounded-[2rem] border border-white/5">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">Relay Placeholders</span>
                    <div className="flex flex-wrap gap-3">
                       {['{{username}}', '{{order_id}}', '{{charge}}', '{{service_name}}', '{{link}}', '{{user_id}}'].map(p => (
                         <span key={p} className="px-3 py-1.5 bg-slate-900 rounded-xl text-[10px] font-mono text-slate-400 border border-white/5 shadow-sm">{p}</span>
                       ))}
                    </div>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] flex items-center space-x-6 shadow-xl group">
          <div className="p-4 bg-blue-600/10 text-blue-500 rounded-2xl group-hover:scale-110 transition-transform"><Megaphone size={24} /></div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Outreach</p>
            <p className="text-2xl font-black text-white tracking-tighter">Broadcast Ready</p>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] flex items-center space-x-6 shadow-xl group">
          <div className="p-4 bg-emerald-600/10 text-emerald-500 rounded-2xl group-hover:scale-110 transition-transform"><RefreshCw size={24} /></div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cache Architecture</p>
            <p className="text-2xl font-black text-white tracking-tighter">Node Optimized</p>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] flex items-center space-x-6 shadow-xl group">
          <div className="p-4 bg-rose-600/10 text-rose-500 rounded-2xl group-hover:scale-110 transition-transform"><FileText size={24} /></div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Legal Status</p>
            <p className="text-2xl font-black text-white tracking-tighter">Fully Compliant</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCMSManager;
