import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Zap, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function SignUpField({ name, label, type = 'text', icon: Icon, placeholder, half, form, onChange, errors }) {
  return (
    <div className={half ? '' : 'md:col-span-2'}>
      <label htmlFor={name} className="label">{label}</label>
      <div className="relative">
        {Icon && <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />}
        <input
          id={name}
          name={name}
          type={type}
          value={form[name]}
          onChange={onChange}
          placeholder={placeholder}
          className={`input pl-10 ${errors?.[name] ? 'border-red-300 focus:ring-red-300 focus:border-red-400' : ''}`}
        />
      </div>
      {errors?.[name] && <p className="text-xs text-red-500 mt-1">{errors[name]}</p>}
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
      signIn({ email: form.email, password: form.password });
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="min-h-screen flex">
      {/* Left — Graphic */}
      <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=1000&h=1200&auto=format&fit=crop"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-violet-700/85 via-indigo-600/75 to-indigo-900/85" />
        <div className="relative z-10 flex flex-col justify-center flex-1 p-12 text-white">
          <Link to="/" className="flex items-center gap-2.5 mb-16">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center border border-white/30">
              <Zap size={20} className="text-white" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight">Payroll<span className="text-yellow-300">Pro</span></span>
          </Link>
          <h2 className="text-3xl font-black leading-tight mb-4 max-w-xs">
            Join thousands of forward-thinking teams.
          </h2>
          <p className="text-sm text-white/70 max-w-xs leading-relaxed mb-10">
            Set up your workspace in under 2 minutes. No credit card, no contracts — just powerful tools.
          </p>
          <div className="space-y-4">
            {[
              { n: '5×', t: 'Faster payroll cycles' },
              { n: '100%', t: 'Real-time visibility' },
              { n: 'SOC2', t: 'Security certified' },
            ].map(({ n, t }) => (
              <div key={t} className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-sm font-black text-yellow-300">{n}</span>
                <span className="text-sm font-medium text-white/80">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-white overflow-y-auto animate-fade-in">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
              <Zap size={15} className="text-white" />
            </div>
            <span className="font-extrabold text-slate-800 text-lg">Payroll<span className="text-indigo-600">Pro</span></span>
          </Link>

          <h2 className="text-2xl font-black text-slate-800 mb-1">Create your account</h2>
          <p className="text-sm text-slate-400 mb-8">Free for 30 days. No credit card required.</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <SignUpField name="firstName" label="First Name"    icon={User}      placeholder="Alex"          half form={form} onChange={handleChange} errors={errors} />
              <SignUpField name="lastName"  label="Last Name"     icon={User}      placeholder="Johnson"       half form={form} onChange={handleChange} errors={errors} />
              <SignUpField name="company"   label="Company (opt)" icon={Building2} placeholder="Acme Corp"     half form={form} onChange={handleChange} errors={errors} />
              <SignUpField name="email"     label="Work Email"    icon={Mail}      placeholder="you@company.com" half type="email" form={form} onChange={handleChange} errors={errors} />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label htmlFor="password" className="label">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  id="password"
                  name="password"
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min 8 characters"
                  className={`input pl-10 pr-11 ${errors.password ? 'border-red-300' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="label">Confirm Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  className={`input pl-10 ${errors.confirmPassword ? 'border-red-300' : ''}`}
                />
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
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

          <p className="text-xs text-slate-400 text-center mt-4 leading-relaxed">
            By creating an account you agree to our{' '}
            <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>.
          </p>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/signin" className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
