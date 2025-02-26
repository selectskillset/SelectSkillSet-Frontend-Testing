/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#F0F7FF',
          100: '#E0F2FE',
          500: '#0077B5',
          600: '#006699',
          700: '#00557D',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)' },
          '100%': { transform: 'translateY(0)' }
        }
      }
    }
  },
  plugins: [],
};
