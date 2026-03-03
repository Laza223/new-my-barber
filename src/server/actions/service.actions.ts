/**
 * Server Actions de Service.
 */
'use server';

import type { ActionResponse } from '@/lib/types/common';
import type { Service } from '@/lib/types/service';
import {
  createServiceSchema,
  updateServiceSchema,
} from '@/lib/validations/service';
import { AppError } from '@/server/lib/errors';
import { requireSession } from '@/server/lib/get-session';
import { serviceService } from '@/server/services/service.service';
import { z } from 'zod';

export async function createServiceAction(
  shopId: string,
  formData: FormData,
): Promise<ActionResponse<Service>> {
  try {
    const session = await requireSession();

    const parsed = createServiceSchema.safeParse({
      name: formData.get('name'),
      price: Number(formData.get('price')),
      duration: formData.get('duration')
        ? Number(formData.get('duration'))
        : undefined,
      description: formData.get('description') || undefined,
    });

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors[0]?.message ?? 'Datos inválidos',
        code: 'VALIDATION_ERROR',
      };
    }

    const svc = await serviceService.createService(
      shopId,
      session.user.id,
      parsed.data,
    );
    return { success: true, data: svc };
  } catch (error) {
    if (error instanceof AppError) {
      return { success: false, error: error.message, code: error.code };
    }
    console.error('[SERVICE] create error:', error);
    return { success: false, error: 'Error al crear servicio' };
  }
}

export async function updateServiceAction(
  serviceId: string,
  formData: FormData,
): Promise<ActionResponse> {
  try {
    const session = await requireSession();

    const raw: Record<string, unknown> = {};
    const name = formData.get('name');
    if (name) raw.name = name;
    const price = formData.get('price');
    if (price !== null) raw.price = Number(price);
    const duration = formData.get('duration');
    if (duration !== null)
      raw.duration = duration ? Number(duration) : undefined;
    const desc = formData.get('description');
    if (desc !== null) raw.description = desc || undefined;

    const parsed = updateServiceSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors[0]?.message ?? 'Datos inválidos',
        code: 'VALIDATION_ERROR',
      };
    }

    await serviceService.updateService(serviceId, session.user.id, parsed.data);
    return { success: true, data: undefined };
  } catch (error) {
    if (error instanceof AppError) {
      return { success: false, error: error.message, code: error.code };
    }
    console.error('[SERVICE] update error:', error);
    return { success: false, error: 'Error al actualizar servicio' };
  }
}

export async function deleteServiceAction(
  serviceId: string,
): Promise<ActionResponse> {
  try {
    const session = await requireSession();
    await serviceService.deleteService(serviceId, session.user.id);
    return { success: true, data: undefined };
  } catch (error) {
    if (error instanceof AppError) {
      return { success: false, error: error.message, code: error.code };
    }
    console.error('[SERVICE] delete error:', error);
    return { success: false, error: 'Error al eliminar servicio' };
  }
}

export async function reorderServicesAction(
  shopId: string,
  orderedIds: string[],
): Promise<ActionResponse> {
  try {
    const session = await requireSession();

    // Validar que todos los IDs sean UUIDs
    const schema = z.array(z.string().uuid());
    const parsed = schema.safeParse(orderedIds);
    if (!parsed.success) {
      return {
        success: false,
        error: 'IDs inválidos',
        code: 'VALIDATION_ERROR',
      };
    }

    await serviceService.reorderServices(shopId, session.user.id, parsed.data);
    return { success: true, data: undefined };
  } catch (error) {
    if (error instanceof AppError) {
      return { success: false, error: error.message, code: error.code };
    }
    console.error('[SERVICE] reorder error:', error);
    return { success: false, error: 'Error al reordenar servicios' };
  }
}

export async function createBulkServicesAction(
  shopId: string,
  servicesInput: {
    name: string;
    price: number;
    duration?: number;
    description?: string;
  }[],
): Promise<ActionResponse<Service[]>> {
  try {
    const session = await requireSession();

    // Validar cada servicio
    const schema = z.array(createServiceSchema);
    const parsed = schema.safeParse(servicesInput);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors[0]?.message ?? 'Datos inválidos',
        code: 'VALIDATION_ERROR',
      };
    }

    const created = await serviceService.createBulkServices(
      shopId,
      session.user.id,
      parsed.data,
    );
    return { success: true, data: created };
  } catch (error) {
    if (error instanceof AppError) {
      return { success: false, error: error.message, code: error.code };
    }
    console.error('[SERVICE] createBulk error:', error);
    return { success: false, error: 'Error al crear servicios' };
  }
}
