
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
  RefreshCw,
  ExternalLink,
  Filter,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  X
} from 'lucide-react';
import { Order, OrderStatus } from '../types.ts';
import { SMMServiceAPI } from '../services/smmService.ts';

const AdminOrderManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    const data = await SMMServiceAPI.getAllOrders();
    setOrders(data);
    setLoading(false);
  };

  const handleBulkSync = async () => {
    setIsSyncing(true);
    try {
      await SMMServiceAPI.syncAllActiveOrders();
      await loadOrders();
    } catch (e) {
      alert("Relay sync failed.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAction = async (status: OrderStatus, refund: boolean = false) => {
    if (!selectedOrder) return;
    if (!confirm(`Are you sure you want to set Order #${selectedOrder.id} to ${status}?${refund ? ' This will refund the user.' : ''}`)) return;
    
    await SMMServiceAPI.updateOrderStatus(selectedOrder.id, status, refund);
    setSelectedOrder(null);
    loadOrders();
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.COMPLETED: return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case OrderStatus.PENDING: return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case OrderStatus.CANCELLED: return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case OrderStatus.IN_PROGRESS: return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case OrderStatus.FAILED: return 'text-rose-500 bg-rose-500/20 border-rose-500/40';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const filteredOrders = orders.filter(o => 
    (o.id.includes(searchTerm) || o.username?.toLowerCase().includes(searchTerm.toLowerCase()) || o.serviceName.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === 'All' || o.status === statusFilter)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Order Architecture</h2>
          <p className="text-slate-500 font-medium">Monitoring handshakes between NOTTY SMM and Cloud Nodes.</p>
        </div>
        
        <div className="flex items-center space-x-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text"
              placeholder="Filter Order Flow..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-sm font-bold text-slate-200 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
            />
          </div>
          <button 
            onClick={handleBulkSync}
            disabled={isSyncing}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest disabled:bg-slate-800"
          >
            <RefreshCw size={18} className={isSyncing ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Sync All Status</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/30 border-b border-slate-800">
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Order ID / Prov</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Client / Link</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Mapping</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Yield / Cost</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status Flow</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                 <tr><td colSpan={6} className="px-6 py-20 text-center"><RefreshCw className="animate-spin text-blue-500 mx-auto" /></td></tr>
              ) : filteredOrders.map(order => (
                <tr key={order.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-6">
                    <div className="font-black text-white text-xs">#{order.id}</div>
                    <div className="text-[9px] font-black text-blue-400 uppercase tracking-widest mt-1">
                      RELAY: {order.providerOrderId}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="text-xs font-black text-slate-200 mb-1">{order.username}</div>
                    <a href={order.link} target="_blank" className="text-[10px] font-bold text-blue-500 flex items-center hover:underline">
                      {order.link.substring(0, 20)}... <ExternalLink size={10} className="ml-1" />
                    </a>
                  </td>
                  <td className="px-6 py-6 max-w-[200px]">
                    <div className="text-xs font-black text-slate-200 line-clamp-1">{order.serviceName}</div>
                    <div className="text-[10px] font-black text-slate-500 uppercase mt-0.5">{order.quantity.toLocaleString()} UNITS</div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="text-xs font-black text-white">₹{order.charge.toFixed(2)}</div>
                    <div className="text-[10px] font-black text-emerald-500 uppercase mt-0.5">+₹{order.profit?.toFixed(2)} PROFIT</div>
                  </td>
                  <td className="px-6 py-6">
                    <div className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-current ${getStatusColor(order.status)}`}>
                      {order.status}
                    </div>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="p-2.5 bg-slate-800 hover:bg-blue-600 hover:text-white rounded-xl text-slate-500 transition-all"
                    >
                      <Edit3 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-[3rem] p-10 shadow-3xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center space-x-4">
                  <div className="p-4 bg-blue-600 rounded-2xl text-white shadow-lg">
                    <ShoppingBag size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">Order Control</h3>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocol ID: #{selectedOrder.id}</p>
                  </div>
               </div>
               <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-slate-800 rounded-full text-slate-500"><X size={24} /></button>
            </div>

            <div className="space-y-4">
               <div className="p-5 bg-slate-950/50 rounded-2xl border border-white/5 space-y-2">
                  <div className="flex justify-between text-[10px] font-black text-slate-600 uppercase tracking-widest">
                     <span>Service</span>
                     <span className="text-blue-500">#{selectedOrder.serviceId}</span>
                  </div>
                  <div className="text-sm font-black text-white">{selectedOrder.serviceName}</div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => handleAction(OrderStatus.COMPLETED)}
                    className="flex flex-col items-center justify-center p-6 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white rounded-3xl border border-emerald-500/20 transition-all group"
                  >
                    <CheckCircle2 size={24} className="mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Manual Complete</span>
                  </button>
                  <button 
                    onClick={() => handleAction(OrderStatus.CANCELLED, true)}
                    className="flex flex-col items-center justify-center p-6 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-3xl border border-rose-500/20 transition-all group"
                  >
                    <XCircle size={24} className="mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Cancel & Refund</span>
                  </button>
               </div>

               <div className="grid grid-cols-3 gap-3">
                  {[OrderStatus.PARTIAL, OrderStatus.PROCESSING, OrderStatus.FAILED].map(status => (
                    <button 
                      key={status}
                      onClick={() => handleAction(status)}
                      className="py-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                    >
                      {status}
                    </button>
                  ))}
               </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/5 flex items-center space-x-3 text-amber-500 bg-amber-500/5 p-4 rounded-2xl">
               <AlertCircle size={16} className="shrink-0" />
               <p className="text-[10px] font-bold leading-tight">Manual status changes will override provider handshakes until the next scheduled sync.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrderManager;
