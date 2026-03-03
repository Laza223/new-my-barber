/**
 * Shop Repository — queries de barberías.
 * Solo acceso a datos, sin lógica de negocio.
 */
import { db } from '@/db';
import { shops } from '@/db/schema/shops';
import { eq } from 'drizzle-orm';

export const shopRepository = {
  async findById(id: string) {
    return db.query.shops.findFirst({
      where: eq(shops.id, id),
    });
  },

  async findByOwnerId(ownerId: string) {
    return db.query.shops.findFirst({
      where: eq(shops.ownerId, ownerId),
    });
  },

  async findBySlug(slug: string) {
    return db.query.shops.findFirst({
      where: eq(shops.slug, slug),
    });
  },

  async findByIdWithDetails(id: string) {
    return db.query.shops.findFirst({
      where: eq(shops.id, id),
      with: {
        professionals: true,
        services: true,
        subscription: true,
      },
    });
  },

  async create(data: typeof shops.$inferInsert) {
    const [created] = await db.insert(shops).values(data).returning();
    if (!created) throw new Error('Failed to create shop');
    return created;
  },

  async update(id: string, data: Partial<typeof shops.$inferInsert>) {
    const [updated] = await db
      .update(shops)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(shops.id, id))
      .returning();
    if (!updated) throw new Error('Shop not found for update');
    return updated;
  },

  async softDelete(id: string) {
    await db
      .update(shops)
      .set({ deletedAt: new Date(), isActive: false, updatedAt: new Date() })
      .where(eq(shops.id, id));
  },
};
