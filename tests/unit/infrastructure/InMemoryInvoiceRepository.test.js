import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryInvoiceRepository } from '../../../src/infrastructure/repositories/InMemoryInvoiceRepository.js';
import { Invoice, InvoiceStatus } from '../../../src/domain/entities/Invoice.js';

describe('InMemoryInvoiceRepository', () => {
  let repository;

  beforeEach(() => {
    repository = new InMemoryInvoiceRepository();
  });

  describe('save and findById', () => {
    it('should save and retrieve invoice', async () => {
      const invoice = new Invoice({
        id: '123',
        number: 'INV-2025-001',
        clientId: 'client-1',
        lines: [{ description: 'Test', quantity: 1, unitPrice: 100, vatRate: 20 }]
      });

      await repository.save(invoice);
      const retrieved = await repository.findById('123');

      expect(retrieved).toBe(invoice);
      expect(retrieved.id).toBe('123');
    });

    it('should return null for non-existent invoice', async () => {
      const result = await repository.findById('unknown');
      expect(result).toBeNull();
    });

    it('should update existing invoice', async () => {
      const invoice = new Invoice({
        id: '123',
        number: 'INV-2025-001',
        clientId: 'client-1',
        lines: [{ description: 'Test', quantity: 1, unitPrice: 100, vatRate: 20 }]
      });

      await repository.save(invoice);
      invoice.markAsPaid();
      await repository.save(invoice);

      const retrieved = await repository.findById('123');
      expect(retrieved.status).toBe(InvoiceStatus.PAID);
    });
  });

  describe('findAll', () => {
    it('should return all invoices', async () => {
      const invoice1 = new Invoice({
        id: '1',
        number: 'INV-2025-001',
        clientId: 'client-1',
        lines: [{ description: 'Test', quantity: 1, unitPrice: 100, vatRate: 20 }]
      });

      const invoice2 = new Invoice({
        id: '2',
        number: 'INV-2025-002',
        clientId: 'client-2',
        lines: [{ description: 'Test', quantity: 1, unitPrice: 200, vatRate: 20 }]
      });

      await repository.save(invoice1);
      await repository.save(invoice2);

      const all = await repository.findAll();
      expect(all).toHaveLength(2);
    });

    it('should return empty array when no invoices', async () => {
      const all = await repository.findAll();
      expect(all).toEqual([]);
    });
  });

  describe('findByFilters', () => {
    beforeEach(async () => {
      const invoice1 = new Invoice({
        id: '1',
        number: 'INV-2025-001',
        date: '2025-01-15T00:00:00.000Z',
        clientId: 'client-1',
        lines: [{ description: 'Test', quantity: 1, unitPrice: 100, vatRate: 20 }],
        status: InvoiceStatus.DRAFT
      });

      const invoice2 = new Invoice({
        id: '2',
        number: 'INV-2025-002',
        date: '2025-02-15T00:00:00.000Z',
        clientId: 'client-2',
        lines: [{ description: 'Test', quantity: 1, unitPrice: 200, vatRate: 20 }],
        status: InvoiceStatus.PAID
      });

      const invoice3 = new Invoice({
        id: '3',
        number: 'INV-2025-003',
        date: '2025-03-15T00:00:00.000Z',
        clientId: 'client-1',
        lines: [{ description: 'Test', quantity: 1, unitPrice: 300, vatRate: 20 }],
        status: InvoiceStatus.PAID
      });

      await repository.save(invoice1);
      await repository.save(invoice2);
      await repository.save(invoice3);
    });

    it('should filter by status', async () => {
      const paid = await repository.findByFilters({ status: InvoiceStatus.PAID });
      expect(paid).toHaveLength(2);
      expect(paid.every(inv => inv.status === InvoiceStatus.PAID)).toBe(true);
    });

    it('should filter by clientId', async () => {
      const client1Invoices = await repository.findByFilters({ clientId: 'client-1' });
      expect(client1Invoices).toHaveLength(2);
      expect(client1Invoices.every(inv => inv.clientId === 'client-1')).toBe(true);
    });

    it('should filter by startDate', async () => {
      const filtered = await repository.findByFilters({ startDate: '2025-02-01' });
      expect(filtered).toHaveLength(2);
    });

    it('should include invoice on exact startDate boundary', async () => {
      const filtered = await repository.findByFilters({ startDate: '2025-02-15T00:00:00.000Z' });
      expect(filtered).toHaveLength(2);
      expect(filtered.some(inv => inv.id === '2')).toBe(true);
    });

    it('should filter by endDate', async () => {
      const filtered = await repository.findByFilters({ endDate: '2025-02-28' });
      expect(filtered).toHaveLength(2);
    });

    it('should include invoice on exact endDate boundary', async () => {
      const filtered = await repository.findByFilters({ endDate: '2025-02-15T00:00:00.000Z' });
      expect(filtered).toHaveLength(2);
      expect(filtered.some(inv => inv.id === '2')).toBe(true);
    });

    it('should filter by date range', async () => {
      const filtered = await repository.findByFilters({
        startDate: '2025-02-01',
        endDate: '2025-02-28'
      });
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('2');
    });

    it('should combine multiple filters', async () => {
      const filtered = await repository.findByFilters({
        status: InvoiceStatus.PAID,
        clientId: 'client-1'
      });
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('3');
    });

    it('should return all when no filters', async () => {
      const all = await repository.findByFilters({});
      expect(all).toHaveLength(3);
    });
  });

  describe('getNextId', () => {
    it('should generate sequential IDs', () => {
      const id1 = repository.getNextId();
      const id2 = repository.getNextId();
      const id3 = repository.getNextId();

      expect(id1).toBe('invoice-1');
      expect(id2).toBe('invoice-2');
      expect(id3).toBe('invoice-3');
    });
  });

  describe('getNextInvoiceNumber', () => {
    it('should generate first invoice number for year', async () => {
      const number = await repository.getNextInvoiceNumber(2025);
      expect(number).toBe('INV-2025-001');
    });

    it('should increment invoice number for same year', async () => {
      const number1 = await repository.getNextInvoiceNumber(2025);
      const number2 = await repository.getNextInvoiceNumber(2025);
      const number3 = await repository.getNextInvoiceNumber(2025);

      expect(number1).toBe('INV-2025-001');
      expect(number2).toBe('INV-2025-002');
      expect(number3).toBe('INV-2025-003');
    });

    it('should handle different years independently', async () => {
      const number2024 = await repository.getNextInvoiceNumber(2024);
      const number2025 = await repository.getNextInvoiceNumber(2025);

      expect(number2024).toBe('INV-2024-001');
      expect(number2025).toBe('INV-2025-001');
    });

    it('should pad numbers with zeros', async () => {
      for (let i = 0; i < 10; i++) {
        await repository.getNextInvoiceNumber(2025);
      }
      const number = await repository.getNextInvoiceNumber(2025);
      expect(number).toBe('INV-2025-011');
    });
  });

  describe('clear', () => {
    it('should clear all invoices', async () => {
      const invoice = new Invoice({
        id: '123',
        number: 'INV-2025-001',
        clientId: 'client-1',
        lines: [{ description: 'Test', quantity: 1, unitPrice: 100, vatRate: 20 }]
      });

      await repository.save(invoice);
      repository.clear();

      const all = await repository.findAll();
      expect(all).toHaveLength(0);
    });

    it('should reset invoice counters', async () => {
      await repository.getNextInvoiceNumber(2025);
      await repository.getNextInvoiceNumber(2025);
      repository.clear();

      const number = await repository.getNextInvoiceNumber(2025);
      expect(number).toBe('INV-2025-001');
    });
  });
});
