import React, { useState } from 'react';
import { X, ShieldCheck, Zap, LogIn, UserPlus, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const POPULAR_SKILLS = [
  'React', 'Next.js', 'Node.js', 'FastAPI', 'Python', 'Agentic AI',
  'Gemini API', 'Supabase', 'TailwindCSS', 'UI/UX Design', 'Solidity', 'PyTorch'
];

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const { login, register, demoLogin, loading } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    full_name: '',
    college_name: 'NIAT University',
    college_email: '',
    password: '',
    city: 'Bengaluru',
    gender: 'Male',
    skills: ['React', 'Node.js', 'Agentic AI'],
  });

  const [error, setError] = useState('');

  if (!isOpen) return null;

  const toggleSkill = (skill) => {
    if (formData.skills.includes(skill)) {
      setFormData({
        ...formData,
        skills: formData.skills.filter((s) => s !== skill),
      });
    } else {
      setFormData({
        ...formData,
        skills: [...formData.skills, skill],
      });
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(formData.college_email, formData.password);
    if (res.success) {
      toast.success('Signed in successfully!');
      onClose();
    } else {
      const errMsg = res.error || 'Authentication failed';
      setError(errMsg);
      toast.error(errMsg);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.skills.length === 0) {
      setError('Please select at least 1 skill');
      return;
    }

    const res = await register(formData);
    if (res.success) {
      toast.success('Account created and authenticated!');
      onClose();
    } else {
      const errMsg = res.error || 'Registration failed';
      setError(errMsg);
      toast.error(errMsg);
    }
  };

  const handleInstantDemo = async () => {
    await demoLogin();
    toast.success('Logged in as Vikram (Lead Architect @ NIAT)!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-surface p-6 sm:p-7 shadow-elevated border border-border/25 text-fg animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl p-1.5 text-muted hover:bg-surface-2 hover:text-fg transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* 1-Click Demo Login Banner */}
        <div className="mb-5 rounded-2xl bg-gradient-to-r from-brand/15 via-accent/10 to-brand/15 p-3.5 border border-brand/30 shadow-subtle flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand text-brand-fg shadow-glow shrink-0">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-fg">Judge / Evaluator Demo Access</p>
              <p className="text-[11px] text-muted">1-Click instant authentication with pre-verified NIAT student credentials</p>
            </div>
          </div>

          <button
            onClick={handleInstantDemo}
            disabled={loading}
            className="rounded-xl bg-brand px-3.5 py-1.5 text-xs font-extrabold text-brand-fg hover:opacity-95 transition shadow-glow shrink-0 btn-shine"
          >
            ⚡ Demo Login
          </button>
        </div>

        {/* Tab Switcher: Login / Register */}
        <div className="flex rounded-2xl bg-surface-2/80 p-1 mb-5 border border-border/15">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              mode === 'login'
                ? 'bg-surface text-fg shadow-sm border border-border/20'
                : 'text-muted hover:text-fg'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              mode === 'register'
                ? 'bg-surface text-fg shadow-sm border border-border/20'
                : 'text-muted hover:text-fg'
            }`}
          >
            Create Student Profile
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-rose-500/10 p-3 text-xs text-rose-500 border border-rose-500/30">
            {error}
          </div>
        )}

        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-fg mb-1">College Email Address *</label>
              <input
                type="email"
                required
                placeholder="vikram@niat.edu.in"
                value={formData.college_email}
                onChange={(e) => setFormData({ ...formData, college_email: e.target.value })}
                className="w-full rounded-xl border border-border/25 bg-surface-2/70 px-3.5 py-2.5 text-fg focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block font-semibold text-fg mb-1">Password *</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full rounded-xl border border-border/25 bg-surface-2/70 px-3.5 py-2.5 text-fg focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-brand py-3 font-bold text-brand-fg hover:opacity-95 transition disabled:opacity-60 shadow-glow btn-shine flex items-center justify-center gap-2 mt-2"
            >
              <LogIn className="h-4 w-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In to HackSphere'}</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-fg mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Rayapuram Vikram"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full rounded-xl border border-border/25 bg-surface-2/70 px-3 py-2 text-fg focus:border-brand focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block font-semibold text-fg mb-1">College / University *</label>
                <input
                  type="text"
                  required
                  placeholder="NIAT x Yenepoya University"
                  value={formData.college_name}
                  onChange={(e) => setFormData({ ...formData, college_name: e.target.value })}
                  className="w-full rounded-xl border border-border/25 bg-surface-2/70 px-3 py-2 text-fg focus:border-brand focus:outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-fg mb-1">College Email (.edu.in) *</label>
                <input
                  type="email"
                  required
                  placeholder="vikram@niat.edu.in"
                  value={formData.college_email}
                  onChange={(e) => setFormData({ ...formData, college_email: e.target.value })}
                  className="w-full rounded-xl border border-border/25 bg-surface-2/70 px-3 py-2 text-fg focus:border-brand focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block font-semibold text-fg mb-1">Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full rounded-xl border border-border/25 bg-surface-2/70 px-3 py-2 text-fg focus:border-brand focus:outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-fg mb-1">Campus City *</label>
                <input
                  type="text"
                  required
                  placeholder="Bengaluru"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full rounded-xl border border-border/25 bg-surface-2/70 px-3 py-2 text-fg focus:border-brand focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block font-semibold text-fg mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full rounded-xl border border-border/25 bg-surface-2/70 px-3 py-2 text-fg focus:border-brand focus:outline-none transition"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female (Eligible for Women-Only Pods)</option>
                  <option value="Non-Binary">Non-Binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>

            {/* Skill Selector Chips */}
            <div>
              <label className="block font-semibold text-fg mb-1.5">
                Primary Skills & Stack (Click to select) *
              </label>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_SKILLS.map((skill) => {
                  const isSelected = formData.skills.includes(skill);
                  return (
                    <button
                      type="button"
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`rounded-xl px-2.5 py-1 text-[11px] font-semibold transition ${
                        isSelected
                          ? 'bg-brand text-brand-fg shadow-glow font-bold'
                          : 'bg-surface-2 text-muted border border-border/20 hover:text-fg'
                      }`}
                    >
                      {isSelected ? `✓ ${skill}` : `+ ${skill}`}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-brand py-3 font-bold text-brand-fg hover:opacity-95 transition disabled:opacity-60 shadow-glow btn-shine flex items-center justify-center gap-2 mt-3"
            >
              <UserPlus className="h-4 w-4" />
              <span>{loading ? 'Creating Profile...' : 'Complete Registration'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
