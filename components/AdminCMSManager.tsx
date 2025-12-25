
import React, { useState } from 'react';
import { 
  Palette, 
  Upload, 
  Type, 
  Megaphone, 
  FileText, 
  Mail, 
  Save, 
  RefreshCw, 
  Image as ImageIcon,
  Globe,
  Bell,
  ShieldCheck,
  Eye
} from 'lucide-react';

const AdminCMSManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'banner' | 'legal' | 'emails'>('general');
  const [panelName, setPanelName] = useState('NOTTY SMM');
  const [bannerEnabled, setBannerEnabled] = useState(true);
  const [bannerText, setBannerText] = useState('🔥 50% EXTRA BONUS on all Crypto deposits this week! Don\'t miss out.');

  const [emailTemplates, setEmailTemplates] = useState({
    welcome: 'Hello {{username}}, welcome to the most powerful SMM infrastructure...',
    orderCompleted: 'Your order #{{order_id}} has been successfully completed!'
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">CMS & Branding</h2>
          <p className="text-slate-500 font-medium">Control the visual identity and communication of your panel.</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-900/30">
          <Save size={18} />
          <span>Publish Changes</span>
        </button>
      </div>

      <div className="flex bg-slate-900 border border-slate-800 p-1.5 rounded-[1.5rem] w-full lg:w-max">
        {[
          { id: 'general', label: 'Identity', icon: Palette },
          { id: 'banner', label: 'Announcement', icon: Megaphone },
          { id: 'legal', label: 'Legal Pages', icon: FileText },
          { id: 'emails', label: 'Email Engine', icon: Mail },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <tab.icon size={14} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl">
        {activeTab === 'general' && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center">
                  <Type className="mr-2 text-blue-500" size={16} /> Panel Name
                </label>
                <input 
                  type="text" 
                  value={panelName}
                  onChange={(e) => setPanelName(e.target.value)}
                  className="w-full bg-slate-800 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center">
                    <ImageIcon className="mr-2 text-blue-500" size={16} /> Main Logo
                  </label>
                  <div className="h-40 bg-slate-950 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center group hover:border-blue-500/50 transition-all cursor-pointer">
                    <Upload size={24} className="text-slate-600 group-hover:text-blue-500 mb-2" />
                    <span className="text-[10px] font-black text-slate-600 uppercase">SVG, PNG (Max 2MB)</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center">
                    <Globe className="mr-2 text-blue-500" size={16} /> Favicon
                  </label>
                  <div className="h-40 bg-slate-950 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center group hover:border-blue-500/50 transition-all cursor-pointer">
                    <Upload size={24} className="text-slate-600 group-hover:text-blue-500 mb-2" />
                    <span className="text-[10px] font-black text-slate-600 uppercase">ICO, PNG (32x32)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/30 border border-white/5 p-8 rounded-[2rem] space-y-6">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Branding Preview</h4>
              <div className="p-6 bg-slate-950 rounded-2xl border border-white/5 flex items-center space-x-4">
                 <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                   <Palette size={20} />
                 </div>
                 <div>
                   <div className="text-lg font-black text-white">{panelName}</div>
                   <div className="text-[10px] text-slate-600 font-bold uppercase">Public Reseller ID: #88921</div>
                 </div>
              </div>
              <div className="space-y-4">
                 <div className="flex items-center justify-between text-xs">
                   <span className="text-slate-400 font-bold">Accent Color</span>
                   <div className="flex space-x-2">
                     <div className="w-6 h-6 bg-blue-600 rounded-full cursor-pointer ring-2 ring-white"></div>
                     <div className="w-6 h-6 bg-emerald-600 rounded-full cursor-pointer opacity-50"></div>
                     <div className="w-6 h-6 bg-rose-600 rounded-full cursor-pointer opacity-50"></div>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'banner' && (
          <div className="space-y-8 max-w-2xl">
            <div className="flex items-center justify-between p-6 bg-slate-800/50 rounded-3xl border border-white/5">
              <div className="flex items-center space-x-4">
                <Bell size={24} className="text-blue-500" />
                <div>
                  <h4 className="font-black text-white">Global Announcement</h4>
                  <p className="text-xs text-slate-500">Show a sticky message to all users on top of dashboard.</p>
                </div>
              </div>
              <button 
                onClick={() => setBannerEnabled(!bannerEnabled)}
                className={`w-14 h-7 rounded-full transition-all relative ${bannerEnabled ? 'bg-blue-600' : 'bg-slate-700'}`}
              >
                <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${bannerEnabled ? 'right-1' : 'left-1'}`}></div>
              </button>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Banner Content</label>
              <textarea 
                value={bannerText}
                onChange={(e) => setBannerText(e.target.value)}
                rows={4}
                className="w-full bg-slate-800 border border-white/5 rounded-2xl p-6 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center space-x-3">
               <div className="p-2 bg-amber-500 rounded-lg text-white"><Megaphone size={14}/></div>
               <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Live Preview:</span>
               <p className="text-xs font-bold text-white truncate flex-1">{bannerText}</p>
            </div>
          </div>
        )}

        {activeTab === 'legal' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                 <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center">
                   <ShieldCheck size={16} className="mr-2 text-blue-500" /> Terms of Service
                 </h4>
                 <textarea 
                   rows={12}
                   className="w-full bg-slate-800 border border-white/5 rounded-2xl p-6 text-xs font-medium text-slate-400 outline-none focus:ring-2 focus:ring-blue-600 leading-relaxed"
                   defaultValue="By placing an order with our panel, you automatically accept all the below-listed terms of service whether you read them or not..."
                 />
              </div>
              <div className="space-y-4">
                 <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center">
                   <FileText size={16} className="mr-2 text-emerald-500" /> Privacy Policy
                 </h4>
                 <textarea 
                   rows={12}
                   className="w-full bg-slate-800 border border-white/5 rounded-2xl p-6 text-xs font-medium text-slate-400 outline-none focus:ring-2 focus:ring-blue-600 leading-relaxed"
                   defaultValue="We take your privacy seriously and will take all measures to protect your personal information..."
                 />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'emails' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-1 space-y-4">
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Notification Templates</h4>
                  <div className="space-y-2">
                     {['Welcome Email', 'Order Completed', 'Low Balance', 'Ticket Answered'].map((t, i) => (
                       <button key={i} className={`w-full text-left p-4 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${i === 1 ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-800 text-slate-400 border-white/5 hover:bg-slate-750'}`}>
                         {t}
                       </button>
                     ))}
                  </div>
               </div>
               <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center justify-between">
                     <h4 className="text-xs font-black text-white uppercase tracking-widest">Editing: Order Completed</h4>
                     <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center">
                       <Eye size={14} className="mr-1.5" /> Preview Template
                     </button>
                  </div>
                  <textarea 
                    value={emailTemplates.orderCompleted}
                    onChange={(e) => setEmailTemplates({...emailTemplates, orderCompleted: e.target.value})}
                    rows={10}
                    className="w-full bg-slate-950 border border-white/5 rounded-2xl p-6 text-sm font-mono text-blue-400 outline-none focus:ring-2 focus:ring-blue-600 leading-relaxed"
                  />
                  <div className="p-4 bg-slate-800/50 rounded-2xl border border-white/5">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">Available Placeholders</span>
                    <div className="flex flex-wrap gap-2">
                       {['{{username}}', '{{order_id}}', '{{charge}}', '{{service_name}}', '{{link}}'].map(p => (
                         <span key={p} className="px-2 py-1 bg-slate-900 rounded text-[9px] font-mono text-slate-400 border border-white/5">{p}</span>
                       ))}
                    </div>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex items-center space-x-4">
          <div className="p-3 bg-blue-600/10 text-blue-500 rounded-2xl"><Megaphone size={20} /></div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Banner Clicks</p>
            <p className="text-xl font-black text-white">4,812</p>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex items-center space-x-4">
          <div className="p-3 bg-emerald-600/10 text-emerald-500 rounded-2xl"><RefreshCw size={20} /></div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Last Cache Flush</p>
            <p className="text-xl font-black text-white">12m ago</p>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex items-center space-x-4">
          <div className="p-3 bg-rose-600/10 text-rose-500 rounded-2xl"><FileText size={20} /></div>
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Legal Status</p>
            <p className="text-xl font-black text-white">Compliance OK</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCMSManager;
