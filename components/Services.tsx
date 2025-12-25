
import React, { useState, useEffect } from 'react';
import { Search, Filter, Info, ChevronRight } from 'lucide-react';
import { SMMServiceAPI } from '../services/smmService.ts';
import { SMMService } from '../types.ts';

const Services: React.FC = () => {
  const [services, setServices] = useState<SMMService[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    SMMServiceAPI.getServices().then(data => {
      setServices(data);
      setLoading(false);
    });
  }, []);

  const categories = ['All', ...Array.from(new Set(services.map(s => s.category)))];

  const filteredServices = services.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        
        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === cat 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-400">Loading premium services...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-800/50 border-b border-slate-800">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Service Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Rate (per 1k)</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Min / Max</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredServices.map(service => (
                  <tr key={service.service} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 text-slate-400 text-sm">{service.service}</td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-semibold text-slate-100 mb-1">{service.name}</div>
                        <div className="text-xs text-slate-500">{service.category}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-green-400">${service.rate}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-slate-400">
                        {service.min} / {service.max}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-2 hover:bg-slate-700 rounded-lg text-blue-400 transition-colors">
                        <Info size={18} />
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
