module.exports = {
  content: ["./src/client/**/*.{html,ts,tsx}", "./src/**/*.ts"],
  theme: {
    extend: {
      colors: {
        ink: "#030814",
        midnight: "#07101f",
        panel: "#0b1729",
        line: "rgba(224, 190, 104, 0.22)",
        gold: "#d9ad4a",
        "gold-soft": "#f1d27b",
        neon: "#2be7ff",
        gain: "#24d37a",
        danger: "#ff495e"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Georgia", "Times New Roman", "serif"]
      },
      boxShadow: {
        premium: "0 24px 80px rgba(0, 0, 0, 0.42)",
        glow: "0 0 38px rgba(217, 173, 74, 0.16)"
      }
    }
  },
  plugins: []
};
