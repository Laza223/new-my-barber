/**
 * Conexión a PostgreSQL en Neon con Drizzle ORM.
 *
 * Usa @neondatabase/serverless para conexiones HTTP
 * (ideal para serverless/edge — una conexión por request).
 *
 * Exporta:
 * - db: instancia de Drizzle para queries
 * - Database: tipo para inyección de dependencias
 *
 * Build-safe: no crashea si DATABASE_URL no está definida
 * (necesario para Next.js build que importa módulos sin ejecutarlos).
 */
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    // En build time, DATABASE_URL no existe.
    // Retornamos un proxy que crashea si se intenta usar.
    return new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
      get(_, prop) {
        if (prop === 'then' || prop === 'catch') return undefined;
        throw new Error(
          'DATABASE_URL no está definida. Configurala en .env.local\n' +
            'Ejemplo: DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/mybarber?sslmode=require',
        );
      },
    });
  }
  const sql = neon(url);
  return drizzle(sql, { schema });
}

export const db = createDb();

/** Tipo de la instancia de DB para inyección */
export type Database = typeof db;
