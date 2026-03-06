/**
 * Seed de desarrollo para My Barber.
 *
 * Ejecutar con: pnpm tsx src/db/seed.ts
 *
 * Crea:
 * - 1 owner (test@mybarber.com / password123)
 * - 1 barbería "BarberKing"
 * - 3 profesionales (owner + 2 empleados)
 * - 5 servicios con precios argentinos reales
 * - 50 ventas repartidas en 30 días (más viernes y sábados)
 * - 1 suscripción trial activa
 *
 * ⚠️ Solo para dev. Nunca correr en producción.
 */
import { neon } from '@neondatabase/serverless';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

async function seed() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL no definida. Configurala en .env.local');
  }

  const client = neon(process.env.DATABASE_URL);
  const db = drizzle(client, { schema });

  console.log('🌱 Iniciando seed...\n');

  // ── 1. Limpiar tablas (orden por FK) ──
  console.log('🗑️  Limpiando tablas...');
  await db.execute(
    sql`TRUNCATE payment_history, sales, services, professionals, subscriptions, shops, verifications, accounts, sessions, users CASCADE`,
  );

  // ── 2. Crear owner ──
  console.log('👤 Creando owner...');
  const [owner] = await db
    .insert(schema.users)
    .values({
      email: 'test@mybarber.com',
      emailVerified: true,
      // bcrypt hash de "password123" (10 rounds)
      passwordHash:
        '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu9mu',
      name: 'Lázaro Owner',
      phone: '+5491155001234',
      role: 'owner',
    })
    .returning();

  if (!owner) throw new Error('Failed to create owner');

  console.log(`   ✓ Owner: ${owner.email} (${owner.id})`);

  // ── 3. Crear barbería ──
  console.log('💈 Creando barbería...');
  const [shop] = await db
    .insert(schema.shops)
    .values({
      ownerId: owner.id,
      name: 'BarberKing',
      slug: 'barberking',
      address: 'Av. Corrientes 1234, CABA',
      phone: '+5491155001234',
      monthlyGoal: 200000000, // $2.000.000 en centavos
      dailySalesLimit: 10,
      summaryHour: 22,
    })
    .returning();

  if (!shop) throw new Error('Failed to create shop');

  console.log(`   ✓ Barbería: ${shop.name} (${shop.id})`);

  // ── 4. Crear profesionales ──
  console.log('✂️  Creando profesionales...');

  // El owner también atiende (comisión 100% porque es su negocio)
  const [proOwner] = await db
    .insert(schema.professionals)
    .values({
      userId: owner.id,
      shopId: shop.id,
      name: 'Lázaro',
      phone: '+5491155001234',
      commissionRate: 100,
      colorIndex: 0,
      isOwner: true,
    })
    .returning();

  if (!proOwner) throw new Error('Failed to create proOwner');

  const [proCarlos] = await db
    .insert(schema.professionals)
    .values({
      shopId: shop.id,
      name: 'Carlos Gómez',
      phone: '+5491155005678',
      commissionRate: 45,
      colorIndex: 1,
    })
    .returning();

  if (!proCarlos) throw new Error('Failed to create proCarlos');

  const [proMartín] = await db
    .insert(schema.professionals)
    .values({
      shopId: shop.id,
      name: 'Martín López',
      phone: '+5491155009012',
      commissionRate: 40,
      colorIndex: 2,
    })
    .returning();

  if (!proMartín) throw new Error('Failed to create proMartín');

  const pros = [proOwner, proCarlos, proMartín];
  console.log(`   ✓ ${pros.length} profesionales creados`);

  // ── 5. Crear servicios ──
  console.log('📋 Creando servicios...');

  const serviceData = [
    { name: 'Corte', price: 800000, duration: 30, sortOrder: 0 }, // $8.000
    { name: 'Barba', price: 500000, duration: 20, sortOrder: 1 }, // $5.000
    { name: 'Corte + Barba', price: 1200000, duration: 45, sortOrder: 2 }, // $12.000
    { name: 'Tintura', price: 1500000, duration: 60, sortOrder: 3 }, // $15.000
    { name: 'Diseño de cejas', price: 300000, duration: 15, sortOrder: 4 }, // $3.000
  ];

  const servicesCreated = await db
    .insert(schema.services)
    .values(serviceData.map((s) => ({ ...s, shopId: shop.id })))
    .returning();

  console.log(`   ✓ ${servicesCreated.length} servicios creados`);

  // ── 6. Crear ventas (50, últimos 30 días) ──
  console.log('💰 Creando ventas...');

  const paymentMethods: (
    | 'cash'
    | 'transfer'
    | 'mercadopago'
    | 'debit'
    | 'credit'
  )[] = [
    'cash',
    'cash',
    'cash', // 30% efectivo (más común)
    'transfer',
    'transfer', // 20% transferencia
    'mercadopago', // 10% MP
    'debit',
    'debit', // 20% débito
    'credit', // 10% crédito
    'cash', // peso extra a efectivo
  ];

  const salesData = [];
  const now = new Date();

  for (let i = 0; i < 50; i++) {
    // Distribución de días (más viernes=5 y sábados=6)
    let daysAgo: number;
    const rand = Math.random();
    if (rand < 0.35) {
      // 35% viernes/sábado (últimos 30 días)
      const targetDay = rand < 0.175 ? 5 : 6; // viernes o sábado
      daysAgo = findDayAgo(now, targetDay, 30);
    } else {
      // 65% días aleatorios
      daysAgo = Math.floor(Math.random() * 30);
    }

    const saleDate = new Date(now);
    saleDate.setDate(saleDate.getDate() - daysAgo);

    const randomHour = 9 + Math.floor(Math.random() * 11); // 9:00 - 19:59
    const randomMin = Math.floor(Math.random() * 60);

    const proIdx = Math.floor(Math.random() * pros.length);
    const svcIdx = Math.floor(Math.random() * servicesCreated.length);
    const pmIdx = Math.floor(Math.random() * paymentMethods.length);
    const pro = pros[proIdx];
    const svc = servicesCreated[svcIdx];
    const pm = paymentMethods[pmIdx];
    if (!pro || !svc || !pm) continue;

    const commissionAmount = Math.round((svc.price * pro.commissionRate) / 100);

    salesData.push({
      shopId: shop.id,
      professionalId: pro.id,
      serviceId: svc.id,
      serviceName: svc.name,
      servicePrice: svc.price,
      commissionRate: pro.commissionRate,
      commissionAmount,
      ownerAmount: svc.price - commissionAmount,
      tipAmount:
        Math.random() < 0.2
          ? Math.round((Math.random() * 200000) / 100) * 100
          : 0,
      paymentMethod: pm,
      saleDate: formatDateYMD(saleDate),
      saleTime: `${String(randomHour).padStart(2, '0')}:${String(randomMin).padStart(2, '0')}:00`,
    });
  }

  await db.insert(schema.sales).values(salesData);
  console.log(`   ✓ ${salesData.length} ventas creadas`);

  // ── 7. Crear suscripción trial ──
  console.log('📦 Creando suscripción...');

  const trialEnd = new Date();
  trialEnd.setDate(trialEnd.getDate() + 14); // 14 días de trial

  await db.insert(schema.subscriptions).values({
    shopId: shop.id,
    plan: 'free',
    status: 'trialing',
    trialEndsAt: trialEnd,
    currentPeriodStart: now,
    currentPeriodEnd: trialEnd,
  });

  console.log('   ✓ Suscripción trial creada (14 días)\n');

  // ── Resumen ──
  console.log('═══════════════════════════════════════');
  console.log('✅ Seed completado!');
  console.log('');
  console.log('📧 Login: test@mybarber.com');
  console.log('🔑 Password: password123');
  console.log('💈 Barbería: BarberKing');
  console.log(`✂️  Profesionales: ${pros.length}`);
  console.log(`📋 Servicios: ${servicesCreated.length}`);
  console.log(`💰 Ventas: ${salesData.length}`);
  console.log('═══════════════════════════════════════');
}

// ── Helpers ──

/** Busca el día de la semana más cercano dentro de N días atrás */
function findDayAgo(from: Date, targetDay: number, maxDays: number): number {
  for (let d = 0; d < maxDays; d++) {
    const date = new Date(from);
    date.setDate(date.getDate() - d);
    if (date.getDay() === targetDay) return d;
  }
  return Math.floor(Math.random() * maxDays);
}

/** Formatea fecha como YYYY-MM-DD */
function formatDateYMD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// ── Run ──
seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Error en seed:', err);
    process.exit(1);
  });
