
import React, { useState, useEffect } from 'react';
import { CreditCard, IndianRupee, Wallet, Bitcoin, CheckCircle, Tag, AlertCircle, ArrowRight, Loader2, Sparkles, History as HistoryIcon } from 'lucide-react';
import { User } from '../types.ts';
import { SMMServiceAPI } from '../services/smmService.ts';
import { auth, db } from '../services/firebase.ts';
import { doc, updateDoc } from 'firebase/firestore';

interface AddFundsProps {
  user: User;
  setUser: (user: User) => void;
}

const AddFunds: React.FC<AddFundsProps> = ({ user, setUser }) => {
  const [amount, setAmount] = useState<string>('');
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    loadTransactions();
  }, [user]);

  const loadTransactions = async () => {
    if(auth.currentUser) {
        const txs = await SMMServiceAPI.getTransactions(auth.currentUser.uid);
        setTransactions(txs);
    }
  };

  const MIN_DEPOSIT = 100;
  const MAX_DEPOSIT = 500000;

  const methods = [
    { id: 'card', name: 'Credit / Debit Card', icon: CreditCard, color: 'text-blue-400', bonus: 0 },
    { id: 'crypto', name: 'Cryptocurrency', icon: Bitcoin, color: 'text-orange-400', bonus: 5 }, // 5% bonus for crypto
    { id: 'wallet', name: 'UPI / PhonePe', icon: Wallet, color: 'text-purple-400', bonus: 0 },
  ];

  const handleDeposit = async () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < MIN_DEPOSIT || numAmount > MAX_DEPOSIT) {
      return;
    }

    setIsProcessing(true);
    // Simulate payment gateway delay (would integrate Razorpay/Stripe here)
    await new Promise(r => setTimeout(r, 2000));

    // Calculate bonus
    let bonusPercent = 0;
    const method = methods.find(m => m.id === selectedMethod);
    if (method) bonusPercent += method.bonus;

    const bonusAmount = numAmount * (bonusPercent / 100);
    const totalCredit = numAmount + bonusAmount;

    try {
        // Save to Firestore
        if (auth.currentUser) {
            await SMMServiceAPI.createTransaction(auth.currentUser.uid, numAmount, method?.name || 'Unknown', bonusAmount);
            
            // Update User Balance
            const newBalance = user.balance + totalCredit;
            const userRef = doc(db, "users", auth.currentUser.uid);
            await updateDoc(userRef, { balance: newBalance });
            
            setUser({ ...user, balance: newBalance });
        }
        
        await loadTransactions();
        setIsProcessing(false);
        setShowSuccess(true);
        setAmount('');
        setTimeout(() => setShowSuccess(false), 5000);

    } catch (e) {
        alert("Transaction Failed");
        setIsProcessing(false);
    }
  };

  const amountValue = parseFloat(amount) || 0;
  const isInvalid = amount !== '' && (amountValue < MIN_DEPOSIT || amountValue > MAX_DEPOSIT);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Wallet Summary Header */}
      <div className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-slate-800 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-white tracking-tight">Deposit Funds</h2>
          <p className="text-slate-400 font-medium mt-1">Instant credits. Zero hidden fees.</p>
        </div>
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 text-center md:text-right min-w-[200px] relative z-10">
          <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Available Balance</span>
          <div className="text-4xl font-black text-emerald-500 tracking-tighter mt-1">
            ₹{user.balance.toFixed(2)}
          </div>
        </div>
      </div>

      {showSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-[2rem] p-6 flex items-center justify-between animate-in zoom-in-95 duration-300">
          <div className="flex items-center space-x-4">
            <div className="bg-emerald-500 p-3 rounded-2xl text-white">
              <CheckCircle size={24} />
            </div>
            <div>
              <h4 className="font-black text-emerald-400">Payment Successful!</h4>
              <p className="text-sm text-slate-400 font-medium">Funds credited to wallet.</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 space-y-8 shadow-2xl">
            {/* Method Selection */}
            <div className="space-y-4">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">1. Choose Method</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {methods.map(method => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`flex flex-col items-center p-5 rounded-[1.5rem] border transition-all relative overflow-hidden group ${
                      selectedMethod === method.id 
                        ? 'bg-blue-600/10 border-blue-500/50 shadow-xl shadow-blue-900/10' 
                        : 'bg-slate-800/50 border-white/5 hover:border-white/10'
                    }`}
                  >
                    {method.bonus > 0 && (
                      <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">
                        +{method.bonus}%
                      </div>
                    )}
                    <div className={`p-4 rounded-2xl bg-slate-900/50 mb-3 group-hover:scale-110 transition-transform ${method.color}`}>
                      <method.icon size={24} />
                    </div>
                    <span className="font-bold text-xs text-slate-200 text-center">{method.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-4">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">2. Deposit Amount</label>
                <div className="flex space-x-3">
                  <span className="text-[10px] font-bold text-slate-600">Min: ₹{MIN_DEPOSIT}</span>
                  <span className="text-[10px] font-bold text-slate-600">Max: ₹{MAX_DEPOSIT}</span>
                </div>
              </div>
              <div className="relative group">
                <div className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${isInvalid ? 'text-red-500' : 'text-slate-500 group-focus-within:text-blue-500'}`}>
                  <IndianRupee size={24} />
                </div>
                <input 
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className={`w-full bg-slate-800/50 border rounded-[1.5rem] pl-14 pr-6 py-5 text-3xl font-black text-white focus:outline-none focus:ring-2 transition-all placeholder:text-slate-700 ${
                    isInvalid ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/5 focus:ring-blue-600 focus:border-transparent'
                  }`}
                />
              </div>
              
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {[100, 500, 1000, 2000, 5000, 10000].map(val => (
                  <button
                    key={val}
                    onClick={() => setAmount(val.toString())}
                    className="py-3 bg-slate-800/80 hover:bg-slate-700 border border-white/5 rounded-xl text-xs font-black text-slate-400 hover:text-white transition-all active:scale-95"
                  >
                    +₹{val}
                  </button>
                ))}
              </div>

              {isInvalid && (
                <div className="flex items-center space-x-2 text-red-500 px-1 animate-pulse">
                  <AlertCircle size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Amount must be between ₹{MIN_DEPOSIT} and ₹{MAX_DEPOSIT}</span>
                </div>
              )}
            </div>

            {/* Pay Button */}
            <button 
              disabled={isProcessing || !amount || isInvalid}
              onClick={handleDeposit}
              className="w-full py-5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-[1.5rem] font-black text-xl shadow-2xl shadow-blue-900/30 transition-all flex items-center justify-center space-x-3 active:scale-[0.98] relative overflow-hidden group"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  <span>Verifying Payment...</span>
                </>
              ) : (
                <>
                  <span>Deposit Securely</span>
                  <ArrowRight className="group-hover:translate-x-1.5 transition-transform" size={24} />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Transaction History Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 h-full shadow-2xl">
            <h4 className="text-lg font-black text-white mb-6 flex items-center tracking-tight">
              <HistoryIcon size={20} className="mr-2 text-blue-500" />
              History
            </h4>
            <div className="space-y-4 max-h-[500px] overflow-y-auto no-scrollbar">
              {transactions.length === 0 ? (
                <p className="text-center text-xs font-black text-slate-600 uppercase">No transactions found</p>
              ) : transactions.map((tx, i) => (
                <div key={i} className="group relative p-4 bg-slate-800/30 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all cursor-default">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{tx.date.split(',')[0]}</span>
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter bg-emerald-500/10 text-emerald-400`}>
                      {tx.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-black text-white">+ ₹{tx.amount.toFixed(2)}</div>
                      <div className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">{tx.method}</div>
                    </div>
                    {tx.bonus > 0 && (
                      <div className="text-right">
                        <div className="text-[9px] font-black text-emerald-500 uppercase tracking-tighter">Bonus</div>
                        <div className="text-xs font-black text-emerald-500">+₹{tx.bonus.toFixed(2)}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFunds;
