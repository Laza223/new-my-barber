/**
 * Setup de tests con Vitest.
 * Se importa automáticamente antes de cada archivo de test.
 */

import '@testing-library/jest-dom/vitest';

// Configurar timezone para tests
process.env.TZ = 'America/Argentina/Buenos_Aires';
