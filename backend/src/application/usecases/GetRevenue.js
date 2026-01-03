import { InvoiceStatus } from '../../domain/entities/Invoice.js';

export class GetRevenue {
  constructor(invoiceRepository) {
    this.invoiceRepository = invoiceRepository;
  }

  async execute({ startDate, endDate }) {
    if (!startDate || !endDate) {
      throw new Error('Start date and end date are required');
    }

    const invoices = await this.invoiceRepository.findByFilters({
      status: InvoiceStatus.PAID,
      startDate,
      endDate
    });

    const totalRevenue = invoices.reduce((total, invoice) => {
      return total + invoice.totalIncludingTax;
    }, 0);

    const totalExcludingTax = invoices.reduce((total, invoice) => {
      return total + invoice.totalExcludingTax;
    }, 0);

    const totalVat = invoices.reduce((total, invoice) => {
      return total + invoice.totalVat;
    }, 0);

    return {
      startDate,
      endDate,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalExcludingTax: Math.round(totalExcludingTax * 100) / 100,
      totalVat: Math.round(totalVat * 100) / 100,
      invoiceCount: invoices.length
    };
  }
}
