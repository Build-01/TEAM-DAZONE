import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#10B981',
        'primary-dark': '#059669',
        'primary-light': '#34D399',
        secondary: '#F59E0B',
        danger: '#EF4444',
        success: '#10B981',
        midnight: '#020617',
        'slate-950': '#0f172a',
        surface: 'rgba(30, 41, 59, 0.7)', // Semi-transparent slate-800
        background: '#020617',
        'text-primary': '#F8FAFC', // Slate-50
        'text-secondary': '#94A3B8', // Slate-400
        border: 'rgba(255, 255, 255, 0.1)',
      },
      boxShadow: {
        soft: '0 18px 50px rgba(0, 0, 0, 0.4)',
        'emerald-glow': '0 0 20px rgba(16, 185, 129, 0.4)',
        'gold-glow': '0 0 20px rgba(245, 158, 11, 0.4)',
        'glass': 'inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
};

export default config;
