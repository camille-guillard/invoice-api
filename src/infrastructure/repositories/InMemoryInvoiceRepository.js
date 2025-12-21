import { InvoiceRepository } from '../../domain/repositories/InvoiceRepository.js';

export class InMemoryInvoiceRepository extends InvoiceRepository {
  constructor() {
    super();
    this.invoices = new Map();
    this.invoiceCounters = new Map(); // To generate invoice numbers
    this.idCounter = 0; // To generate predictable IDs
  }

  async save(invoice) {
    this.invoices.set(invoice.id, invoice);
    return invoice;
  }

  async findById(id) {
    return this.invoices.get(id) || null;
  }

  async findAll() {
    return Array.from(this.invoices.values())
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  async findByFilters({ status, startDate, endDate, clientId }) {
    let invoices = Array.from(this.invoices.values());

    if (status) {
      invoices = invoices.filter(inv => inv.status === status);
    }

    if (clientId) {
      invoices = invoices.filter(inv => inv.clientId === clientId);
    }

    if (startDate) {
      invoices = invoices.filter(inv => new Date(inv.date) >= new Date(startDate));
    }

    if (endDate) {
      invoices = invoices.filter(inv => new Date(inv.date) <= new Date(endDate));
    }

    return invoices.sort((a, b) => b.date.localeCompare(a.date));
  }

  async getNextInvoiceNumber(year) {
    const currentCount = this.invoiceCounters.get(year) || 0;
    const nextCount = currentCount + 1;
    this.invoiceCounters.set(year, nextCount);

    // Format: INV-YYYY-001
    const paddedNumber = String(nextCount).padStart(3, '0');
    return `INV-${year}-${paddedNumber}`;
  }

  getNextId() {
    this.idCounter++;
    return `invoice-${this.idCounter}`;
  }

  // Useful method for tests
  clear() {
    this.invoices.clear();
    this.invoiceCounters.clear();
    this.idCounter = 0;
  }
}
