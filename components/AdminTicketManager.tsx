
import React, { useState, useEffect, useRef } from 'react';
import { 
  Inbox, 
  Search, 
  User as UserIcon, 
  Send, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare,
  RefreshCw,
  MoreVertical,
  ChevronRight,
  ShieldCheck,
  X,
  Star,
  Archive,
  Trash2,
  MoreHorizontal,
  Mail,
  ExternalLink,
  Tag,
  Ban,
  Wallet
} from 'lucide-react';
import { Ticket } from '../types.ts';
import { SMMServiceAPI } from '../services/smmService.ts';

const AdminTicketManager: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'All' | 'Open' | 'Closed'>('All');
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedTicketId, tickets]);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const data = await SMMServiceAPI.getTickets();
      data.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setTickets(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!selectedTicketId || !reply.trim() || isSending) return;
    
    setIsSending(true);
    try {
      await SMMServiceAPI.replyToTicket(selectedTicketId, reply, 'admin');
      setReply('');
      await loadTickets(); 
    } catch (e) {
      alert("Relay error: " + e);
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = async (id: string) => {
    if(!confirm("Are you sure you want to close this ticket?")) return;
    try {
      await SMMServiceAPI.closeTicket(id);
      await loadTickets();
    } catch (e) {
      alert(e);
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm("DANGER: This will permanently delete the ticket history. Continue?")) return;
    try {
      await SMMServiceAPI.deleteTicket(id);
      setSelectedTicketId(null);
      await loadTickets();
    } catch (e) {
      alert(e);
    }
  };

  const selectedTicket = tickets.find(t => t.id === selectedTicketId);
  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.id.includes(searchTerm) || 
                          t.username?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || (filter === 'Open' && t.status !== 'Closed') || (filter === 'Closed' && t.status === 'Closed');
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-10rem)] bg-[#0f172a] border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in duration-700">
      
      <div className="hidden xl:flex w-20 bg-slate-900 border-r border-slate-800 flex-col items-center py-8 space-y-6">
        <button className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-900/20"><Inbox size={20} /></button>
        <button className="p-3 text-slate-500 hover:bg-slate-800 hover:text-slate-300 rounded-2xl transition-all"><Star size={20} /></button>
        <button className="p-3 text-slate-500 hover:bg-slate-800 hover:text-slate-300 rounded-2xl transition-all"><Archive size={20} /></button>
        <button className="p-3 text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all"><Trash2 size={20} /></button>
      </div>

      <div className="w-full lg:w-96 border-r border-slate-800 flex flex-col bg-slate-900/50">
        <div className="p-6 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-black text-white tracking-tight">Mailbox</h3>
            <button 
              onClick={loadTickets}
              className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 transition-all hover:text-white"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
            <input 
              type="text" 
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-xs font-bold text-slate-300 outline-none focus:ring-1 focus:ring-blue-600 transition-all"
            />
          </div>
          <div className="flex items-center space-x-2">
            {['All', 'Open', 'Closed'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                  filter === f ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {loading && tickets.length === 0 ? (
            <div className="p-12 text-center">
              <RefreshCw className="animate-spin mx-auto mb-4 text-blue-500" size={32} />
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Refreshing Stream...</p>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="p-12 text-center">
              <Mail className="mx-auto mb-4 text-slate-700" size={48} />
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Inbox Zero Achieved</p>
            </div>
          ) : filteredTickets.map(ticket => (
            <div 
              key={ticket.id}
              onClick={() => setSelectedTicketId(ticket.id)}
              className={`p-5 border-b border-slate-800/50 cursor-pointer transition-all hover:bg-white/[0.02] relative group ${
                selectedTicketId === ticket.id ? 'bg-blue-600/5 border-l-4 border-l-blue-600' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                   <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center font-black text-[10px] text-blue-400">
                     {ticket.username?.substring(0,2).toUpperCase() || 'U'}
                   </div>
                   <span className="text-xs font-black text-slate-300">{ticket.username}</span>
                </div>
                <span className="text-[9px] font-black text-slate-600 uppercase">{ticket.lastUpdate.split(',')[0]}</span>
              </div>
              <h4 className={`text-xs font-black truncate mb-1 pr-6 ${selectedTicketId === ticket.id ? 'text-blue-400' : 'text-slate-100'}`}>
                {ticket.subject}
              </h4>
              <p className="text-[10px] text-slate-500 font-medium line-clamp-1 mb-2">
                {ticket.messages[ticket.messages.length - 1].text}
              </p>
              <div className="flex items-center space-x-2">
                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter ${
                  ticket.status === 'Open' ? 'bg-blue-500/10 text-blue-400' : 
                  ticket.status === 'Answered' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'
                }`}>
                  {ticket.status}
                </span>
                {ticket.priority === 'High' && (
                  <span className="bg-rose-500/10 text-rose-500 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter">Urgent</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-slate-950/40 relative">
        {selectedTicket ? (
          <>
            <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-3 mb-1">
                  <h3 className="text-xl font-black text-white">{selectedTicket.subject}</h3>
                  <Star size={18} className="text-slate-700 hover:text-amber-400 cursor-pointer transition-colors" />
                </div>
                <div className="flex items-center space-x-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <span className="text-blue-500">ID: #{selectedTicket.id}</span>
                  <span>•</span>
                  <span>Created: {new Date(selectedTicket.createdAt || Date.now()).toLocaleDateString()}</span>
                  <span>•</span>
                  <span className={`px-2 py-0.5 rounded ${selectedTicket.priority === 'High' ? 'bg-rose-500/10 text-rose-400' : 'bg-slate-800 text-slate-400'}`}>
                    {selectedTicket.priority} Priority
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleClose(selectedTicket.id)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    selectedTicket.status === 'Closed' 
                      ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
                      : 'bg-rose-600/10 text-rose-500 border border-rose-500/20 hover:bg-rose-600 hover:text-white'
                  }`}
                  disabled={selectedTicket.status === 'Closed'}
                >
                  <Archive size={14} />
                  <span>{selectedTicket.status === 'Closed' ? 'Closed' : 'Archive Ticket'}</span>
                </button>
                <button 
                  onClick={() => handleDelete(selectedTicket.id)}
                  className="p-2.5 bg-rose-500/10 hover:bg-rose-600 text-rose-500 hover:text-white rounded-xl transition-all"
                  title="Delete Forever"
                >
                  <Trash2 size={20} />
                </button>
                <button className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl">
                  <MoreHorizontal size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 flex flex-col xl:flex-row overflow-hidden">
              <div className="flex-1 flex flex-col overflow-y-auto p-8 space-y-10 no-scrollbar">
                {selectedTicket.messages.map((msg, i) => (
                  <div key={i} className="flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${
                          msg.role === 'admin' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {msg.role === 'admin' ? 'S' : (selectedTicket.username?.substring(0,1) || 'U')}
                        </div>
                        <div>
                          <div className="text-sm font-black text-white">
                            {msg.role === 'admin' ? 'Support Infrastructure' : selectedTicket.username}
                            <span className="ml-2 text-[10px] text-slate-600 font-bold">&lt;{msg.role === 'admin' ? 'support@notty.cloud' : 'user-relay@node.io'}&gt;</span>
                          </div>
                          <div className="text-[9px] font-black text-slate-500 uppercase">via secure relay • {msg.time}</div>
                        </div>
                      </div>
                      <button className="p-2 text-slate-700 hover:text-slate-400"><MoreVertical size={16} /></button>
                    </div>
                    <div className={`p-8 rounded-[2rem] text-sm leading-relaxed border ${
                      msg.role === 'admin' 
                        ? 'bg-blue-600/5 border-blue-500/20 text-blue-50' 
                        : 'bg-slate-900/50 border-slate-800 text-slate-300'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <div className="hidden xl:flex w-72 border-l border-slate-800 flex-col p-8 bg-slate-900/20">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl mx-auto flex items-center justify-center text-white shadow-xl shadow-blue-900/20 mb-4">
                    <UserIcon size={36} />
                  </div>
                  <h4 className="font-black text-white">{selectedTicket.username}</h4>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Client Portal Active</span>
                </div>

                <div className="space-y-6">
                  <div>
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest block mb-3">Context mapping</span>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-xl">
                        <Tag size={12} className="text-blue-500" />
                        <span className="text-[10px] font-black text-white uppercase tracking-tight">#{selectedTicket.id}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-xl">
                        <UserIcon size={12} className="text-emerald-500" />
                        <span className="text-[10px] font-black text-white uppercase tracking-tight">UID: {selectedTicket.userId}</span>
                      </div>
                      {selectedTicket.orderId && (
                        <div className="flex items-center justify-between p-3 bg-blue-600/10 border border-blue-500/20 rounded-xl group cursor-pointer">
                          <ExternalLink size={12} className="text-blue-400" />
                          <span className="text-[10px] font-black text-blue-400 uppercase tracking-tight">Order #{selectedTicket.orderId}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-5 bg-slate-800/30 rounded-2xl border border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black text-slate-500 uppercase">Quick Actions</span>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                       <button className="flex items-center space-x-2 p-2.5 bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white rounded-xl text-[10px] font-black uppercase transition-all">
                         <Ban size={14} /> <span>Block Node</span>
                       </button>
                       <button className="flex items-center space-x-2 p-2.5 bg-slate-800 hover:bg-emerald-600 text-slate-400 hover:text-white rounded-xl text-[10px] font-black uppercase transition-all">
                         <Wallet size={14} /> <span>Adjust Credit</span>
                       </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {selectedTicket.status !== 'Closed' ? (
              <div className="p-8 border-t border-slate-800 bg-slate-900/80 backdrop-blur-md">
                <div className="relative group">
                  <div className="absolute left-6 top-6 text-slate-600">
                    <Send size={18} />
                  </div>
                  <textarea 
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Compose an official response..."
                    rows={4}
                    className="w-full bg-slate-950 border border-white/5 rounded-[2rem] pl-14 pr-16 py-6 text-sm font-bold text-slate-200 outline-none focus:ring-2 focus:ring-blue-600 transition-all resize-none shadow-inner"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleReply();
                      }
                    }}
                  />
                  <div className="absolute right-6 bottom-6 flex items-center space-x-3">
                    <button 
                      onClick={handleReply}
                      disabled={isSending || !reply.trim()}
                      className="p-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white rounded-2xl shadow-xl transition-all active:scale-95 flex items-center space-x-2 px-6"
                    >
                      {isSending ? <RefreshCw className="animate-spin" size={18} /> : (
                        <>
                          <span className="text-xs font-black uppercase tracking-widest">Transmit</span>
                          <Send size={16} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-10 text-center bg-slate-900/50 border-t border-slate-800">
                 <div className="flex items-center justify-center space-x-3 text-slate-600 font-black uppercase tracking-[0.2em] text-xs">
                   <Archive size={16} />
                   <span>Archived Communication Protocol</span>
                 </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center opacity-20 p-20">
            <Mail size={120} className="text-slate-500 mb-8" />
            <div className="text-center max-w-sm">
              <h3 className="text-2xl font-black text-slate-500 uppercase tracking-tight">Operational Inbox</h3>
              <p className="text-xs font-bold text-slate-600 mt-4 uppercase leading-relaxed tracking-widest">
                Select a message from the relay to view the communication thread and issue a command.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTicketManager;
