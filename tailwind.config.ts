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
          orange: "#f47a1f",
          orangeDark: "#c95812",
          cream: "#fff4df",
          creamSoft: "#fffaf0",
          green: "#6f9f39",
          greenDark: "#41651f",
          ink: "#2b2118",
          muted: "#776858"
        }
      },
      boxShadow: {
        warm: "0 18px 45px rgba(101, 66, 27, 0.14)"
      }
    }
  },
  plugins: []
};

export default config;
