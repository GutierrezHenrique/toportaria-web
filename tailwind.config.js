/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0B0C0F',
        panel: '#111318',
        panel2: '#1A1D24',
        border: '#242832',
        ink: '#E7E9EE',
        muted: '#8A8F9C',
        accent: '#D97757',
        accentHover: '#C6613E',
        ok: '#4ADE80',
        warn: '#FBBF24',
        danger: '#F87171',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Fraunces"', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 1px 0 rgba(255,255,255,0.04) inset, 0 10px 30px rgba(0,0,0,0.35)',
      },
    },
  },
  plugins: [],
};
