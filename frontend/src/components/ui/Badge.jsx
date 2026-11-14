import React from 'react';
import { ShieldCheck, Trophy, Sparkles, Shield, Radio, Check } from 'lucide-react';

export default function Badge({ variant = 'default', children, className = '' }) {
  switch (variant) {
    case 'verified':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200/90 shadow-2xs ${className}`}>
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
          <span>{children}</span>
        </span>
      );

    case 'prize':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-800 border border-amber-200/90 tabular-nums shadow-2xs ${className}`}>
          <Trophy className="h-3.5 w-3.5 text-amber-600 shrink-0" />
          <span>{children}</span>
        </span>
      );

    case 'women-only':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-bold text-rose-700 border border-rose-200/80 shadow-2xs ${className}`}>
          <Shield className="h-3 w-3 text-rose-600 shrink-0" />
          <span>{children}</span>
        </span>
      );

    case 'live':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 border border-emerald-200 ${className}`}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>{children}</span>
        </span>
      );

    case 'agent':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-bold text-brand-700 border border-brand-200 ${className}`}>
          <Sparkles className="h-3 w-3 text-brand-600 shrink-0" />
          <span>{children}</span>
        </span>
      );

    case 'skill':
      return (
        <span className={`inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 border border-slate-200/70 hover:bg-slate-200/70 transition ${className}`}>
          {children}
        </span>
      );

    case 'event-type':
      return (
        <span className={`inline-flex items-center rounded-md bg-white/90 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-bold text-brand-700 border border-brand-200 shadow-xs ${className}`}>
          {children}
        </span>
      );

    default:
      return (
        <span className={`inline-flex items-center rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 border border-slate-200 ${className}`}>
          {children}
        </span>
      );
  }
}
