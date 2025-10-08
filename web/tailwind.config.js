/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "var(--font-inter)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Ubuntu",
          "Cantarell",
          "Noto Sans",
          "sans-serif",
        ],
        display: [
          "Inter",
          "var(--font-inter)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Ubuntu",
          "Cantarell",
          "Noto Sans",
          "sans-serif",
        ],
      },
      colors: {
        brand: {
          DEFAULT: "#00C853", // Swish vibrant green
          50: "#E8F8F0",
          100: "#C8F0D8",
          200: "#9FE4B8",
          300: "#6ED498",
          400: "#4ACA7C",
          500: "#00C853",
          600: "#00B248",
          700: "#009A3E",
          800: "#008234",
          900: "#005A25",
        },
        swish: {
          green: "#00C853",
          light: "#4CAF50",
          accent: "#8BC34A",
        },
      },
      boxShadow: {
        glass: "0 10px 30px rgba(0,0,0,0.08)",
        card: "0 8px 20px rgba(99, 102, 241, 0.08)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "bounce-gentle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(0, 200, 83, 0.2)" },
          "100%": { boxShadow: "0 0 20px rgba(0, 200, 83, 0.4)" },
        },
        "heart-beat": {
          "0%": { transform: "scale(1)" },
          "14%": { transform: "scale(1.3)" },
          "28%": { transform: "scale(1)" },
          "42%": { transform: "scale(1.3)" },
          "70%": { transform: "scale(1)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "fade-in": "fade-in .6s ease-out both",
        "fade-in-up": "fade-in-up 0.8s ease-out both",
        "slide-in": "slide-in 0.6s ease-out both",
        marquee: "marquee 20s linear infinite",
        shimmer: "shimmer 2s infinite",
        "pulse-slow": "pulse-slow 3s infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
        "scale-in": "scale-in 0.5s ease-out both",
        "bounce-gentle": "bounce-gentle 2s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        "heart-beat": "heart-beat 1.5s ease-in-out infinite",
      },
      backdropBlur: {
        xs: "2px",
      },
      borderRadius: {
        squircle: "24px",
      },
    },
  },
  plugins: [],
};