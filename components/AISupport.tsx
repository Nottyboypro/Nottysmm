
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { geminiSupport } from '../services/geminiService.ts';

const AISupport: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: "Hello! I'm your NOTTY SMM Assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await geminiSupport.askSupport(userMsg, messages);
      setMessages(prev => [...prev, { role: 'model', text: response || "I'm sorry, I couldn't process that request." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "Service temporarily unavailable. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      <div className="p-6 bg-slate-800/50 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600 rounded-xl">
            <Bot className="text-white" size={24} />
          </div>
          <div>
            <h3 className="font-bold">NOTTY AI Agent</h3>
            <span className="text-xs text-emerald-400 flex items-center">
              <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></span>
              Online Support
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
              <div className={`p-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-600 ml-3' : 'bg-slate-800 mr-3'}`}>
                {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>
              <div className={`p-4 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-800 text-slate-200'
              } text-sm leading-relaxed shadow-sm`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-800 rounded-lg">
                <Bot size={18} />
              </div>
              <div className="bg-slate-800 p-4 rounded-2xl flex items-center space-x-2">
                <Loader2 className="animate-spin text-blue-500" size={18} />
                <span className="text-sm text-slate-400">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-6 border-t border-slate-800">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Ask about orders, services, or technical help..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            className="w-full bg-slate-800 border border-slate-700 rounded-2xl pl-4 pr-16 py-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="mt-3 text-[10px] text-slate-500 text-center uppercase tracking-widest font-bold">
          Powered by Gemini 3 Flash Engine
        </p>
      </div>
    </div>
  );
};

export default AISupport;
