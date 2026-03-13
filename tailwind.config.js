/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#07090f',
        panel: '#0d131c',
        panel2: '#111a25',
        line: '#ff5a1f',
        line2: '#ff7f32',
        alert: '#ff4538',
        approve: '#7cff88',
        mute: '#9aa4ad',
        steel: '#3f4b5a',
      },
      fontFamily: {
        display: ['Orbitron', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Rajdhani', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        magi: '0 0 0 1px rgba(255,90,31,.35), 0 0 36px rgba(255,90,31,.14)',
        frame: 'inset 0 0 0 1px rgba(255,255,255,.04), 0 0 0 1px rgba(255,90,31,.18)',
      },
      backgroundImage: {
        grid: 'linear-gradient(rgba(255,90,31,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,90,31,.08) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
}
