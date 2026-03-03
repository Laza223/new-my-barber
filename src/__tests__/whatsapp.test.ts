/**
 * Unit tests for WhatsApp summary builder.
 */
import {
  buildDailySummaryWhatsApp,
  buildWeeklySummaryWhatsApp,
  buildWhatsAppUrl,
} from '@/server/lib/whatsapp';
import { describe, expect, it } from 'vitest';

describe('buildDailySummaryWhatsApp', () => {
  it('builds a formatted daily summary', () => {
    const text = buildDailySummaryWhatsApp({
      shopName: 'Barber Shop',
      date: 'Lunes 13 de enero',
      revenue: 500_000,
      salesCount: 10,
      averageTicket: 50_000,
      topService: { name: 'Corte', count: 7 },
      topProfessional: { name: 'Carlos', revenue: 300_000 },
    });

    expect(text).toContain('Barber Shop');
    expect(text).toContain('Facturado');
    expect(text).toContain('Servicio top');
    expect(text).toContain('Carlos');
  });

  it('handles missing top data', () => {
    const text = buildDailySummaryWhatsApp({
      shopName: 'Test',
      date: 'Hoy',
      revenue: 0,
      salesCount: 0,
      averageTicket: 0,
      topService: null,
      topProfessional: null,
    });

    expect(text).not.toContain('Servicio top');
    expect(text).toContain('Test');
  });
});

describe('buildWeeklySummaryWhatsApp', () => {
  it('builds a formatted weekly summary', () => {
    const text = buildWeeklySummaryWhatsApp({
      shopName: 'Test',
      dateRange: '6-12 Enero',
      revenue: 1_000_000,
      salesCount: 30,
      comparedToLastWeek: 15,
      bestDay: { date: 'Viernes', revenue: 200_000 },
    });

    expect(text).toContain('semanal');
    expect(text).toContain('+15%');
    expect(text).toContain('Viernes');
  });
});

describe('buildWhatsAppUrl', () => {
  it('builds url without phone', () => {
    const url = buildWhatsAppUrl('Hola mundo');
    expect(url).toBe('https://wa.me/?text=Hola%20mundo');
  });

  it('builds url with phone', () => {
    const url = buildWhatsAppUrl('Test', '+5491123456789');
    expect(url).toContain('wa.me/5491123456789');
  });
});
