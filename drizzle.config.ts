import { defineConfig } from "drizzle-kit";

/**
 * Drizzle Kit config — conecta a Neon PostgreSQL.
 * Usa DATABASE_URL del .env (nunca hardcodeado).
 */
export default defineConfig({
  out: "./drizzle/migrations",
  schema: "./src/db/schema/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  // Verbose output en migraciones para debugging
  verbose: true,
  // Strict mode — pide confirmación en cambios destructivos
  strict: true,
});
