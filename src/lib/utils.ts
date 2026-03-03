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

/**
 * Parsea un input de moneda argentina a centavos (integer).
 * Acepta formatos: "$1.234,56", "1234.56", "1234,56", "1234"
 * Retorna centavos: "1234,56" → 123456
 */
export function parseCurrencyInput(value: string): number {
  if (!value) return 0;
  // Quitar $, puntos de miles, espacios
  const cleaned = value.replace(/[$\s.]/g, '').replace(',', '.');
  const num = parseFloat(cleaned);
  if (isNaN(num)) return 0;
  return Math.round(num * 100);
}

/**
 * Extrae las iniciales de un nombre (máximo 2 letras).
 * "Lázaro Owner" → "LO"
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');
}
