import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sparkles } from 'lucide-react';

export default function ThemeSwitcher({ className = '', compact = false }) {
  const { theme, setTheme, themes } = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label="Theme switcher"
      className={`inline-flex items-center gap-1 p-1 rounded-full border border-border/20 bg-surface/80 backdrop-blur-md shadow-subtle ${className}`}
    >
      {themes.map((t) => {
        const isActive = theme === t.id;
        return (
          <button
            key={t.id}
            role="radio"
            aria-checked={isActive}
            aria-label={`${t.name} theme: ${t.tagline}`}
            onClick={() => setTheme(t.id)}
            title={`${t.name} (${t.tagline})`}
            className={`relative flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
              isActive
                ? 'bg-surface-2 text-fg shadow-sm border border-brand/40 ring-1 ring-brand/30'
                : 'text-muted hover:text-fg hover:bg-surface/50'
            }`}
          >
            {/* Color Swatch Dot */}
            <span
              className="w-3 h-3 rounded-full shrink-0 border border-black/20 shadow-xs flex items-center justify-center transition-transform"
              style={{
                backgroundColor: t.primary,
                boxShadow: isActive ? `0 0 10px ${t.primary}` : 'none',
                transform: isActive ? 'scale(1.15)' : 'scale(1)',
              }}
            />
            
            {!compact && (
              <span className={`text-[11px] font-medium tracking-tight ${isActive ? 'font-bold text-fg' : 'text-muted'}`}>
                {t.name}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
