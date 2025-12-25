
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Settings2, 
  Power, 
  PowerOff, 
  Edit3, 
  Pin, 
  ArrowUpDown, 
  Save, 
  X, 
  RefreshCw,
  TrendingUp,
  ShieldCheck,
  Hash,
  Activity
} from 'lucide-react';
import { SMMService } from '../types.ts';
import { SMMServiceAPI } from '../services/smmService.ts';

interface ManagedService extends SMMService {
  pinned?: boolean;
  enabled?: boolean;
  markupPercent?: number;
  originalRate?: string;
}

const ServiceManager: React.FC = () => {
  const [services, setServices] = useState<ManagedService[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [editingService, setEditingService] = useState<ManagedService | null>(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setLoading(true);
    try {
      const data = await SMMServiceAPI.getServices();
      // Initialize admin-only properties
      const managedData = data.map(s => ({
        ...s,
        pinned: false,
        enabled: true,
        markupPercent: 25, // Default markup from our API layer
        originalRate: (parseFloat(s.rate) / 1.25).toFixed(2) // Derived for demo
      }));
      setServices(managedData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = (id: number) => {
    setServices(prev => prev.map(s => 
      s.service === id ? { ...s, enabled: !s.enabled } : s
    ));
  };

  const togglePin = (id: number) => {
    setServices(prev => prev.map(s => 
      s.service === id ? { ...s, pinned: !s.pinned } : s
    ));
  };

  const handleUpdateService = (updated: ManagedService) => {
    setServices(prev => prev.map(s => 
      s.service === updated.service ? updated : s
    ));
    setEditingService(null);
  };

  const filteredServices = services
    .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.service.toString().includes(searchTerm))
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return 0;
    });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center">
            <Settings2 className="mr-3 text-blue-500" size={32} />
            Service Infrastructure
          </h2>
          <p className="text-slate-500 font-medium mt-1">Global control over service mapping, pricing, and visibility.</p>
        </div>

        <div className="flex items-center space-x-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text"
              placeholder="Search by ID or Internal Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-slate-600"
            />
          </div>
          <button 
            onClick={loadServices}
            disabled={isSyncing}
            className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 hover:text-white transition-all hover:bg-slate-800 active:rotate-180"
          >
            <RefreshCw size={20} className={isSyncing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/30 border-b border-slate-800">
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] w-20">Pin</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Mapping</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Display Name</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Cost / Rate</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Markup</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Features</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Status</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-20 text-center">
                    <Activity className="animate-spin text-blue-500 mx-auto mb-4" size={32} />
                    <p className="text-xs font-black uppercase tracking-widest text-slate-600">Retrieving Master List...</p>
                  </td>
                </tr>
              ) : filteredServices.map(service => (
                <tr key={service.service} className={`group hover:bg-white/[0.02] transition-colors ${!service.enabled ? 'opacity-50 grayscale' : ''}`}>
                  <td className="px-6 py-6">
                    <button 
                      onClick={() => togglePin(service.service)}
                      className={`transition-colors ${service.pinned ? 'text-blue-500' : 'text-slate-700 hover:text-slate-500'}`}
                    >
                      <Pin size={18} fill={service.pinned ? 'currentColor' : 'none'} />
                    </button>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Internal: <span className="text-blue-400">#{service.service}</span></span>
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Provider: {service.service}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6 min-w-[250px]">
                    <div className="text-xs font-black text-white group-hover:text-blue-400 transition-colors line-clamp-1">{service.name}</div>
                    <div className="text-[9px] text-slate-500 font-bold uppercase mt-0.5">{service.category}</div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-emerald-500">${service.rate}</span>
                      <span className="text-[9px] font-bold text-slate-500 uppercase line-through">P: ${service.originalRate}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-blue-500/10 rounded-xl">
                      <TrendingUp size={12} className="text-blue-400" />
                      <span className="text-[10px] font-black text-blue-400">+{service.markupPercent}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex space-x-2">
                      <div className={`p-1.5 rounded-lg border ${service.refill ? 'border-blue-500/30 text-blue-400 bg-blue-500/5' : 'border-slate-800 text-slate-700'}`} title="Refill Supported">
                        <RefreshCw size={12} />
                      </div>
                      <div className={`p-1.5 rounded-lg border ${service.cancel ? 'border-red-500/30 text-red-400 bg-red-500/5' : 'border-slate-800 text-slate-700'}`} title="Cancel Supported">
                        <X size={12} />
                      </div>
                      <div className={`p-1.5 rounded-lg border ${service.dripfeed ? 'border-purple-500/30 text-purple-400 bg-purple-500/5' : 'border-slate-800 text-slate-700'}`} title="Drip-feed Enabled">
                        <Activity size={12} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <button 
                      onClick={() => toggleStatus(service.service)}
                      className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border transition-all ${
                        service.enabled 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : 'bg-slate-800 text-slate-500 border-slate-700'
                      }`}
                    >
                      {service.enabled ? <Power size={12} /> : <PowerOff size={12} />}
                      <span className="text-[9px] font-black uppercase tracking-widest">{service.enabled ? 'Live' : 'Hidden'}</span>
                    </button>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <button 
                      onClick={() => setEditingService(service)}
                      className="p-3 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all active:scale-90"
                    >
                      <Edit3 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Service Modal */}
      {editingService && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-3xl animate-in zoom-in-95 duration-300 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-900/30">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight">Modify Infrastructure</h3>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Internal ID: #{editingService.service}</span>
                </div>
              </div>
              <button onClick={() => setEditingService(null)} className="p-3 hover:bg-slate-800 rounded-2xl text-slate-500 transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Internal Display Name</label>
                  <input 
                    type="text"
                    value={editingService.name}
                    onChange={(e) => setEditingService({...editingService, name: e.target.value})}
                    className="w-full bg-slate-800 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Markup %</label>
                    <div className="relative">
                      <input 
                        type="number"
                        value={editingService.markupPercent}
                        onChange={(e) => {
                          const m = parseFloat(e.target.value) || 0;
                          const original = parseFloat(editingService.originalRate || '0');
                          const newRate = (original * (1 + m/100)).toFixed(2);
                          setEditingService({...editingService, markupPercent: m, rate: newRate});
                        }}
                        className="w-full bg-slate-800 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:ring-2 focus:ring-blue-600 outline-none"
                      />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 font-black text-xs">%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Public Rate (1k)</label>
                    <div className="relative">
                      <input 
                        type="text"
                        value={editingService.rate}
                        onChange={(e) => setEditingService({...editingService, rate: e.target.value})}
                        className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-5 py-4 text-sm font-black text-emerald-400 outline-none"
                      />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 font-black text-xs">$</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Min Override</label>
                    <input 
                      type="text"
                      value={editingService.min}
                      onChange={(e) => setEditingService({...editingService, min: e.target.value})}
                      className="w-full bg-slate-800 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Max Override</label>
                    <input 
                      type="text"
                      value={editingService.max}
                      onChange={(e) => setEditingService({...editingService, max: e.target.value})}
                      className="w-full bg-slate-800 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </div>
                </div>

                <div className="p-6 bg-slate-800/30 rounded-3xl border border-white/5 space-y-4">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Capabilities control</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">Allow Manual Refills</span>
                    <button 
                      onClick={() => setEditingService({...editingService, refill: !editingService.refill})}
                      className={`w-10 h-5 rounded-full transition-all relative ${editingService.refill ? 'bg-blue-600' : 'bg-slate-700'}`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${editingService.refill ? 'right-0.5' : 'left-0.5'}`}></div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">Allow User Cancellation</span>
                    <button 
                      onClick={() => setEditingService({...editingService, cancel: !editingService.cancel})}
                      className={`w-10 h-5 rounded-full transition-all relative ${editingService.cancel ? 'bg-red-600' : 'bg-slate-700'}`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${editingService.cancel ? 'right-0.5' : 'left-0.5'}`}></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button 
                onClick={() => handleUpdateService(editingService)}
                className="flex-1 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-blue-900/30 transition-all flex items-center justify-center space-x-2"
              >
                <Save size={20} />
                <span>Deploy Changes</span>
              </button>
              <button 
                onClick={() => setEditingService(null)}
                className="px-8 py-5 bg-slate-800 hover:bg-slate-700 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Summary Footer */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-8 border-t border-slate-800">
        {[
          { label: 'Total Services', value: services.length, icon: Hash },
          { label: 'Live Active', value: services.filter(s => s.enabled).length, icon: Activity },
          { label: 'Avg. Markup', value: '25.0%', icon: TrendingUp },
          { label: 'Sync Status', value: 'Optimized', icon: ShieldCheck },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/40 p-5 rounded-3xl border border-slate-800 flex items-center space-x-4">
            <div className="p-3 bg-blue-600/10 text-blue-500 rounded-2xl">
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
              <p className="text-lg font-black text-white leading-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceManager;
