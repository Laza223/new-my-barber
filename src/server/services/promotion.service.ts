/**
 * Promotion Service — lógica de negocio de promociones.
 */
import type { CreatePromotionInput } from '@/lib/types/promotion';
import { NotFoundError } from '@/server/lib/errors';
import { requireOwner } from '@/server/lib/get-session';
import { promotionRepository } from '@/server/repositories/promotion.repository';

export const promotionService = {
  /** List all promotions for a shop */
  async getPromotions(shopId: string) {
    await requireOwner(shopId);
    return promotionRepository.findByShopId(shopId);
  },

  /** Get active promotions for today */
  async getActiveToday(shopId: string) {
    return promotionRepository.findActiveForToday(shopId);
  },

  /** Create a promotion */
  async createPromotion(shopId: string, input: CreatePromotionInput) {
    await requireOwner(shopId);
    return promotionRepository.create({
      shopId,
      name: input.name,
      discountPercent: input.discountPercent,
      dayOfWeek: input.dayOfWeek,
      serviceId: input.serviceId ?? null,
    });
  },

  /** Update a promotion */
  async updatePromotion(
    id: string,
    shopId: string,
    data: Partial<CreatePromotionInput> & { isActive?: boolean },
  ) {
    await requireOwner(shopId);
    const promo = await promotionRepository.findById(id);
    if (!promo || promo.shopId !== shopId) {
      throw new NotFoundError('Promoción');
    }
    return promotionRepository.update(id, data);
  },

  /** Delete a promotion */
  async deletePromotion(id: string, shopId: string) {
    await requireOwner(shopId);
    const promo = await promotionRepository.findById(id);
    if (!promo || promo.shopId !== shopId) {
      throw new NotFoundError('Promoción');
    }
    await promotionRepository.delete(id);
  },

  /**
   * Calculate discounted price for a service given active promotions.
   * Returns { finalPrice, discountPercent, promotionName } or null if no promo.
   */
  applyDiscount(
    serviceId: string,
    originalPrice: number,
    activePromotions: {
      serviceId: string | null;
      discountPercent: number;
      name: string;
    }[],
  ) {
    // Find best matching promo: specific service first, then "all services"
    const specificPromo = activePromotions.find(
      (p) => p.serviceId === serviceId,
    );
    const globalPromo = activePromotions.find((p) => p.serviceId === null);
    const promo = specificPromo ?? globalPromo;

    if (!promo) return null;

    const discount = Math.round((originalPrice * promo.discountPercent) / 100);

    return {
      finalPrice: originalPrice - discount,
      discountPercent: promo.discountPercent,
      promotionName: promo.name,
    };
  },
};
