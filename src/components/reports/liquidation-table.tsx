/**
 * LiquidationTable — Tabla responsive de liquidación.
 */
'use client';

import { PAYMENT_METHODS } from '@/lib/constants';
import type { ProfessionalLiquidation } from '@/lib/types/sale';
import { formatCurrency } from '@/lib/utils';

interface LiquidationTableProps {
  data: ProfessionalLiquidation;
}

export function LiquidationTable({ data }: LiquidationTableProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-card rounded-lg border p-4">
        <h3 className="font-bold">{data.professional.name}</h3>
        <p className="text-muted-foreground text-sm">
          {data.period.start} — {data.period.end} ·{' '}
          {data.professional.commissionRate}% comisión
        </p>
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-muted-foreground border-b text-left">
              <th className="pb-2 font-medium">Fecha</th>
              <th className="pb-2 font-medium">Hora</th>
              <th className="pb-2 font-medium">Servicio</th>
              <th className="pb-2 text-right font-medium">Precio</th>
              <th className="pb-2 text-right font-medium">Comisión</th>
              <th className="pb-2 text-right font-medium">Propina</th>
              <th className="pb-2 font-medium">Pago</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.sales.map((sale) => {
              const pm = PAYMENT_METHODS.find(
                (m) => m.id === sale.paymentMethod,
              );
              return (
                <tr key={sale.id} className="hover:bg-muted/30">
                  <td className="py-2">{sale.saleDate}</td>
                  <td className="py-2 font-mono text-xs">
                    {sale.saleTime.slice(0, 5)}
                  </td>
                  <td className="py-2">{sale.serviceName}</td>
                  <td className="py-2 text-right font-medium">
                    {formatCurrency(sale.servicePrice)}
                  </td>
                  <td className="py-2 text-right">
                    {formatCurrency(sale.commissionAmount)}
                  </td>
                  <td className="py-2 text-right">
                    {sale.tipAmount > 0 ? formatCurrency(sale.tipAmount) : '—'}
                  </td>
                  <td className="py-2">{pm?.icon}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-muted/50 border-t-2 font-bold">
              <td colSpan={3} className="py-3">
                TOTAL ({data.sales.length} ventas)
              </td>
              <td className="py-3 text-right">
                {formatCurrency(data.totalRevenue)}
              </td>
              <td className="py-3 text-right">
                {formatCurrency(data.totalCommission)}
              </td>
              <td className="py-3 text-right">
                {formatCurrency(data.totalTips)}
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-2 md:hidden">
        {data.sales.map((sale) => {
          const pm = PAYMENT_METHODS.find((m) => m.id === sale.paymentMethod);
          return (
            <div
              key={sale.id}
              className="bg-card rounded-lg border p-3 text-sm"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{sale.serviceName}</span>
                <span className="font-bold">
                  {formatCurrency(sale.servicePrice)}
                </span>
              </div>
              <div className="text-muted-foreground mt-1 flex items-center justify-between text-xs">
                <span>
                  {sale.saleDate} · {sale.saleTime.slice(0, 5)} · {pm?.icon}
                </span>
                <span>Com: {formatCurrency(sale.commissionAmount)}</span>
              </div>
              {sale.tipAmount > 0 && (
                <div className="text-muted-foreground mt-1 text-xs">
                  Propina: {formatCurrency(sale.tipAmount)}
                </div>
              )}
            </div>
          );
        })}

        {/* Mobile total */}
        <div className="border-primary/30 bg-primary/5 rounded-lg border-2 p-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Facturado:</span>{' '}
              <span className="font-bold">
                {formatCurrency(data.totalRevenue)}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Comisión:</span>{' '}
              <span className="font-bold">
                {formatCurrency(data.totalCommission)}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Propinas:</span>{' '}
              <span className="font-bold">
                {formatCurrency(data.totalTips)}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">A pagar:</span>{' '}
              <span className="text-primary font-bold">
                {formatCurrency(data.totalPayout)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
