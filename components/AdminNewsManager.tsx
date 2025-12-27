
import React, { useState, useEffect } from 'react';
import { Megaphone, Plus, Trash2, Calendar, AlertCircle, CheckCircle, Info, Send, RefreshCw } from 'lucide-react';
import { SMMServiceAPI } from '../services/smmService.ts';

const AdminNewsManager: React.FC = () => {
  const [news, setNews] = useState<any[]>([]);
  const [content, setContent] = useState('');
  const [type, setType] = useState<'info' | 'warning' | 'success'>('info');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    setLoading(true);
    const data = await SMMServiceAPI.getAnnouncements();
    setNews(data);
    setLoading(false);
  };

  const handlePost = async () => {
    if (!content.trim()) return;
    setLoading(true);
    await SMMServiceAPI.addAnnouncement(content, type);
    setContent('');
    await loadNews();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this broadcast protocol?")) return;
    await SMMServiceAPI.deleteAnnouncement(id);
    loadNews();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Broadcast Engine</h2>
          <p className="text-slate-500 font-medium">Post announcements that appear on every client's dashboard.</p>
        </div>
        <button onClick={loadNews} className="p-3 text-slate-500 hover:text-white transition-all">
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl space-y-6">
            <h3 className="text-xl font-black text-white uppercase tracking-tight">Create Post</h3>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Relay Severity</label>
              <div className="grid grid-cols-3 gap-2">
                {(['info', 'warning', 'success'] as const).map(t => (
                  <button 
                    key={t}
                    onClick={() => setType(t)}
                    className={`py-3 rounded-xl text-[10px] font-black uppercase transition-all border ${
                      type === t 
                        ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-900/20' 
                        : 'bg-slate-800 text-slate-500 border-white/5'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Protocol Content</label>
              <textarea 
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Type news content for all users..."
                rows={5}
                className="w-full bg-slate-950 border border-white/5 rounded-2xl p-5 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-blue-600 resize-none shadow-inner"
              />
            </div>

            <button 
              onClick={handlePost}
              disabled={loading || !content.trim()}
              className="w-full py-5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center space-x-3 shadow-xl shadow-blue-900/30 group"
            >
              <Megaphone size={18} className="group-hover:rotate-12 transition-transform" />
              <span>{loading ? 'Transmitting...' : 'Deploy Broadcast'}</span>
            </button>
          </div>

          <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-3xl">
             <div className="flex items-center space-x-3 text-blue-500 mb-2">
                <Info size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">Transmission Policy</span>
             </div>
             <p className="text-[10px] text-slate-600 font-bold leading-relaxed uppercase">
                Announcements are cached locally on client nodes. New broadcasts will trigger a notification on next dashboard sync.
             </p>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4 max-h-[700px] overflow-y-auto no-scrollbar pr-2">
          {news.length === 0 ? (
            <div className="p-24 text-center border-2 border-dashed border-slate-800 rounded-[3rem] opacity-30">
               <Megaphone size={64} className="mx-auto mb-6" />
               <p className="font-black uppercase tracking-widest text-xs">Awaiting System Broadcasts</p>
            </div>
          ) : news.map(item => (
            <div key={item.id} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex items-start justify-between group hover:border-blue-500/30 transition-all shadow-xl">
              <div className="flex items-start space-x-4">
                <div className={`p-4 rounded-2xl shadow-inner ${
                  item.type === 'warning' ? 'bg-rose-500/10 text-rose-500' : 
                  item.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'
                }`}>
                  {item.type === 'warning' ? <AlertCircle size={24} /> : item.type === 'success' ? <CheckCircle size={24} /> : <Info size={24} />}
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-sm font-black text-slate-200 leading-relaxed">{item.content}</p>
                  <div className="flex items-center space-x-3 mt-4">
                    <Calendar size={12} className="text-slate-600" />
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{item.date}</span>
                    <span className="text-slate-800 font-black">•</span>
                    <span className="text-[10px] font-black text-blue-500/60 uppercase tracking-widest">Deployed from HQ</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => handleDelete(item.id)} 
                className="p-2.5 text-slate-800 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminNewsManager;
