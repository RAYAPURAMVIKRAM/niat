import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const THEMES = [
  {
    id: 'classic',
    name: 'Classic',
    tagline: 'Executive Indigo & Slate (Phase 1)',
    primary: '#4F46E5',
    bg: '#F8FAFC',
    fg: '#0F172A',
    fontDisplay: 'Plus Jakarta Sans',
  },
  {
    id: 'aurum',
    name: 'Aurum',
    tagline: 'Midnight Luxury Gold',
    primary: '#FFC21A',
    bg: '#0A0A0B',
    fg: '#FFFFFF',
    fontDisplay: 'Fraunces',
  },
  {
    id: 'volt',
    name: 'Volt',
    tagline: 'Cyber Neon Lime',
    primary: '#B6FF00',
    bg: '#07080A',
    fg: '#F6F0E1',
    fontDisplay: 'Space Grotesk',
  },
  {
    id: 'lagoon',
    name: 'Lagoon',
    tagline: 'Deep Teal & Coral',
    primary: '#FF6B4A',
    bg: '#F4FAF8',
    fg: '#0B2E2B',
    fontDisplay: 'Outfit',
  },
];

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    try {
      const saved = localStorage.getItem('hacksphere_theme');
      if (saved && ['classic', 'aurum', 'volt', 'lagoon'].includes(saved)) {
        return saved;
      }
    } catch (e) {
      // localStorage disabled or security block
    }
    return 'classic';
  });

  const setTheme = (newTheme) => {
    if (!['classic', 'aurum', 'volt', 'lagoon'].includes(newTheme)) return;
    setThemeState(newTheme);
    try {
      localStorage.setItem('hacksphere_theme', newTheme);
    } catch (e) {
      console.warn('Unable to persist theme to localStorage', e);
    }
    document.documentElement.dataset.theme = newTheme;
  };

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
