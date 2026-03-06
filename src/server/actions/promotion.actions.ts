/**
 * Server Actions de Promociones.
 */
'use server';

import type { ActionResponse } from '@/lib/types/common';
import type { Promotion } from '@/lib/types/promotion';
import {
  createPromotionSchema,
  updatePromotionSchema,
} from '@/lib/validations/promotion';
import { AppError } from '@/server/lib/errors';
import { requireSession } from '@/server/lib/get-session';
import { promotionService } from '@/server/services/promotion.service';

export async function getPromotionsAction(
  shopId: string,
): Promise<
  ActionResponse<Awaited<ReturnType<typeof promotionService.getPromotions>>>
> {
  try {
    await requireSession();
    const promotions = await promotionService.getPromotions(shopId);
    return { success: true, data: promotions };
  } catch (error) {
    if (error instanceof AppError) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: false, error: 'Error al cargar promociones' };
  }
}

export async function createPromotionAction(
  shopId: string,
  formData: FormData,
): Promise<ActionResponse<Promotion>> {
  try {
    await requireSession();

    const parsed = createPromotionSchema.safeParse({
      name: formData.get('name'),
      discountPercent: Number(formData.get('discountPercent')),
      dayOfWeek: Number(formData.get('dayOfWeek')),
      serviceId: formData.get('serviceId') || null,
    });

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors[0]?.message ?? 'Datos inválidos',
        code: 'VALIDATION_ERROR',
      };
    }

    const promo = await promotionService.createPromotion(shopId, parsed.data);
    return { success: true, data: promo };
  } catch (error) {
    if (error instanceof AppError) {
      return { success: false, error: error.message, code: error.code };
    }
    console.error('[PROMOTION] create error:', error);
    return { success: false, error: 'Error al crear promoción' };
  }
}

export async function updatePromotionAction(
  id: string,
  shopId: string,
  formData: FormData,
): Promise<ActionResponse> {
  try {
    await requireSession();

    const raw: Record<string, unknown> = {};
    const name = formData.get('name');
    if (name !== null) raw.name = name;
    const disc = formData.get('discountPercent');
    if (disc !== null) raw.discountPercent = Number(disc);
    const day = formData.get('dayOfWeek');
    if (day !== null) raw.dayOfWeek = Number(day);
    const active = formData.get('isActive');
    if (active !== null) raw.isActive = active === 'true';

    const parsed = updatePromotionSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors[0]?.message ?? 'Datos inválidos',
        code: 'VALIDATION_ERROR',
      };
    }

    await promotionService.updatePromotion(id, shopId, parsed.data);
    return { success: true, data: undefined };
  } catch (error) {
    if (error instanceof AppError) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: false, error: 'Error al actualizar promoción' };
  }
}

export async function deletePromotionAction(
  id: string,
  shopId: string,
): Promise<ActionResponse> {
  try {
    await requireSession();
    await promotionService.deletePromotion(id, shopId);
    return { success: true, data: undefined };
  } catch (error) {
    if (error instanceof AppError) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: false, error: 'Error al eliminar promoción' };
  }
}
