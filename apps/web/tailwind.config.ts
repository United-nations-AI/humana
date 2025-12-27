import type { Config } from 'tailwindcss';

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a'
        },
        // Human Rights Themed Colors
        rights: {
          // Primary: Trust and Stability (Deep Blue)
          primary: '#1e3a8a',
          'primary-light': '#3b82f6',
          'primary-dark': '#1e40af',
          // Secondary: Justice and Hope (Gold/Amber)
          secondary: '#f59e0b',
          'secondary-light': '#fbbf24',
          'secondary-dark': '#d97706',
          // Accent: Growth and Protection (Emerald Green)
          accent: '#10b981',
          'accent-light': '#34d399',
          'accent-dark': '#059669',
          // Neutral backgrounds
          bg: '#0f172a',
          'bg-light': '#1e293b',
          'bg-lighter': '#334155'
        }
      },
      borderRadius: {
        xl: '1rem'
      }
    }
  },
  plugins: []
} satisfies Config;

