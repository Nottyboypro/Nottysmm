
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  RotateCcw, 
  Edit3, 
  ArrowRight,
  ShoppingBag,
  AlertCircle,
  Hash,
  User as UserIcon,
  RefreshCw
} from 'lucide-react';
import { Order, OrderStatus } from '../types.ts';
import { SMMServiceAPI } from '../services/smmService.ts';

const AdminOrderManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    const data = await SMMServiceAPI.getAllOrders();
    setOrders(data);
    setLoading(false);
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.COMPLETED: return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case OrderStatus.PENDING: return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case OrderStatus.CANCELLED: return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case OrderStatus.IN_PROGRESS: return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const filteredOrders = orders.filter(o => 
    (o.id.includes(searchTerm) || o.username?.includes(searchTerm) || o.serviceName.includes(searchTerm)) &&
    (statusFilter === 'All' || o.status === statusFilter || (statusFilter === 'Refill' && o.refillStatus === 'Requested'))
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Order Infrastructure</h2>
          <p className="text-slate-500 font-medium">Monitoring real relay logs between NOTTY SMM and Mesumax V2.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text"
              placeholder="Order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-sm font-bold text-slate-200 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
            />
          </div>
          <button onClick={loadOrders} className="p-3 bg-slate-800 rounded-2xl text-slate-400 hover:text-white">
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/30 border-b border-slate-800">
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Internal / Mesumax</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Identity</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Mapping / Qty</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Charge / Net</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status Flow</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                 <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-bold">Loading Database...</td></tr>
              ) : filteredOrders.length === 0 ? (
                 <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-bold uppercase tracking-widest">No orders found in database</td></tr>
              ) : filteredOrders.map(order => (
                <tr key={order.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-6">
                    <div className="font-black text-white text-xs">NOTTY-#{order.id}</div>
                    <div className="flex items-center text-[9px] font-black text-blue-400 uppercase tracking-widest mt-1">
                      {order.providerOrderId}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      <UserIcon size={10} className="mr-1" /> {order.username}
                    </div>
                    <div className="text-xs font-bold text-blue-500 truncate max-w-[120px]">
                      {order.link}
                    </div>
                  </td>
                  <td className="px-6 py-6 max-w-[200px]">
                    <div className="text-xs font-black text-slate-200 line-clamp-1">{order.serviceName}</div>
                    <div className="text-[10px] font-black text-slate-500 uppercase mt-0.5">{order.quantity.toLocaleString()} QTY</div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="text-xs font-black text-white">₹{order.charge.toFixed(2)}</div>
                    <div className="text-[10px] font-black text-emerald-500 uppercase mt-0.5">+₹{order.profit?.toFixed(2)} PROFIT</div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col space-y-2">
                      <div className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-current ${getStatusColor(order.status)}`}>
                        {order.status}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderManager;
