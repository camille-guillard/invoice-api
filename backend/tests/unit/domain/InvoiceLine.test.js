import { describe, it, expect } from 'vitest';
import { InvoiceLine } from '../../../src/domain/entities/InvoiceLine.js';

describe('InvoiceLine', () => {
  describe('constructor', () => {
    it('should create invoice line with valid data', () => {
      const line = new InvoiceLine({
        description: 'Consulting service',
        quantity: 2,
        unitPrice: 100,
        vatRate: 20
      });

      expect(line.description).toBe('Consulting service');
      expect(line.quantity).toBe(2);
      expect(line.unitPrice).toBe(100);
      expect(line.vatRate).toBe(20);
    });

    it('should throw error without description', () => {
      expect(() => new InvoiceLine({
        quantity: 1,
        unitPrice: 100,
        vatRate: 20
      })).toThrow('Description is required and must be a string');
    });

    it('should throw error with non-string description', () => {
      expect(() => new InvoiceLine({
        description: 123,
        quantity: 1,
        unitPrice: 100,
        vatRate: 20
      })).toThrow('Description is required and must be a string');
    });

    it('should throw error with negative quantity', () => {
      expect(() => new InvoiceLine({
        description: 'Test',
        quantity: -1,
        unitPrice: 100,
        vatRate: 20
      })).toThrow('Quantity must be a positive number');
    });

    it('should throw error with zero quantity', () => {
      expect(() => new InvoiceLine({
        description: 'Test',
        quantity: 0,
        unitPrice: 100,
        vatRate: 20
      })).toThrow('Quantity must be a positive number');
    });

    it('should throw error with non-number quantity', () => {
      expect(() => new InvoiceLine({
        description: 'Test',
        quantity: '2',
        unitPrice: 100,
        vatRate: 20
      })).toThrow('Quantity must be a positive number');
    });

    it('should throw error with negative unit price', () => {
      expect(() => new InvoiceLine({
        description: 'Test',
        quantity: 1,
        unitPrice: -100,
        vatRate: 20
      })).toThrow('Unit price must be a positive number');
    });

    it('should throw error with zero unit price', () => {
      expect(() => new InvoiceLine({
        description: 'Test',
        quantity: 1,
        unitPrice: 0,
        vatRate: 20
      })).toThrow('Unit price must be a positive number');
    });

    it('should throw error with non-number unit price', () => {
      expect(() => new InvoiceLine({
        description: 'Test',
        quantity: 1,
        unitPrice: '100',
        vatRate: 20
      })).toThrow('Unit price must be a positive number');
    });

    it('should throw error with invalid VAT rate', () => {
      expect(() => new InvoiceLine({
        description: 'Test',
        quantity: 1,
        unitPrice: 100,
        vatRate: 15
      })).toThrow('VAT rate must be one of: 0, 5.5, 10, 20');
    });

    it('should accept all valid VAT rates', () => {
      const validRates = [0, 5.5, 10, 20];

      validRates.forEach(rate => {
        const line = new InvoiceLine({
          description: 'Test',
          quantity: 1,
          unitPrice: 100,
          vatRate: rate
        });
        expect(line.vatRate).toBe(rate);
      });
    });
  });

  describe('toJSON', () => {
    it('should serialize line to JSON', () => {
      const line = new InvoiceLine({
        description: 'Consulting service',
        quantity: 2,
        unitPrice: 100,
        vatRate: 20
      });

      const json = line.toJSON();

      expect(json).toEqual({
        description: 'Consulting service',
        quantity: 2,
        unitPrice: 100,
        vatRate: 20
      });
    });
  });
});
