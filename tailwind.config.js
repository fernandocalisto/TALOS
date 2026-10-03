/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        talos: {
          void: '#030611',
          navy: {
            950: '#050918',
            900: '#090F26',
            850: '#0C1433',
            800: '#111C44',
            700: '#18275E',
          },
          bronze: {
            200: '#F5E4D3',
            300: '#E4BD94',
            400: '#CFA071',
            500: '#B8804D',
            600: '#976236',
            700: '#754622',
          },
          copper: {
            300: '#FFCCA3',
            400: '#F59E58',
            500: '#DE7322',
            600: '#B8550E',
            glow: '#E29555',
          },
          circuit: {
            300: '#D8B4FE',
            400: '#C084FC',
            500: '#A855F7',
            glow: '#9333EA',
          }
        }
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-copper': '0 0 25px -5px rgba(226, 149, 85, 0.4)',
        'glow-circuit': '0 0 30px -5px rgba(168, 85, 247, 0.35)',
        'card-glass': '0 25px 60px -15px rgba(0, 0, 0, 0.8), inset 0 1px 1px 0 rgba(255, 255, 255, 0.12)',
        'hud-badge': '0 4px 20px -2px rgba(0, 0, 0, 0.6), inset 0 0 0 1px rgba(226, 149, 85, 0.25)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'glow-breathe': 'glow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        glow: {
          '0%': { opacity: '0.4' },
          '100%': { opacity: '0.9' },
        }
      }
    },
  },
  plugins: [],
}
