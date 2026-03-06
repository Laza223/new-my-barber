import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// Load .env.local (Next.js convention)
dotenv.config({ path: '.env.local' });

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
