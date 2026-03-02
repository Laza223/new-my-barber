// @ts-check

import eslint from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // Base recomendada de ESLint
  eslint.configs.recommended,

  // TypeScript strict
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,

  // Reglas del proyecto
  {
    plugins: {
      "react-hooks": reactHooksPlugin,
      "@next/next": nextPlugin,
    },
    rules: {
      // React Hooks
      ...reactHooksPlugin.configs.recommended.rules,

      // Next.js
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,

      // TypeScript — ser estricto con any
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      // Permitir {} como tipo en Server Components de Next.js
      "@typescript-eslint/no-empty-object-type": "off",

      // Complejidad máxima por función
      complexity: ["warn", 10],
    },
  },

  // Ignorar archivos generados
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "drizzle/**",
      "public/**",
      "*.config.*",
    ],
  },
);
