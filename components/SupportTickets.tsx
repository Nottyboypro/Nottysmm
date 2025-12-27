
import React, { useState, useEffect, useRef } from 'react';
import { Plus, MessageSquare, Send, ChevronRight, X, AlertCircle, Clock, CheckCircle2, User as UserIcon, ShieldCheck, Bell, Users, ExternalLink } from 'lucide-react';
import { Ticket, User } from '../types.ts';
import { SMMServiceAPI } from '../services/smmService.ts';
import { auth } from '../services/firebase.ts';

const SupportTickets: React.FC<{ user: User }> = ({ user }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [loading, setLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadTickets();
  }, [user]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedTicketId, tickets]);

  const loadTickets = async () => {
    if(auth.currentUser) {
        const data = await SMMServiceAPI.getTickets(auth.currentUser.uid);
        data.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setTickets(data);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!auth.currentUser) return;
    setLoading(true);

    const newTicket: Ticket = {
        id: Math.floor(1000 + Math.random() * 9000).toString(),
        userId: auth.currentUser.uid,
        username: user.username,
        subject,
        status: 'Open',
        priority: priority as any,
        lastUpdate: new Date().toLocaleString(),
        createdAt: Date.now(),
        messages: [{ role: 'user', text: message, time: new Date().toLocaleTimeString() }],
    };

    await SMMServiceAPI.createTicket(newTicket);
    await loadTickets();
    setLoading(false);
    setShowCreateModal(false);
    setSubject('');
    setMessage('');
  };

  const handleReply = async () => {
    if (!selectedTicketId || !reply.trim() || isSending) return;
    setIsSending(true);
    try {
      await SMMServiceAPI.replyToTicket(selectedTicketId, reply, 'user');
      setReply('');
      await loadTickets();
    } catch (e) {
      alert(e);
    } finally {
      setIsSending(false);
    }
  };

  const selectedTicket = tickets.find(t => t.id === selectedTicketId);

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
        <div className="xl:col-span-1 space-y-6">
          {/* Telegram Relay Cards */}
          <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-blue-600/10 transition-all"></div>
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center">
              <Send size={12} className="mr-2 text-blue-500" /> Telegram Relay Station
            </h3>
            
            <div className="space-y-3">
              <a 
                href="https://t.me/NOTTYUpdates" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-slate-800/50 hover:bg-slate-800 border border-white/5 rounded-2xl transition-all group/btn"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-600/10 text-blue-500 rounded-lg group-hover/btn:scale-110 transition-transform">
                    <Bell size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-black text-white uppercase tracking-tight">Update Channel</div>
                    <div className="text-[8px] font-black text-slate-500 uppercase">Live Node Alerts</div>
                  </div>
                </div>
                <ExternalLink size={14} className="text-slate-700 group-hover/btn:text-blue-500 transition-colors" />
              </a>

              <a 
                href="https://t.me/NOTTYSupportGroup" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-slate-800/50 hover:bg-slate-800 border border-white/5 rounded-2xl transition-all group/btn"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-emerald-600/10 text-emerald-500 rounded-lg group-hover/btn:scale-110 transition-transform">
                    <Users size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-black text-white uppercase tracking-tight">HQ Community</div>
                    <div className="text-[8px] font-black text-slate-500 uppercase">24/7 Group Support</div>
                  </div>
                </div>
                <ExternalLink size={14} className="text-slate-700 group-hover/btn:text-emerald-500 transition-colors" />
              </a>
            </div>
          </div>

          {/* Ticket List Container */}
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl h-[calc(100vh-28rem)] flex flex-col">
            <div className="p-6 border-b border-slate-800 bg-slate-800/20 flex items-center justify-between sticky top-0 z-10">
              <h3 className="text-xs font-black text-white uppercase tracking-widest">Active Tickets</h3>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-800 px-3 py-1 rounded-full">{tickets.length}</span>
            </div>
            
            <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-slate-800/50">
              {tickets.length === 0 ? (
                  <div className="p-12 text-center text-slate-600 font-black uppercase tracking-widest text-[10px]">No support tickets found</div>
              ) : tickets.map((ticket) => (
                <div 
                  key={ticket.id} 
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className={`p-6 hover:bg-white/[0.02] transition-all cursor-pointer group flex items-center justify-between ${selectedTicketId === ticket.id ? 'bg-blue-600/5 border-l-4 border-l-blue-600' : ''}`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-4 rounded-2xl ${ticket.status === 'Open' ? 'bg-blue-500/10 text-blue-500' : 'bg-slate-800 text-slate-500'}`}>
                      <MessageSquare size={20} />
                    </div>
                    <div>
                      <h4 className={`font-black truncate w-40 ${selectedTicketId === ticket.id ? 'text-blue-400' : 'text-slate-100'}`}>{ticket.subject}</h4>
                      <div className="flex items-center space-x-3 mt-1.5">
                        <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">#{ticket.id}</span>
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-tighter ${
                          ticket.status === 'Open' ? 'bg-blue-500/10 text-blue-400' : 
                          ticket.status === 'Answered' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'
                        }`}>
                          {ticket.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={16} className={`text-slate-700 transition-all ${selectedTicketId === ticket.id ? 'translate-x-1 text-blue-500' : ''}`} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="xl:col-span-2">
          {selectedTicket ? (
            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl h-[calc(100vh-16rem)] flex flex-col">
              <div className="p-6 border-b border-slate-800 bg-slate-800/20 flex items-center justify-between">
                 <div>
                    <h3 className="text-sm font-black text-white">{selectedTicket.subject}</h3>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className="text-[10px] font-black text-blue-500 uppercase">ID: #{selectedTicket.id}</span>
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">•</span>
                      <span className={`text-[10px] font-black uppercase ${selectedTicket.priority === 'High' ? 'text-rose-500' : 'text-slate-500'}`}>{selectedTicket.priority} Priority</span>
                    </div>
                 </div>
                 <button onClick={() => setSelectedTicketId(null)} className="p-2 hover:bg-slate-800 rounded-xl text-slate-500"><X size={18} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                {selectedTicket.messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'admin' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`flex max-w-[85%] ${msg.role === 'admin' ? 'flex-row' : 'flex-row-reverse'} items-start space-x-4`}>
                      <div className={`p-2 rounded-xl mt-1 shrink-0 ${msg.role === 'admin' ? 'bg-blue-600/10 text-blue-500 mr-4' : 'bg-slate-800 text-slate-400 ml-4'}`}>
                        {msg.role === 'admin' ? <ShieldCheck size={16} /> : <UserIcon size={16} />}
                      </div>
                      <div className="space-y-1">
                        <div className={`p-5 rounded-3xl text-sm font-medium leading-relaxed ${
                          msg.role === 'admin' 
                            ? 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-none' 
                            : 'bg-blue-600 text-white rounded-tr-none'
                        }`}>
                          {msg.text}
                        </div>
                        <div className={`text-[9px] font-black text-slate-600 uppercase px-2 ${msg.role === 'admin' ? 'text-left' : 'text-right'}`}>
                          {msg.role === 'admin' ? 'Support infrastructure' : 'You'} • {msg.time}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {selectedTicket.status !== 'Closed' ? (
                <div className="p-6 bg-slate-950/20 border-t border-slate-800">
                  <div className="relative">
                    <textarea 
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="Type your follow-up message..."
                      rows={2}
                      className="w-full bg-slate-900 border border-white/5 rounded-[1.5rem] pl-6 pr-16 py-5 text-sm font-bold text-slate-200 outline-none focus:ring-2 focus:ring-blue-600 transition-all resize-none"
                    />
                    <button 
                      onClick={handleReply}
                      disabled={isSending || !reply.trim()}
                      className="absolute right-3 bottom-3 p-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white rounded-2xl shadow-xl transition-all active:scale-95"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center bg-slate-950/50 border-t border-slate-800">
                   <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center justify-center">
                     <Clock size={12} className="mr-2" /> THIS COMMUNICATION CHANNEL IS NOW CLOSED
                   </span>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] flex flex-col items-center justify-center h-[calc(100vh-16rem)] opacity-20 p-20 text-center">
              <MessageSquare size={80} className="text-slate-500 mb-6" />
              <h3 className="text-xl font-black text-slate-500 uppercase tracking-tight">Select a Ticket</h3>
              <p className="text-xs font-bold text-slate-600 mt-2 uppercase tracking-widest">View your communication thread with support</p>
            </div>
          )}
        </div>
      </div>

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
