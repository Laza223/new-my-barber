/**
 * Conexión a PostgreSQL en Neon con Drizzle ORM.
 *
 * Usa @neondatabase/serverless para conexiones HTTP
 * (ideal para serverless/edge — una conexión por request).
 *
 * Exporta:
 * - db: instancia de Drizzle para queries
 * - Database: tipo para inyección de dependencias
 */
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL no está definida. Configurala en .env.local\n' +
      'Ejemplo: DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/mybarber?sslmode=require',
  );
}

const sql = neon(process.env.DATABASE_URL);

export const db = drizzle(sql, { schema });

/** Tipo de la instancia de DB para inyección */
export type Database = typeof db;
