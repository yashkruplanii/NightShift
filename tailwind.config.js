/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        night: {
          bg: '#070A0F',
          card: '#0D1424',
          cardHover: '#131D33',
          border: '#1A2744',
          subtle: '#263859',
          textMuted: '#64748B',
          textMain: '#E2E8F0',
        },
        cyber: {
          cyan: '#00F0FF',
          emerald: '#10B981',
          amber: '#F59E0B',
          coral: '#EF4444',
          purple: '#8B5CF6'
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace', 'ui-monospace'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
