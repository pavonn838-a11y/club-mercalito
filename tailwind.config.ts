import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        merca: {
          orange: "#f26513",
          orangeDark: "#c94d08",
          cream: "#fff1d7",
          creamSoft: "#fffaf0",
          peach: "#ffd8b1",
          green: "#244d2f",
          greenSoft: "#d7ead0",
          greenDark: "#173820",
          ink: "#2b2118",
          muted: "#776858"
        }
      },
      boxShadow: {
        warm: "0 18px 45px rgba(101, 66, 27, 0.14)",
        label: "8px 8px 0 rgba(36, 77, 47, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
