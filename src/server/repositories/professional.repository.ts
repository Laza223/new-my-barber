/**
 * Professional Repository — queries de profesionales.
 */
import { db } from '@/db';
import { professionals } from '@/db/schema/professionals';
import { and, eq, isNull, sql } from 'drizzle-orm';

export const professionalRepository = {
  async findById(id: string) {
    return db.query.professionals.findFirst({
      where: eq(professionals.id, id),
    });
  },

  async findByShopId(shopId: string, includeDeleted = false) {
    if (includeDeleted) {
      return db.query.professionals.findMany({
        where: eq(professionals.shopId, shopId),
      });
    }
    return db.query.professionals.findMany({
      where: and(
        eq(professionals.shopId, shopId),
        isNull(professionals.deletedAt),
      ),
    });
  },

  async findByUserId(userId: string) {
    return db.query.professionals.findFirst({
      where: eq(professionals.userId, userId),
    });
  },

  async create(data: typeof professionals.$inferInsert) {
    const [created] = await db.insert(professionals).values(data).returning();
    if (!created) throw new Error('Failed to create professional');
    return created;
  },

  async update(id: string, data: Partial<typeof professionals.$inferInsert>) {
    const [updated] = await db
      .update(professionals)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(professionals.id, id))
      .returning();
    if (!updated) throw new Error('Professional not found for update');
    return updated;
  },

  async softDelete(id: string) {
    await db
      .update(professionals)
      .set({ deletedAt: new Date(), isActive: false, updatedAt: new Date() })
      .where(eq(professionals.id, id));
  },

  async countActiveByShopId(shopId: string): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(professionals)
      .where(
        and(
          eq(professionals.shopId, shopId),
          isNull(professionals.deletedAt),
          eq(professionals.isActive, true),
        ),
      );
    return Number(result[0]?.count ?? 0);
  },

  async getNextColorIndex(shopId: string): Promise<number> {
    const count = await this.countActiveByShopId(shopId);
    return count % 10; // 10 colores en la paleta
  },

  async softDeleteByShopId(shopId: string) {
    await db
      .update(professionals)
      .set({ deletedAt: new Date(), isActive: false, updatedAt: new Date() })
      .where(eq(professionals.shopId, shopId));
  },
};
