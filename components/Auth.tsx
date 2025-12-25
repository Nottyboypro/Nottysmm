
import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  RefreshCw
} from 'lucide-react';

interface AuthProps {
  onLogin: (userData: any) => void;
}

type AuthView = 'login' | 'signup' | 'forgot' | 'verify';

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [view, setView] = useState<AuthView>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Password strength state
  const [strength, setStrength] = useState({ score: 0, label: 'Too Short', color: 'bg-slate-700' });

  // Form States
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (view === 'signup') {
      const pass = formData.password;
      let score = 0;
      if (pass.length >= 8) score++;
      if (/[A-Z]/.test(pass)) score++;
      if (/[0-9]/.test(pass)) score++;
      if (/[^A-Za-z0-9]/.test(pass)) score++;

      if (score === 0) setStrength({ score: 0, label: 'Too Short', color: 'bg-slate-700' });
      else if (score <= 1) setStrength({ score: 25, label: 'Weak', color: 'bg-red-500' });
      else if (score === 2) setStrength({ score: 50, label: 'Fair', color: 'bg-orange-500' });
      else if (score === 3) setStrength({ score: 75, label: 'Good', color: 'bg-blue-500' });
      else setStrength({ score: 100, label: 'Strong', color: 'bg-emerald-500' });
    }
  }, [formData.password, view]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Simulated Latency
    await new Promise(r => setTimeout(r, 1200));

    if (view === 'login') {
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields.');
        setIsLoading(false);
        return;
      }

      // Check for Admin Backdoor
      if (formData.email === 'admin@notty.com' && formData.password === 'admin123') {
        onLogin({
          id: 'admin_root',
          username: 'SystemAdmin',
          email: 'admin@notty.com',
          balance: 9999.99,
          currency: 'USD',
          isAdmin: true
        });
      } else {
        // Mock User Login
        onLogin({
          id: 'user_1',
          username: formData.email.split('@')[0],
          email: formData.email,
          balance: 154.20,
          currency: 'USD',
          isAdmin: false
        });
      }
    } else if (view === 'signup') {
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters long.');
        setIsLoading(false);
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match. Please re-enter.');
        setIsLoading(false);
        return;
      }
      setSuccess('Registration successful! Redirecting to verification...');
      setTimeout(() => setView('verify'), 1000);
    } else if (view === 'forgot') {
      setSuccess('If this email is registered, you will receive a reset link shortly.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[150px] animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-600/10 rounded-full blur-[150px] animate-pulse"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-4 rounded-2xl shadow-2xl shadow-blue-900/40 mb-4 transform hover:scale-110 transition-transform">
            <ShoppingBag className="text-white" size={32} />
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white">
            NOTTY<span className="text-blue-500">SMM</span>
          </h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">Premium Social Marketing Infrastructure</p>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-3xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              {view === 'login' && 'Sign In'}
              {view === 'signup' && 'Sign Up'}
              {view === 'forgot' && 'Recovery'}
              {view === 'verify' && 'Verification'}
            </h2>
            <p className="text-slate-400 text-sm font-medium">
              {view === 'login' && 'Access your white-label dashboard.'}
              {view === 'signup' && 'Create your professional reseller account.'}
              {view === 'forgot' && "We'll help you get back into your account."}
              {view === 'verify' && "Protecting your account with email validation."}
            </p>
          </div>

          {(error || success) && (
            <div className={`mb-6 p-4 rounded-2xl flex items-start space-x-3 text-sm animate-in fade-in slide-in-from-top-4 duration-300 ${
              error ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
            }`}>
              {error ? <AlertCircle size={18} className="mt-0.5 shrink-0" /> : <CheckCircle2 size={18} className="mt-0.5 shrink-0" />}
              <span className="font-semibold">{error || success}</span>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-6">
            {view === 'signup' && (
              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input 
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white/10 transition-all placeholder:text-slate-600"
                    placeholder="Enter unique username"
                  />
                </div>
              </div>
            )}

            {(view !== 'verify') && (
              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input 
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white/10 transition-all placeholder:text-slate-600"
                    placeholder="name@company.com"
                  />
                </div>
              </div>
            )}

            {(view === 'login' || view === 'signup') && (
              <div className="space-y-2 group">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Password</label>
                  {view === 'login' && (
                    <button type="button" onClick={() => setView('forgot')} className="text-[10px] text-blue-500 hover:text-blue-400 font-black uppercase tracking-widest">Forgot?</button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input 
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white/10 transition-all placeholder:text-slate-600"
                    placeholder="••••••••"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            {view === 'signup' && (
              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Confirm Password</label>
                <div className="relative">
                  <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'text-red-500' : 'text-slate-500 group-focus-within:text-blue-500'}`} size={18} />
                  <input 
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full bg-white/5 border rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:bg-white/10 transition-all placeholder:text-slate-600 ${
                      formData.confirmPassword && formData.password !== formData.confirmPassword 
                        ? 'border-red-500/50 focus:ring-red-500/50' 
                        : 'border-white/10 focus:ring-blue-600'
                    }`}
                    placeholder="Repeat password"
                  />
                </div>
              </div>
            )}

            {view === 'verify' && (
              <div className="space-y-8 animate-in zoom-in-95 duration-500">
                <div className="flex justify-between gap-3">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <input 
                      key={i}
                      type="text"
                      maxLength={1}
                      className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl text-center text-2xl font-black text-white focus:ring-2 focus:ring-blue-600 focus:bg-white/10 focus:outline-none transition-all"
                    />
                  ))}
                </div>
                <button 
                  type="button" 
                  onClick={() => onLogin({ id: 'user_1', username: 'NewUser', email: 'verified@example.com', balance: 0, currency: 'USD', isAdmin: false })}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-emerald-900/30 active:scale-95"
                >
                  Complete Verification
                </button>
              </div>
            )}

            {view !== 'verify' && (
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-blue-900/30 flex items-center justify-center space-x-3 group active:scale-[0.98]"
              >
                <span>{isLoading ? 'Processing...' : view === 'login' ? 'Sign In' : view === 'signup' ? 'Create Account' : 'Recover Account'}</span>
                {!isLoading && <ArrowRight className="group-hover:translate-x-1.5 transition-transform" size={20} />}
              </button>
            )}
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            {view === 'login' ? (
              <p className="text-slate-500 text-sm font-medium">
                Don't have an account? <button onClick={() => setView('signup')} className="text-blue-500 font-black hover:text-blue-400 transition-colors">Start for free</button>
              </p>
            ) : view === 'forgot' ? (
              <button onClick={() => setView('login')} className="text-slate-500 text-sm font-black flex items-center justify-center mx-auto hover:text-white transition-colors uppercase tracking-widest">
                <ChevronLeft size={16} className="mr-2" /> Back to Log In
              </button>
            ) : view === 'signup' ? (
              <p className="text-slate-500 text-sm font-medium">
                Already a member? <button onClick={() => setView('login')} className="text-blue-500 font-black hover:text-blue-400 transition-colors">Sign in</button>
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
