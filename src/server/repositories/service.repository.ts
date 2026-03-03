/**
 * Service Repository — queries de servicios.
 */
import { db } from '@/db';
import { services } from '@/db/schema/services';
import { and, asc, eq, isNull, sql } from 'drizzle-orm';

export const serviceRepository = {
  async findById(id: string) {
    return db.query.services.findFirst({
      where: eq(services.id, id),
    });
  },

  async findByShopId(shopId: string, onlyActive = true) {
    if (onlyActive) {
      return db.query.services.findMany({
        where: and(
          eq(services.shopId, shopId),
          eq(services.isActive, true),
          isNull(services.deletedAt),
        ),
        orderBy: asc(services.sortOrder),
      });
    }
    return db.query.services.findMany({
      where: and(eq(services.shopId, shopId), isNull(services.deletedAt)),
      orderBy: asc(services.sortOrder),
    });
  },

  async create(data: typeof services.$inferInsert) {
    const [created] = await db.insert(services).values(data).returning();
    if (!created) throw new Error('Failed to create service');
    return created;
  },

  async createMany(data: (typeof services.$inferInsert)[]) {
    return db.insert(services).values(data).returning();
  },

  async update(id: string, data: Partial<typeof services.$inferInsert>) {
    const [updated] = await db
      .update(services)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(services.id, id))
      .returning();
    if (!updated) throw new Error('Service not found for update');
    return updated;
  },

  async softDelete(id: string) {
    await db
      .update(services)
      .set({ deletedAt: new Date(), isActive: false, updatedAt: new Date() })
      .where(eq(services.id, id));
  },

  async countActiveByShopId(shopId: string): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(services)
      .where(
        and(
          eq(services.shopId, shopId),
          isNull(services.deletedAt),
          eq(services.isActive, true),
        ),
      );
    return Number(result[0]?.count ?? 0);
  },

  async getMaxSortOrder(shopId: string): Promise<number> {
    const result = await db
      .select({ max: sql<number>`coalesce(max(${services.sortOrder}), -1)` })
      .from(services)
      .where(eq(services.shopId, shopId));
    return Number(result[0]?.max ?? -1);
  },

  async updateSortOrders(shopId: string, orderedIds: string[]) {
    // Actualizar en batch con posición como sortOrder
    for (let i = 0; i < orderedIds.length; i++) {
      const id = orderedIds[i];
      if (!id) continue;
      await db
        .update(services)
        .set({ sortOrder: i, updatedAt: new Date() })
        .where(and(eq(services.id, id), eq(services.shopId, shopId)));
    }
  },

  async findActiveByName(shopId: string, name: string) {
    return db.query.services.findFirst({
      where: and(
        eq(services.shopId, shopId),
        eq(services.name, name),
        isNull(services.deletedAt),
      ),
    });
  },
};
