
import React, { useState } from 'react';
import { 
  Search, 
  RotateCcw, 
  ExternalLink, 
  Download, 
  RefreshCw, 
  Clock, 
  CheckCircle2, 
  Hash,
  Activity,
  ChevronRight
} from 'lucide-react';
import { OrderStatus, Order } from '../types.ts';
import { SMMServiceAPI } from '../services/smmService.ts';

interface OrderHistoryProps {
  orders: Order[];
  setOrders: (o: Order[]) => void;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ orders, setOrders }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fix: Replaced manual mapping that called non-existent getOrderStatus with centralized SMMServiceAPI.syncOrders()
  const handleRefreshStatuses = async () => {
    setIsRefreshing(true);
    try {
      const updatedOrders = await SMMServiceAPI.syncOrders();
      setOrders(updatedOrders);
    } catch (e) {
      console.error("Failed to sync orders:", e);
    }
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleRefill = async (orderId: string) => {
    try {
      await SMMServiceAPI.requestRefill(orderId);
      alert(`Refill request submitted for Order #${orderId}`);
    } catch (e: any) {
      alert(`Refill failed: ${e.message}`);
    }
  };

  const getStatusStyles = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.COMPLETED: return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case OrderStatus.IN_PROGRESS: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case OrderStatus.CANCELLED: return 'bg-red-500/10 text-red-400 border-red-500/20';
      case OrderStatus.PENDING: return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case OrderStatus.PARTIAL: return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case OrderStatus.PROCESSING: return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) || o.id.includes(searchTerm);
    const matchesStatus = statusFilter === 'All' || o.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col xl:flex-row gap-6 items-start xl:items-center justify-between">
        <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text"
              placeholder="Search by ID or Service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-slate-200 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
            />
          </div>
          
          <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-2xl overflow-x-auto no-scrollbar">
            {['All', 'Pending', 'In Progress', 'Completed', 'Cancelled'].map(filter => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  statusFilter === filter 
                    ? 'bg-slate-800 text-white shadow-md' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button 
            onClick={handleRefreshStatuses}
            disabled={isRefreshing}
            className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-6 py-3.5 bg-slate-900 border border-slate-800 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all disabled:opacity-50"
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            <span>Sync Status</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/30 border-b border-slate-800">
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">ID</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Date</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Service</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Target</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Quantity</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Progress</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Status</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredOrders.length > 0 ? filteredOrders.map(order => {
                // Safe numeric parsing for UI progress calculation
                const remainsNum = parseInt(order.remains || "0", 10);
                const quantityNum = order.quantity || 1;
                const progress = Math.max(0, Math.min(100, ((quantityNum - remainsNum) / quantityNum) * 100));

                return (
                  <tr key={order.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-6"><span className="text-xs font-black text-slate-400">#{order.id}</span></td>
                    <td className="px-6 py-6"><span className="text-[10px] font-bold text-slate-500 uppercase whitespace-nowrap">{order.createdAt}</span></td>
                    <td className="px-6 py-6 min-w-[200px]">
                      <div className="text-xs font-black text-slate-200 line-clamp-1">{order.serviceName}</div>
                      <div className="text-[9px] text-slate-500 font-bold uppercase mt-0.5">ID: {order.serviceId}</div>
                    </td>
                    <td className="px-6 py-6">
                      <a href={order.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-[10px] font-black text-blue-500 hover:text-blue-400 uppercase">
                        {order.link.substring(0, 15)}... <ExternalLink size={10} className="ml-1" />
                      </a>
                    </td>
                    <td className="px-6 py-6">
                      <div className="text-xs font-black text-slate-200">{order.quantity.toLocaleString()}</div>
                      <div className="text-[9px] font-bold text-slate-500 uppercase mt-0.5">${order.charge.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col space-y-1 min-w-[100px]">
                        <div className="flex justify-between text-[9px] font-black uppercase text-slate-500">
                          <span>Starts: {order.start_count || '0'}</span>
                          <span>Remains: {order.remains || '0'}</span>
                        </div>
                        <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${order.status === OrderStatus.COMPLETED ? 100 : progress}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${getStatusStyles(order.status)}`}>
                        {order.status}
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      {order.canRefill && order.status === OrderStatus.COMPLETED ? (
                        <button onClick={() => handleRefill(order.id)} className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">
                          <RotateCcw size={12} /><span>Refill</span>
                        </button>
                      ) : <span className="text-[9px] text-slate-600 font-black uppercase">No Action</span>}
                    </td>
                  </tr>
                );
              }) : (
                <tr><td colSpan={8} className="px-6 py-20 text-center text-slate-600 font-black uppercase tracking-widest opacity-20"><Activity size={48} className="mx-auto mb-4" />No orders found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
