import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  LogIn,
  LogOut,
  ChevronDown,
  Search,
  Command
} from 'lucide-react';
import Avatar from './ui/Avatar';
import Badge from './ui/Badge';
import ThemeSwitcher from './ThemeSwitcher';

export default function Navbar({ onOpenAuth, onOpenHostEvent, onOpenCommandPalette }) {
  const { user, demoLogin, logout, backendOnline, loading } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleDemoLogin = async () => {
    await demoLogin();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/15 bg-surface/85 backdrop-blur-xl shadow-subtle transition-all">
      {/* Top subtle ambient glow hairline */}
      <div className="h-0.5 w-full bg-gradient-to-r from-brand via-accent to-brand opacity-90 shadow-glow" />

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 transition-transform hover:scale-[1.01] group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-brand text-brand-fg shadow-glow transition-all group-hover:scale-105">
              <Sparkles className="h-5 w-5 animate-pulse" />
              <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-fg font-display">
                  HackSphere<span className="text-brand">.ai</span>
                </span>
                <span className="hidden sm:inline-flex items-center rounded-full bg-brand/15 px-2 py-0.5 text-[10px] font-bold text-brand border border-brand/30 tracking-wide uppercase font-mono">
                  Agentic AI
                </span>
              </div>
            </div>
          </Link>

          {/* Backend Online Status Pill */}
          <div className="hidden lg:flex items-center gap-2 ml-4 rounded-full bg-surface-2/80 px-3 py-1 text-xs font-semibold text-muted border border-border/15 shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                  backendOnline ? 'bg-emerald-400 opacity-75' : 'bg-amber-400 opacity-75'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  backendOnline ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
            </span>
            <span className="font-mono text-[11px]">{backendOnline ? 'API Operational' : 'Waking Engine...'}</span>
          </div>
        </div>

        {/* Center: Command Palette Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/20 bg-surface-2/60 text-muted hover:text-fg hover:border-brand/40 transition text-xs font-medium shadow-2xs"
          title="Search or jump to route (Cmd + K)"
        >
          <Search className="h-3.5 w-3.5 text-muted" />
          <span className="text-xs">Quick Jump...</span>
          <kbd className="ml-2 font-mono text-[10px] bg-surface px-1.5 py-0.5 rounded border border-border/20 text-muted">
            ⌘K
          </kbd>
        </button>

        {/* Right Section Actions */}
        <div className="flex items-center gap-2.5">
          {/* Theme Switcher Pill in Navbar */}
          <div className="hidden sm:flex">
            <ThemeSwitcher />
          </div>

          {/* Quick Demo Login CTA (if not logged in) */}
          {!user ? (
            <>
              <button
                onClick={handleDemoLogin}
                disabled={loading}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-emerald-500/20 px-3.5 py-1.5 text-xs font-bold text-emerald-400 border border-emerald-500/30 hover:border-emerald-400 hover:shadow-subtle transition btn-shine"
                title="1-Click demo authentication as Vikram (Lead Architect @ NIAT)"
              >
                <Zap className="h-3.5 w-3.5 text-emerald-400 fill-emerald-400" />
                <span>⚡ Instant Demo Login</span>
              </button>

              <button
                onClick={() => onOpenAuth('login')}
                className="inline-flex items-center gap-1.5 rounded-xl bg-brand text-brand-fg px-4 py-2 text-xs font-bold hover:opacity-95 transition shadow-subtle btn-shine"
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
                <div className="hidden xl:inline-flex">
                  <Badge variant="verified">
                    Verified Student ({user.college_email?.endsWith('.in') ? '.edu.in' : 'Campus'})
                  </Badge>
                </div>
              )}

              {/* User Dropdown Trigger */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-full border border-border/20 bg-surface/90 pl-1 pr-3 py-1 text-xs font-semibold text-fg hover:border-brand/40 hover:bg-surface-2 transition shadow-2xs"
                >
                  <Avatar name={user.full_name} isVerified={user.is_verified} size="sm" />
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="font-bold text-fg max-w-[130px] truncate leading-tight font-display">
                      {user.full_name}
                    </span>
                    <span className="text-[10px] text-muted truncate max-w-[130px]">
                      {user.college_name || 'Hacker'}
                    </span>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-muted ml-0.5" />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-border/20 bg-surface p-2 shadow-elevated z-50 animate-fade-in-up">
                    <div className="px-3 py-2.5 border-b border-border/15 mb-1">
                      <p className="text-xs font-extrabold text-fg font-display">{user.full_name}</p>
                      <p className="text-[11px] text-muted truncate">{user.college_email}</p>
                      <div className="mt-2 flex items-center gap-1.5">
                        <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-[11px] font-semibold text-emerald-400">
                          {user.is_verified ? 'Verified Campus Identity' : 'Pending Verification'}
                        </span>
                      </div>
                    </div>

                    <Link
                      to="/verify"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-fg hover:bg-surface-2 transition"
                    >
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                      <span>ID Verification Center</span>
                    </Link>

                    <Link
                      to="/agent"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-fg hover:bg-surface-2 transition"
                    >
                      <Sparkles className="h-4 w-4 text-brand" />
                      <span>Launch AI Orchestrator</span>
                    </Link>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition"
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
