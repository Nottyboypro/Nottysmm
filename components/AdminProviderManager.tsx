
import React, { useState, useEffect } from 'react';
import { Plus, Globe, Key, Trash2, Edit3, Save, X, RefreshCw, Activity, ShieldCheck } from 'lucide-react';
import { SMMServiceAPI } from '../services/smmService.ts';
import { Provider } from '../types.ts';

const AdminProviderManager: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProvider, setEditingProvider] = useState<Partial<Provider> | null>(null);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    setLoading(true);
    const data = await SMMServiceAPI.getProviders();
    setProviders(data);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!editingProvider) return;
    if (editingProvider.id) {
      await SMMServiceAPI.updateProvider(editingProvider.id, editingProvider);
    } else {
      await SMMServiceAPI.addProvider(editingProvider as any);
    }
    setEditingProvider(null);
    loadProviders();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this provider node? This might break services mapped to it.")) return;
    await SMMServiceAPI.deleteProvider(id);
    loadProviders();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Provider Nodes</h2>
          <p className="text-slate-500 font-medium">Connect external APIs to relay orders and fetch services.</p>
        </div>
        <button 
          onClick={() => setEditingProvider({ name: '', url: '', apiKey: '', status: 'Active', priority: 1 })}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
        >
          <Plus size={18} />
          <span>Add Provider</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 flex justify-center"><RefreshCw className="animate-spin text-blue-500" size={32} /></div>
        ) : providers.map(p => (
          <div key={p.id} className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
            <div className={`absolute top-4 right-4 w-2 h-2 rounded-full ${p.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-4 bg-blue-600/10 text-blue-500 rounded-2xl">
                <Globe size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">{p.name}</h3>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Priority: {p.priority}</p>
              </div>
            </div>

            <div className="space-y-4">
               <div className="p-3 bg-slate-950/50 rounded-xl border border-white/5 truncate">
                  <span className="text-[8px] font-black text-slate-600 uppercase block">Endpoint</span>
                  <span className="text-[10px] text-slate-400 font-mono">{p.url}</span>
               </div>
               <div className="p-3 bg-slate-950/50 rounded-xl border border-white/5 truncate">
                  <span className="text-[8px] font-black text-slate-600 uppercase block">Auth Key</span>
                  <span className="text-[10px] text-slate-400 font-mono">••••••••••••••••</span>
               </div>
            </div>

            <div className="flex items-center justify-end space-x-2 mt-8">
              <button onClick={() => setEditingProvider(p)} className="p-2.5 bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white rounded-xl transition-all"><Edit3 size={16} /></button>
              <button onClick={() => handleDelete(p.id)} className="p-2.5 bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white rounded-xl transition-all"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      {editingProvider && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 shadow-3xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-white tracking-tight">Provider Protocol</h3>
              <button onClick={() => setEditingProvider(null)} className="p-2 hover:bg-slate-800 rounded-full text-slate-500"><X size={24} /></button>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Provider Name</label>
                <input 
                  type="text" 
                  value={editingProvider.name} 
                  onChange={e => setEditingProvider({...editingProvider, name: e.target.value})}
                  className="w-full bg-slate-800 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="e.g. PeakSMM"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">API URL (V2)</label>
                <input 
                  type="text" 
                  value={editingProvider.url} 
                  onChange={e => setEditingProvider({...editingProvider, url: e.target.value})}
                  className="w-full bg-slate-800 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="https://provider.com/api/v2"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Secret Key</label>
                <input 
                  type="password" 
                  value={editingProvider.apiKey} 
                  onChange={e => setEditingProvider({...editingProvider, apiKey: e.target.value})}
                  className="w-full bg-slate-800 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Paste API Key"
                />
              </div>
              <button onClick={handleSave} className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-blue-900/30 transition-all">
                Save Node
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProviderManager;
