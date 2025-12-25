
import React, { useState } from 'react';
import { Plus, MessageSquare, Clock, AlertCircle, Send, Hash, SendHorizontal, MessageCircle, ChevronRight, X } from 'lucide-react';
import { Ticket } from '../types.ts';

const SupportTickets: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  
  const [tickets, setTickets] = useState<Ticket[]>([
    { 
      id: 'TIC-102', 
      subject: 'Order #12845 Refill Request', 
      status: 'Answered', 
      priority: 'High', 
      lastUpdate: '1h ago',
      messages: [
        { role: 'user', text: 'Hey, my order dropped by 200 followers. Can I get a refill?', time: '2h ago' },
        { role: 'admin', text: 'Certainly! I have initiated a refill for Order #12845. It should complete within 24 hours.', time: '1h ago' }
      ]
    },
    { 
      id: 'TIC-098', 
      subject: 'Payment via Crypto not credited', 
      status: 'Open', 
      priority: 'High', 
      lastUpdate: '5h ago',
      messages: [{ role: 'user', text: 'I sent $50 in BTC but my wallet balance is still 0.', time: '5h ago' }]
    }
  ]);

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
              {tickets.map((ticket) => (
                <div 
                  key={ticket.id} 
                  onClick={() => setSelectedTicket(ticket)}
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
                        <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{ticket.lastUpdate}</span>
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
                    <ChevronRight size={20} className="text-slate-700 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-xl">
            <h4 className="font-black text-white mb-6 flex items-center tracking-tight">
              <MessageCircle className="mr-2 text-blue-500" size={20} />
              Join Community
            </h4>
            <div className="space-y-4">
              <a 
                href="https://t.me/nottysmm" 
                target="_blank" 
                className="flex items-center justify-between p-5 bg-[#0088cc]/10 hover:bg-[#0088cc]/20 border border-[#0088cc]/20 rounded-2xl transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-[#0088cc] rounded-xl text-white">
                    <Send size={18} />
                  </div>
                  <div>
                    <span className="text-xs font-black text-white uppercase tracking-widest block">Official Group</span>
                    <span className="text-[9px] text-[#0088cc] font-black uppercase">Instant Updates</span>
                  </div>
                </div>
                <ChevronRight size={18} className="text-[#0088cc] group-hover:translate-x-1 transition-transform" />
              </a>
              
              <a 
                href="https://t.me/nottychannel" 
                target="_blank" 
                className="flex items-center justify-between p-5 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-600/20 rounded-2xl transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-600 rounded-xl text-white">
                    <MessageCircle size={18} />
                  </div>
                  <div>
                    <span className="text-xs font-black text-white uppercase tracking-widest block">Update Channel</span>
                    <span className="text-[9px] text-blue-400 font-black uppercase">Promo Alerts</span>
                  </div>
                </div>
                <ChevronRight size={18} className="text-blue-500 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-900/40 to-slate-900 border border-red-500/20 rounded-[2.5rem] p-8 shadow-xl">
            <h4 className="font-black text-white mb-4 flex items-center">
              <AlertCircle className="mr-2 text-red-500" size={20} />
              Support Notice
            </h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Our average response time is <span className="text-white font-bold">45 minutes</span>. Always include your <span className="text-red-400 font-black">Order ID</span> for issues related to delivery speed or drops.
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
            
            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Subject</label>
                <input 
                  type="text" 
                  placeholder="e.g. Order #12845 Drop Issue"
                  className="w-full bg-slate-800 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Request Type</label>
                  <select className="w-full bg-slate-800 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:ring-2 focus:ring-blue-600 outline-none appearance-none">
                    <option>Order Issue</option>
                    <option>Payment Issue</option>
                    <option>Service Request</option>
                    <option>API Support</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Priority</label>
                  <select className="w-full bg-slate-800 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:ring-2 focus:ring-blue-600 outline-none appearance-none">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Message</label>
                <textarea 
                  rows={4}
                  placeholder="Explain your issue in detail..."
                  className="w-full bg-slate-800 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:ring-2 focus:ring-blue-600 outline-none"
                ></textarea>
              </div>

              <button className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-blue-900/30 transition-all">
                Submit Support Ticket
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Ticket Chat Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-2xl h-[80vh] bg-slate-900 border border-slate-800 rounded-[2.5rem] flex flex-col shadow-3xl animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-white tracking-tight">{selectedTicket.subject}</h3>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">#{selectedTicket.id}</span>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="p-2 hover:bg-slate-800 rounded-full text-slate-500">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {selectedTicket.messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-5 rounded-3xl text-sm font-medium ${
                    msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none'
                  }`}>
                    {msg.text}
                    <div className={`text-[8px] font-black uppercase mt-2 ${msg.role === 'user' ? 'text-blue-200' : 'text-slate-500'}`}>
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-8 border-t border-slate-800">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Type your reply..."
                  className="w-full bg-slate-800 border border-white/5 rounded-2xl pl-6 pr-16 py-5 text-sm font-bold text-white focus:ring-2 focus:ring-blue-600 outline-none"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 p-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all">
                  <SendHorizontal size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportTickets;
