/**
 * Server Actions de Professional.
 */
'use server';

import type { ActionResponse } from '@/lib/types/common';
import type {
  Professional,
  ProfessionalWithStats,
} from '@/lib/types/professional';
import {
  createProfessionalSchema,
  updateProfessionalSchema,
} from '@/lib/validations/professional';
import { AppError } from '@/server/lib/errors';
import { requireSession } from '@/server/lib/get-session';
import { professionalService } from '@/server/services/professional.service';

export async function addProfessionalAction(
  shopId: string,
  formData: FormData,
): Promise<ActionResponse<Professional>> {
  try {
    const session = await requireSession();

    const parsed = createProfessionalSchema.safeParse({
      name: formData.get('name'),
      phone: formData.get('phone') || undefined,
      commissionRate: Number(formData.get('commissionRate')),
    });

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors[0]?.message ?? 'Datos inválidos',
        code: 'VALIDATION_ERROR',
      };
    }

    const pro = await professionalService.addProfessional(
      shopId,
      session.user.id,
      parsed.data,
    );
    return { success: true, data: pro };
  } catch (error) {
    if (error instanceof AppError) {
      return { success: false, error: error.message, code: error.code };
    }
    console.error('[PROFESSIONAL] add error:', error);
    return { success: false, error: 'Error al agregar profesional' };
  }
}

export async function updateProfessionalAction(
  professionalId: string,
  formData: FormData,
): Promise<ActionResponse> {
  try {
    const session = await requireSession();

    const raw: Record<string, unknown> = {};
    const name = formData.get('name');
    if (name) raw.name = name;
    const phone = formData.get('phone');
    if (phone !== null) raw.phone = phone || undefined;
    const rate = formData.get('commissionRate');
    if (rate !== null) raw.commissionRate = Number(rate);

    const parsed = updateProfessionalSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors[0]?.message ?? 'Datos inválidos',
        code: 'VALIDATION_ERROR',
      };
    }

    await professionalService.updateProfessional(
      professionalId,
      session.user.id,
      parsed.data,
    );
    return { success: true, data: undefined };
  } catch (error) {
    if (error instanceof AppError) {
      return { success: false, error: error.message, code: error.code };
    }
    console.error('[PROFESSIONAL] update error:', error);
    return { success: false, error: 'Error al actualizar profesional' };
  }
}

export async function removeProfessionalAction(
  professionalId: string,
): Promise<ActionResponse> {
  try {
    const session = await requireSession();
    await professionalService.removeProfessional(
      professionalId,
      session.user.id,
    );
    return { success: true, data: undefined };
  } catch (error) {
    if (error instanceof AppError) {
      return { success: false, error: error.message, code: error.code };
    }
    console.error('[PROFESSIONAL] remove error:', error);
    return { success: false, error: 'Error al eliminar profesional' };
  }
}

export async function getProfessionalsWithStatsAction(
  shopId: string,
): Promise<ActionResponse<ProfessionalWithStats[]>> {
  try {
    const session = await requireSession();
    const data = await professionalService.getProfessionalsWithStats(
      shopId,
      session.user.id,
    );
    return { success: true, data };
  } catch (error) {
    if (error instanceof AppError) {
      return { success: false, error: error.message, code: error.code };
    }
    console.error('[PROFESSIONAL] getStats error:', error);
    return { success: false, error: 'Error al cargar profesionales' };
  }
}
