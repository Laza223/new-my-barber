/**
 * SalesSummaryBar — Barra sticky con resumen numérico.
 */
'use client';

import { formatCurrency } from '@/lib/utils';

interface SalesSummaryBarProps {
  totalRevenue: number;
  totalSales: number;
  averageTicket: number;
}

export function SalesSummaryBar({
  totalRevenue,
  totalSales,
  averageTicket,
}: SalesSummaryBarProps) {
  return (
    <div className="bg-card/95 sticky right-0 bottom-0 left-0 border-t px-4 py-3 backdrop-blur-sm md:relative md:mt-4 md:rounded-lg md:border">
      <div className="flex items-center justify-between gap-4 text-center">
        <div className="flex-1">
          <p className="text-muted-foreground text-xs">Facturado</p>
          <p className="text-sm font-bold">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="bg-border h-8 w-px" />
        <div className="flex-1">
          <p className="text-muted-foreground text-xs">Ventas</p>
          <p className="text-sm font-bold">{totalSales}</p>
        </div>
        <div className="bg-border h-8 w-px" />
        <div className="flex-1">
          <p className="text-muted-foreground text-xs">Ticket</p>
          <p className="text-sm font-bold">{formatCurrency(averageTicket)}</p>
        </div>
      </div>
    </div>
  );
}
