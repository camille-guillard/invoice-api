import { describe, it, expect } from 'vitest';
import { InvoiceCalculator } from '../../../src/domain/services/InvoiceCalculator.js';
import { Invoice } from '../../../src/domain/entities/Invoice.js';

describe('InvoiceCalculator', () => {
  const calculator = new InvoiceCalculator();

  describe('calculateLineTotal', () => {
    it('should calculate line total excluding tax', () => {
      const line = {
        quantity: 2,
        unitPrice: 100,
        vatRate: 20
      };

      const total = calculator.calculateLineTotal(line);
      expect(total).toBe(200);
    });

    it('should handle decimal quantities', () => {
      const line = {
        quantity: 2.5,
        unitPrice: 100,
        vatRate: 20
      };

      const total = calculator.calculateLineTotal(line);
      expect(total).toBe(250);
    });

    it('should round to 2 decimals', () => {
      const line = {
        quantity: 3,
        unitPrice: 10.33,
        vatRate: 20
      };

      const total = calculator.calculateLineTotal(line);
      expect(total).toBe(30.99);
    });
  });

  describe('calculateLineVat', () => {
    it('should calculate VAT at 20%', () => {
      const line = {
        quantity: 1,
        unitPrice: 100,
        vatRate: 20
      };

      const vat = calculator.calculateLineVat(line);
      expect(vat).toBe(20);
    });

    it('should calculate VAT at 5.5%', () => {
      const line = {
        quantity: 1,
        unitPrice: 100,
        vatRate: 5.5
      };

      const vat = calculator.calculateLineVat(line);
      expect(vat).toBe(5.5);
    });

    it('should calculate VAT at 0%', () => {
      const line = {
        quantity: 1,
        unitPrice: 100,
        vatRate: 0
      };

      const vat = calculator.calculateLineVat(line);
      expect(vat).toBe(0);
    });

    it('should round VAT to 2 decimals', () => {
      const line = {
        quantity: 3,
        unitPrice: 10.33,
        vatRate: 20
      };

      const vat = calculator.calculateLineVat(line);
      expect(vat).toBe(6.2);
    });
  });

  describe('calculateInvoiceTotals', () => {
    it('should calculate totals for single line invoice', () => {
      const invoice = new Invoice({
        id: '123',
        number: 'INV-2025-001',
        clientId: 'client-1',
        lines: [{
          description: 'Service',
          quantity: 2,
          unitPrice: 100,
          vatRate: 20
        }]
      });

      const totals = calculator.calculateInvoiceTotals(invoice);

      expect(totals.totalExcludingTax).toBe(200);
      expect(totals.totalVat).toBe(40);
      expect(totals.totalIncludingTax).toBe(240);
    });

    it('should calculate totals for multi-line invoice', () => {
      const invoice = new Invoice({
        id: '123',
        number: 'INV-2025-001',
        clientId: 'client-1',
        lines: [
          {
            description: 'Service 1',
            quantity: 2,
            unitPrice: 100,
            vatRate: 20
          },
          {
            description: 'Service 2',
            quantity: 1,
            unitPrice: 50,
            vatRate: 10
          }
        ]
      });

      const totals = calculator.calculateInvoiceTotals(invoice);

      expect(totals.totalExcludingTax).toBe(250); // 200 + 50
      expect(totals.totalVat).toBe(45); // 40 + 5
      expect(totals.totalIncludingTax).toBe(295); // 250 + 45
    });

    it('should handle mixed VAT rates', () => {
      const invoice = new Invoice({
        id: '123',
        number: 'INV-2025-001',
        clientId: 'client-1',
        lines: [
          {
            description: 'Product 1',
            quantity: 1,
            unitPrice: 100,
            vatRate: 20
          },
          {
            description: 'Product 2',
            quantity: 1,
            unitPrice: 100,
            vatRate: 5.5
          },
          {
            description: 'Product 3',
            quantity: 1,
            unitPrice: 100,
            vatRate: 0
          }
        ]
      });

      const totals = calculator.calculateInvoiceTotals(invoice);

      expect(totals.totalExcludingTax).toBe(300);
      expect(totals.totalVat).toBe(25.5); // 20 + 5.5 + 0
      expect(totals.totalIncludingTax).toBe(325.5);
    });

    it('should round totals to 2 decimals', () => {
      const invoice = new Invoice({
        id: '123',
        number: 'INV-2025-001',
        clientId: 'client-1',
        lines: [
          {
            description: 'Service',
            quantity: 3,
            unitPrice: 10.33,
            vatRate: 20
          }
        ]
      });

      const totals = calculator.calculateInvoiceTotals(invoice);

      expect(totals.totalExcludingTax).toBe(30.99);
      expect(totals.totalVat).toBe(6.2);
      expect(totals.totalIncludingTax).toBe(37.19);
    });
  });
});
