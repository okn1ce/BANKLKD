/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark': {
          'primary': '#1A1B1E',
          'secondary': '#25262B',
          'accent': '#2C2D32',
        },
        'accent': {
          'primary': '#FF4D4D',    // Rouge vif pour les actions importantes
          'secondary': '#4DFFB7',  // Vert néon pour les gains
          'tertiary': '#4D79FF',   // Bleu électrique pour les actions secondaires
        }
      },
      keyframes: {
        modal: {
          '0%': { 
            opacity: '0',
            transform: 'scale(0.95) translateY(10px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'scale(1) translateY(0)'
          },
        },
        rainbow: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '25%': { transform: 'translate(2px, 2px)' },
          '50%': { transform: 'translate(-2px, -2px)' },
          '75%': { transform: 'translate(-2px, 2px)' }
        },
        shine: {
          '0%': { 'background-position': '200% center' },
          '100%': { 'background-position': '-200% center' }
        },
        matrix: {
          '0%, 100%': { opacity: '1', color: '#4ade80' },
          '50%': { opacity: '0.7', color: '#22c55e' }
        }
      },
      animation: {
        modal: 'modal 0.2s ease-out',
        rainbow: 'rainbow 3s linear infinite',
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'glitch': 'glitch 1s linear infinite',
        'shine': 'shine 2s linear infinite',
        'matrix': 'matrix 2s linear infinite',
      }
    },
  },
  plugins: [],
} 