import { Invoice } from '../../domain/entities/Invoice.js';
import { InvoiceCalculator } from '../../domain/services/InvoiceCalculator.js';

export class CreateInvoice {
  constructor(invoiceRepository, clientRepository) {
    this.invoiceRepository = invoiceRepository;
    this.clientRepository = clientRepository;
    this.calculator = new InvoiceCalculator();
  }

  async execute({ clientId, lines }) {
    const client = await this.clientRepository.findById(clientId);
    if (!client) {
      throw new Error('Client not found');
    }

    const year = new Date().getFullYear();
    const invoiceNumber = await this.invoiceRepository.getNextInvoiceNumber(year);

    const invoice = new Invoice({
      id: this.invoiceRepository.getNextId(),
      number: invoiceNumber,
      date: new Date().toISOString(),
      clientId,
      lines
    });

    const totals = this.calculator.calculateInvoiceTotals(invoice);
    invoice.setTotals(totals.totalExcludingTax, totals.totalVat, totals.totalIncludingTax);

    await this.invoiceRepository.save(invoice);

    return invoice;
  }
}
