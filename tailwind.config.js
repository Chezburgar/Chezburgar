/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#06060a",
          900: "#0a0a12",
          800: "#10101a",
          700: "#181824",
          600: "#22222f",
        },
        neon: {
          orange: "#ff6b1a",
          amber: "#ffb627",
          yellow: "#ffe14a",
          red: "#ff2d55",
          pink: "#ff1493",
          lime: "#c6ff3d",
          cyan: "#19f0ff",
        },
        cream: "#fff4e0",
      },
      fontFamily: {
        display: ["Anton", "Impact", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["Space Grotesk", "ui-monospace", "monospace"],
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin 24s linear infinite",
        marquee: "marquee 28s linear infinite",
        flicker: "flicker 3.4s linear infinite",
        glow: "glow 3s ease-in-out infinite",
        "bg-pan": "bgPan 12s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(-3deg)" },
          "50%": { transform: "translateY(-22px) rotate(3deg)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        flicker: {
          "0%, 18%, 22%, 25%, 53%, 57%, 100%": { opacity: "1" },
          "20%, 24%, 55%": { opacity: "0.55" },
        },
        glow: {
          "0%, 100%": { filter: "drop-shadow(0 0 18px rgba(255,107,26,0.55))" },
          "50%": { filter: "drop-shadow(0 0 38px rgba(255,45,85,0.75))" },
        },
        bgPan: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      backgroundImage: {
        "grid-lines":
          "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
        "neon-flame":
          "linear-gradient(135deg, #ff1493 0%, #ff2d55 35%, #ff6b1a 70%, #ffb627 100%)",
      },
    },
  },
  plugins: [],
};
