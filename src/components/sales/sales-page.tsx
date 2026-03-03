/**
 * SalesPage — Historial de ventas con filtros + lista + resumen.
 */
'use client';

import { useSearchParams } from 'next/navigation';
import * as React from 'react';
import { SalesFilters } from './sales-filters';
import { SalesList } from './sales-list';
import { SalesSummaryBar } from './sales-summary-bar';

interface SalesPageProps {
  shopId: string;
  professionals: { id: string; name: string }[];
  initialFilters: {
    startDate?: string;
    endDate?: string;
    professionalId?: string;
    paymentMethod?: string;
    page?: number;
  };
}

export function SalesPage({
  shopId,
  professionals,
  initialFilters,
}: SalesPageProps) {
  const searchParams = useSearchParams();
  const [summary, setSummary] = React.useState({
    revenue: 0,
    count: 0,
    avg: 0,
  });

  // Build filters from current URL
  const filters = {
    startDate:
      searchParams.get('start') ??
      initialFilters.startDate ??
      new Date().toLocaleDateString('en-CA', {
        timeZone: 'America/Argentina/Buenos_Aires',
      }),
    endDate:
      searchParams.get('end') ??
      initialFilters.endDate ??
      new Date().toLocaleDateString('en-CA', {
        timeZone: 'America/Argentina/Buenos_Aires',
      }),
    professionalId:
      searchParams.get('professional') ?? initialFilters.professionalId,
    paymentMethod: searchParams.get('payment') ?? initialFilters.paymentMethod,
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col">
      <div className="flex-1 space-y-6 pb-20 md:pb-4">
        {/* Header */}
        <div>
          <h1 className="font-display text-2xl font-bold">
            Historial de ventas
          </h1>
        </div>

        {/* Filters */}
        <SalesFilters professionals={professionals} />

        {/* List */}
        <SalesList
          shopId={shopId}
          filters={filters}
          onSummaryUpdate={setSummary}
        />
      </div>

      {/* Summary bar */}
      <SalesSummaryBar
        totalRevenue={summary.revenue}
        totalSales={summary.count}
        averageTicket={summary.avg}
      />
    </div>
  );
}
