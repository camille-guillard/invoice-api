import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GetRevenue } from '../../../src/application/usecases/GetRevenue.js';
import { Invoice, InvoiceStatus } from '../../../src/domain/entities/Invoice.js';

describe('GetRevenue', () => {
  let invoiceRepository;
  let useCase;

  beforeEach(() => {
    invoiceRepository = {
      findByFilters: vi.fn()
    };

    useCase = new GetRevenue(invoiceRepository);
  });

  it('should calculate revenue for paid invoices in period', async () => {
    const invoice1 = new Invoice({
      id: '1',
      number: 'INV-2025-001',
      clientId: 'client-1',
      lines: [{ description: 'Test', quantity: 1, unitPrice: 100, vatRate: 20 }],
      status: InvoiceStatus.PAID,
      totalIncludingTax: 120
    });

    const invoice2 = new Invoice({
      id: '2',
      number: 'INV-2025-002',
      clientId: 'client-1',
      lines: [{ description: 'Test', quantity: 1, unitPrice: 200, vatRate: 20 }],
      status: InvoiceStatus.PAID,
      totalIncludingTax: 240
    });

    invoiceRepository.findByFilters.mockResolvedValue([invoice1, invoice2]);

    const result = await useCase.execute({
      startDate: '2025-01-01',
      endDate: '2025-12-31'
    });

    expect(result.totalRevenue).toBe(360);
    expect(result.invoiceCount).toBe(2);
    expect(result.startDate).toBe('2025-01-01');
    expect(result.endDate).toBe('2025-12-31');
  });

  it('should return zero revenue when no invoices', async () => {
    invoiceRepository.findByFilters.mockResolvedValue([]);

    const result = await useCase.execute({
      startDate: '2025-01-01',
      endDate: '2025-12-31'
    });

    expect(result.totalRevenue).toBe(0);
    expect(result.invoiceCount).toBe(0);
  });

  it('should throw error without startDate', async () => {
    await expect(
      useCase.execute({ endDate: '2025-12-31' })
    ).rejects.toThrow('Start date and end date are required');
  });

  it('should throw error without endDate', async () => {
    await expect(
      useCase.execute({ startDate: '2025-01-01' })
    ).rejects.toThrow('Start date and end date are required');
  });

  it('should call repository with correct filters', async () => {
    invoiceRepository.findByFilters.mockResolvedValue([]);

    await useCase.execute({
      startDate: '2025-01-01',
      endDate: '2025-12-31'
    });

    expect(invoiceRepository.findByFilters).toHaveBeenCalledWith({
      status: InvoiceStatus.PAID,
      startDate: '2025-01-01',
      endDate: '2025-12-31'
    });
  });
});
