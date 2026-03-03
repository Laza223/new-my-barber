/**
 * ReportsPage — Liquidaciones con selector de período y profesional.
 */
'use client';

import { Button } from '@/components/ui/button';
import type { ProfessionalLiquidation } from '@/lib/types/sale';
import { cn, formatCurrency } from '@/lib/utils';
import { getLiquidationAction } from '@/server/actions/sale.actions';
import { ArrowRight, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { toast } from 'sonner';
import { ExportButtons } from './export-buttons';
import { LiquidationTable } from './liquidation-table';

interface ReportsPageProps {
  shopId: string;
  shopName: string;
  professionals: {
    id: string;
    name: string;
    commissionRate: number;
    isOwner: boolean;
  }[];
  hasAccess: boolean;
}

function currentMonthRange() {
  const now = new Date();
  const start = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
  const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const end = last.toLocaleDateString('en-CA');
  return { start, end, year: now.getFullYear(), month: now.getMonth() + 1 };
}

export function ReportsPage({
  shopId,
  shopName,
  professionals,
  hasAccess,
}: ReportsPageProps) {
  const router = useRouter();
  const [selectedPro, setSelectedPro] = React.useState(
    professionals[0]?.id ?? '',
  );
  const [period, setPeriod] = React.useState(currentMonthRange);
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<ProfessionalLiquidation | null>(null);

  // Upsell if no access
  if (!hasAccess) {
    return (
      <div className="space-y-6">
        <h1 className="font-display text-2xl font-bold">Reportes</h1>
        <div className="space-y-4 rounded-xl border p-8 text-center">
          <Lock className="text-muted-foreground mx-auto h-12 w-12" />
          <h2 className="text-lg font-bold">
            Liquidaciones disponibles en el plan Individual o Business
          </h2>
          <p className="text-muted-foreground mx-auto max-w-md text-sm">
            Accedé a liquidaciones detalladas por profesional, exportación a
            PDF/Excel y envío por WhatsApp.
          </p>
          <Button onClick={() => router.push('/settings')}>
            Actualizar plan
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  async function loadLiquidation(proId: string, start: string, end: string) {
    setLoading(true);
    setData(null);
    const result = await getLiquidationAction(shopId, proId, start, end);
    if (result.success) {
      setData(result.data);
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  }

  // Load on mount and on selection change
  React.useEffect(() => {
    if (selectedPro) {
      loadLiquidation(selectedPro, period.start, period.end);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPro, period.start, period.end]);

  function handleMonthChange(e: React.ChangeEvent<HTMLInputElement>) {
    const [yearStr, monthStr] = e.target.value.split('-');
    if (!yearStr || !monthStr) return;
    const year = Number(yearStr);
    const month = Number(monthStr);
    const start = `${year}-${String(month).padStart(2, '0')}-01`;
    const last = new Date(year, month, 0);
    const end = last.toLocaleDateString('en-CA');
    setPeriod({ start, end, year, month });
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">Reportes</h1>

      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* Period selector */}
        <div className="flex-1">
          <label className="text-muted-foreground text-xs">Período</label>
          <input
            type="month"
            value={`${period.year}-${String(period.month).padStart(2, '0')}`}
            onChange={handleMonthChange}
            className="border-input bg-background flex w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        {/* Professional tabs */}
        <div className="flex-1">
          <label className="text-muted-foreground text-xs">Profesional</label>
          <div className="mt-1 flex gap-1 overflow-x-auto pb-1">
            {professionals.map((pro) => (
              <button
                key={pro.id}
                type="button"
                onClick={() => setSelectedPro(pro.id)}
                className={cn(
                  'shrink-0 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all',
                  selectedPro === pro.id
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/40',
                )}
              >
                {pro.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Totals cards */}
      {data && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="bg-card rounded-lg border p-3 text-center">
            <p className="text-muted-foreground text-xs">Facturado</p>
            <p className="text-lg font-bold">
              {formatCurrency(data.totalRevenue)}
            </p>
          </div>
          <div className="bg-card rounded-lg border p-3 text-center">
            <p className="text-muted-foreground text-xs">Comisión</p>
            <p className="text-lg font-bold">
              {formatCurrency(data.totalCommission)}
            </p>
          </div>
          <div className="bg-card rounded-lg border p-3 text-center">
            <p className="text-muted-foreground text-xs">Propinas</p>
            <p className="text-lg font-bold">
              {formatCurrency(data.totalTips)}
            </p>
          </div>
          <div className="border-primary/30 bg-primary/5 rounded-lg border p-3 text-center">
            <p className="text-muted-foreground text-xs">Total a pagar</p>
            <p className="text-primary text-lg font-bold">
              {formatCurrency(data.totalPayout)}
            </p>
          </div>
        </div>
      )}

      {/* Export buttons */}
      {data && <ExportButtons data={data} shopName={shopName} />}

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="bg-muted/50 h-12 animate-pulse rounded-lg"
            />
          ))}
        </div>
      )}

      {/* Table */}
      {data && !loading && <LiquidationTable data={data} />}

      {/* Empty */}
      {!loading && data && data.sales.length === 0 && (
        <p className="text-muted-foreground py-8 text-center">
          No hay ventas en este período para este profesional
        </p>
      )}
    </div>
  );
}
