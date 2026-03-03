/**
 * RecentSalesList — compact list of last 10 sales.
 */
'use client';

import { PAYMENT_METHODS } from '@/lib/constants';
import type { SaleWithDetails } from '@/lib/types/sale';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

interface RecentSalesListProps {
  sales: SaleWithDetails[];
}

export function RecentSalesList({ sales }: RecentSalesListProps) {
  if (sales.length === 0) {
    return (
      <div className="bg-card rounded-xl border p-5">
        <h3 className="text-muted-foreground mb-4 text-sm font-medium">
          Últimas ventas
        </h3>
        <p className="text-muted-foreground py-4 text-center text-sm">
          No hay ventas registradas
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-muted-foreground text-sm font-medium">
          Últimas ventas
        </h3>
        <Link href="/sales" className="text-primary text-xs hover:underline">
          Ver todo →
        </Link>
      </div>
      <div className="space-y-2">
        {sales.map((sale) => {
          const pm = PAYMENT_METHODS.find((m) => m.id === sale.paymentMethod);
          return (
            <div key={sale.id} className="flex items-center gap-2 py-1 text-sm">
              <span className="text-muted-foreground w-10 shrink-0 font-mono text-xs">
                {sale.saleTime.slice(0, 5)}
              </span>
              <span className="text-muted-foreground flex-1 truncate">
                <span className="text-foreground font-medium">
                  {sale.professionalName}
                </span>{' '}
                · {sale.serviceName}
              </span>
              <span className="shrink-0 font-bold">
                {formatCurrency(sale.servicePrice)}
              </span>
              <span className="shrink-0">{pm?.icon}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
