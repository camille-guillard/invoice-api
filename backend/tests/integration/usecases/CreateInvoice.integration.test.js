import { describe, it, expect, beforeEach } from 'vitest';
import { CreateInvoice } from '../../../src/application/usecases/CreateInvoice.js';
import { InMemoryInvoiceRepository } from '../../../src/infrastructure/repositories/InMemoryInvoiceRepository.js';
import { InMemoryClientRepository } from '../../../src/infrastructure/repositories/InMemoryClientRepository.js';
import { Client } from '../../../src/domain/entities/Client.js';

describe('CreateInvoice Integration', () => {
  let createInvoice;
  let invoiceRepository;
  let clientRepository;

  beforeEach(() => {
    invoiceRepository = new InMemoryInvoiceRepository();
    clientRepository = new InMemoryClientRepository();
    createInvoice = new CreateInvoice(invoiceRepository, clientRepository);
  });

  it('should create invoice and persist it to repository', async () => {
    const client = new Client({
      id: 'client-1',
      name: 'Test Client',
      email: 'test@example.com',
      address: '123 Test St'
    });
    await clientRepository.save(client);

    const invoice = await createInvoice.execute({
      clientId: 'client-1',
      lines: [
        { description: 'Service 1', quantity: 2, unitPrice: 100, vatRate: 20 }
      ]
    });

    const saved = await invoiceRepository.findById(invoice.id);

    expect(saved).toBeDefined();
    expect(saved.id).toBe(invoice.id);
    expect(saved.clientId).toBe('client-1');
    expect(saved.lines).toHaveLength(1);
  });

  it('should calculate totals correctly when saving', async () => {
    const client = new Client({
      id: 'client-1',
      name: 'Test Client',
      email: 'test@example.com',
      address: '123 Test St'
    });
    await clientRepository.save(client);

    const invoice = await createInvoice.execute({
      clientId: 'client-1',
      lines: [
        { description: 'Service 1', quantity: 2, unitPrice: 100, vatRate: 20 },
        { description: 'Service 2', quantity: 1, unitPrice: 50, vatRate: 10 }
      ]
    });

    const saved = await invoiceRepository.findById(invoice.id);

    expect(saved.totalExcludingTax).toBe(250);
    expect(saved.totalVat).toBe(45);
    expect(saved.totalIncludingTax).toBe(295);
  });

  it('should throw error when client does not exist', async () => {
    await expect(createInvoice.execute({
      clientId: 'non-existent',
      lines: [{ description: 'Service', quantity: 1, unitPrice: 100, vatRate: 20 }]
    })).rejects.toThrow('Client not found');
  });

  it('should generate invoice number using repository', async () => {
    const client = new Client({
      id: 'client-1',
      name: 'Test Client',
      email: 'test@example.com',
      address: '123 Test St'
    });
    await clientRepository.save(client);

    const invoice1 = await createInvoice.execute({
      clientId: 'client-1',
      lines: [{ description: 'Service', quantity: 1, unitPrice: 100, vatRate: 20 }]
    });

    const invoice2 = await createInvoice.execute({
      clientId: 'client-1',
      lines: [{ description: 'Service', quantity: 1, unitPrice: 100, vatRate: 20 }]
    });

    expect(invoice1.number).toMatch(/^INV-\d{4}-001$/);
    expect(invoice2.number).toMatch(/^INV-\d{4}-002$/);
  });
});
