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

    const revenue = invoices.reduce((total, invoice) => {
      return total + invoice.totalIncludingTax;
    }, 0);

    return {
      startDate,
      endDate,
      totalRevenue: Math.round(revenue * 100) / 100,
      invoiceCount: invoices.length
    };
  }
}
