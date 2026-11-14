import React, { useState } from 'react';
import { X, ShieldCheck, Zap, LogIn, UserPlus, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const POPULAR_SKILLS = [
  'React', 'Next.js', 'Node.js', 'FastAPI', 'Python', 'Agentic AI',
  'Gemini API', 'Supabase', 'TailwindCSS', 'UI/UX Design', 'Solidity', 'PyTorch'
];

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const { login, register, demoLogin, loading } = useAuth();

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
      onClose();
    } else {
      setError(res.error || 'Authentication failed');
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
      onClose();
    } else {
      setError(res.error || 'Registration failed');
    }
  };

  const handleInstantDemo = async () => {
    await demoLogin();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4 animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 sm:p-7 shadow-elevated border border-slate-200/90 animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white shadow-glow mb-2.5">
            <Sparkles className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 font-display">
            {mode === 'login' ? 'Sign in to HackSphere AI' : 'Create Student Hacker Profile'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {mode === 'login'
              ? 'Access teammate matching, travel pods & autonomous agents'
              : 'Verified credentials with automatic .edu.in trust scoring'}
          </p>
        </div>

        {/* 1-Click Instant Demo Login Banner */}
        <div className="mb-4 rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100/60 p-3 text-xs shadow-2xs">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-600 fill-emerald-500 shrink-0" />
              <div>
                <p className="font-bold text-emerald-950 font-display">Live Hackathon Judge Shortcut</p>
                <p className="text-[11px] text-emerald-700">1-click login as Vikram (NIAT Lead)</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleInstantDemo}
              disabled={loading}
              className="rounded-lg bg-emerald-600 px-3 py-1.5 font-bold text-white shadow-xs hover:bg-emerald-700 transition shrink-0 btn-shine"
            >
              ⚡ Instant Demo
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl bg-slate-100 p-1 mb-4 text-xs font-bold font-display">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 rounded-lg py-2 transition ${
              mode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); }}
            className={`flex-1 rounded-lg py-2 transition ${
              mode === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            New Student Register
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
            {error}
          </div>
        )}

        {/* Login Form */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">College Email</label>
              <input
                type="email"
                required
                placeholder="yourname@college.edu.in"
                value={formData.college_email}
                onChange={(e) => setFormData({ ...formData, college_email: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-slate-900 py-3 font-bold text-white hover:bg-slate-800 transition shadow-subtle mt-2 disabled:opacity-60 btn-shine"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs max-h-[60vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Rayapuram Vikram"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:border-brand-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">City *</label>
                <input
                  type="text"
                  required
                  placeholder="Bengaluru"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:border-brand-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">College Name *</label>
              <input
                type="text"
                required
                placeholder="NIAT x Yenepoya University"
                value={formData.college_name}
                onChange={(e) => setFormData({ ...formData, college_name: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-slate-900 focus:border-brand-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                College Email * <span className="text-emerald-600 font-normal">(.edu.in / .ac.in auto-verifies)</span>
              </label>
              <input
                type="email"
                required
                placeholder="student@college.edu.in"
                value={formData.college_email}
                onChange={(e) => setFormData({ ...formData, college_email: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-slate-900 focus:border-brand-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Password (min 6 chars) *</label>
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-slate-900 focus:border-brand-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Skills & Tech Stack <span className="text-slate-400 font-normal font-tech">({formData.skills.length} selected)</span>
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1.5 bg-slate-50 rounded-xl border border-slate-200">
                {POPULAR_SKILLS.map((skill) => {
                  const selected = formData.skills.includes(skill);
                  return (
                    <button
                      type="button"
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`rounded-lg px-2.5 py-0.5 text-[11px] font-semibold transition ${
                        selected
                          ? 'bg-brand-600 text-white shadow-2xs'
                          : 'bg-white text-slate-700 border border-slate-300 hover:border-slate-400'
                      }`}
                    >
                      {skill} {selected && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-brand-600 py-3 font-bold text-white hover:bg-brand-700 transition shadow-subtle mt-2 disabled:opacity-60 btn-shine"
            >
              {loading ? 'Creating Profile...' : 'Create Verified Profile'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
