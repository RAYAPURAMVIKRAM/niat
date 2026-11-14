import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  LogIn,
  LogOut,
  User,
  Activity,
  Menu,
  X,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

export default function Navbar({ onOpenAuth, onOpenHostEvent }) {
  const { user, demoLogin, logout, backendOnline, loading } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleDemoLogin = async () => {
    await demoLogin();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 transition-transform hover:scale-[1.01]">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-indigo-500 text-white shadow-sm shadow-brand-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-slate-900 font-sans">
                  HackSphere<span className="text-brand-600">.ai</span>
                </span>
                <span className="hidden sm:inline-flex items-center rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-700 border border-brand-200">
                  Agentic AI Platform
                </span>
              </div>
            </div>
          </Link>

          {/* Backend Online Status Pill */}
          <div className="hidden md:flex items-center gap-1.5 ml-4 rounded-full bg-slate-100/80 px-2.5 py-1 text-xs font-medium text-slate-600 border border-slate-200/60">
            <span className={`h-2 w-2 rounded-full ${backendOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span>{backendOnline ? 'API Port 5000 Live' : 'Connecting API...'}</span>
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
                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 border border-emerald-200/80 hover:bg-emerald-100 transition shadow-xs"
                title="1-Click demo authentication as Vikram (Lead Architect @ NIAT)"
              >
                <Zap className="h-3.5 w-3.5 text-emerald-600 fill-emerald-500" />
                <span>⚡ Instant Demo Login (Vikram @ NIAT)</span>
              </button>

              <button
                onClick={() => onOpenAuth('login')}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition shadow-xs"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Sign In</span>
              </button>
            </>
          ) : (
            /* Logged in state */
            <div className="flex items-center gap-2 relative">
              {/* Verified College Badge */}
              {user.is_verified && (
                <div className="hidden lg:inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Verified Student ({user.college_email?.endsWith('.in') ? '.edu.in' : 'Campus'})</span>
                </div>
              )}

              {/* User Dropdown Trigger */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1 pr-2.5 text-xs font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-brand-700 text-[11px] font-bold text-white uppercase shadow-xs">
                    {user.full_name?.charAt(0) || 'U'}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="font-semibold text-slate-900 max-w-[120px] truncate leading-tight">
                      {user.full_name}
                    </span>
                    <span className="text-[10px] text-slate-500 truncate max-w-[120px]">
                      {user.college_name || 'Hacker'}
                    </span>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-elevated z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <p className="text-xs font-bold text-slate-900">{user.full_name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.college_email}</p>
                      <div className="mt-1.5 flex items-center gap-1">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-medium text-emerald-600">
                          {user.is_verified ? 'Verified Campus Identity' : 'Pending Verification'}
                        </span>
                      </div>
                    </div>

                    <Link
                      to="/verify"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
                    >
                      <ShieldCheck className="h-3.5 w-3.5 text-brand-600" />
                      <span>ID Verification Center</span>
                    </Link>

                    <Link
                      to="/agent"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                      <span>Launch AI Orchestrator</span>
                    </Link>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 transition"
                    >
                      <LogOut className="h-3.5 w-3.5" />
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
