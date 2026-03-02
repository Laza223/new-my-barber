/**
 * DataTable — Tabla responsive.
 * Desktop: tabla normal con sorting.
 * Mobile: cada row se convierte en card.
 */
'use client';

import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';
import { Skeleton } from './skeleton';

/* ── Types ── */
interface Column<T> {
  key: string;
  header: string;
  /** Render personalizado de la celda */
  render?: (row: T) => React.ReactNode;
  /** Clave para sorting. Si no se define, usa `key`. */
  sortKey?: string;
  /** Habilitar sorting en esta columna */
  sortable?: boolean;
  /** Ocultar en mobile cards (se muestra solo en tabla desktop) */
  hideOnMobile?: boolean;
  /** Clase adicional de la celda */
  className?: string;
}

type SortDirection = 'asc' | 'desc' | null;

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  /** Clave única de cada row. Default: 'id' */
  rowKey?: keyof T | ((row: T) => string);
  loading?: boolean;
  /** Componente a mostrar cuando no hay datos */
  emptyState?: React.ReactNode;
  /** Número de skeleton rows en loading */
  loadingRows?: number;
  /** Clase del contenedor */
  className?: string;
  /** Callback cuando se clickea una row */
  onRowClick?: (row: T) => void;
}

function getRowKeyValue<T>(
  row: T,
  rowKey: keyof T | ((row: T) => string),
): string {
  if (typeof rowKey === 'function') return rowKey(row);
  return String(row[rowKey]);
}

function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  rowKey = 'id' as keyof T,
  loading,
  emptyState,
  loadingRows = 5,
  className,
  onRowClick,
}: DataTableProps<T>) {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDir, setSortDir] = React.useState<SortDirection>(null);

  const handleSort = (column: Column<T>) => {
    if (!column.sortable) return;
    const key = column.sortKey ?? column.key;
    if (sortKey === key) {
      setSortDir((prev) =>
        prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc',
      );
      if (sortDir === 'desc') setSortKey(null);
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortKey || !sortDir) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal == null || bVal == null) return 0;
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  const getCellValue = (row: T, col: Column<T>) => {
    if (col.render) return col.render(row);
    return String(row[col.key] ?? '');
  };

  // ── Loading state ──
  if (loading) {
    return (
      <div className={cn('space-y-3', className)}>
        {Array.from({ length: loadingRows }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  // ── Empty state ──
  if (data.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  // ── Mobile: Cards ──
  if (isMobile) {
    return (
      <div className={cn('space-y-3', className)}>
        {sortedData.map((row) => (
          <div
            key={getRowKeyValue(row, rowKey)}
            className={cn(
              'bg-card space-y-2 rounded-lg border p-4',
              onRowClick &&
                'cursor-pointer transition-transform active:scale-[0.98]',
            )}
            onClick={() => onRowClick?.(row)}
            role={onRowClick ? 'button' : undefined}
            tabIndex={onRowClick ? 0 : undefined}
          >
            {columns
              .filter((col) => !col.hideOnMobile)
              .map((col) => (
                <div
                  key={col.key}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground">{col.header}</span>
                  <span className={cn('font-medium', col.className)}>
                    {getCellValue(row, col)}
                  </span>
                </div>
              ))}
          </div>
        ))}
      </div>
    );
  }

  // ── Desktop: Table ──
  return (
    <div className={cn('w-full overflow-auto', className)}>
      <table className="w-full caption-bottom text-sm">
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'text-muted-foreground h-10 px-4 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0',
                  col.sortable &&
                    'hover:text-foreground cursor-pointer select-none',
                  col.className,
                )}
                onClick={() => handleSort(col)}
              >
                <div className="flex items-center gap-1">
                  {col.header}
                  {col.sortable && (
                    <span className="ml-1">
                      {sortKey === (col.sortKey ?? col.key) ? (
                        sortDir === 'asc' ? (
                          <ChevronUp className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5" />
                        )
                      ) : (
                        <ChevronsUpDown className="h-3.5 w-3.5 opacity-40" />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {sortedData.map((row) => (
            <tr
              key={getRowKeyValue(row, rowKey)}
              className={cn(
                'hover:bg-muted/50 border-b transition-colors',
                onRowClick && 'cursor-pointer',
              )}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    'p-4 align-middle [&:has([role=checkbox])]:pr-0',
                    col.className,
                  )}
                >
                  {getCellValue(row, col)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export { DataTable };
export type { Column, DataTableProps };
