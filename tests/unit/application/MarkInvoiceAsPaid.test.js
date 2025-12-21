import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MarkInvoiceAsPaid } from '../../../src/application/usecases/MarkInvoiceAsPaid.js';
import { Invoice, InvoiceStatus } from '../../../src/domain/entities/Invoice.js';

describe('MarkInvoiceAsPaid', () => {
  let invoiceRepository;
  let useCase;

  beforeEach(() => {
    invoiceRepository = {
      findById: vi.fn(),
      save: vi.fn()
    };

    useCase = new MarkInvoiceAsPaid(invoiceRepository);
  });

  it('should mark draft invoice as paid', async () => {
    const invoice = new Invoice({
      id: '123',
      number: 'INV-2025-001',
      clientId: 'client-1',
      lines: [{ description: 'Test', quantity: 1, unitPrice: 100, vatRate: 20 }],
      status: InvoiceStatus.DRAFT
    });

    invoiceRepository.findById.mockResolvedValue(invoice);
    invoiceRepository.save.mockImplementation(inv => Promise.resolve(inv));

    const result = await useCase.execute('123');

    expect(result.status).toBe(InvoiceStatus.PAID);
    expect(invoiceRepository.save).toHaveBeenCalledWith(invoice);
  });

  it('should throw error if invoice not found', async () => {
    invoiceRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('unknown')).rejects.toThrow('Invoice not found');
  });

  it('should throw error if invoice already paid', async () => {
    const invoice = new Invoice({
      id: '123',
      number: 'INV-2025-001',
      clientId: 'client-1',
      lines: [{ description: 'Test', quantity: 1, unitPrice: 100, vatRate: 20 }],
      status: InvoiceStatus.PAID
    });

    invoiceRepository.findById.mockResolvedValue(invoice);

    await expect(useCase.execute('123')).rejects.toThrow('Invoice is already paid');
  });
});
