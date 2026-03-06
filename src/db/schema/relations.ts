/**
 * Relaciones de Drizzle ORM.
 *
 * Define cómo se conectan las tablas para que las queries con
 * `db.query.xxx.findMany({ with: { ... } })` funcionen.
 *
 * Nota: las relaciones de Drizzle son SOLO para la query API.
 * Los FK constraints reales están definidos en cada tabla.
 */
import { relations } from 'drizzle-orm';
import { accounts } from './accounts';
import { paymentHistory } from './payment-history';
import { professionals } from './professionals';
import { promotions } from './promotions';
import { sales } from './sales';
import { services } from './services';
import { sessions } from './sessions';
import { shops } from './shops';
import { subscriptions } from './subscriptions';
import { users } from './users';

// ── User relations ──────────────────────────────────
export const usersRelations = relations(users, ({ one, many }) => ({
  /** Un owner tiene una barbería */
  shop: one(shops, {
    fields: [users.id],
    references: [shops.ownerId],
  }),
  /** Un user puede estar vinculado a un profesional */
  professional: one(professionals, {
    fields: [users.id],
    references: [professionals.userId],
  }),
  /** Sesiones activas del usuario */
  sessions: many(sessions),
  /** Cuentas de auth (email, Google, etc.) */
  accounts: many(accounts),
}));

// ── Session relations ───────────────────────────────
export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

// ── Account relations ───────────────────────────────
export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

// ── Shop relations ──────────────────────────────────
export const shopsRelations = relations(shops, ({ one, many }) => ({
  /** Dueño de la barbería */
  owner: one(users, {
    fields: [shops.ownerId],
    references: [users.id],
  }),
  /** Profesionales/barberos del equipo */
  professionals: many(professionals),
  /** Catálogo de servicios */
  services: many(services),
  /** Registro de ventas */
  sales: many(sales),
  /** Suscripción al SaaS (1:1) */
  subscription: one(subscriptions, {
    fields: [shops.id],
    references: [subscriptions.shopId],
  }),
  /** Promociones de la barbería */
  promotions: many(promotions),
}));

// ── Professional relations ──────────────────────────
export const professionalsRelations = relations(
  professionals,
  ({ one, many }) => ({
    /** Cuenta del sistema (opcional) */
    user: one(users, {
      fields: [professionals.userId],
      references: [users.id],
    }),
    /** Barbería a la que pertenece */
    shop: one(shops, {
      fields: [professionals.shopId],
      references: [shops.id],
    }),
    /** Ventas realizadas por este profesional */
    sales: many(sales),
  }),
);

// ── Service relations ───────────────────────────────
export const servicesRelations = relations(services, ({ one, many }) => ({
  /** Barbería que ofrece este servicio */
  shop: one(shops, {
    fields: [services.shopId],
    references: [shops.id],
  }),
  /** Ventas de este servicio */
  sales: many(sales),
  /** Promociones de este servicio */
  promotions: many(promotions),
}));

// ── Sale relations ──────────────────────────────────
export const salesRelations = relations(sales, ({ one }) => ({
  /** Barbería donde se realizó la venta */
  shop: one(shops, {
    fields: [sales.shopId],
    references: [shops.id],
  }),
  /** Profesional que atendió */
  professional: one(professionals, {
    fields: [sales.professionalId],
    references: [professionals.id],
  }),
  /** Servicio vendido (referencial, los datos reales están en los snapshots) */
  service: one(services, {
    fields: [sales.serviceId],
    references: [services.id],
  }),
}));

// ── Subscription relations ──────────────────────────
export const subscriptionsRelations = relations(
  subscriptions,
  ({ one, many }) => ({
    /** Barbería suscrita */
    shop: one(shops, {
      fields: [subscriptions.shopId],
      references: [shops.id],
    }),
    /** Historial de pagos */
    payments: many(paymentHistory),
  }),
);

// ── Payment History relations ───────────────────────
export const paymentHistoryRelations = relations(paymentHistory, ({ one }) => ({
  /** Suscripción a la que pertenece este pago */
  subscription: one(subscriptions, {
    fields: [paymentHistory.subscriptionId],
    references: [subscriptions.id],
  }),
}));

// ── Promotion relations ─────────────────────────────
export const promotionsRelations = relations(promotions, ({ one }) => ({
  shop: one(shops, {
    fields: [promotions.shopId],
    references: [shops.id],
  }),
  service: one(services, {
    fields: [promotions.serviceId],
    references: [services.id],
  }),
}));
