/**
 * Server Actions de Ventas.
 */
'use server';

import type { ActionResponse } from '@/lib/types/common';
import type {
  DailySummary,
  MonthlySummary,
  ProfessionalLiquidation,
  Sale,
  SaleWithDetails,
} from '@/lib/types/sale';
import { createSaleSchema, salesFilterSchema } from '@/lib/validations/sale';
import { AppError } from '@/server/lib/errors';
import { requireSession } from '@/server/lib/get-session';
import { saleService } from '@/server/services/sale.service';
import { z } from 'zod';

export async function registerSaleAction(
  shopId: string,
  formData: FormData,
): Promise<ActionResponse<Sale>> {
  try {
    const session = await requireSession();

    const parsed = createSaleSchema.safeParse({
      professionalId: formData.get('professionalId'),
      serviceId: formData.get('serviceId'),
      paymentMethod: formData.get('paymentMethod'),
      tipAmount: formData.get('tipAmount')
        ? Number(formData.get('tipAmount'))
        : undefined,
      notes: formData.get('notes') || undefined,
      idempotencyKey: formData.get('idempotencyKey') || undefined,
    });

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors[0]?.message ?? 'Datos inválidos',
        code: 'VALIDATION_ERROR',
      };
    }

    const sale = await saleService.registerSale(
      shopId,
      session.user.id,
      parsed.data,
    );
    return { success: true, data: sale };
  } catch (error) {
    if (error instanceof AppError) {
      return { success: false, error: error.message, code: error.code };
    }
    console.error('[SALE] register error:', error);
    return { success: false, error: 'Error al registrar la venta' };
  }
}

export async function getSalesAction(
  shopId: string,
  filters: {
    startDate?: string;
    endDate?: string;
    professionalId?: string;
    paymentMethod?: string;
    page?: number;
    limit?: number;
  },
): Promise<
  ActionResponse<{
    data: SaleWithDetails[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>
> {
  try {
    const session = await requireSession();

    // Validate filters if provided
    if (filters.startDate || filters.endDate) {
      const parsed = salesFilterSchema.safeParse(filters);
      if (!parsed.success) {
        return {
          success: false,
          error: parsed.error.errors[0]?.message ?? 'Filtros inválidos',
          code: 'VALIDATION_ERROR',
        };
      }
    }

    const result = await saleService.getSales(shopId, session.user.id, filters);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof AppError) {
      return { success: false, error: error.message, code: error.code };
    }
    console.error('[SALE] getSales error:', error);
    return { success: false, error: 'Error al cargar ventas' };
  }
}

export async function deleteSaleAction(
  saleId: string,
): Promise<ActionResponse> {
  try {
    const session = await requireSession();
    await saleService.deleteSale(saleId, session.user.id);
    return { success: true, data: undefined };
  } catch (error) {
    if (error instanceof AppError) {
      return { success: false, error: error.message, code: error.code };
    }
    console.error('[SALE] delete error:', error);
    return { success: false, error: 'Error al eliminar la venta' };
  }
}

export async function getDailySummaryAction(
  shopId: string,
  date: string,
): Promise<ActionResponse<DailySummary>> {
  try {
    const session = await requireSession();

    // Validate date format
    const dateSchema = z.string().date('Formato de fecha inválido');
    const parsed = dateSchema.safeParse(date);
    if (!parsed.success) {
      return {
        success: false,
        error: 'Fecha inválida',
        code: 'VALIDATION_ERROR',
      };
    }

    const summary = await saleService.getDailySummary(
      shopId,
      session.user.id,
      parsed.data,
    );
    return { success: true, data: summary };
  } catch (error) {
    if (error instanceof AppError) {
      return { success: false, error: error.message, code: error.code };
    }
    console.error('[SALE] dailySummary error:', error);
    return { success: false, error: 'Error al cargar resumen' };
  }
}

export async function getMonthlySummaryAction(
  shopId: string,
  year: number,
  month: number,
): Promise<ActionResponse<MonthlySummary>> {
  try {
    const session = await requireSession();

    if (month < 1 || month > 12) {
      return {
        success: false,
        error: 'Mes inválido',
        code: 'VALIDATION_ERROR',
      };
    }

    const summary = await saleService.getMonthlySummary(
      shopId,
      session.user.id,
      year,
      month,
    );
    return { success: true, data: summary };
  } catch (error) {
    if (error instanceof AppError) {
      return { success: false, error: error.message, code: error.code };
    }
    console.error('[SALE] monthlySummary error:', error);
    return { success: false, error: 'Error al cargar resumen mensual' };
  }
}

export async function getLiquidationAction(
  shopId: string,
  professionalId: string,
  startDate: string,
  endDate: string,
): Promise<ActionResponse<ProfessionalLiquidation>> {
  try {
    const session = await requireSession();

    // Validate dates
    const schema = z.object({
      startDate: z.string().date(),
      endDate: z.string().date(),
      professionalId: z.string().uuid(),
    });
    const parsed = schema.safeParse({ startDate, endDate, professionalId });
    if (!parsed.success) {
      return {
        success: false,
        error: 'Datos inválidos',
        code: 'VALIDATION_ERROR',
      };
    }

    const liquidation = await saleService.getProfessionalLiquidation(
      shopId,
      session.user.id,
      parsed.data.professionalId,
      parsed.data.startDate,
      parsed.data.endDate,
    );
    return { success: true, data: liquidation };
  } catch (error) {
    if (error instanceof AppError) {
      return { success: false, error: error.message, code: error.code };
    }
    console.error('[SALE] liquidation error:', error);
    return { success: false, error: 'Error al cargar liquidación' };
  }
}
