/**
 * Promotion Repository — queries de promociones.
 */
import { db } from '@/db';
import { promotions } from '@/db/schema/promotions';
import { services } from '@/db/schema/services';
import { and, eq } from 'drizzle-orm';

const ARGENTINA_TZ = 'America/Argentina/Buenos_Aires';

/** Weekday actual en timezone Argentina (0=Dom, 6=Sáb) */
function todayWeekday(): number {
  const now = new Date();
  // Get the day string in Argentina timezone, then parse its weekday
  const dayStr = now.toLocaleDateString('en-US', {
    timeZone: ARGENTINA_TZ,
    weekday: 'short',
  });
  const map: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  return map[dayStr] ?? now.getDay();
}

export const promotionRepository = {
  /** All active promotions for a shop (with service name) */
  async findByShopId(shopId: string) {
    return db
      .select({
        id: promotions.id,
        shopId: promotions.shopId,
        name: promotions.name,
        discountPercent: promotions.discountPercent,
        dayOfWeek: promotions.dayOfWeek,
        serviceId: promotions.serviceId,
        isActive: promotions.isActive,
        createdAt: promotions.createdAt,
        updatedAt: promotions.updatedAt,
        serviceName: services.name,
      })
      .from(promotions)
      .leftJoin(services, eq(promotions.serviceId, services.id))
      .where(eq(promotions.shopId, shopId))
      .orderBy(promotions.dayOfWeek);
  },

  /** Active promotions for TODAY's weekday */
  async findActiveForToday(shopId: string) {
    const weekday = todayWeekday();
    return db
      .select({
        id: promotions.id,
        shopId: promotions.shopId,
        name: promotions.name,
        discountPercent: promotions.discountPercent,
        dayOfWeek: promotions.dayOfWeek,
        serviceId: promotions.serviceId,
        isActive: promotions.isActive,
        createdAt: promotions.createdAt,
        updatedAt: promotions.updatedAt,
        serviceName: services.name,
      })
      .from(promotions)
      .leftJoin(services, eq(promotions.serviceId, services.id))
      .where(
        and(
          eq(promotions.shopId, shopId),
          eq(promotions.dayOfWeek, weekday),
          eq(promotions.isActive, true),
        ),
      );
  },

  async create(data: typeof promotions.$inferInsert) {
    const [created] = await db.insert(promotions).values(data).returning();
    if (!created) throw new Error('Failed to create promotion');
    return created;
  },

  async update(id: string, data: Partial<typeof promotions.$inferInsert>) {
    const [updated] = await db
      .update(promotions)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(promotions.id, id))
      .returning();
    return updated;
  },

  async delete(id: string) {
    await db.delete(promotions).where(eq(promotions.id, id));
  },

  async findById(id: string) {
    return db.query.promotions.findFirst({
      where: eq(promotions.id, id),
    });
  },
};
