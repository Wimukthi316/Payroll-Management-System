import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Zap, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

function SignUpField({ name, label, type = 'text', icon: Icon, placeholder, half, form, onChange, errors }) {
  return (
    <div className={half ? '' : 'md:col-span-2'}>
      <label htmlFor={name} className="label">{label}</label>
      <div className="relative">
        {Icon && <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.25)' }} />}
        <input
          id={name} name={name} type={type}
          value={form[name]} onChange={onChange}
          placeholder={placeholder}
          className={`input pl-10 ${errors?.[name] ? 'border-red-500/40 focus:ring-red-500/20' : ''}`}
        />
      </div>
      {errors?.[name] && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors[name]}</p>}
    </div>
  );
}

export default function SignUp() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', company: '', email: '', password: '', confirmPassword: '',
  });
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState({});
  const { signIn }              = useAuth();
  const navigate                = useNavigate();

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((er) => ({ ...er, [e.target.name]: '' }));
  }

  function validate() {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = 'Required';
    if (!form.lastName.trim())  errs.lastName  = 'Required';
    if (!form.email.trim())     errs.email     = 'Required';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Invalid email';
    if (form.password.length < 8) errs.password = 'Min 8 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      signIn({ name: `${form.firstName} ${form.lastName}`.trim(), email: form.email, password: form.password });
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#050810' }}>
      {/* ── Left — Graphic ───────────────────────────────────────────── */}
      <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=1000&h=1200&auto=format&fit=crop"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,rgba(5,8,16,0.92) 0%,rgba(6,182,212,0.10) 55%,rgba(5,8,16,0.95) 100%)' }} />

        {/* Animated orbs */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{ width: 420, height: 420, background: 'rgba(6,182,212,0.1)', filter: 'blur(90px)', top: '5%', left: '-10%' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{ width: 320, height: 320, background: 'rgba(139,92,246,0.08)', filter: 'blur(80px)', bottom: '10%', right: '-5%' }}
          animate={{ scale: [1, 1.18, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2.5 }}
        />

        <motion.div
          className="relative z-10 flex flex-col justify-center flex-1 p-12 text-white"
          initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22,1,0.36,1], delay: 0.15 }}
        >
          <Link to="/" className="flex items-center gap-2.5 mb-16">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}>
              <Zap size={20} className="text-white" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight" style={{ color: 'rgba(255,255,255,0.9)' }}>
              Payroll<span style={{ backgroundImage: 'linear-gradient(135deg,#06b6d4,#3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Pro</span>
            </span>
          </Link>
          <h2 className="text-3xl font-black leading-tight mb-4 max-w-xs" style={{ color: 'rgba(255,255,255,0.92)' }}>
            Join thousands of forward-thinking teams.
          </h2>
          <p className="text-sm max-w-xs leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Set up your workspace in under 2 minutes. No credit card, no contracts — just powerful tools.
          </p>
          <div className="space-y-4">
            {[
              { n: '5×', t: 'Faster payroll cycles', color: '#22d3ee' },
              { n: '100%', t: 'Real-time visibility', color: '#34d399' },
              { n: 'SOC2', t: 'Security certified', color: '#a78bfa' },
            ].map(({ n, t, color }, i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
                className="flex items-center gap-3"
              >
                <span className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color }}
                >{n}</span>
                <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.65)' }}>{t}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Right — Form ──────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 relative overflow-hidden overflow-y-auto">
        {/* Animated background orbs */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{ width: 480, height: 480, background: 'rgba(6,182,212,0.07)', filter: 'blur(95px)', top: '-10%', right: '-15%' }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{ width: 350, height: 350, background: 'rgba(99,102,241,0.06)', filter: 'blur(80px)', bottom: '-5%', left: '-10%' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        />

        <motion.div
          className="w-full max-w-md relative z-10"
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22,1,0.36,1], delay: 0.1 }}
        >
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#06b6d4,#3b82f6)', boxShadow: '0 0 16px rgba(6,182,212,0.3)' }}>
              <Zap size={15} className="text-white" />
            </div>
            <span className="font-extrabold text-lg" style={{ color: 'rgba(255,255,255,0.9)' }}>
              Payroll<span style={{ backgroundImage: 'linear-gradient(135deg,#06b6d4,#3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Pro</span>
            </span>
          </Link>

          <h2 className="text-2xl font-black mb-1" style={{ color: 'rgba(255,255,255,0.92)' }}>Create your account</h2>
          <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.35)' }}>Free for 30 days. No credit card required.</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <SignUpField name="firstName" label="First Name"    icon={User}      placeholder="Alex"            half form={form} onChange={handleChange} errors={errors} />
              <SignUpField name="lastName"  label="Last Name"     icon={User}      placeholder="Johnson"         half form={form} onChange={handleChange} errors={errors} />
              <SignUpField name="company"   label="Company (opt)" icon={Building2} placeholder="Acme Corp"       half form={form} onChange={handleChange} errors={errors} />
              <SignUpField name="email"     label="Work Email"    icon={Mail}      placeholder="you@company.com" half type="email" form={form} onChange={handleChange} errors={errors} />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label htmlFor="password" className="label">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.25)' }} />
                <input
                  id="password" name="password"
                  type={showPw ? 'text' : 'password'}
                  value={form.password} onChange={handleChange}
                  placeholder="Min 8 characters"
                  className={`input pl-10 pr-11 ${errors.password ? 'border-red-500/40' : ''}`}
                />
                <button
                  type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'rgba(255,255,255,0.25)' }}
                  onMouseEnter={e => e.currentTarget.style.color='rgba(255,255,255,0.6)'}
                  onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.25)'}
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="label">Confirm Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.25)' }} />
                <input
                  id="confirmPassword" name="confirmPassword"
                  type="password"
                  value={form.confirmPassword} onChange={handleChange}
                  placeholder="Repeat password"
                  className={`input pl-10 ${errors.confirmPassword ? 'border-red-500/40' : ''}`}
                />
              </div>
              {errors.confirmPassword && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors.confirmPassword}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base">
              {loading ? (
                <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <>Create Account <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="text-xs text-center mt-4 leading-relaxed" style={{ color: 'rgba(255,255,255,0.3)' }}>
            By creating an account you agree to our{' '}
            <a href="#" className="transition-colors" style={{ color: '#22d3ee' }}
              onMouseEnter={e => e.currentTarget.style.color='#67e8f9'}
              onMouseLeave={e => e.currentTarget.style.color='#22d3ee'}
            >Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="transition-colors" style={{ color: '#22d3ee' }}
              onMouseEnter={e => e.currentTarget.style.color='#67e8f9'}
              onMouseLeave={e => e.currentTarget.style.color='#22d3ee'}
            >Privacy Policy</a>.
          </p>

          <p className="text-center text-sm mt-6" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Already have an account?{' '}
            <Link to="/signin" className="font-semibold transition-colors" style={{ color: '#22d3ee' }}
              onMouseEnter={e => e.currentTarget.style.color='#67e8f9'}
              onMouseLeave={e => e.currentTarget.style.color='#22d3ee'}
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}


