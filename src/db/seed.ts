/**
 * Seed de desarrollo.
 *
 * Crea datos de prueba:
 * - 1 usuario verificado
 * - 1 shop con onboarding completo
 * - 1 suscripción trial
 * - 5 servicios
 * - 3 profesionales
 * - ~100 ventas en 30 días
 *
 * Ejecutar con: pnpm db:seed
 */

// TODO: Implementar seed después de configurar auth
// import { db } from './index';
// import * as schema from './schema';

async function seed() {
  console.log('🌱 Seeding database...');

  // TODO: Implementar en la fase de auth/core
  // 1. Crear usuario
  // 2. Crear shop
  // 3. Crear suscripción trial
  // 4. Crear servicios
  // 5. Crear profesionales
  // 6. Crear ventas variadas

  console.log('✅ Seed completado');
}

seed().catch((error) => {
  console.error('❌ Error en seed:', error);
  process.exit(1);
});
