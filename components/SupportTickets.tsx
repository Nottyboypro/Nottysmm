
import React, { useState, useEffect } from 'react';
import { Plus, MessageSquare, SendHorizontal, MessageCircle, ChevronRight, X, AlertCircle } from 'lucide-react';
import { Ticket, User } from '../types.ts';
import { SMMServiceAPI } from '../services/smmService.ts';
import { auth } from '../services/firebase.ts';

const SupportTickets: React.FC<{ user: User }> = ({ user }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTickets();
  }, [user]);

  const loadTickets = async () => {
    if(auth.currentUser) {
        const data = await SMMServiceAPI.getTickets(auth.currentUser.uid);
        setTickets(data);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!auth.currentUser) return;
    setLoading(true);

    const newTicket: Ticket = {
        id: Math.floor(1000 + Math.random() * 9000).toString(),
        subject,
        status: 'Open',
        priority: priority as any,
        lastUpdate: 'Just now',
        messages: [{ role: 'user', text: message, time: new Date().toLocaleTimeString() }],
        // Store user ID implicitly in Firestore document or add field
        userId: auth.currentUser.uid
    } as any; // Cast to any to include userId which might be missing in strict type if not updated

    await SMMServiceAPI.createTicket(newTicket);
    await loadTickets();
    setLoading(false);
    setShowCreateModal(false);
    setSubject('');
    setMessage('');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Priority Support</h2>
          <p className="text-slate-500 font-medium mt-1">Submit inquiries or report issues with your orders.</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-blue-900/30 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" />
          <span>New Ticket</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 bg-slate-800/20 flex items-center justify-between">
              <h3 className="text-xs font-black text-white uppercase tracking-widest">Active Tickets</h3>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-800 px-3 py-1 rounded-full">{tickets.length} TOTAL</span>
            </div>
            
            <div className="divide-y divide-slate-800">
              {tickets.length === 0 ? (
                  <div className="p-12 text-center text-slate-600 font-black uppercase tracking-widest">No support tickets found</div>
              ) : tickets.map((ticket) => (
                <div 
                  key={ticket.id} 
                  className="p-6 hover:bg-white/[0.02] transition-all cursor-pointer group flex items-center justify-between"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-4 rounded-2xl ${ticket.status === 'Open' ? 'bg-blue-500/10 text-blue-500' : 'bg-slate-800 text-slate-500'}`}>
                      <MessageSquare size={20} />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-100 group-hover:text-blue-400 transition-colors">{ticket.subject}</h4>
                      <div className="flex items-center space-x-3 mt-1.5">
                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">#{ticket.id}</span>
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter ${
                          ticket.priority === 'High' ? 'bg-red-500/10 text-red-400' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {ticket.priority} Priority
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-right hidden sm:block">
                      <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                        ticket.status === 'Open' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                        ticket.status === 'Answered' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                        'bg-slate-800 text-slate-500 border-transparent'
                      }`}>
                        {ticket.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-red-900/40 to-slate-900 border border-red-500/20 rounded-[2.5rem] p-8 shadow-xl">
            <h4 className="font-black text-white mb-4 flex items-center">
              <AlertCircle className="mr-2 text-red-500" size={20} />
              Support Notice
            </h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Our average response time is <span className="text-white font-bold">45 minutes</span>. Always include your <span className="text-red-400 font-black">Order ID</span>.
            </p>
          </div>
        </div>
      </div>

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-3xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-white tracking-tight">Create Ticket</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-slate-800 rounded-full text-slate-500">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Subject</label>
                <input 
                  type="text" 
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="e.g. Order #12845 Drop Issue"
                  className="w-full bg-slate-800 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:ring-2 focus:ring-blue-600 outline-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Priority</label>
                <select 
                    value={priority}
                    onChange={e => setPriority(e.target.value)}
                    className="w-full bg-slate-800 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:ring-2 focus:ring-blue-600 outline-none appearance-none"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Message</label>
                <textarea 
                  rows={4}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Explain your issue in detail..."
                  className="w-full bg-slate-800 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:ring-2 focus:ring-blue-600 outline-none"
                  required
                ></textarea>
              </div>

              <button disabled={loading} className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-blue-900/30 transition-all">
                {loading ? 'Submitting...' : 'Submit Support Ticket'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportTickets;
