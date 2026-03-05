/**
 * InicioPage — today's sales list + inline new sale modal.
 * Both desktop and mobile open the sale form in a bottom sheet (no page navigation).
 * Designed to fit entirely within the viewport — NO outer scroll on any device.
 *
 * Height budget (mobile):
 *   100dvh - 64px(header) - 16px(main pt-4) - 80px(main pb-20) - 48px(nav) = available
 *   = 100dvh - 208px
 *
 * Height budget (desktop):
 *   100dvh - 64px(header) - 24px(main pt-6) - 24px(main pb-6) = available
 *   = 100dvh - 112px
 */
'use client';

import { SaleFlow } from '@/components/sales/sale-flow';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { PAYMENT_METHODS } from '@/lib/constants';
import type { DashboardData } from '@/lib/types/dashboard';
import type { SaleWithDetails } from '@/lib/types/sale';
import { formatCurrency } from '@/lib/utils';
import { getDashboardAction } from '@/server/actions/dashboard.actions';
import { Plus, Scissors } from 'lucide-react';
import * as React from 'react';

/* ── Short labels for payment methods on mobile ── */
const PM_SHORT: Record<string, string> = {
  cash: 'Efect.',
  transfer: 'Transf.',
  mercadopago: 'MP',
  debit: 'Débito',
  credit: 'Crédito',
};

/* ── Types ── */
interface SaleFormData {
  professionals: {
    id: string;
    name: string;
    colorIndex: number;
    isOwner: boolean;
  }[];
  services: {
    id: string;
    name: string;
    price: number;
    duration: number | null;
    sortOrder: number;
  }[];
  todaySalesCount: number;
  dailySalesLimit: number | null;
  canSell: boolean;
}

interface InicioPageProps {
  shopId: string;
  today: DashboardData['today'];
  recentSales: SaleWithDetails[];
  saleFormData: SaleFormData;
}

export function InicioPage({
  shopId,
  today: initialToday,
  recentSales: initialSales,
  saleFormData,
}: InicioPageProps) {
  const [today, setToday] = React.useState(initialToday);
  const [recentSales, setRecentSales] = React.useState(initialSales);
  const [formOpen, setFormOpen] = React.useState(false);

  React.useEffect(() => {
    const interval = setInterval(async () => {
      const result = await getDashboardAction(shopId);
      if (result.success) {
        setToday(result.data.today);
        setRecentSales(result.data.recentSales);
      }
    }, 60_000);
    return () => clearInterval(interval);
  }, [shopId]);

  function handleSaleSuccess() {
    setFormOpen(false);
    getDashboardAction(shopId).then((result) => {
      if (result.success) {
        setToday(result.data.today);
        setRecentSales(result.data.recentSales);
      }
    });
  }

  return (
    <>
      <div className="flex h-[calc(100dvh-208px)] flex-col overflow-hidden md:h-[calc(100dvh-112px)]">
        {/* ── Header ── */}
        <div className="mb-2 flex shrink-0 items-center justify-between">
          <div>
            <h1 className="font-display text-lg font-bold">Hoy</h1>
            <p className="text-muted-foreground text-xs">
              {new Date().toLocaleDateString('es-AR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setFormOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium shadow-sm transition-colors active:scale-[0.97]"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Agregar venta</span>
            <span className="sm:hidden">Agregar</span>
          </button>
        </div>

        {/* ── Sales list ── */}
        <div className="bg-card flex min-h-0 flex-1 flex-col rounded-xl border">
          {/* Column headers */}
          <div className="text-muted-foreground shrink-0 border-b px-2 py-1.5 text-[10px] font-semibold tracking-wider uppercase md:px-3 md:py-2 md:text-[11px]">
            <div className="grid grid-cols-[3rem_1fr_3.5rem_4rem] items-center gap-3 md:grid-cols-[3.5rem_1fr_6rem_5rem] md:gap-4">
              <span>Hora</span>
              <span>Servicio</span>
              <span className="text-right">Pago</span>
              <span className="text-right">Precio</span>
            </div>
          </div>

          {recentSales.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center py-6 text-center">
              <Scissors className="text-muted-foreground/40 mb-2 h-8 w-8" />
              <p className="text-muted-foreground text-sm">
                No hay ventas registradas hoy
              </p>
              <button
                type="button"
                onClick={() => setFormOpen(true)}
                className="text-primary mt-1.5 text-sm font-medium hover:underline"
              >
                Registrar primera venta →
              </button>
            </div>
          ) : (
            <>
              <style>{`
                .sales-scroll { max-height: calc(100dvh - 340px); }
                @media (min-width: 768px) { .sales-scroll { max-height: calc(100dvh - 220px); } }
              `}</style>
              <div
                className="sales-scroll overflow-y-auto"
                style={{
                  overscrollBehavior: 'contain',
                }}
              >
                <div className="divide-y">
                  {recentSales.map((sale) => {
                    const pm = PAYMENT_METHODS.find(
                      (m) => m.id === sale.paymentMethod,
                    );

                    return (
                      <div
                        key={sale.id}
                        className="grid grid-cols-[3rem_1fr_3.5rem_4rem] items-center gap-3 px-2 py-1.5 md:grid-cols-[3.5rem_1fr_6rem_5rem] md:gap-4 md:px-3 md:py-2"
                      >
                        <span className="text-muted-foreground font-mono text-xs">
                          {sale.saleTime.slice(0, 5)}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm leading-tight font-medium">
                            {sale.serviceName}
                          </p>
                          <p className="text-muted-foreground truncate text-xs">
                            {sale.professionalName}
                          </p>
                        </div>
                        {/* Short label on mobile, full on desktop */}
                        <span className="text-muted-foreground text-right text-xs md:hidden">
                          {PM_SHORT[sale.paymentMethod] ?? sale.paymentMethod}
                        </span>
                        <span className="text-muted-foreground hidden text-right text-xs md:inline">
                          {pm?.label ?? sale.paymentMethod}
                        </span>
                        <span className="text-primary text-right text-sm font-bold">
                          {formatCurrency(sale.servicePrice)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── KPI cards ── */}
        <div className="mt-2 grid shrink-0 grid-cols-2 gap-2 md:mt-3 md:gap-3">
          <div className="bg-card rounded-xl border px-3 py-2 md:px-4 md:py-2.5">
            <p className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase md:text-xs">
              Ventas
            </p>
            <p className="text-foreground text-lg font-bold">
              {today.salesCount}
            </p>
          </div>
          <div className="bg-card rounded-xl border px-3 py-2 md:px-4 md:py-2.5">
            <p className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase md:text-xs">
              Facturación
            </p>
            <p className="text-primary text-lg font-bold">
              {formatCurrency(today.revenue)}
            </p>
          </div>
        </div>
      </div>

      {/* ── Sale form modal ── */}
      <Sheet open={formOpen} onOpenChange={setFormOpen}>
        <SheetContent
          side="bottom"
          className="mx-auto rounded-t-2xl px-5 pt-5 pb-8 md:inset-auto md:top-1/2 md:left-1/2 md:w-full md:max-w-2xl md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl"
        >
          <SheetHeader className="mb-3">
            <SheetTitle className="text-left">Nueva venta</SheetTitle>
            <SheetDescription className="sr-only">
              Registrá una venta rápidamente
            </SheetDescription>
          </SheetHeader>
          <SaleFlow
            shopId={shopId}
            professionals={saleFormData.professionals}
            services={saleFormData.services}
            todaySalesCount={saleFormData.todaySalesCount}
            dailySalesLimit={saleFormData.dailySalesLimit}
            canSell={saleFormData.canSell}
            onSuccess={handleSaleSuccess}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
