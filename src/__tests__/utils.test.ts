/**
 * Unit tests for utility functions.
 */
import {
  cn,
  formatCurrency,
  getInitials,
  parseCurrencyInput,
} from '@/lib/utils';
import { describe, expect, it } from 'vitest';

describe('formatCurrency', () => {
  it('formats cents to ARS', () => {
    expect(formatCurrency(100_000)).toBe('$1.000');
    expect(formatCurrency(0)).toBe('$0');
    expect(formatCurrency(50)).toBe('$1');
  });

  it('formats large amounts', () => {
    expect(formatCurrency(1_000_000_00)).toBe('$10.000.000');
  });
});

describe('parseCurrencyInput', () => {
  it('parses ARS formatted values', () => {
    expect(parseCurrencyInput('1234,56')).toBe(123456);
    expect(parseCurrencyInput('$1.234,56')).toBe(123456);
    expect(parseCurrencyInput('')).toBe(0);
  });

  it('handles plain numbers', () => {
    expect(parseCurrencyInput('1234')).toBe(123400);
  });

  it('handles invalid input', () => {
    expect(parseCurrencyInput('abc')).toBe(0);
  });
});

describe('getInitials', () => {
  it('returns up to 2 initials', () => {
    expect(getInitials('Lázaro Perez')).toBe('LP');
    expect(getInitials('Carlos')).toBe('C');
    expect(getInitials('Juan Pablo Lopez')).toBe('JP');
  });
});

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
  });
});
