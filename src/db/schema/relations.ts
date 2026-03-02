import { relations } from 'drizzle-orm';
import { professionals } from './professionals';
import { sales } from './sales';
import { services } from './services';
import { shops } from './shops';
import {
    analyticsEvents,
    subscriptionEvents,
    subscriptions,
} from './subscriptions';
import { users } from './users';

/**
 * Relaciones de Drizzle ORM.
 * Define cómo se relacionan las tablas para queries con JOINs.
 */

// ── Users ──
export const usersRelations = relations(users, ({ one }) => ({
  shop: one(shops, {
    fields: [users.id],
    references: [shops.userId],
  }),
}));

// ── Shops ──
export const shopsRelations = relations(shops, ({ one, many }) => ({
  user: one(users, {
    fields: [shops.userId],
    references: [users.id],
  }),
  subscription: one(subscriptions, {
    fields: [shops.id],
    references: [subscriptions.shopId],
  }),
  services: many(services),
  professionals: many(professionals),
  sales: many(sales),
  analyticsEvents: many(analyticsEvents),
}));

// ── Services ──
export const servicesRelations = relations(
  services,
  ({ one, many }) => ({
    shop: one(shops, {
      fields: [services.shopId],
      references: [shops.id],
    }),
    sales: many(sales),
  }),
);

// ── Professionals ──
export const professionalsRelations = relations(
  professionals,
  ({ one, many }) => ({
    shop: one(shops, {
      fields: [professionals.shopId],
      references: [shops.id],
    }),
    sales: many(sales),
  }),
);

// ── Sales ──
export const salesRelations = relations(sales, ({ one }) => ({
  shop: one(shops, {
    fields: [sales.shopId],
    references: [shops.id],
  }),
  service: one(services, {
    fields: [sales.serviceId],
    references: [services.id],
  }),
  professional: one(professionals, {
    fields: [sales.professionalId],
    references: [professionals.id],
  }),
}));

// ── Subscriptions ──
export const subscriptionsRelations = relations(
  subscriptions,
  ({ one, many }) => ({
    shop: one(shops, {
      fields: [subscriptions.shopId],
      references: [shops.id],
    }),
    events: many(subscriptionEvents),
  }),
);

// ── Subscription Events ──
export const subscriptionEventsRelations = relations(
  subscriptionEvents,
  ({ one }) => ({
    subscription: one(subscriptions, {
      fields: [subscriptionEvents.subscriptionId],
      references: [subscriptions.id],
    }),
  }),
);

// ── Analytics Events ──
export const analyticsEventsRelations = relations(
  analyticsEvents,
  ({ one }) => ({
    shop: one(shops, {
      fields: [analyticsEvents.shopId],
      references: [shops.id],
    }),
  }),
);
