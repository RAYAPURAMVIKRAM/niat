import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Compass,
  Sparkles,
  Users,
  Navigation,
  ShieldCheck,
  MessageSquare,
  PlusCircle,
  Award,
  Zap
} from 'lucide-react';

const NAV_ITEMS = [
  {
    to: '/',
    label: 'Events & Hackathons',
    icon: Compass,
    badge: null,
  },
  {
    to: '/agent',
    label: 'Autonomous 3-Agent AI',
    icon: Sparkles,
    badge: 'Core AI',
    highlight: true,
  },
  {
    to: '/teams',
    label: 'Teammate Bounties',
    icon: Users,
    badge: null,
  },
  {
    to: '/travel',
    label: 'Travel Pods & Transit',
    icon: Navigation,
    badge: 'Safe Split',
  },
  {
    to: '/verify',
    label: 'Student ID Verification',
    icon: ShieldCheck,
    badge: null,
  },
  {
    to: '/chat',
    label: 'Collaboration & Huddle',
    icon: MessageSquare,
    badge: 'Live',
  },
];

export default function Sidebar({ onOpenHostEvent, onOpenPostTeam, onOpenCreateTravel }) {
  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-border/15 bg-surface/60 backdrop-blur-xl min-h-[calc(100vh-4.1rem)] p-4 shrink-0 transition-all">
      {/* Primary Navigation Links */}
      <div className="space-y-1">
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-muted font-mono">
          Platform Workspace
        </p>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `group relative flex items-center justify-between rounded-2xl px-3 py-2.5 text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? item.highlight
                      ? 'bg-brand text-brand-fg shadow-glow font-bold'
                      : 'bg-surface-2 text-fg border border-border/20 shadow-subtle font-bold'
                    : item.highlight
                    ? 'text-brand bg-brand/10 hover:bg-brand/15 border border-brand/25'
                    : 'text-muted hover:bg-surface-2/80 hover:text-fg hover:translate-x-0.5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`h-4 w-4 transition-colors ${
                        isActive
                          ? item.highlight ? 'text-brand-fg' : 'text-brand'
                          : item.highlight
                          ? 'text-brand group-hover:scale-110 transition-transform'
                          : 'text-muted group-hover:text-fg'
                      }`}
                    />
                    <span className="font-display">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider font-mono ${
                        isActive
                          ? item.highlight
                            ? 'bg-black/25 text-brand-fg'
                            : 'bg-brand/20 text-brand'
                          : item.highlight
                          ? 'bg-brand/20 text-brand'
                          : 'bg-surface-2 text-muted'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Quick Action Bounties */}
      <div className="mt-6 pt-5 border-t border-border/15 space-y-2">
        <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted font-mono">
          Demo Quick Post
        </p>

        <button
          onClick={onOpenHostEvent}
          className="w-full flex items-center justify-between rounded-2xl border border-dashed border-border/30 px-3 py-2 text-left text-xs font-medium text-fg hover:border-brand/60 hover:bg-brand/10 transition-all btn-shine group"
        >
          <span className="flex items-center gap-2">
            <PlusCircle className="h-3.5 w-3.5 text-brand group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-xs">Host / Post Event</span>
          </span>
          <span className="text-[10px] font-mono font-bold text-muted group-hover:text-brand">POST</span>
        </button>

        <button
          onClick={onOpenPostTeam}
          className="w-full flex items-center justify-between rounded-2xl border border-dashed border-border/30 px-3 py-2 text-left text-xs font-medium text-fg hover:border-emerald-500/60 hover:bg-emerald-500/10 transition-all btn-shine group"
        >
          <span className="flex items-center gap-2">
            <PlusCircle className="h-3.5 w-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-xs">Post Team Bounty</span>
          </span>
          <span className="text-[10px] font-mono font-bold text-muted group-hover:text-emerald-400">LFT</span>
        </button>

        <button
          onClick={onOpenCreateTravel}
          className="w-full flex items-center justify-between rounded-2xl border border-dashed border-border/30 px-3 py-2 text-left text-xs font-medium text-fg hover:border-amber-500/60 hover:bg-amber-500/10 transition-all btn-shine group"
        >
          <span className="flex items-center gap-2">
            <PlusCircle className="h-3.5 w-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-xs">Create Travel Pod</span>
          </span>
          <span className="text-[10px] font-mono font-bold text-muted group-hover:text-amber-400">Transit</span>
        </button>
      </div>

      {/* Live Hackathon Trust Stats card */}
      <div className="mt-auto pt-4">
        <div className="rounded-2xl border border-border/20 bg-surface-2/80 p-3.5 text-xs shadow-subtle backdrop-blur-md">
          <div className="flex items-center gap-1.5 font-bold text-fg font-display">
            <Award className="h-4 w-4 text-brand" />
            <span>Campus Trust Network</span>
          </div>
          <p className="mt-1 text-[11px] text-muted leading-relaxed">
            Multi-tier verification powered by Google Gemini Vision & institutional checks.
          </p>
          <div className="mt-2.5 grid grid-cols-2 gap-2 pt-2.5 border-t border-border/15 text-center">
            <div>
              <p className="font-black text-fg text-sm font-mono">100%</p>
              <p className="text-[10px] font-medium text-muted">Verified IDs</p>
            </div>
            <div>
              <p className="font-black text-emerald-400 text-sm font-mono">₹1,200+</p>
              <p className="text-[10px] font-medium text-muted">Avg Saved</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
