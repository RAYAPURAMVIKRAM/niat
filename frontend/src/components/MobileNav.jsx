import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Compass,
  Sparkles,
  Users,
  Navigation,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';

const MOBILE_NAV_ITEMS = [
  { to: '/', label: 'Events', icon: Compass },
  { to: '/teams', label: 'Teams', icon: Users },
  { to: '/agent', label: 'AI Agent', icon: Sparkles, highlight: true },
  { to: '/travel', label: 'Travel', icon: Navigation },
  { to: '/chat', label: 'Chat', icon: MessageSquare },
  { to: '/verify', label: 'Verify', icon: ShieldCheck },
];

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-slate-200/90 bg-white/90 backdrop-blur-xl px-2 py-1.5 shadow-elevated pb-[max(0.375rem,env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {MOBILE_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center min-w-[48px] min-h-[44px] py-1 px-2 rounded-xl text-[10px] font-semibold transition-all duration-200 ${
                  item.highlight
                    ? isActive
                      ? 'text-brand-600 font-extrabold -translate-y-1'
                      : 'text-brand-700 font-bold'
                    : isActive
                    ? 'text-slate-900 font-extrabold -translate-y-0.5'
                    : 'text-slate-500 hover:text-slate-800'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.highlight ? (
                    <div className={`flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-700 to-indigo-500 text-white shadow-glow mb-0.5 transition-transform ${isActive ? 'scale-110 ring-2 ring-brand-400' : ''}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                  ) : (
                    <Icon className={`h-4 w-4 mb-0.5 transition-colors ${isActive ? 'text-slate-900' : 'text-slate-400'}`} />
                  )}
                  <span className="font-display leading-tight">{item.label}</span>
                  {isActive && !item.highlight && (
                    <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-slate-900" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
