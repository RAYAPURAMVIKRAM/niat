/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--bg) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'surface-2': 'rgb(var(--surface-2) / <alpha-value>)',
        'surface-ivory': 'rgb(var(--surface-ivory) / <alpha-value>)',
        'surface-ivory-fg': 'rgb(var(--surface-ivory-fg) / <alpha-value>)',
        fg: 'rgb(var(--fg) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        brand: {
          DEFAULT: 'rgb(var(--brand) / <alpha-value>)',
          fg: 'rgb(var(--brand-fg) / <alpha-value>)',
          50: '#f5f7ff',
          100: '#ebf0fe',
          200: '#dbe4fe',
          300: '#bfcefd',
          400: '#9cb0fa',
          500: '#7588f6',
          600: 'rgb(var(--brand) / <alpha-value>)',
          700: 'rgb(var(--brand) / <alpha-value>)',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        'brand-fg': 'rgb(var(--brand-fg) / <alpha-value>)',
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          fg: 'rgb(var(--accent-fg) / <alpha-value>)',
        },
        'accent-fg': 'rgb(var(--accent-fg) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        success: 'rgb(var(--success) / <alpha-value>)',
        warning: 'rgb(var(--warning) / <alpha-value>)',
        danger: 'rgb(var(--danger) / <alpha-value>)',
        ring: 'rgb(var(--ring) / <alpha-value>)',
        slate: {
          850: '#151f32',
          950: '#090d16',
        }
      },
      fontFamily: {
        display: ['var(--font-display)', 'Plus Jakarta Sans', 'Inter', 'sans-serif'],
        sans: ['var(--font-body)', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'Space Mono', 'monospace'],
        tech: ['Space Grotesk', 'monospace'],
      },
      fontSize: {
        'hero': ['clamp(2.4rem, 5vw + 1rem, 4.5rem)', { lineHeight: '1.08', letterSpacing: '-0.035em' }],
        'h1': ['clamp(1.9rem, 3.5vw + 0.5rem, 3rem)', { lineHeight: '1.14', letterSpacing: '-0.03em' }],
        'h2': ['clamp(1.4rem, 2.5vw + 0.25rem, 2.1rem)', { lineHeight: '1.2', letterSpacing: '-0.025em' }],
        'h3': ['clamp(1.15rem, 1.8vw + 0.2rem, 1.5rem)', { lineHeight: '1.25', letterSpacing: '-0.02em' }],
        'body': ['0.9375rem', { lineHeight: '1.5' }],
        'caption': ['0.8125rem', { lineHeight: '1.4' }],
        'micro': ['0.6875rem', { lineHeight: '1.3', letterSpacing: '0.04em' }],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'elevated': '0 10px 30px -8px rgba(0, 0, 0, 0.25), 0 4px 12px -3px rgba(0, 0, 0, 0.15)',
        'elevated-hover': '0 20px 35px -10px rgba(0, 0, 0, 0.35), 0 10px 15px -5px rgba(0, 0, 0, 0.2)',
        'glow': 'var(--shadow-glow, 0 0 35px rgba(255, 194, 26, 0.25))',
        'glow-lg': '0 0 50px -5px rgba(255, 194, 26, 0.4)',
        'glow-theme': 'var(--shadow-glow, 0 0 32px rgba(255, 194, 26, 0.3))',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.35)',
        'glow-amber': '0 0 25px -5px rgba(245, 158, 11, 0.35)',
        'glow-rose': '0 0 25px -5px rgba(244, 63, 94, 0.35)',
      },
      borderRadius: {
        'card': 'var(--radius-card, 1.5rem)',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'gradient-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'radar-ping': {
          '0%': { transform: 'scale(0.8)', opacity: '0.9' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(0%)', opacity: '0.85' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateY(280px)', opacity: '0.85' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 12px rgba(255, 194, 26, 0.3))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 25px rgba(255, 194, 26, 0.7))' },
        },
        'ring-draw': {
          '0%': { strokeDashoffset: '283' },
          '100%': { strokeDashoffset: 'var(--target-offset, 28)' },
        },
        'shine-sweep': {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(220%)' },
        },
        'wave-bar': {
          '0%, 100%': { height: '6px' },
          '50%': { height: '22px' },
        },
        'marquee': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.45s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fade-in 0.3s ease-out both',
        'shimmer': 'shimmer 2s infinite linear',
        'gradient-spin': 'gradient-spin 4s linear infinite',
        'radar-ping': 'radar-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'scan-line': 'scan-line 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-glow': 'pulse-glow 2.5s ease-in-out infinite',
        'ring-draw': 'ring-draw 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'shine-sweep': 'shine-sweep 1.8s ease-in-out infinite',
        'marquee': 'marquee 28s linear infinite',
        'pulse-slow': 'pulse-slow 4s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
