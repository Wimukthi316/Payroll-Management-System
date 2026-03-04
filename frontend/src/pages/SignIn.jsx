import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
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
      await new Promise((r) => setTimeout(r, 700));
      signIn(form);
      navigate('/dashboard');
    } catch {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#050810' }}>
      {/* ── Left — Form ──────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 relative overflow-hidden">
        {/* Animated background orbs */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{ width: 520, height: 520, background: 'rgba(6,182,212,0.08)', filter: 'blur(100px)', top: '-15%', left: '-20%' }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{ width: 400, height: 400, background: 'rgba(139,92,246,0.07)', filter: 'blur(90px)', bottom: '-10%', right: '-15%' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{ width: 250, height: 250, background: 'rgba(59,130,246,0.06)', filter: 'blur(70px)', top: '50%', left: '60%' }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        />

        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22,1,0.36,1] }}>
          <Link to="/" className="flex items-center gap-2.5 mb-10 group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg,#06b6d4,#3b82f6)', boxShadow: '0 0 20px rgba(6,182,212,0.35)' }}>
              <Zap size={18} className="text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight" style={{ color: 'rgba(255,255,255,0.9)' }}>
              Payroll<span className="text-gradient bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg,#06b6d4,#3b82f6)' }}>Pro</span>
            </span>
          </Link>
        </motion.div>

        <motion.div
          className="w-full max-w-sm relative z-10"
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22,1,0.36,1], delay: 0.1 }}
        >
          <h2 className="text-2xl font-black mb-1" style={{ color: 'rgba(255,255,255,0.92)' }}>Welcome back</h2>
          <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.35)' }}>Sign in to access your dashboard</p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="mb-5 px-4 py-3 rounded-xl text-sm"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: '#f87171' }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="label">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.25)' }} />
                <input
                  id="email" name="email" type="email" autoComplete="email"
                  value={form.email} onChange={handleChange}
                  placeholder="you@company.com" className="input pl-10"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="label mb-0">Password</label>
                <a href="#" className="text-xs font-medium transition-colors" style={{ color: '#22d3ee' }}
                  onMouseEnter={e => e.currentTarget.style.color='#67e8f9'}
                  onMouseLeave={e => e.currentTarget.style.color='#22d3ee'}
                >Forgot password?</a>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.25)' }} />
                <input
                  id="password" name="password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={form.password} onChange={handleChange}
                  placeholder="••••••••" className="input pl-10 pr-11"
                />
                <button
                  type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'rgba(255,255,255,0.25)' }}
                  onMouseEnter={e => e.currentTarget.style.color='rgba(255,255,255,0.6)'}
                  onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.25)'}
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

          <p className="text-center text-sm mt-7" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="font-semibold transition-colors" style={{ color: '#22d3ee' }}
              onMouseEnter={e => e.currentTarget.style.color='#67e8f9'}
              onMouseLeave={e => e.currentTarget.style.color='#22d3ee'}
            >
              Sign up free
            </Link>
          </p>

          {/* Demo hint */}
          <div className="mt-6 p-3.5 rounded-xl" style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.12)' }}>
            <p className="text-xs font-medium text-center" style={{ color: '#22d3ee' }}>
              Demo credentials pre-filled. Click <strong>Sign In</strong> to continue.
            </p>
          </div>
        </motion.div>
      </div>

      {/* ── Right — Graphic ───────────────────────────────────────────── */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=1000&h=1200&auto=format&fit=crop"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,rgba(5,8,16,0.85) 0%,rgba(6,182,212,0.15) 50%,rgba(5,8,16,0.9) 100%)' }} />

        {/* Animated orbs on top of image */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{ width: 350, height: 350, background: 'rgba(6,182,212,0.12)', filter: 'blur(80px)', top: '10%', right: '5%' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{ width: 280, height: 280, background: 'rgba(99,102,241,0.1)', filter: 'blur(70px)', bottom: '15%', left: '10%' }}
          animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        />

        {/* Content */}
        <motion.div
          className="relative z-10 flex flex-col justify-end p-12 text-white h-full"
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22,1,0.36,1], delay: 0.2 }}
        >
          <blockquote className="text-lg font-medium italic leading-relaxed mb-5 max-w-sm" style={{ color: 'rgba(255,255,255,0.85)' }}>
            &ldquo;PayrollPro transformed how we handle compensation. What used to take a week now takes minutes.&rdquo;
          </blockquote>
          <div className="flex items-center gap-3 mb-8">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=48&h=48&auto=format&fit=facearea&facepad=2"
              alt="testimonial"
              className="w-10 h-10 rounded-full object-cover"
              style={{ boxShadow: '0 0 0 2px rgba(6,182,212,0.4)' }}
            />
            <div>
              <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>Sarah Chen</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>VP of HR, TechNova Inc.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Payroll Automation', 'Asset Tracking', 'HR Analytics', 'Compliance'].map((f, i) => (
              <motion.span
                key={f}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(8px)' }}
              >
                {f}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
