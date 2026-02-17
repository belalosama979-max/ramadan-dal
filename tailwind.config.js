/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
            DEFAULT: '#14532D', // Deep Green
            light: '#22C55E',  // Accent Green
            dark: '#0F3D2E',   // Very Dark Green
        },
        accent: {
            DEFAULT: '#D4AF37', // Gold (Limited use)
            light: '#FCD34D',
        },
        background: {
            DEFAULT: '#F0FDF4', // Soft Greenish White
            paper: '#FFFFFF',
        }
      },
      fontFamily: {
        arabic: ['"Tajawal"', 'sans-serif'], // Using Google Font Tajawal
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
