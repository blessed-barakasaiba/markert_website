/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  // for React with Vite
  ],
  theme: {
    extend: {
      animation: {
        shake: "shake 0.5s ease-in-out",
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-10px)" },
          "40%": { transform: "translateX(10px)" },
          "60%": { transform: "translateX(-10px)" },
          "80%": { transform: "translateX(10px)" },
        },
      },
    },
  },
  plugins: [],
}

