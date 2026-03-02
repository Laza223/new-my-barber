import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina clases de Tailwind de forma segura.
 * Resuelve conflictos: cn('px-2', 'px-4') → 'px-4'
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formatea un monto en centavos a formato ARS.
 * Ej: 249900 → "$2.499,00"
 */
export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

/**
 * Formatea una fecha para display en español argentino.
 * Ej: "Miércoles 15 de Enero"
 */
export function formatDateDisplay(date: Date): string {
  return new Intl.DateTimeFormat('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'America/Argentina/Buenos_Aires',
  }).format(date);
}

/**
 * Convierte una fecha a formato YYYY-MM-DD (business date).
 * Usa la timezone argentina.
 */
export function toBusinessDate(date: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

/**
 * Espera N milisegundos. Útil para simular latencia en dev.
 */
export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
