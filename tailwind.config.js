/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00ff88',
        'primary-dark': '#00cc6a',
        neon: {
          green: '#00ff88',
          pink: '#ff2d78',
          blue: '#00d4ff',
        },
        dark: {
          bg: '#080808',
          card: '#111111',
          card2: '#161616',
          border: 'rgba(255,255,255,0.07)',
        }
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif'],
      },
      boxShadow: {
        'neon-green': '0 0 20px rgba(0,255,136,0.3), 0 0 60px rgba(0,255,136,0.1)',
        'neon-pink': '0 0 20px rgba(255,45,120,0.4), 0 0 60px rgba(255,45,120,0.15)',
        'neon-blue': '0 0 20px rgba(0,212,255,0.3)',
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0,255,136,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0,255,136,0.6)' },
        },
      },
    },
  },
  plugins: [],
}