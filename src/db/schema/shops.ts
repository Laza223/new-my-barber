import {
    boolean,
    integer,
    pgTable,
    timestamp,
    uuid,
    varchar,
} from 'drizzle-orm/pg-core';
import { users } from './users';

/**
 * Tabla shops — la barbería/negocio.
 * Cada user tiene exactamente 1 shop (1:1).
 *
 * "shop" se usa en código en vez de "barber" para evitar
 * confusión entre la persona y el negocio.
 */
export const shops = pgTable('shops', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 100 }).notNull(),
  fantasyName: varchar('fantasy_name', { length: 100 }),
  phone: varchar('phone', { length: 20 }),
  // Días laborales: array de 0-6 (domingo a sábado)
  workingDays: integer('working_days').array(),
  // Onboarding
  onboardingCompleted: boolean('onboarding_completed')
    .notNull()
    .default(false),
  onboardingStep: integer('onboarding_step').notNull().default(1),
  // Meta mensual en centavos (nullable = sin meta)
  monthlyGoalCents: integer('monthly_goal_cents'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
