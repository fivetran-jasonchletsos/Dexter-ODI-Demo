import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Miami-noir / forensic lab palette.
        // Anchor: near-black ink, off-white bone, blood-slide red.
        // Accents: teal neon (lab equipment), amber scan (monitor phosphor).
        ink:    "#06080d",   // near-black, slight blue cast (Miami at 3am)
        deep:   "#0c1018",
        slate:  "#1a1f2b",
        ocean:  "#0e2030",   // bay-water depth
        bone:   "#e7e0c9",   // off-white evidence-bag
        lab:    "#d4d0c4",   // clinical off-white, slightly cooler than bone
        ash:    "#bdb4a0",
        muted:  "#7a7669",
        slide:  "#a31423",   // the blood-slide red
        signal: "#cf2030",   // brighter accent
        rust:   "#5b1410",
        neon:   "#00b8a9",   // sparse teal accent (lab instruments)
        scan:   "#b8a060",   // amber phosphor — used only for specimen counts
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "Times New Roman", "serif"],
        sans:    ["ui-sans-serif", "system-ui", "-apple-system", "Helvetica", "Arial", "sans-serif"],
        mono:    ["var(--font-jetbrains)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
        // "type" — Courier Prime (clinical forensic report) falling back to JetBrains
        type:    ["var(--font-courier)", "var(--font-jetbrains)", "Courier New", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
