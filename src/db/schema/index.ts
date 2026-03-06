/**
 * Barrel export de todo el schema.
 *
 * Importar desde aquí:
 * import { users, shops, sales, ... } from '@/db/schema';
 */

// Enums
export * from './enums';

// Tablas
export * from './accounts';
export * from './payment-history';
export * from './professionals';
export * from './promotions';
export * from './sales';
export * from './services';
export * from './sessions';
export * from './shops';
export * from './subscriptions';
export * from './users';
export * from './verifications';

// Relaciones (necesarias para db.query)
export * from './relations';
