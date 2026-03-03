/**
 * Server Actions de Shop.
 * Validan input con Zod, llaman al service, retornan ActionResponse.
 */
'use server';

import type { ActionResponse } from '@/lib/types/common';
import type { Shop } from '@/lib/types/shop';
import {
  createShopSchema,
  updateShopSchema,
  updateShopSettingsSchema,
} from '@/lib/validations/shop';
import { AppError } from '@/server/lib/errors';
import { requireSession } from '@/server/lib/get-session';
import { shopService } from '@/server/services/shop.service';

export async function createShopAction(
  formData: FormData,
): Promise<ActionResponse<Shop>> {
  try {
    const session = await requireSession();

    const parsed = createShopSchema.safeParse({
      name: formData.get('name'),
      address: formData.get('address') || undefined,
      phone: formData.get('phone') || undefined,
    });

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors[0]?.message ?? 'Datos inválidos',
        code: 'VALIDATION_ERROR',
      };
    }

    const shop = await shopService.createShop(session.user.id, parsed.data);
    return { success: true, data: shop };
  } catch (error) {
    if (error instanceof AppError) {
      return { success: false, error: error.message, code: error.code };
    }
    console.error('[SHOP] createShop error:', error);
    return { success: false, error: 'Error al crear la barbería' };
  }
}

export async function updateShopAction(
  shopId: string,
  formData: FormData,
): Promise<ActionResponse<Shop>> {
  try {
    const session = await requireSession();

    const parsed = updateShopSchema.safeParse({
      name: formData.get('name') || undefined,
      address: formData.get('address') || undefined,
      phone: formData.get('phone') || undefined,
    });

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors[0]?.message ?? 'Datos inválidos',
        code: 'VALIDATION_ERROR',
      };
    }

    const shop = await shopService.updateShop(
      shopId,
      session.user.id,
      parsed.data,
    );
    return { success: true, data: shop };
  } catch (error) {
    if (error instanceof AppError) {
      return { success: false, error: error.message, code: error.code };
    }
    console.error('[SHOP] updateShop error:', error);
    return { success: false, error: 'Error al actualizar la barbería' };
  }
}

export async function updateShopSettingsAction(
  shopId: string,
  formData: FormData,
): Promise<ActionResponse> {
  try {
    const session = await requireSession();

    const raw: Record<string, unknown> = {};
    const monthlyGoal = formData.get('monthlyGoal');
    if (monthlyGoal !== null) raw.monthlyGoal = Number(monthlyGoal);
    const whatsapp = formData.get('whatsappNumber');
    if (whatsapp !== null) raw.whatsappNumber = whatsapp || null;
    const emailSummary = formData.get('emailSummaryEnabled');
    if (emailSummary !== null)
      raw.emailSummaryEnabled = emailSummary === 'true';
    const whatsappSummary = formData.get('whatsappSummaryEnabled');
    if (whatsappSummary !== null)
      raw.whatsappSummaryEnabled = whatsappSummary === 'true';
    const hour = formData.get('summaryHour');
    if (hour !== null) raw.summaryHour = Number(hour);

    const parsed = updateShopSettingsSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors[0]?.message ?? 'Datos inválidos',
        code: 'VALIDATION_ERROR',
      };
    }

    await shopService.updateShopSettings(shopId, session.user.id, parsed.data);
    return { success: true, data: undefined };
  } catch (error) {
    if (error instanceof AppError) {
      return { success: false, error: error.message, code: error.code };
    }
    console.error('[SHOP] updateSettings error:', error);
    return { success: false, error: 'Error al actualizar configuración' };
  }
}

export async function deleteShopAction(
  shopId: string,
): Promise<ActionResponse> {
  try {
    const session = await requireSession();
    await shopService.deleteShop(shopId, session.user.id);
    return { success: true, data: undefined };
  } catch (error) {
    if (error instanceof AppError) {
      return { success: false, error: error.message, code: error.code };
    }
    console.error('[SHOP] deleteShop error:', error);
    return { success: false, error: 'Error al eliminar la barbería' };
  }
}
