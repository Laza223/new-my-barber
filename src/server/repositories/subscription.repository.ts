/**
 * Subscription Repository — queries de suscripciones.
 * Solo acceso a datos, sin lógica de negocio.
 */
import { db } from '@/db';
import { subscriptions } from '@/db/schema/subscriptions';
import { eq } from 'drizzle-orm';

export const subscriptionRepository = {
  async findByShopId(shopId: string) {
    return db.query.subscriptions.findFirst({
      where: eq(subscriptions.shopId, shopId),
    });
  },

  async create(data: typeof subscriptions.$inferInsert) {
    const [created] = await db.insert(subscriptions).values(data).returning();
    if (!created) throw new Error('Failed to create subscription');
    return created;
  },

  async update(id: string, data: Partial<typeof subscriptions.$inferInsert>) {
    const [updated] = await db
      .update(subscriptions)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(subscriptions.id, id))
      .returning();
    if (!updated) throw new Error('Subscription not found for update');
    return updated;
  },
};
