import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

/**
 * Drizzle ORM connection — conecta a Neon PostgreSQL.
 *
 * Usa neon-http (Neon's HTTP driver) que funciona en:
 * - Vercel Edge Functions
 * - Vercel Serverless Functions
 * - Node.js
 *
 * No usar en pooling mode (pg) para serverless.
 */

if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL is not defined. Check your .env.local file.',
  );
}

const sql = neon(process.env.DATABASE_URL);

export const db = drizzle(sql, { schema });

// Re-export schema para uso directo
export { schema };
