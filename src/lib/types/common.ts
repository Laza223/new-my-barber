/**
 * Tipos comunes reutilizables en toda la app.
 */

/** Respuesta estándar de Server Actions */
export type ActionResponse<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string };

/** Resultado paginado */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/** Rango de fechas para filtros */
export interface DateRange {
  start: Date;
  end: Date;
}

/** Dirección de ordenamiento */
export type SortDirection = 'asc' | 'desc';
