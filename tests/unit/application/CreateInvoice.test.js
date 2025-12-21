import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CreateInvoice } from '../../../src/application/usecases/CreateInvoice.js';
import { Client } from '../../../src/domain/entities/Client.js';

describe('CreateInvoice', () => {
  let invoiceRepository;
  let clientRepository;
  let useCase;

  beforeEach(() => {
    let idCounter = 0;
    invoiceRepository = {
      save: vi.fn(),
      getNextInvoiceNumber: vi.fn(),
      getNextId: vi.fn(() => `invoice-${++idCounter}`)
    };

    clientRepository = {
      findById: vi.fn()
    };

    useCase = new CreateInvoice(invoiceRepository, clientRepository);
  });

  it('should create invoice with valid data', async () => {
    const client = new Client({
      id: 'client-1',
      name: 'Test Company',
      email: 'test@company.com',
      address: '123 Street'
    });

    clientRepository.findById.mockResolvedValue(client);
    invoiceRepository.getNextInvoiceNumber.mockResolvedValue('INV-2025-001');
    invoiceRepository.save.mockImplementation(invoice => Promise.resolve(invoice));

    const result = await useCase.execute({
      clientId: 'client-1',
      lines: [
        {
          description: 'Service',
          quantity: 2,
          unitPrice: 100,
          vatRate: 20
        }
      ]
    });

    expect(result.number).toBe('INV-2025-001');
    expect(result.clientId).toBe('client-1');
    expect(result.lines).toHaveLength(1);
    expect(result.totalExcludingTax).toBe(200);
    expect(result.totalVat).toBe(40);
    expect(result.totalIncludingTax).toBe(240);
    expect(invoiceRepository.save).toHaveBeenCalledWith(result);
  });

  it('should throw error if client not found', async () => {
    clientRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        clientId: 'unknown',
        lines: [{ description: 'Test', quantity: 1, unitPrice: 100, vatRate: 20 }]
      })
    ).rejects.toThrow('Client not found');
  });

  it('should calculate totals correctly for multiple lines', async () => {
    const client = new Client({
      id: 'client-1',
      name: 'Test Company',
      email: 'test@company.com',
      address: '123 Street'
    });

    clientRepository.findById.mockResolvedValue(client);
    invoiceRepository.getNextInvoiceNumber.mockResolvedValue('INV-2025-001');
    invoiceRepository.save.mockImplementation(invoice => Promise.resolve(invoice));

    const result = await useCase.execute({
      clientId: 'client-1',
      lines: [
        { description: 'Service 1', quantity: 2, unitPrice: 100, vatRate: 20 },
        { description: 'Service 2', quantity: 1, unitPrice: 50, vatRate: 10 }
      ]
    });

    expect(result.totalExcludingTax).toBe(250);
    expect(result.totalVat).toBe(45);
    expect(result.totalIncludingTax).toBe(295);
  });
});
