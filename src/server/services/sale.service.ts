/**
 * Sale Service — lógica de negocio de ventas.
 * Snapshots, límites de plan, timezone Argentina.
 */
import type { CreateSaleInput } from '@/lib/types/sale';
import {
  ForbiddenError,
  NotFoundError,
  PlanLimitError,
  ValidationError,
} from '@/server/lib/errors';
import { requireOwner, requireSession } from '@/server/lib/get-session';
import { professionalRepository } from '@/server/repositories/professional.repository';
import { saleRepository } from '@/server/repositories/sale.repository';
import { serviceRepository } from '@/server/repositories/service.repository';
import { subscriptionService } from '@/server/services/subscription.service';

const ARGENTINA_TZ = 'America/Argentina/Buenos_Aires';

/** Fecha de hoy en timezone Argentina (YYYY-MM-DD) */
function todayArgentina(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: ARGENTINA_TZ });
}

/** Hora actual en timezone Argentina (HH:MM:SS) */
function nowTimeArgentina(): string {
  return new Date().toLocaleTimeString('en-GB', {
    timeZone: ARGENTINA_TZ,
    hour12: false,
  });
}

export const saleService = {
  /**
   * Registrar una venta con snapshots del estado actual.
   * Verifica: profesional del shop, servicio activo, límite diario.
   */
  async registerSale(shopId: string, userId: string, input: CreateSaleInput) {
    await requireSession();

    // Verificar profesional pertenece al shop
    const pro = await professionalRepository.findById(input.professionalId);
    if (!pro || pro.shopId !== shopId) {
      throw new NotFoundError('Profesional');
    }

    // Verificar servicio pertenece al shop y está activo
    const svc = await serviceRepository.findById(input.serviceId);
    if (!svc || svc.shopId !== shopId) {
      throw new NotFoundError('Servicio');
    }
    if (!svc.isActive) {
      throw new ValidationError('Este servicio está desactivado');
    }

    // Verificar límite diario del plan
    const limitCheck = await subscriptionService.checkDailySalesLimit(shopId);
    if (!limitCheck.allowed) {
      throw new PlanLimitError(
        'ventas diarias',
        'Individual',
        `Llegaste al límite de ${limitCheck.limit} ventas diarias del plan gratuito. Actualizá tu plan para registrar ventas ilimitadas.`,
      );
    }

    // Calcular montos con SNAPSHOT de valores actuales
    const servicePrice = svc.price;
    const commissionRate = pro.commissionRate;
    const commissionAmount = Math.round((servicePrice * commissionRate) / 100);
    const ownerAmount = servicePrice - commissionAmount;

    // Fecha y hora en timezone Argentina
    const saleDate = todayArgentina();
    const saleTime = nowTimeArgentina();

    return saleRepository.create({
      shopId,
      professionalId: input.professionalId,
      serviceId: input.serviceId,
      serviceName: svc.name,
      servicePrice,
      commissionRate,
      commissionAmount,
      ownerAmount,
      tipAmount: input.tipAmount ?? 0,
      paymentMethod: input.paymentMethod,
      notes: input.notes,
      saleDate,
      saleTime,
    });
  },

  /**
   * Listar ventas con paginación y filtros.
   */
  async getSales(
    shopId: string,
    userId: string,
    filters: {
      startDate?: string;
      endDate?: string;
      professionalId?: string;
      paymentMethod?: string;
      page?: number;
      limit?: number;
    },
  ) {
    await requireOwner(shopId);
    return saleRepository.findByShopId(shopId, filters);
  },

  /**
   * Eliminar venta — solo si es de HOY.
   */
  async deleteSale(saleId: string, _userId: string) {
    const sale = await saleRepository.findById(saleId);
    if (!sale) throw new NotFoundError('Venta');

    await requireOwner(sale.shopId);

    // Verificar que sea de hoy
    const today = todayArgentina();
    if (sale.saleDate !== today) {
      throw new ForbiddenError('Solo podés eliminar ventas del día actual');
    }

    await saleRepository.softDelete(saleId);
  },

  /**
   * Resumen diario.
   */
  async getDailySummary(shopId: string, userId: string, date: string) {
    await requireOwner(shopId);
    return saleRepository.getDailySummary(shopId, date);
  },

  /**
   * Resumen mensual.
   */
  async getMonthlySummary(
    shopId: string,
    userId: string,
    year: number,
    month: number,
  ) {
    await requireOwner(shopId);
    return saleRepository.getMonthlySummary(shopId, year, month);
  },

  /**
   * Liquidación de un profesional — solo el owner.
   */
  async getProfessionalLiquidation(
    shopId: string,
    userId: string,
    professionalId: string,
    startDate: string,
    endDate: string,
  ) {
    await requireOwner(shopId);

    // Verificar que el profesional pertenece al shop
    const pro = await professionalRepository.findById(professionalId);
    if (!pro || pro.shopId !== shopId) {
      throw new NotFoundError('Profesional');
    }

    const result = await saleRepository.getProfessionalLiquidation(
      shopId,
      professionalId,
      startDate,
      endDate,
    );

    if (!result) throw new NotFoundError('Liquidación');
    return result;
  },
};
