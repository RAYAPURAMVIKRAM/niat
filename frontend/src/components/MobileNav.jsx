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
  { to: '/agent', label: 'AI Agent', icon: Sparkles, highlight: true },
  { to: '/teams', label: 'Teams', icon: Users },
  { to: '/travel', label: 'Travel', icon: Navigation },
  { to: '/chat', label: 'Chat', icon: MessageSquare },
  { to: '/verify', label: 'Verify', icon: ShieldCheck },
];

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        {MOBILE_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-semibold transition ${
                  isActive
                    ? item.highlight
                      ? 'text-brand-600 font-bold scale-105'
                      : 'text-slate-900 font-bold'
                    : 'text-slate-500 hover:text-slate-700'
                }`
              }
            >
              <Icon className="h-4 w-4 mb-0.5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
