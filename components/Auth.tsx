
import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Mail, 
  Lock, 
  User as UserIcon, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  AlertCircle,
  CheckCircle2,
  ChevronLeft
} from 'lucide-react';
import { AuthService } from '../services/authService.ts';

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

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // Simulated network delay
    await new Promise(r => setTimeout(r, 1000));

    if (view === 'login') {
      // Fix: Added await to correctly resolve the result from AuthService.login
      const result = await AuthService.login(formData.email, formData.password);
      if (result.success) {
        setSuccess(result.message);
        setTimeout(() => onLogin(result.user), 500);
      } else {
        setError(result.message);
      }
    } else if (view === 'signup') {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match.');
        setIsLoading(false);
        return;
      }

      // Fix: Added await to correctly resolve the result from AuthService.signup
      const result = await AuthService.signup(formData.username, formData.email, formData.password);
      if (result.success) {
        setSuccess("Account created! Please sign in.");
        setTimeout(() => setView('login'), 1500);
      } else {
        setError(result.message);
      }
    } else if (view === 'forgot') {
      setSuccess('If the account exists, you will receive a reset link.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
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
          <p className="text-slate-500 text-sm mt-2 font-medium">Secure Marketing Infrastructure</p>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-3xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              {view === 'login' && 'Sign In'}
              {view === 'signup' && 'Sign Up'}
              {view === 'forgot' && 'Recovery'}
            </h2>
            <p className="text-slate-400 text-sm font-medium">
              {view === 'login' && 'Log in to manage your orders.'}
              {view === 'signup' && 'Register your new reseller account.'}
              {view === 'forgot' && "Enter your email to recover access."}
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
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-slate-600"
                    placeholder="Create username"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                {view === 'login' ? 'Email or Username' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  name="email"
                  type={view === 'login' ? 'text' : 'email'}
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-slate-600"
                  placeholder={view === 'login' ? "User ID" : "name@company.com"}
                />
              </div>
            </div>

            {view !== 'forgot' && (
              <div className="space-y-2 group">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Password</label>
                  {view === 'login' && (
                    <button type="button" onClick={() => setView('forgot')} className="text-[10px] text-blue-500 font-black uppercase tracking-widest">Forgot?</button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-slate-600"
                    placeholder="••••••••"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
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
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                    placeholder="Repeat password"
                  />
                </div>
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-blue-900/30 flex items-center justify-center space-x-3 group active:scale-[0.98]"
            >
              <span>{isLoading ? 'Checking...' : view === 'login' ? 'Secure Login' : view === 'signup' ? 'Create Account' : 'Recover'}</span>
              {!isLoading && <ArrowRight className="group-hover:translate-x-1.5 transition-transform" size={20} />}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            {view === 'login' ? (
              <p className="text-slate-500 text-sm font-medium">
                Don't have an account? <button onClick={() => setView('signup')} className="text-blue-500 font-black">Register Now</button>
              </p>
            ) : (
              <button onClick={() => setView('login')} className="text-slate-500 text-sm font-black flex items-center justify-center mx-auto uppercase tracking-widest">
                <ChevronLeft size={16} className="mr-2" /> Back to Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
