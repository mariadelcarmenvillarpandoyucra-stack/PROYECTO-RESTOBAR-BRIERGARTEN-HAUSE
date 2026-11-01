/** Paleta de marca — verde esmeralda profundo & ámbar (rediseño total, muy
 *  distinto de la versión dorada/marrón original). */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "bg-deep": "#0b1512",
        "bg-panel": "#101f1a",
        "bg-card": "#142822",
        "bg-card-hi": "#1a332b",
        line: "#2c4a41",
        gold: "#2f9e6e",
        "gold-soft": "#5cc99a",
        "gold-dim": "#1d6b49",
        wine: "#d99a3f",
        "wine-soft": "#f0b968",
        "wine-dim": "#8a5f22",
        cream: "#eaf2ee",
        "cream-dim": "#a6b9b0",
        muted: "#6f8a80",
        ok: "#3fb37f",
        warn: "#d99a3f",
        danger: "#c1443b",
        info: "#4a90c2",
      },
      fontFamily: {
        display: ["Cinzel", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "14px",
        sm: "8px",
      },
      boxShadow: {
        card: "0 4px 24px rgba(0,0,0,0.35)",
      },
    },
  },
  plugins: [],
};
