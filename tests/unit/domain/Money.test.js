import { describe, it, expect } from 'vitest';
import { Money } from '../../../src/domain/valueObjects/Money.js';

describe('Money', () => {
  describe('constructor', () => {
    it('should create money with valid amount and currency', () => {
      const money = new Money(100, 'EUR');
      expect(money.amount).toBe(100);
      expect(money.currency).toBe('EUR');
    });

    it('should default to EUR currency', () => {
      const money = new Money(50);
      expect(money.currency).toBe('EUR');
    });

    it('should round amount to 2 decimals', () => {
      const money = new Money(10.999);
      expect(money.amount).toBe(11);
    });

    it('should accept zero amount', () => {
      const money = new Money(0);
      expect(money.amount).toBe(0);
    });

    it('should throw error for negative amount', () => {
      expect(() => new Money(-10)).toThrow('Amount must be a positive number');
    });

    it('should throw error for non-number amount', () => {
      expect(() => new Money('100')).toThrow('Amount must be a positive number');
    });

    it('should throw error for invalid currency', () => {
      expect(() => new Money(100, 'EURO')).toThrow('Currency must be a 3-letter code');
    });

    it('should throw error for non-string currency', () => {
      expect(() => new Money(100, 123)).toThrow('Currency must be a 3-letter code');
    });

    it('should throw error for array currency even with length 3', () => {
      expect(() => new Money(100, ['A', 'B', 'C'])).toThrow('Currency must be a 3-letter code');
    });
  });

  describe('add', () => {
    it('should add money with same currency', () => {
      const money1 = new Money(100, 'EUR');
      const money2 = new Money(50, 'EUR');
      const result = money1.add(money2);

      expect(result.amount).toBe(150);
      expect(result.currency).toBe('EUR');
    });

    it('should throw error when adding different currencies', () => {
      const money1 = new Money(100, 'EUR');
      const money2 = new Money(50, 'USD');

      expect(() => money1.add(money2)).toThrow('Cannot add money with different currencies');
    });
  });

  describe('multiply', () => {
    it('should multiply money by factor', () => {
      const money = new Money(10, 'EUR');
      const result = money.multiply(3);

      expect(result.amount).toBe(30);
      expect(result.currency).toBe('EUR');
    });

    it('should handle decimal factors', () => {
      const money = new Money(10, 'EUR');
      const result = money.multiply(1.5);

      expect(result.amount).toBe(15);
    });

    it('should multiply by zero', () => {
      const money = new Money(10, 'EUR');
      const result = money.multiply(0);

      expect(result.amount).toBe(0);
    });

    it('should throw error for negative factor', () => {
      const money = new Money(10, 'EUR');
      expect(() => money.multiply(-2)).toThrow('Factor must be a positive number');
    });

    it('should throw error for non-number factor', () => {
      const money = new Money(10, 'EUR');
      expect(() => money.multiply('2')).toThrow('Factor must be a positive number');
    });
  });

  describe('equals', () => {
    it('should return true for equal money', () => {
      const money1 = new Money(100, 'EUR');
      const money2 = new Money(100, 'EUR');

      expect(money1.equals(money2)).toBe(true);
    });

    it('should return false for different amounts', () => {
      const money1 = new Money(100, 'EUR');
      const money2 = new Money(50, 'EUR');

      expect(money1.equals(money2)).toBe(false);
    });

    it('should return false for different currencies', () => {
      const money1 = new Money(100, 'EUR');
      const money2 = new Money(100, 'USD');

      expect(money1.equals(money2)).toBe(false);
    });
  });

  describe('toJSON', () => {
    it('should serialize to JSON', () => {
      const money = new Money(100, 'EUR');
      const json = money.toJSON();

      expect(json).toEqual({ amount: 100, currency: 'EUR' });
    });
  });
});
