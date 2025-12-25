
import React, { useState } from 'react';
import { 
  Search, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  ExternalLink, 
  Filter, 
  Edit3, 
  MoreHorizontal,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Hash,
  User as UserIcon,
  ShoppingBag
} from 'lucide-react';
import { Order, OrderStatus } from '../types.ts';

const AdminOrderManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isSyncing, setIsSyncing] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const [orders, setOrders] = useState<Order[]>([
    { 
      id: '12845', 
      username: 'pro_marketer',
      serviceId: 101, 
      serviceName: '🚀 Instagram Followers', 
      link: 'instagram.com/notty', 
      quantity: 1000, 
      charge: 1.25, 
      profit: 0.31,
      status: OrderStatus.COMPLETED, 
      refillStatus: 'Requested',
      createdAt: '2023-11-01 14:20', 
      canRefill: true,
      providerOrderId: 'PROV-9981'
    },
    { 
      id: '12844', 
      username: 'agency_x',
      serviceId: 300, 
      serviceName: '⚡ Instant Likes', 
      link: 'instagram.com/p/B4x...', 
      quantity: 5000, 
      charge: 2.20, 
      profit: 0.55,
      status: OrderStatus.IN_PROGRESS, 
      createdAt: '2023-11-01 16:45', 
      canRefill: false,
      providerOrderId: 'PROV-9982'
    }
  ]);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    setEditingOrder(null);
  };

  const handleRefillAction = (orderId: string, action: 'Approve' | 'Reject') => {
    setOrders(prev => prev.map(o => 
      o.id === orderId 
        ? { ...o, refillStatus: action === 'Approve' ? 'Processing' : 'Rejected' } 
        : o
    ));
    alert(`Refill ${action}d for Order #${orderId}`);
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
          <h2 className="text-3xl font-black text-white tracking-tight">Orders Global Control</h2>
          <p className="text-slate-500 font-medium">Monitor and manually intervene in panel-provider order flows.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text"
              placeholder="Order ID, User or Service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-sm font-bold text-slate-200 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
            />
          </div>
          <div className="bg-slate-900 border border-slate-800 p-1 rounded-2xl flex">
            {['All', 'Pending', 'Refill'].map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  statusFilter === f ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/30 border-b border-slate-800">
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">ID / User</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Service</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Link / Qty</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Charge / Profit</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Provider ID</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredOrders.map(order => (
                <tr key={order.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-6">
                    <div className="font-black text-white text-xs">#{order.id}</div>
                    <div className="flex items-center text-[9px] font-black text-blue-400 uppercase tracking-widest mt-1">
                      <UserIcon size={10} className="mr-1" /> {order.username}
                    </div>
                  </td>
                  <td className="px-6 py-6 max-w-[200px]">
                    <div className="text-xs font-black text-slate-200 line-clamp-1">{order.serviceName}</div>
                    <div className="text-[9px] font-bold text-slate-500 uppercase mt-0.5">ID: {order.serviceId}</div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center text-xs text-blue-500 font-bold mb-1">
                      {order.link.substring(0, 15)}... <ExternalLink size={10} className="ml-1" />
                    </div>
                    <div className="text-[10px] font-black text-slate-400 uppercase">{order.quantity.toLocaleString()} QTY</div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="text-xs font-black text-white">${order.charge.toFixed(2)}</div>
                    <div className="text-[10px] font-black text-emerald-500 uppercase mt-0.5">+${order.profit?.toFixed(2)} NET</div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="bg-slate-950 border border-white/5 px-2 py-1 rounded text-[10px] font-mono text-slate-400">
                      {order.providerOrderId}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col space-y-2">
                      <div className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-current ${getStatusColor(order.status)}`}>
                        {order.status}
                      </div>
                      {order.refillStatus === 'Requested' && (
                        <div className="inline-flex items-center px-2 py-1 bg-amber-500/10 text-amber-500 rounded-lg text-[8px] font-black uppercase">
                          REFILL REQ
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {order.refillStatus === 'Requested' ? (
                        <>
                          <button onClick={() => handleRefillAction(order.id, 'Approve')} className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500/20 transition-all" title="Approve Refill">
                            <CheckCircle2 size={16} />
                          </button>
                          <button onClick={() => handleRefillAction(order.id, 'Reject')} className="p-2 bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500/20 transition-all" title="Reject Refill">
                            <XCircle size={16} />
                          </button>
                        </>
                      ) : (
                        <button onClick={() => setEditingOrder(order)} className="p-2 bg-slate-800 text-slate-400 rounded-lg hover:text-white transition-all">
                          <Edit3 size={16} />
                        </button>
                      )}
                      <button className="p-2 bg-slate-800 text-slate-400 rounded-lg hover:text-white transition-all">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Order Modal */}
      {editingOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-3xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-white">Order Control: #{editingOrder.id}</h3>
              <button onClick={() => setEditingOrder(null)} className="p-2 hover:bg-slate-800 rounded-full text-slate-500">
                <XCircle size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-800/50 rounded-2xl border border-white/5">
                  <span className="text-[10px] font-black text-slate-500 uppercase block mb-1">Provider ID</span>
                  <input type="text" defaultValue={editingOrder.providerOrderId} className="bg-transparent text-sm font-black text-white outline-none w-full" />
                </div>
                <div className="p-4 bg-slate-800/50 rounded-2xl border border-white/5">
                  <span className="text-[10px] font-black text-slate-500 uppercase block mb-1">Quantity Override</span>
                  <input type="number" defaultValue={editingOrder.quantity} className="bg-transparent text-sm font-black text-white outline-none w-full" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Force Status Update</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(OrderStatus).map(status => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(editingOrder.id, status)}
                      className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                        editingOrder.status === status ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-800 text-slate-400 border-white/5 hover:border-slate-700'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
                  Retry at Provider
                </button>
                <button className="flex-1 py-4 bg-rose-600/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
                  Full Refund
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Dashboard Link & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: ShoppingBag, label: 'Pending Sync', value: '12' },
          { icon: RotateCcw, label: 'Active Refills', value: '4' },
          { icon: AlertCircle, label: 'Provider Failures', value: '0' },
          { icon: Hash, label: 'Avg. Profit/Order', value: '$0.42' },
        ].map((s, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center space-x-4">
            <div className="p-3 bg-blue-600/10 text-blue-500 rounded-xl"><s.icon size={18} /></div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-tight">{s.label}</p>
              <p className="text-lg font-black text-white">{s.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrderManager;
