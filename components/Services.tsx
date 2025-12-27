
import React, { useState, useEffect } from 'react';
import { Search, Info, Activity, AlertCircle } from 'lucide-react';
import { SMMServiceAPI } from '../services/smmService.ts';
import { SMMService } from '../types.ts';

const Services: React.FC = () => {
  const [services, setServices] = useState<SMMService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    let mounted = true;
    SMMServiceAPI.getServices().then(data => {
      if (!mounted) return;
      if (data.length === 0) {
        setError("Unable to load services. The infrastructure might be undergoing maintenance.");
      } else {
        setServices(data);
        setError(null);
      }
      setLoading(false);
    }).catch(err => {
      if (mounted) {
        setError("Global Service Sync Failed. " + err.message);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  const categories = ['All', ...Array.from(new Set(services.map(s => s.category)))];

  const filteredServices = services.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.service.toString().includes(searchTerm);
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text"
            placeholder="Search service ID or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-slate-200 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
          />
        </div>
        
        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                selectedCategory === cat 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-slate-900 text-slate-500 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-24 flex flex-col items-center justify-center">
            <Activity className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">Retrieving Master Catalog...</p>
          </div>
        ) : error ? (
           <div className="p-24 flex flex-col items-center justify-center text-center">
            <AlertCircle className="w-12 h-12 text-rose-500 mb-4" />
            <p className="text-sm font-bold text-slate-400 mb-2">{error}</p>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">Node Connection Interrupted</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-800/30 border-b border-slate-800">
                  <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">ID</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Service Name</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Rate (per 1k)</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Min/Max Quantity</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredServices.map(service => (
                  <tr key={service.service} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-6 text-xs font-black text-slate-400">#{service.service}</td>
                    <td className="px-6 py-6">
                      <div className="text-sm font-black text-slate-100 group-hover:text-blue-400 transition-colors">{service.name}</div>
                      <div className="text-[9px] text-slate-500 font-bold uppercase mt-1">{service.category}</div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-emerald-400">₹{service.rate}</span>
                        <span className="text-[8px] font-black text-slate-600 uppercase">Premium Cloud Routing</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                        {service.min.toLocaleString()} / {service.max.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <button className="p-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl text-blue-500 transition-colors group-hover:shadow-lg group-hover:shadow-blue-500/10">
                        <Info size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
