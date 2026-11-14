import React from 'react';
import { Sparkles, Github, ShieldCheck, Heart, Cpu } from 'lucide-react';
import ThemeSwitcher from './ThemeSwitcher';
import { useAuth } from '../context/AuthContext';

export default function Footer() {
  const { backendOnline } = useAuth();

  return (
    <footer className="mt-16 border-t border-border/15 bg-surface/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Tagline */}
          <div className="space-y-1.5 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <div className="h-7 w-7 rounded-xl bg-brand text-brand-fg flex items-center justify-center font-extrabold text-xs shadow-glow">
                HS
              </div>
              <span className="font-display font-extrabold text-base tracking-tight text-fg">
                HackSphere AI
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand/15 text-brand border border-brand/30">
                v2.0
              </span>
            </div>
            <p className="text-xs text-muted max-w-md">
              Autonomous Agentic AI Social Ecosystem for Tech Events, Teammate Matching & Safe Outstation Student Mobility.
            </p>
          </div>

          {/* Theme Switcher & Backend Health */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <ThemeSwitcher />

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/20 bg-surface/80 text-[11px] font-semibold text-muted shadow-subtle">
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    backendOnline ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    backendOnline ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
              </span>
              <span>{backendOnline ? 'API Operational' : 'Render Engine Waking'}</span>
            </div>
          </div>
        </div>

        {/* Sub-footer */}
        <div className="mt-8 pt-6 border-t border-border/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <p>© 2026 HackSphere AI • Built with passion for NIAT HackSprint 2026</p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/RAYAPURAMVIKRAM/niat"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-fg transition"
            >
              <Github className="h-3.5 w-3.5" />
              <span>GitHub Repository</span>
            </a>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Verified Campus Safe</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
