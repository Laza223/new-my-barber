/**
 * SalesList — Lista de ventas agrupadas por fecha con scroll infinito.
 */
'use client';

import {
  deleteSaleAction,
  getSalesAction,
} from '@/server/actions/sale.actions';
import { Loader2 } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';
import { SaleListItem } from './sale-list-item';

interface SaleData {
  id: string;
  saleDate: string;
  saleTime: string;
  professionalId: string;
  professionalName: string;
  serviceName: string;
  servicePrice: number;
  commissionRate: number;
  commissionAmount: number;
  ownerAmount: number;
  tipAmount: number;
  paymentMethod: string;
  notes: string | null;
}

interface SalesListProps {
  shopId: string;
  filters: {
    startDate?: string;
    endDate?: string;
    professionalId?: string;
    paymentMethod?: string;
  };
  onSummaryUpdate: (totals: {
    revenue: number;
    count: number;
    avg: number;
  }) => void;
}

function formatDateHeader(dateStr: string): string {
  const today = new Date().toLocaleDateString('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires',
  });
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toLocaleDateString('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires',
  });

  if (dateStr === today) return 'Hoy';
  if (dateStr === yesterdayStr) return 'Ayer';

  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  });
}

export function SalesList({
  shopId,
  filters,
  onSummaryUpdate,
}: SalesListProps) {
  const [sales, setSales] = React.useState<SaleData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const observerRef = React.useRef<HTMLDivElement>(null);

  const today = new Date().toLocaleDateString('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires',
  });

  // Load initial data
  React.useEffect(() => {
    setLoading(true);
    setSales([]);
    setPage(1);
    setHasMore(true);

    async function load() {
      const result = await getSalesAction(shopId, {
        ...filters,
        page: 1,
        limit: 20,
      });
      if (result.success) {
        setSales(result.data.data as unknown as SaleData[]);
        setHasMore(
          result.data.pagination.page < result.data.pagination.totalPages,
        );
        // Update summary
        const revenue = (result.data.data as unknown as SaleData[]).reduce(
          (sum, s) => sum + s.servicePrice,
          0,
        );
        const count = result.data.pagination.total;
        onSummaryUpdate({
          revenue,
          count,
          avg: count > 0 ? Math.round(revenue / count) : 0,
        });
      }
      setLoading(false);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    shopId,
    filters.startDate,
    filters.endDate,
    filters.professionalId,
    filters.paymentMethod,
  ]);

  // Intersection observer for infinite scroll
  React.useEffect(() => {
    if (!observerRef.current || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !loadingMore && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(observerRef.current);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, loadingMore, page]);

  async function loadMore() {
    setLoadingMore(true);
    const nextPage = page + 1;
    const result = await getSalesAction(shopId, {
      ...filters,
      page: nextPage,
      limit: 20,
    });
    if (result.success) {
      setSales((prev) => [
        ...prev,
        ...(result.data.data as unknown as SaleData[]),
      ]);
      setPage(nextPage);
      setHasMore(
        result.data.pagination.page < result.data.pagination.totalPages,
      );
    }
    setLoadingMore(false);
  }

  async function handleDelete(saleId: string) {
    const result = await deleteSaleAction(saleId);
    if (result.success) {
      setSales((prev) => prev.filter((s) => s.id !== saleId));
      toast.success('Venta eliminada');
    } else {
      toast.error(result.error);
    }
  }

  // Group by date
  const grouped = React.useMemo(() => {
    const map = new Map<string, SaleData[]>();
    for (const sale of sales) {
      const existing = map.get(sale.saleDate) ?? [];
      existing.push(sale);
      map.set(sale.saleDate, existing);
    }
    return Array.from(map.entries()).sort(([a], [b]) => b.localeCompare(a));
  }, [sales]);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-muted/50 h-14 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (sales.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <p className="text-muted-foreground">No hay ventas en este período</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {grouped.map(([date, dateSales]) => (
        <div key={date}>
          <h3 className="text-muted-foreground mb-2 text-sm font-medium capitalize">
            {formatDateHeader(date)}
          </h3>
          <div className="space-y-2">
            {dateSales.map((sale) => (
              <SaleListItem
                key={sale.id}
                sale={sale}
                isToday={sale.saleDate === today}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Infinite scroll trigger */}
      {hasMore && (
        <div ref={observerRef} className="flex justify-center py-4">
          {loadingMore && (
            <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
          )}
        </div>
      )}
    </div>
  );
}
