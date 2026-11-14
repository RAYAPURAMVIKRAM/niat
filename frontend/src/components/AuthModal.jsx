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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-elevated border border-slate-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700 mb-2">
            <Sparkles className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            {mode === 'login' ? 'Sign in to HackSphere AI' : 'Create Student Hacker Profile'}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {mode === 'login'
              ? 'Access teammate matching, travel pods & autonomous agents'
              : 'Verified credentials with automatic .edu.in trust scoring'}
          </p>
        </div>

        {/* 1-Click Instant Demo Login Banner */}
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-600 fill-emerald-500" />
              <div>
                <p className="font-bold text-emerald-900">Live Hackathon Judge Shortcut</p>
                <p className="text-[11px] text-emerald-700">1-click login as Vikram (NIAT Lead)</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleInstantDemo}
              disabled={loading}
              className="rounded-lg bg-emerald-600 px-3 py-1.5 font-bold text-white shadow-xs hover:bg-emerald-700 transition"
            >
              ⚡ Instant Demo
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex rounded-lg bg-slate-100 p-1 mb-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 rounded-md py-1.5 transition ${
              mode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); }}
            className={`flex-1 rounded-md py-1.5 transition ${
              mode === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            New Student Register
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-rose-50 p-2.5 text-xs text-rose-700 border border-rose-200">
            {error}
          </div>
        )}

        {/* Login Form */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">College Email</label>
              <input
                type="email"
                required
                placeholder="yourname@college.edu.in"
                value={formData.college_email}
                onChange={(e) => setFormData({ ...formData, college_email: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-brand-600 focus:outline-none"
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
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-brand-600 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-slate-900 py-2.5 font-bold text-white hover:bg-slate-800 transition shadow-xs mt-2 disabled:opacity-60"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs max-h-[60vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Rayapuram Vikram"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-brand-600 focus:outline-none"
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
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-brand-600 focus:outline-none"
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
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-brand-600 focus:outline-none"
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
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-brand-600 focus:outline-none"
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
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-brand-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Skills & Tech Stack <span className="text-slate-400 font-normal">({formData.skills.length} selected)</span>
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-slate-50 rounded-lg border border-slate-200">
                {POPULAR_SKILLS.map((skill) => {
                  const selected = formData.skills.includes(skill);
                  return (
                    <button
                      type="button"
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition ${
                        selected
                          ? 'bg-brand-600 text-white shadow-xs'
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
              className="w-full rounded-lg bg-brand-600 py-2.5 font-bold text-white hover:bg-brand-700 transition shadow-xs mt-2 disabled:opacity-60"
            >
              {loading ? 'Creating Profile...' : 'Create Verified Profile'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
