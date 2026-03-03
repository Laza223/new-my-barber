/**
 * Service Service (sí, servicio de servicios 😅) — lógica de negocio.
 */
import type {
  CreateServiceInput,
  UpdateServiceInput,
} from '@/lib/types/service';
import {
  ConflictError,
  NotFoundError,
  PlanLimitError,
} from '@/server/lib/errors';
import { requireOwner } from '@/server/lib/get-session';
import { serviceRepository } from '@/server/repositories/service.repository';
import { subscriptionService } from '@/server/services/subscription.service';

export const serviceService = {
  /**
   * Crea un servicio nuevo. Verifica plan y duplicados.
   */
  async createService(
    shopId: string,
    userId: string,
    input: CreateServiceInput,
  ) {
    await requireOwner(shopId);

    // Verificar límite del plan
    const access = await subscriptionService.checkAccess(shopId, 'services');
    if (access.limit !== undefined) {
      const currentCount = await serviceRepository.countActiveByShopId(shopId);
      if (currentCount >= access.limit) {
        throw new PlanLimitError('servicios', 'Individual');
      }
    }

    // Verificar nombre no duplicado
    const existing = await serviceRepository.findActiveByName(
      shopId,
      input.name,
    );
    if (existing) {
      throw new ConflictError(`Ya existe un servicio llamado "${input.name}"`);
    }

    // sortOrder = max + 1
    const maxSort = await serviceRepository.getMaxSortOrder(shopId);

    return serviceRepository.create({
      shopId,
      name: input.name,
      price: input.price,
      duration: input.duration,
      description: input.description,
      sortOrder: maxSort + 1,
    });
  },

  /**
   * Actualiza un servicio.
   * NOTA: cambiar precio NO afecta ventas pasadas (snapshot).
   */
  async updateService(
    serviceId: string,
    userId: string,
    input: UpdateServiceInput,
  ) {
    const svc = await serviceRepository.findById(serviceId);
    if (!svc) throw new NotFoundError('Servicio');

    await requireOwner(svc.shopId);

    // Si cambia el nombre, verificar que no duplique
    if (input.name && input.name !== svc.name) {
      const existing = await serviceRepository.findActiveByName(
        svc.shopId,
        input.name,
      );
      if (existing) {
        throw new ConflictError(
          `Ya existe un servicio llamado "${input.name}"`,
        );
      }
    }

    return serviceRepository.update(serviceId, {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.price !== undefined && { price: input.price }),
      ...(input.duration !== undefined && { duration: input.duration }),
      ...(input.description !== undefined && {
        description: input.description,
      }),
    });
  },

  /**
   * Soft delete de un servicio.
   */
  async deleteService(serviceId: string, userId: string) {
    const svc = await serviceRepository.findById(serviceId);
    if (!svc) throw new NotFoundError('Servicio');

    await requireOwner(svc.shopId);
    await serviceRepository.softDelete(serviceId);
  },

  /**
   * Reordena los servicios del shop.
   */
  async reorderServices(shopId: string, userId: string, orderedIds: string[]) {
    await requireOwner(shopId);
    await serviceRepository.updateSortOrders(shopId, orderedIds);
  },

  /**
   * Crea múltiples servicios de una vez (para onboarding).
   * Verifica límite del plan para la cantidad total.
   */
  async createBulkServices(
    shopId: string,
    userId: string,
    servicesInput: CreateServiceInput[],
  ) {
    await requireOwner(shopId);

    // Verificar límite del plan
    const access = await subscriptionService.checkAccess(shopId, 'services');
    if (access.limit !== undefined) {
      const currentCount = await serviceRepository.countActiveByShopId(shopId);
      if (currentCount + servicesInput.length > access.limit) {
        throw new PlanLimitError('servicios', 'Individual');
      }
    }

    // Crear todos con sortOrder incremental
    const maxSort = await serviceRepository.getMaxSortOrder(shopId);
    const data = servicesInput.map((s, i) => ({
      shopId,
      name: s.name,
      price: s.price,
      duration: s.duration,
      description: s.description,
      sortOrder: maxSort + 1 + i,
    }));

    return serviceRepository.createMany(data);
  },
};
