import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Compass,
  Cpu,
  Users,
  Navigation,
  ShieldCheck,
  MessageSquare,
  Sparkles,
  Palette,
  X,
  ArrowRight
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function CommandPalette({ isOpen, onClose, onOpenHostEvent, onOpenPostTeam, onOpenCreateTravel }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const { theme, setTheme, themes } = useTheme();

  // Listen for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(false); // toggle
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const actions = [
    {
      id: 'events',
      title: 'Events & Hackathons Feed',
      subtitle: 'Browse live campus tech fests & prize pools',
      icon: Compass,
      perform: () => { navigate('/'); onClose(); }
    },
    {
      id: 'agent',
      title: 'Autonomous 3-Agent AI Command Center',
      subtitle: 'Track strategy, squad matching & outstation transit',
      icon: Cpu,
      perform: () => { navigate('/agent'); onClose(); }
    },
    {
      id: 'teams',
      title: 'Teammate Bounties & Matching',
      subtitle: 'Find complementary hackers by skills',
      icon: Users,
      perform: () => { navigate('/teams'); onClose(); }
    },
    {
      id: 'travel',
      title: 'Outstation Travel Pods',
      subtitle: 'Carpools, sleeper train splits & women-only pods',
      icon: Navigation,
      perform: () => { navigate('/travel'); onClose(); }
    },
    {
      id: 'verify',
      title: 'College ID Trust Verification',
      subtitle: 'Gemini Multimodal Vision student authentication',
      icon: ShieldCheck,
      perform: () => { navigate('/verify'); onClose(); }
    },
    {
      id: 'chat',
      title: 'Collaboration & Huddle Rooms',
      subtitle: 'Real-time channels & voice huddles',
      icon: MessageSquare,
      perform: () => { navigate('/chat'); onClose(); }
    },
    // Modals
    {
      id: 'host-event',
      title: 'Host New Event / Hackathon',
      subtitle: 'Publish an event to the campus feed',
      icon: Sparkles,
      perform: () => { onClose(); if (onOpenHostEvent) onOpenHostEvent(); }
    },
    {
      id: 'post-team',
      title: 'Post Teammate Bounty (LFT)',
      subtitle: 'Recruit hackers for your hackathon squad',
      icon: Users,
      perform: () => { onClose(); if (onOpenPostTeam) onOpenPostTeam(); }
    },
    {
      id: 'create-travel',
      title: 'Create Travel Pod',
      subtitle: 'Offer seats for outstation hackathon transit',
      icon: Navigation,
      perform: () => { onClose(); if (onOpenCreateTravel) onOpenCreateTravel(); }
    },
    // Theme switches
    {
      id: 'theme-classic',
      title: 'Switch Theme: Classic',
      subtitle: 'Executive Indigo & Slate (Default Phase 1 Look)',
      icon: Palette,
      perform: () => { setTheme('classic'); onClose(); }
    },
    {
      id: 'theme-aurum',
      title: 'Switch Theme: Aurum',
      subtitle: 'Midnight Black + Pure White + Vibrant Golden Yellow',
      icon: Palette,
      perform: () => { setTheme('aurum'); onClose(); }
    },
    {
      id: 'theme-volt',
      title: 'Switch Theme: Volt',
      subtitle: 'Midnight Black + Neon Lime + Warm Ivory',
      icon: Palette,
      perform: () => { setTheme('volt'); onClose(); }
    },
    {
      id: 'theme-lagoon',
      title: 'Switch Theme: Lagoon',
      subtitle: 'Deep Teal Green + Coral Orange + Mint White',
      icon: Palette,
      perform: () => { setTheme('lagoon'); onClose(); }
    },
  ];

  const filtered = actions.filter((act) =>
    act.title.toLowerCase().includes(query.toLowerCase()) ||
    act.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl rounded-3xl border border-border/20 bg-surface/95 text-fg shadow-elevated-hover overflow-hidden flex flex-col max-h-[75vh]">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/15 bg-surface-2/60">
          <Search className="h-5 w-5 text-muted shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command or search routes (e.g. 'agent', 'travel', 'volt')..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent text-sm font-medium text-fg focus:outline-none placeholder:text-muted"
          />
          <button
            onClick={onClose}
            className="text-muted hover:text-fg p-1 rounded-lg transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted">
              No matching actions found for "{query}"
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={item.perform}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all ${
                    isSelected
                      ? 'bg-brand/15 text-fg border border-brand/30 shadow-xs'
                      : 'text-fg hover:bg-surface-2/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-surface border border-border/15 text-brand shrink-0">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-tight">{item.title}</p>
                      <p className="text-[11px] text-muted">{item.subtitle}</p>
                    </div>
                  </div>
                  <ArrowRight className={`h-4 w-4 text-muted transition ${isSelected ? 'translate-x-1 text-brand' : ''}`} />
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 border-t border-border/15 bg-surface-2/40 flex items-center justify-between text-[11px] text-muted font-mono">
          <div className="flex items-center gap-2">
            <span>Navigate <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border/20 text-[10px]">↑</kbd> <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border/20 text-[10px]">↓</kbd></span>
            <span>Select <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border/20 text-[10px]">↵</kbd></span>
          </div>
          <span>Close <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border/20 text-[10px]">Esc</kbd></span>
        </div>
      </div>
    </div>
  );
}
