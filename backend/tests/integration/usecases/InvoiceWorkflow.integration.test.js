import { describe, it, expect, beforeEach } from 'vitest';
import { CreateInvoice } from '../../../src/application/usecases/CreateInvoice.js';
import { MarkInvoiceAsPaid } from '../../../src/application/usecases/MarkInvoiceAsPaid.js';
import { GetRevenue } from '../../../src/application/usecases/GetRevenue.js';
import { ListInvoices } from '../../../src/application/usecases/ListInvoices.js';
import { InMemoryInvoiceRepository } from '../../../src/infrastructure/repositories/InMemoryInvoiceRepository.js';
import { InMemoryClientRepository } from '../../../src/infrastructure/repositories/InMemoryClientRepository.js';
import { Client } from '../../../src/domain/entities/Client.js';
import { InvoiceStatus } from '../../../src/domain/entities/Invoice.js';

describe('Invoice Workflow Integration', () => {
  let invoiceRepository;
  let clientRepository;
  let createInvoice;
  let markInvoiceAsPaid;
  let getRevenue;
  let listInvoices;

  beforeEach(() => {
    invoiceRepository = new InMemoryInvoiceRepository();
    clientRepository = new InMemoryClientRepository();
    createInvoice = new CreateInvoice(invoiceRepository, clientRepository);
    markInvoiceAsPaid = new MarkInvoiceAsPaid(invoiceRepository);
    getRevenue = new GetRevenue(invoiceRepository);
    listInvoices = new ListInvoices(invoiceRepository);
  });

  it('should create invoice then mark it as paid', async () => {
    const client = new Client({
      id: 'client-1',
      name: 'Test Client',
      email: 'test@example.com',
      address: '123 Test St'
    });
    await clientRepository.save(client);

    const invoice = await createInvoice.execute({
      clientId: 'client-1',
      lines: [{ description: 'Service', quantity: 1, unitPrice: 100, vatRate: 20 }]
    });

    expect(invoice.status).toBe(InvoiceStatus.DRAFT);

    const paidInvoice = await markInvoiceAsPaid.execute(invoice.id);

    expect(paidInvoice.status).toBe(InvoiceStatus.PAID);

    const retrieved = await invoiceRepository.findById(invoice.id);
    expect(retrieved.status).toBe(InvoiceStatus.PAID);
  });

  it('should create multiple invoices and calculate revenue for paid ones only', async () => {
    const client = new Client({
      id: 'client-1',
      name: 'Test Client',
      email: 'test@example.com',
      address: '123 Test St'
    });
    await clientRepository.save(client);

    const invoice1 = await createInvoice.execute({
      clientId: 'client-1',
      lines: [{ description: 'Service 1', quantity: 1, unitPrice: 100, vatRate: 20 }]
    });

    const invoice2 = await createInvoice.execute({
      clientId: 'client-1',
      lines: [{ description: 'Service 2', quantity: 1, unitPrice: 200, vatRate: 20 }]
    });

    const invoice3 = await createInvoice.execute({
      clientId: 'client-1',
      lines: [{ description: 'Service 3', quantity: 1, unitPrice: 150, vatRate: 20 }]
    });

    await markInvoiceAsPaid.execute(invoice1.id);
    await markInvoiceAsPaid.execute(invoice3.id);

    const revenue = await getRevenue.execute({
      startDate: new Date(Date.now() - 86400000).toISOString(),
      endDate: new Date(Date.now() + 86400000).toISOString()
    });

    expect(revenue.totalRevenue).toBe(300);
    expect(revenue.invoiceCount).toBe(2);
  });

  it('should filter invoices by status after marking some as paid', async () => {
    const client = new Client({
      id: 'client-1',
      name: 'Test Client',
      email: 'test@example.com',
      address: '123 Test St'
    });
    await clientRepository.save(client);

    const invoice1 = await createInvoice.execute({
      clientId: 'client-1',
      lines: [{ description: 'Service 1', quantity: 1, unitPrice: 100, vatRate: 20 }]
    });

    const invoice2 = await createInvoice.execute({
      clientId: 'client-1',
      lines: [{ description: 'Service 2', quantity: 1, unitPrice: 200, vatRate: 20 }]
    });

    await markInvoiceAsPaid.execute(invoice1.id);

    const draftInvoices = await listInvoices.execute({ status: InvoiceStatus.DRAFT });
    const paidInvoices = await listInvoices.execute({ status: InvoiceStatus.PAID });

    expect(draftInvoices).toHaveLength(1);
    expect(draftInvoices[0].id).toBe(invoice2.id);

    expect(paidInvoices).toHaveLength(1);
    expect(paidInvoices[0].id).toBe(invoice1.id);
  });

  it('should handle complete invoice lifecycle', async () => {
    const client = new Client({
      id: 'client-1',
      name: 'Test Client',
      email: 'test@example.com',
      address: '123 Test St'
    });
    await clientRepository.save(client);

    const created = await createInvoice.execute({
      clientId: 'client-1',
      lines: [
        { description: 'Consulting', quantity: 5, unitPrice: 100, vatRate: 20 },
        { description: 'Development', quantity: 10, unitPrice: 80, vatRate: 20 }
      ]
    });

    expect(created.status).toBe(InvoiceStatus.DRAFT);
    expect(created.totalExcludingTax).toBe(1300);
    expect(created.totalIncludingTax).toBe(1560);

    const allInvoices = await listInvoices.execute({});
    expect(allInvoices).toHaveLength(1);

    await markInvoiceAsPaid.execute(created.id);

    const paidInvoices = await listInvoices.execute({ status: InvoiceStatus.PAID });
    expect(paidInvoices).toHaveLength(1);
    expect(paidInvoices[0].status).toBe(InvoiceStatus.PAID);

    const revenue = await getRevenue.execute({
      startDate: new Date(Date.now() - 86400000).toISOString(),
      endDate: new Date(Date.now() + 86400000).toISOString()
    });

    expect(revenue.totalRevenue).toBe(1560);
    expect(revenue.invoiceCount).toBe(1);
  });

  it('should filter invoices by client after creating for multiple clients', async () => {
    const client1 = new Client({
      id: 'client-1',
      name: 'Client 1',
      email: 'client1@example.com',
      address: '123 St'
    });

    const client2 = new Client({
      id: 'client-2',
      name: 'Client 2',
      email: 'client2@example.com',
      address: '456 St'
    });

    await clientRepository.save(client1);
    await clientRepository.save(client2);

    await createInvoice.execute({
      clientId: 'client-1',
      lines: [{ description: 'Service', quantity: 1, unitPrice: 100, vatRate: 20 }]
    });

    await createInvoice.execute({
      clientId: 'client-1',
      lines: [{ description: 'Service', quantity: 1, unitPrice: 200, vatRate: 20 }]
    });

    await createInvoice.execute({
      clientId: 'client-2',
      lines: [{ description: 'Service', quantity: 1, unitPrice: 150, vatRate: 20 }]
    });

    const client1Invoices = await listInvoices.execute({ clientId: 'client-1' });
    const client2Invoices = await listInvoices.execute({ clientId: 'client-2' });

    expect(client1Invoices).toHaveLength(2);
    expect(client2Invoices).toHaveLength(1);
    expect(client1Invoices.every(inv => inv.clientId === 'client-1')).toBe(true);
    expect(client2Invoices.every(inv => inv.clientId === 'client-2')).toBe(true);
  });
});
