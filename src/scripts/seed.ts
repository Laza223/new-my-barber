/**
 * Seed script — creates a test user with shop, professionals, services, and sample sales.
 *
 * Uses Better-Auth's own hashPassword to guarantee compatibility.
 *
 * Run with: npx tsx src/scripts/seed.ts
 */
import { config } from 'dotenv';
config({ path: '.env.local' });

import { neon } from '@neondatabase/serverless';
import { hashPassword } from 'better-auth/crypto';
import * as crypto from 'crypto';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../db/schema';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL no definida');
  process.exit(1);
}

const APP_URL = process.env.BETTER_AUTH_URL ?? 'http://localhost:3000';
const sql = neon(DATABASE_URL);
const db = drizzle(sql, { schema });

async function seed() {
  console.log('🌱 Seeding test data...\n');

  const TEST_EMAIL = 'demo@mybarber.app';
  const TEST_PASSWORD = 'Test1234!';
  const TEST_NAME = 'Lázaro Demo';

  // 1. Create or find user
  const existingUser = await db.query.users.findFirst({
    where: eq(schema.users.email, TEST_EMAIL),
  });

  let userId: string;

  if (existingUser) {
    console.log('👤 Usuario demo ya existe, saltando creación...');
    userId = existingUser.id;
  } else {
    const passwordHash = await hashPassword(TEST_PASSWORD);

    const [user] = await db
      .insert(schema.users)
      .values({
        name: TEST_NAME,
        email: TEST_EMAIL,
        emailVerified: true,
        passwordHash,
      })
      .returning();

    userId = user.id;

    // Create Better-Auth account entry (password stored here too)
    await db.insert(schema.accounts).values({
      id: crypto.randomUUID(),
      userId,
      providerId: 'credential',
      accountId: userId,
      password: passwordHash,
    });

    console.log(`✅ Usuario creado: ${TEST_EMAIL} / ${TEST_PASSWORD}`);
  }

  // 2. Create or find shop
  let shop = await db.query.shops.findFirst({
    where: eq(schema.shops.ownerId, userId),
  });

  if (!shop) {
    const [newShop] = await db
      .insert(schema.shops)
      .values({
        ownerId: userId,
        name: 'Barber Shop Demo',
        slug: 'barber-shop-demo',
        address: 'Av. Corrientes 1234, CABA',
        phone: '+5491123456789',
        monthlyGoal: 500_000_00,
      })
      .returning();

    shop = newShop;
    console.log(`🏪 Barbería creada: ${shop.name}`);
  } else {
    console.log('🏪 Barbería ya existe, saltando...');
  }

  // 3. Create subscription (trial)
  const existingSub = await db.query.subscriptions.findFirst({
    where: eq(schema.subscriptions.shopId, shop.id),
  });

  if (!existingSub) {
    const now = new Date();
    const trialEnd = new Date(now);
    trialEnd.setDate(trialEnd.getDate() + 14);

    await db.insert(schema.subscriptions).values({
      shopId: shop.id,
      plan: 'free',
      status: 'trialing',
      trialEndsAt: trialEnd,
      currentPeriodStart: now,
      currentPeriodEnd: trialEnd,
    });
    console.log('📋 Suscripción trial creada (14 días)');
  }

  // 4. Create professionals
  const existingPros = await db.query.professionals.findMany({
    where: eq(schema.professionals.shopId, shop.id),
  });

  const proIds: string[] = existingPros.map((p) => p.id);

  if (existingPros.length === 0) {
    const pros = [
      { name: TEST_NAME, commissionRate: 0, colorIndex: 0, isOwner: true },
      {
        name: 'Carlos Pérez',
        commissionRate: 40,
        colorIndex: 1,
        isOwner: false,
      },
      {
        name: 'Martín López',
        commissionRate: 35,
        colorIndex: 2,
        isOwner: false,
      },
    ];

    for (const pro of pros) {
      const [created] = await db
        .insert(schema.professionals)
        .values({
          shopId: shop.id,
          userId: pro.isOwner ? userId : null,
          name: pro.name,
          commissionRate: pro.commissionRate,
          colorIndex: pro.colorIndex,
          isActive: true,
          isOwner: pro.isOwner,
        })
        .returning();
      proIds.push(created.id);
    }
    console.log(`👥 ${pros.length} profesionales creados`);
  } else {
    console.log(`👥 Profesionales ya existen (${existingPros.length})`);
  }

  // 5. Create services
  const existingServices = await db.query.services.findMany({
    where: eq(schema.services.shopId, shop.id),
  });

  const serviceData: { id: string; name: string; price: number }[] =
    existingServices.map((s) => ({ id: s.id, name: s.name, price: s.price }));

  if (existingServices.length === 0) {
    const services = [
      { name: 'Corte clásico', price: 8_000_00, duration: 30 },
      { name: 'Corte + Barba', price: 12_000_00, duration: 45 },
      { name: 'Barba', price: 5_000_00, duration: 20 },
      { name: 'Corte Fade', price: 10_000_00, duration: 40 },
      { name: 'Alisado', price: 15_000_00, duration: 60 },
    ];

    for (const svc of services) {
      const [created] = await db
        .insert(schema.services)
        .values({
          shopId: shop.id,
          name: svc.name,
          price: svc.price,
          duration: svc.duration,
          isActive: true,
        })
        .returning();
      serviceData.push({ id: created.id, name: svc.name, price: svc.price });
    }
    console.log(`✂️ ${services.length} servicios creados`);
  } else {
    console.log(`✂️ Servicios ya existen (${existingServices.length})`);
  }

  // 6. Create sample sales (last 7 days)
  const existingSales = await db.query.sales.findMany({
    where: eq(schema.sales.shopId, shop.id),
    limit: 1,
  });

  if (
    existingSales.length === 0 &&
    proIds.length > 0 &&
    serviceData.length > 0
  ) {
    const paymentMethods = [
      'cash',
      'transfer',
      'mercadopago',
      'debit',
      'credit',
    ] as const;
    let totalSales = 0;

    for (let daysAgo = 6; daysAgo >= 0; daysAgo--) {
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      const dateStr = date.toLocaleDateString('en-CA', {
        timeZone: 'America/Argentina/Buenos_Aires',
      });

      const salesPerDay = Math.floor(Math.random() * 6) + 3;

      for (let j = 0; j < salesPerDay; j++) {
        const proIdx = Math.floor(Math.random() * proIds.length);
        const svcIdx = Math.floor(Math.random() * serviceData.length);
        const pro = proIds[proIdx];
        const svc = serviceData[svcIdx];
        const pm =
          paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

        if (!pro || !svc || !pm) continue;

        const commRate = proIdx === 0 ? 0 : proIdx === 1 ? 40 : 35;
        const commAmount = Math.round((svc.price * commRate) / 100);
        const ownerAmount = svc.price - commAmount;
        const hour = 9 + Math.floor(Math.random() * 10);
        const minute = Math.floor(Math.random() * 60);

        await db.insert(schema.sales).values({
          shopId: shop.id,
          professionalId: pro,
          serviceId: svc.id,
          serviceName: svc.name,
          servicePrice: svc.price,
          commissionRate: commRate,
          commissionAmount: commAmount,
          ownerAmount: ownerAmount,
          tipAmount:
            Math.random() > 0.7 ? Math.floor(Math.random() * 3) * 500_00 : 0,
          paymentMethod: pm,
          saleDate: dateStr,
          saleTime: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`,
        });
        totalSales++;
      }
    }
    console.log(`💰 ${totalSales} ventas de ejemplo creadas (últimos 7 días)`);
  } else if (existingSales.length > 0) {
    console.log('💰 Ventas ya existen, saltando...');
  }

  console.log('\n🎉 ¡Seed completado!');
  console.log('─'.repeat(40));
  console.log(`📧 Email:    ${TEST_EMAIL}`);
  console.log(`🔑 Password: ${TEST_PASSWORD}`);
  console.log('─'.repeat(40));
}

seed().catch((err) => {
  console.error('❌ Error en seed:', err);
  process.exit(1);
});
