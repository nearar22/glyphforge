/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        abyss: '#02000A',
        void: '#10002B',
        ultraviolet: '#240046',
        dim: '#1A0A2E',
        surface: '#1C0B33',
        violet: '#6D28D9',
        cyan: '#22D3EE',
        gold: '#FFD166',
        crimson: '#EF476F',
        ether: '#F8F7FF',
        emerald: '#06D6A0',
        ritual: '#F72585',
        mist: '#A78BC0',
        line: '#33205A',
        'line-bright': '#4A2E80',
      },
      fontFamily: {
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        body: ['Manrope', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        'portal-open': {
          '0%': { opacity: '0', transform: 'scale(0.6) rotate(-12deg)' },
          '100%': { opacity: '1', transform: 'scale(1) rotate(0deg)' },
        },
        'glyph-spin': { to: { transform: 'rotate(360deg)' } },
        'glyph-spin-rev': { to: { transform: 'rotate(-360deg)' } },
        'orbit': { to: { transform: 'rotate(360deg)' } },
        'draw': { from: { strokeDashoffset: '1' }, to: { strokeDashoffset: '0' } },
        'pulse-core': {
          '0%,100%': { opacity: '0.6', transform: 'scale(0.94)' },
          '50%': { opacity: '1', transform: 'scale(1.06)' },
        },
        'rift': {
          '0%,100%': { transform: 'scaleY(1) skewX(0deg)', opacity: '0.7' },
          '50%': { transform: 'scaleY(1.15) skewX(3deg)', opacity: '1' },
        },
        'float-rune': {
          '0%,100%': { transform: 'translateY(0) rotate(0deg)', opacity: '0.5' },
          '50%': { transform: 'translateY(-14px) rotate(8deg)', opacity: '0.9' },
        },
        'rise': { from: { opacity: '0', transform: 'translateY(18px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'shimmer': { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        'meter': { from: { width: '0%' } },
      },
      animation: {
        'portal-open': 'portal-open 0.9s cubic-bezier(0.2,0.7,0.2,1) both',
        'glyph-spin': 'glyph-spin 38s linear infinite',
        'glyph-spin-rev': 'glyph-spin-rev 52s linear infinite',
        'pulse-core': 'pulse-core 3.2s ease-in-out infinite',
        'rift': 'rift 4s ease-in-out infinite',
        'float-rune': 'float-rune 7s ease-in-out infinite',
        'rise': 'rise 0.6s cubic-bezier(0.2,0.7,0.2,1) both',
        'shimmer': 'shimmer 2.4s linear infinite',
      },
    },
  },
  plugins: [],
};
