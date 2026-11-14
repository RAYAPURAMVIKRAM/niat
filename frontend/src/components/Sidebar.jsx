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
    <aside className="hidden lg:flex w-64 flex-col border-r border-slate-200/80 bg-white/60 backdrop-blur-xl min-h-[calc(100vh-4.1rem)] p-4 shrink-0 transition-all">
      {/* Primary Navigation Links */}
      <div className="space-y-1">
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-tech">
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
                `group relative flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? item.highlight
                      ? 'bg-gradient-to-r from-brand-700 via-indigo-600 to-violet-600 text-white shadow-glow'
                      : 'bg-slate-900 text-white shadow-subtle'
                    : item.highlight
                    ? 'text-brand-700 bg-brand-50/80 hover:bg-brand-100 hover:text-brand-900 border border-brand-200/50'
                    : 'text-slate-600 hover:bg-slate-100/90 hover:text-slate-900 hover:translate-x-0.5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`h-4 w-4 transition-colors ${
                        isActive
                          ? 'text-white'
                          : item.highlight
                          ? 'text-brand-600 group-hover:scale-110 transition-transform'
                          : 'text-slate-400 group-hover:text-slate-800'
                      }`}
                    />
                    <span className="font-display font-medium">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider font-tech ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.highlight
                          ? 'bg-brand-200/80 text-brand-900'
                          : 'bg-slate-200 text-slate-700'
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
      <div className="mt-6 pt-5 border-t border-slate-100 space-y-2">
        <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-tech">
          Demo Quick Post
        </p>

        <button
          onClick={onOpenHostEvent}
          className="w-full flex items-center justify-between rounded-xl border border-dashed border-slate-300 px-3 py-2 text-left text-xs font-medium text-slate-700 hover:border-brand-400 hover:bg-brand-50/50 hover:text-brand-900 transition-all btn-shine group"
        >
          <span className="flex items-center gap-2">
            <PlusCircle className="h-3.5 w-3.5 text-brand-600 group-hover:scale-110 transition-transform" />
            <span className="font-semibold">Host / Post Event</span>
          </span>
          <span className="text-[10px] font-mono font-bold text-slate-400 group-hover:text-brand-600">POST</span>
        </button>

        <button
          onClick={onOpenPostTeam}
          className="w-full flex items-center justify-between rounded-xl border border-dashed border-slate-300 px-3 py-2 text-left text-xs font-medium text-slate-700 hover:border-emerald-400 hover:bg-emerald-50/50 hover:text-emerald-900 transition-all btn-shine group"
        >
          <span className="flex items-center gap-2">
            <PlusCircle className="h-3.5 w-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
            <span className="font-semibold">Post Team Bounty</span>
          </span>
          <span className="text-[10px] font-mono font-bold text-slate-400 group-hover:text-emerald-600">LFT</span>
        </button>

        <button
          onClick={onOpenCreateTravel}
          className="w-full flex items-center justify-between rounded-xl border border-dashed border-slate-300 px-3 py-2 text-left text-xs font-medium text-slate-700 hover:border-amber-400 hover:bg-amber-50/50 hover:text-amber-900 transition-all btn-shine group"
        >
          <span className="flex items-center gap-2">
            <PlusCircle className="h-3.5 w-3.5 text-amber-600 group-hover:scale-110 transition-transform" />
            <span className="font-semibold">Create Travel Pod</span>
          </span>
          <span className="text-[10px] font-mono font-bold text-slate-400 group-hover:text-amber-600">Transit</span>
        </button>
      </div>

      {/* Live Hackathon Trust Stats card */}
      <div className="mt-auto pt-4">
        <div className="rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white to-slate-50 p-3.5 text-xs shadow-2xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-900 font-display">
            <Award className="h-4 w-4 text-brand-600" />
            <span>Campus Trust Network</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
            Multi-tier verification powered by Google Gemini Vision & institutional checks.
          </p>
          <div className="mt-2.5 grid grid-cols-2 gap-2 pt-2.5 border-t border-slate-200/60 text-center">
            <div>
              <p className="font-black text-slate-900 text-sm font-tech">100%</p>
              <p className="text-[10px] font-medium text-slate-500">Verified IDs</p>
            </div>
            <div>
              <p className="font-black text-emerald-600 text-sm font-tech">₹1,200+</p>
              <p className="text-[10px] font-medium text-slate-500">Avg Saved</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
