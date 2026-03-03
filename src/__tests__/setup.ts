/**
 * Test setup file.
 */

// Mock environment variables
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.BETTER_AUTH_SECRET = 'test-secret';
process.env.CRON_SECRET = 'test-cron-secret';
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
