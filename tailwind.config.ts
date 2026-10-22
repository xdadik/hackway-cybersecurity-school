import type { Config } from "tailwindcss";

/**
 * Hackway design tokens.
 *
 * The visual language is a "hacked poster": near-black paper, acid lime
 * accents, heavy condensed display type, monospace labels and hard offset
 * shadows instead of soft blur.
 */
const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: "#0a0a0a",
          secondary: "#121212",
          tertiary: "#161616",
        },
        surface: {
          DEFAULT: "#121212",
          elevated: "#1e1e1e",
          sunken: "#050505",
        },
        acid: {
          DEFAULT: "#ccff00",
          hover: "#b3e600",
        },
        ink: {
          DEFAULT: "#f5f5f7",
          secondary: "#a1a1aa",
          muted: "#6f6f76",
        },
        line: {
          DEFAULT: "#26262a",
          soft: "#1b1b1e",
          strong: "#3f3f46",
        },
        success: "#4ade80",
        warning: "#fbbf24",
        danger: "#f87171",
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "sans-serif",
        ],
        display: [
          "var(--font-display)",
          "Impact",
          "Arial Black",
          "Helvetica Neue",
          "sans-serif",
        ],
        mono: [
          "var(--font-mono-code)",
          "Fira Code",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Consolas",
          "Liberation Mono",
          "monospace",
        ],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],
      },
      maxWidth: {
        container: "78rem", // ~1248px
      },
      spacing: {
        "4.5": "1.125rem",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      boxShadow: {
        card: "0 1px 2px rgba(0, 0, 0, 0.8)",
        "card-hover": "0 4px 20px rgba(0, 0, 0, 0.95)",
        pop: "0 16px 48px rgba(0, 0, 0, 0.6)",
        hard: "6px 6px 0 0 rgba(245, 245, 247, 1)",
        "hard-sm": "4px 4px 0 0 rgba(245, 245, 247, 0.18)",
        "hard-acid": "12px 12px 0 0 rgba(204, 255, 0, 0.16)",
        "hard-acid-sm": "6px 6px 0 0 rgba(204, 255, 0, 0.18)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        glitch: {
          "0%, 100%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 2px)" },
          "40%": { transform: "translate(-2px, -2px)" },
          "60%": { transform: "translate(2px, 2px)" },
          "80%": { transform: "translate(2px, -2px)" },
        },
        blink: {
          "0%, 45%": { opacity: "1" },
          "50%, 95%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in 150ms ease-out",
        "fade-up": "fade-up 200ms cubic-bezier(0.16, 1, 0.3, 1)",
        shimmer: "shimmer 1.6s infinite",
        glitch: "glitch 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite",
        blink: "blink 1.1s steps(1) infinite",
      },
      borderRadius: {
        DEFAULT: "2px",
        md: "4px",
        lg: "6px",
        xl: "8px",
      },
    },
  },
  plugins: [],
};

export default config;
