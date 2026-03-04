import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SignIn() {
  const [form, setForm]       = useState({ email: 'admin@payrollpro.com', password: 'password' });
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const { signIn }            = useAuth();
  const navigate              = useNavigate();

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (error) setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in both fields.');
      return;
    }
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 700)); // mock delay
      signIn(form);
      navigate('/dashboard');
    } catch {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-white animate-fade-in">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 mb-10 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-btn">
            <Zap size={18} className="text-white" />
          </div>
          <span className="font-extrabold text-slate-800 text-xl tracking-tight">
            Payroll<span className="text-indigo-600">Pro</span>
          </span>
        </Link>

        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-black text-slate-800 mb-1">Welcome back</h2>
          <p className="text-sm text-slate-400 mb-8">Sign in to access your dashboard</p>

          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="label">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  className="input pl-10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="label mb-0">Password</label>
                <a href="#" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  id="password"
                  name="password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input pl-10 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base">
              {loading ? (
                <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-7">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
              Sign up free
            </Link>
          </p>

          {/* Demo hint */}
          <div className="mt-6 p-3.5 bg-indigo-50 rounded-xl border border-indigo-100">
            <p className="text-xs text-indigo-600 font-medium text-center">
              Demo credentials pre-filled. Click <strong>Sign In</strong> to continue.
            </p>
          </div>
        </div>
      </div>

      {/* Right — Graphic / Photo */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=1000&h=1200&auto=format&fit=crop"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/80 via-violet-700/70 to-indigo-900/80" />
        {/* Content on top */}
        <div className="relative z-10 flex flex-col justify-end p-12 text-white">
          <blockquote className="text-lg font-medium italic leading-relaxed mb-5 max-w-sm text-white/90">
            "PayrollPro transformed how we handle compensation. What used to take a week now takes minutes."
          </blockquote>
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=48&h=48&auto=format&fit=facearea&facepad=2"
              alt="testimonial"
              className="w-10 h-10 rounded-full ring-2 ring-white/40 object-cover"
            />
            <div>
              <p className="text-sm font-semibold">Sarah Chen</p>
              <p className="text-xs text-white/60">VP of HR, TechNova Inc.</p>
            </div>
          </div>
          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 mt-8">
            {['Payroll Automation', 'Asset Tracking', 'HR Analytics', 'Compliance'].map((f) => (
              <span key={f} className="px-3 py-1 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full text-xs font-medium text-white">
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
