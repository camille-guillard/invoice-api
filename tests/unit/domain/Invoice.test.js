import { describe, it, expect } from 'vitest';
import { Invoice, InvoiceStatus } from '../../../src/domain/entities/Invoice.js';
import { InvoiceLine } from '../../../src/domain/entities/InvoiceLine.js';

describe('Invoice', () => {
  const validLine = {
    description: 'Consulting service',
    quantity: 2,
    unitPrice: 100,
    vatRate: 20
  };

  describe('constructor', () => {
    it('should create invoice with valid data', () => {
      const invoice = new Invoice({
        id: '123',
        number: 'INV-2025-001',
        clientId: 'client-1',
        lines: [validLine]
      });

      expect(invoice.id).toBe('123');
      expect(invoice.number).toBe('INV-2025-001');
      expect(invoice.clientId).toBe('client-1');
      expect(invoice.lines).toHaveLength(1);
      expect(invoice.status).toBe(InvoiceStatus.DRAFT);
    });

    it('should set current date if not provided', () => {
      const invoice = new Invoice({
        id: '123',
        number: 'INV-2025-001',
        clientId: 'client-1',
        lines: [validLine]
      });

      expect(invoice.date).toBeDefined();
      expect(new Date(invoice.date)).toBeInstanceOf(Date);
    });

    it('should convert line objects to InvoiceLine instances', () => {
      const invoice = new Invoice({
        id: '123',
        number: 'INV-2025-001',
        clientId: 'client-1',
        lines: [validLine]
      });

      expect(invoice.lines[0]).toBeInstanceOf(InvoiceLine);
    });

    it('should throw error without clientId', () => {
      expect(() => new Invoice({
        id: '123',
        number: 'INV-2025-001',
        lines: [validLine]
      })).toThrow('Client ID is required');
    });

    it('should throw error with non-string clientId', () => {
      expect(() => new Invoice({
        id: '123',
        number: 'INV-2025-001',
        clientId: 123,
        lines: [validLine]
      })).toThrow('Client ID is required');
    });

    it('should throw error without lines', () => {
      expect(() => new Invoice({
        id: '123',
        number: 'INV-2025-001',
        clientId: 'client-1',
        lines: []
      })).toThrow('Invoice must have at least one line');
    });

    it('should throw error with non-array lines', () => {
      expect(() => new Invoice({
        id: '123',
        number: 'INV-2025-001',
        clientId: 'client-1',
        lines: 'not-an-array'
      })).toThrow('Invoice must have at least one line');
    });

    it('should keep InvoiceLine instances as is', () => {
      const lineInstance = new InvoiceLine(validLine);
      const invoice = new Invoice({
        id: '123',
        number: 'INV-2025-001',
        clientId: 'client-1',
        lines: [lineInstance]
      });

      expect(invoice.lines[0]).toBe(lineInstance);
    });
  });

  describe('markAsPaid', () => {
    it('should change status from DRAFT to PAID', () => {
      const invoice = new Invoice({
        id: '123',
        number: 'INV-2025-001',
        clientId: 'client-1',
        lines: [validLine]
      });

      invoice.markAsPaid();
      expect(invoice.status).toBe(InvoiceStatus.PAID);
    });

    it('should throw error if already paid', () => {
      const invoice = new Invoice({
        id: '123',
        number: 'INV-2025-001',
        clientId: 'client-1',
        lines: [validLine],
        status: InvoiceStatus.PAID
      });

      expect(() => invoice.markAsPaid()).toThrow('Invoice is already paid');
    });
  });

  describe('status checks', () => {
    it('should correctly identify draft invoice', () => {
      const invoice = new Invoice({
        id: '123',
        number: 'INV-2025-001',
        clientId: 'client-1',
        lines: [validLine]
      });

      expect(invoice.isDraft()).toBe(true);
      expect(invoice.isPaid()).toBe(false);
    });

    it('should correctly identify paid invoice', () => {
      const invoice = new Invoice({
        id: '123',
        number: 'INV-2025-001',
        clientId: 'client-1',
        lines: [validLine],
        status: InvoiceStatus.PAID
      });

      expect(invoice.isDraft()).toBe(false);
      expect(invoice.isPaid()).toBe(true);
    });
  });

  describe('setTotals', () => {
    it('should set invoice totals', () => {
      const invoice = new Invoice({
        id: '123',
        number: 'INV-2025-001',
        clientId: 'client-1',
        lines: [validLine]
      });

      invoice.setTotals(200, 40, 240);

      expect(invoice.totalExcludingTax).toBe(200);
      expect(invoice.totalVat).toBe(40);
      expect(invoice.totalIncludingTax).toBe(240);
    });
  });

  describe('toJSON', () => {
    it('should serialize invoice to JSON', () => {
      const invoice = new Invoice({
        id: '123',
        number: 'INV-2025-001',
        clientId: 'client-1',
        lines: [validLine],
        totalExcludingTax: 200,
        totalVat: 40,
        totalIncludingTax: 240
      });

      const json = invoice.toJSON();

      expect(json).toMatchObject({
        id: '123',
        number: 'INV-2025-001',
        clientId: 'client-1',
        status: InvoiceStatus.DRAFT,
        totalExcludingTax: 200,
        totalVat: 40,
        totalIncludingTax: 240
      });
      expect(json.lines).toHaveLength(1);
      expect(json.lines[0]).toHaveProperty('description', validLine.description);
      expect(json.lines[0]).toHaveProperty('quantity', validLine.quantity);
      expect(json.lines[0]).toHaveProperty('unitPrice', validLine.unitPrice);
      expect(json.lines[0]).toHaveProperty('vatRate', validLine.vatRate);
    });
  });
});
