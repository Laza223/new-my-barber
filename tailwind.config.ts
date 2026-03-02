import type { Config } from "tailwindcss";

/**
 * Tailwind CSS v4 config — solo estructura.
 * Los colores, fuentes y tokens de diseño van en globals.css
 * usando @theme (Tailwind v4 way).
 *
 * shadcn/ui necesita este archivo para saber dónde están los componentes.
 */
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      /* Los tokens van en globals.css con @theme */
    },
  },
  plugins: [],
};

export default config;
