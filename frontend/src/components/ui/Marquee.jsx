import React from 'react';
import { Sparkles, Trophy, MapPin, Zap } from 'lucide-react';

export default function Marquee({ items = [] }) {
  if (!items || items.length === 0) return null;

  // Duplicate items for seamless continuous looping
  const displayItems = [...items, ...items];

  return (
    <div className="w-full overflow-hidden border-y border-border/15 bg-surface/50 py-2.5 backdrop-blur-md relative group select-none">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused] items-center gap-8">
        {displayItems.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2.5 text-xs font-semibold text-muted tracking-tight shrink-0"
          >
            <span className="flex h-1.5 w-1.5 rounded-full bg-brand" />
            <span className="font-extrabold text-fg">{item.title}</span>
            {item.prize_pool && (
              <span className="px-2 py-0.5 rounded-full bg-brand/15 text-brand font-mono font-bold text-[10px] border border-brand/30">
                {item.prize_pool}
              </span>
            )}
            {item.city && (
              <span className="text-[11px] text-muted flex items-center gap-0.5">
                <MapPin className="h-3 w-3" />
                {item.city}
              </span>
            )}
            <span className="text-border/30 mx-2">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}
