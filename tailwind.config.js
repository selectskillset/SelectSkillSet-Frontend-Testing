/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Professional Blue and Purple Colors
        primary: {
          DEFAULT: "#4338CA", // Primary Blue (Dark)
          light: "#6366F1", // Lighter Blue
          dark: "#3730A3", // Darker Blue
        },
        secondary: {
          DEFAULT: "#7C3AED", // Primary Purple
          light: "#A78BFA", // Lighter Purple
          dark: "#5B21B6", // Darker Purple
        },
        gradient: {
          blueToPurple: "linear-gradient(90deg, #4338CA, #7C3AED)",
          purpleToBlue: "linear-gradient(90deg, #7C3AED, #4338CA)",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        shake: "shake 0.82s cubic-bezier(.36,.07,.19,.97) both",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)" },
          "100%": { transform: "translateY(0)" },
        },
        shake: {
          "10%, 90%": { transform: "translate3d(-1px, 0, 0)" },
          "20%, 80%": { transform: "translate3d(2px, 0, 0)" },
          "30%, 50%, 70%": { transform: "translate3d(-4px, 0, 0)" },
          "40%, 60%": { transform: "translate3d(4px, 0, 0)" },
        },
      },
    },
  },
  plugins: [],
};
