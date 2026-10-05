import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      // TODO(setup): brand colors and fonts.
    },
  },
  plugins: [],
};

export default config;
