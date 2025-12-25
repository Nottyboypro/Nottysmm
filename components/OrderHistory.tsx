
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  RotateCcw, 
  ExternalLink, 
  Download, 
  RefreshCw, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Hash,
  Activity,
  ChevronRight
} from 'lucide-react';
import { OrderStatus, Order } from '../types.ts';
import { SMMServiceAPI } from '../services/smmService.ts';

const OrderHistory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [orders, setOrders] = useState<Order[]>([
    { 
      id: '12845', 
      serviceId: 101, 
      serviceName: '🚀 High Quality Instagram Followers [Stable]', 
      link: 'instagram.com/notty', 
      quantity: 1000, 
      charge: 1.25, 
      status: OrderStatus.COMPLETED, 
      start_count: '5420', 
      remains: '0', 
      createdAt: '2023-11-01 14:20', 
      canRefill: true 
    },
    { 
      id: '12844', 
      serviceId: 300, 
      serviceName: '⚡ Instant Instagram Likes [No Drop]', 
      link: 'instagram.com/p/B4x...', 
      quantity: 500, 
      charge: 0.22, 
      status: OrderStatus.IN_PROGRESS, 
      start_count: '120', 
      remains: '150', 
      createdAt: '2023-11-01 16:45', 
      canRefill: false 
    },
    { 
      id: '12843', 
      serviceId: 101, 
      serviceName: '🚀 High Quality Instagram Followers [Stable]', 
      link: 'instagram.com/notty', 
      quantity: 5000, 
      charge: 6.25, 
      status: OrderStatus.CANCELLED, 
      start_count: '0', 
      remains: '0', 
      createdAt: '2023-10-30 09:12', 
      canRefill: false 
    },
    { 
      id: '12842', 
      serviceId: 300, 
      serviceName: '⚡ Instant Instagram Likes [No Drop]', 
      link: 'instagram.com/reels/...', 
      quantity: 10000, 
      charge: 4.50, 
      status: OrderStatus.COMPLETED, 
      start_count: '890', 
      remains: '0', 
      createdAt: '2023-10-28 22:30', 
      canRefill: true 
    },
  ]);

  const handleRefreshStatuses = async () => {
    setIsRefreshing(true);
    const updatedOrders = await Promise.all(orders.map(async (order) => {
      if (order.status === OrderStatus.COMPLETED || order.status === OrderStatus.CANCELLED) return order;
      try {
        const statusData = await SMMServiceAPI.getOrderStatus(order.id);
        return {
          ...order,
          status: statusData.status,
          start_count: statusData.start_count,
          remains: statusData.remains
        };
      } catch (e) {
        return order;
      }
    }));
    setOrders(updatedOrders);
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

  const exportToCSV = () => {
    const headers = ['Order ID', 'Date', 'Service', 'Link', 'Quantity', 'Charge', 'Status', 'Start Count', 'Remains'];
    const rows = filteredOrders.map(o => [
      o.id,
      o.createdAt,
      o.serviceName,
      o.link,
      o.quantity,
      o.charge,
      o.status,
      o.start_count,
      o.remains
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `NOTTY_Orders_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-slate-600"
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
            className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-6 py-3.5 bg-slate-900 border border-slate-800 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-slate-800 transition-all disabled:opacity-50"
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            <span>Sync Status</span>
          </button>
          <button 
            onClick={exportToCSV}
            className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20 group"
          >
            <Download size={16} className="group-hover:translate-y-0.5 transition-transform" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/30 border-b border-slate-800">
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]"><div className="flex items-center"><Hash size={12} className="mr-1"/> ID</div></th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]"><div className="flex items-center"><Clock size={12} className="mr-1"/> Date</div></th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Service</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Target Link</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Quantity</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Progress</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Status</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredOrders.length > 0 ? filteredOrders.map(order => (
                <tr key={order.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-6">
                    <span className="text-xs font-black text-slate-400">#{order.id}</span>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter whitespace-nowrap">{order.createdAt}</span>
                  </td>
                  <td className="px-6 py-6 min-w-[200px]">
                    <div className="text-xs font-black text-slate-200 line-clamp-1 group-hover:text-blue-400 transition-colors">{order.serviceName}</div>
                    <div className="text-[9px] text-slate-500 font-bold uppercase mt-0.5">ID: {order.serviceId}</div>
                  </td>
                  <td className="px-6 py-6">
                    <a 
                      href={order.link.startsWith('http') ? order.link : `https://${order.link}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-[10px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-tighter"
                    >
                      {order.link.length > 20 ? order.link.substring(0, 20) + '...' : order.link}
                      <ExternalLink size={10} className="ml-1" />
                    </a>
                  </td>
                  <td className="px-6 py-6">
                    <div className="text-xs font-black text-slate-200">{order.quantity.toLocaleString()}</div>
                    <div className="text-[9px] font-bold text-slate-500 uppercase mt-0.5">${order.charge.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col space-y-1 min-w-[100px]">
                      <div className="flex justify-between text-[9px] font-black uppercase">
                        <span className="text-slate-500">Starts: <span className="text-slate-300">{order.start_count || '0'}</span></span>
                        <span className="text-slate-500">Remains: <span className="text-slate-300">{order.remains || '0'}</span></span>
                      </div>
                      <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 transition-all duration-1000" 
                          style={{ 
                            width: order.status === OrderStatus.COMPLETED ? '100%' : 
                                   order.remains && order.quantity ? `${Math.max(0, Math.min(100, (1 - (parseInt(order.remains) / order.quantity)) * 100))}%` : '0%' 
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${getStatusStyles(order.status)}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current mr-2 animate-pulse"></span>
                      {order.status}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    {order.canRefill && order.status === OrderStatus.COMPLETED ? (
                      <button 
                        onClick={() => handleRefill(order.id)}
                        className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all active:scale-95"
                      >
                        <RotateCcw size={12} />
                        <span>Refill</span>
                      </button>
                    ) : (
                      <div className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">No Action</div>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={8} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center opacity-20">
                      <Activity size={48} className="mb-4" />
                      <p className="text-sm font-black uppercase tracking-widest">No orders found matching your criteria</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-6 bg-slate-800/30 border-t border-slate-800 flex items-center justify-between">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Showing {filteredOrders.length} of {orders.length} orders</p>
          <div className="flex space-x-2">
            <button disabled className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-600 cursor-not-allowed">
              <ChevronRight size={16} className="rotate-180" />
            </button>
            <button disabled className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-600 cursor-not-allowed">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: CheckCircle2, label: 'Quality Assurance', text: 'All orders are verified by our proprietary anti-drop algorithms.' },
          { icon: Clock, label: 'Real-time Tracking', text: 'Status updates every 5-10 minutes directly from our primary node.' },
          { icon: AlertCircle, label: 'Issue with order?', text: 'Open a support ticket with your Order ID for rapid priority assistance.' },
        ].map((item, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex items-start space-x-4">
            <div className="p-3 bg-blue-600/10 text-blue-500 rounded-2xl">
              <item.icon size={20} />
            </div>
            <div>
              <h5 className="text-sm font-black text-white mb-1 uppercase tracking-tight">{item.label}</h5>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
