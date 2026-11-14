import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  LogIn,
  LogOut,
  ChevronDown
} from 'lucide-react';
import Avatar from './ui/Avatar';
import Badge from './ui/Badge';

export default function Navbar({ onOpenAuth, onOpenHostEvent }) {
  const { user, demoLogin, logout, backendOnline, loading } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleDemoLogin = async () => {
    await demoLogin();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-xl shadow-subtle transition-all">
      {/* Top subtle ambient glow hairline */}
      <div className="h-0.5 w-full bg-gradient-to-r from-brand-600 via-violet-500 to-fuchsia-500 opacity-90" />

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 transition-transform hover:scale-[1.01] group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-700 via-indigo-600 to-violet-500 text-white shadow-glow transition-all group-hover:shadow-glow-lg">
              <Sparkles className="h-5 w-5 animate-pulse" />
              <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 font-display">
                  HackSphere<span className="text-brand-600">.ai</span>
                </span>
                <span className="hidden sm:inline-flex items-center rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-700 border border-brand-200 tracking-wide uppercase font-tech">
                  Agentic AI
                </span>
              </div>
            </div>
          </Link>

          {/* Backend Online Status Pill */}
          <div className="hidden md:flex items-center gap-2 ml-4 rounded-full bg-slate-100/90 px-3 py-1 text-xs font-semibold text-slate-600 border border-slate-200/80">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${backendOnline ? 'bg-emerald-400 opacity-75' : 'bg-amber-400 opacity-75'}`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${backendOnline ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            </span>
            <span className="font-tech text-[11px]">{backendOnline ? 'API Port 5000 Live' : 'Connecting Engine...'}</span>
          </div>
        </div>

        {/* Right Section Actions */}
        <div className="flex items-center gap-2.5">
          {/* Quick Demo Login CTA (if not logged in) */}
          {!user ? (
            <>
              <button
                onClick={handleDemoLogin}
                disabled={loading}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100 px-3.5 py-1.5 text-xs font-bold text-emerald-900 border border-emerald-300 hover:border-emerald-400 hover:shadow-subtle transition btn-shine"
                title="1-Click demo authentication as Vikram (Lead Architect @ NIAT)"
              >
                <Zap className="h-3.5 w-3.5 text-emerald-600 fill-emerald-500" />
                <span>⚡ Instant Demo Login (Vikram @ NIAT)</span>
              </button>

              <button
                onClick={() => onOpenAuth('login')}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition shadow-subtle btn-shine"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Sign In</span>
              </button>
            </>
          ) : (
            /* Logged in state */
            <div className="flex items-center gap-2.5 relative">
              {/* Verified College Badge */}
              {user.is_verified && (
                <div className="hidden lg:inline-flex">
                  <Badge variant="verified">
                    Verified Student ({user.college_email?.endsWith('.in') ? '.edu.in' : 'Campus'})
                  </Badge>
                </div>
              )}

              {/* User Dropdown Trigger */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-full border border-slate-200/90 bg-white/90 pl-1 pr-3 py-1 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition shadow-2xs"
                >
                  <Avatar name={user.full_name} isVerified={user.is_verified} size="sm" />
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="font-bold text-slate-900 max-w-[130px] truncate leading-tight font-display">
                      {user.full_name}
                    </span>
                    <span className="text-[10px] text-slate-500 truncate max-w-[130px]">
                      {user.college_name || 'Hacker'}
                    </span>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 ml-0.5" />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-slate-200 bg-white p-2 shadow-elevated z-50 animate-fade-in-up">
                    <div className="px-3 py-2.5 border-b border-slate-100 mb-1">
                      <p className="text-xs font-extrabold text-slate-900 font-display">{user.full_name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.college_email}</p>
                      <div className="mt-2 flex items-center gap-1.5">
                        <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-[11px] font-semibold text-emerald-700">
                          {user.is_verified ? 'Verified Campus Identity' : 'Pending Verification'}
                        </span>
                      </div>
                    </div>

                    <Link
                      to="/verify"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition"
                    >
                      <ShieldCheck className="h-4 w-4 text-brand-600" />
                      <span>ID Verification Center</span>
                    </Link>

                    <Link
                      to="/agent"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-800 transition"
                    >
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      <span>Launch AI Orchestrator</span>
                    </Link>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
