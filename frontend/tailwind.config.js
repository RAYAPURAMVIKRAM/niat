/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7ff',
          100: '#ebf0fe',
          200: '#dbe4fe',
          300: '#bfcefd',
          400: '#9cb0fa',
          500: '#7588f6',
          600: '#4f46e5', // Primary executive indigo
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        slate: {
          850: '#151f32',
          950: '#090d16',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        tech: ['Space Grotesk', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px 0 rgba(15, 23, 42, 0.03)',
        'elevated': '0 10px 30px -8px rgba(15, 23, 42, 0.08), 0 4px 12px -3px rgba(15, 23, 42, 0.04)',
        'elevated-hover': '0 20px 35px -10px rgba(15, 23, 42, 0.12), 0 10px 15px -5px rgba(15, 23, 42, 0.05)',
        'glow': '0 0 30px -5px rgba(79, 70, 229, 0.3)',
        'glow-lg': '0 0 50px -5px rgba(79, 70, 229, 0.4)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.35)',
        'glow-amber': '0 0 25px -5px rgba(245, 158, 11, 0.35)',
        'glow-rose': '0 0 25px -5px rgba(244, 63, 94, 0.35)',
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
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 12px rgba(79, 70, 229, 0.3))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 25px rgba(79, 70, 229, 0.7))' },
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
        'wave-bar-1': 'wave-bar 1.2s ease-in-out infinite 0.1s',
        'wave-bar-2': 'wave-bar 1.2s ease-in-out infinite 0.3s',
        'wave-bar-3': 'wave-bar 1.2s ease-in-out infinite 0.5s',
      }
    },
  },
  plugins: [],
};
