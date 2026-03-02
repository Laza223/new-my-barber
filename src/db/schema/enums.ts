/**
 * Enums de PostgreSQL para My Barber.
 *
 * Centralizados aquí para que todos los schemas los importen
 * desde un solo lugar. Agregar nuevos valores al final del array
 * para no romper migraciones existentes.
 */
import { pgEnum } from 'drizzle-orm/pg-core';

/** Rol del usuario en el sistema */
export const userRoleEnum = pgEnum('user_role', [
  'owner', // Dueño de barbería, acceso completo
  'professional', // Profesional/barbero, acceso limitado a sus datos
]);

/** Métodos de pago aceptados por la barbería */
export const paymentMethodEnum = pgEnum('payment_method', [
  'cash', // Efectivo
  'transfer', // Transferencia bancaria
  'mercadopago', // MercadoPago (QR, link de pago)
  'debit', // Tarjeta de débito
  'credit', // Tarjeta de crédito
]);

/** Planes de suscripción disponibles */
export const subscriptionPlanEnum = pgEnum('subscription_plan', [
  'free', // Plan gratuito con límites
  'individual', // Plan para barbero independiente
  'business', // Plan para barbería con equipo
]);

/** Estado de la suscripción */
export const subscriptionStatusEnum = pgEnum('subscription_status', [
  'active', // Suscripción activa y al día
  'past_due', // Pago pendiente/vencido
  'cancelled', // Cancelada por el usuario o sistema
  'trialing', // En período de prueba
]);

/** Estado de un pago individual */
export const paymentStatusEnum = pgEnum('payment_status', [
  'approved', // Pago confirmado
  'pending', // Esperando confirmación
  'rejected', // Rechazado por procesador
  'refunded', // Devuelto al usuario
]);
