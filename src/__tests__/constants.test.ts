/**
 * Unit tests for constants.
 */
import { APP_CONFIG, PAYMENT_METHODS, PLANS } from '@/lib/constants';
import { describe, expect, it } from 'vitest';

describe('PLANS', () => {
  it('has 3 plans', () => {
    expect(Object.keys(PLANS)).toHaveLength(3);
    expect(PLANS.FREE).toBeDefined();
    expect(PLANS.INDIVIDUAL).toBeDefined();
    expect(PLANS.BUSINESS).toBeDefined();
  });

  it('FREE plan has correct limits', () => {
    expect(PLANS.FREE.priceCents).toBe(0);
    expect(PLANS.FREE.limits.maxProfessionals).toBe(1);
    expect(PLANS.FREE.limits.maxServices).toBe(3);
    expect(PLANS.FREE.limits.maxSalesPerDay).toBe(10);
  });

  it('BUSINESS plan has highest limits', () => {
    expect(PLANS.BUSINESS.limits.maxProfessionals).toBe(10);
    expect(PLANS.BUSINESS.limits.hasInsights).toBe(true);
    expect(PLANS.BUSINESS.limits.hasWhatsapp).toBe(true);
  });

  it('prices are in correct order', () => {
    expect(PLANS.FREE.priceCents).toBe(0);
    expect(PLANS.INDIVIDUAL.priceCents).toBeGreaterThan(0);
    expect(PLANS.BUSINESS.priceCents).toBeGreaterThan(
      PLANS.INDIVIDUAL.priceCents,
    );
  });
});

describe('PAYMENT_METHODS', () => {
  it('has 5 methods', () => {
    expect(PAYMENT_METHODS).toHaveLength(5);
  });

  it('includes required methods', () => {
    const ids = PAYMENT_METHODS.map((m) => m.id);
    expect(ids).toContain('cash');
    expect(ids).toContain('transfer');
    expect(ids).toContain('mercadopago');
  });
});

describe('APP_CONFIG', () => {
  it('has trial days', () => {
    expect(APP_CONFIG.trialDays).toBe(14);
  });
});
