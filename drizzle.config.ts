import { defineConfig } from 'drizzle-kit';
import { loadEnvConfig } from 'next';
loadEnvConfig(process.cwd());

/**
 * Drizzle Kit config — conecta a Neon PostgreSQL.
 * Usa DATABASE_URL del .env.local (cargado via @next/env).
 */
export default defineConfig({
  out: './drizzle/migrations',
  schema: './src/db/schema/index.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  // Verbose output en migraciones para debugging
  verbose: true,
  // Strict mode — pide confirmación en cambios destructivos
  strict: true,
});
