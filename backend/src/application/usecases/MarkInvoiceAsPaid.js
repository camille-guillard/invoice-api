export class MarkInvoiceAsPaid {
  constructor(invoiceRepository) {
    this.invoiceRepository = invoiceRepository;
  }

  async execute(invoiceId) {
    const invoice = await this.invoiceRepository.findById(invoiceId);
    if (!invoice) {
      throw new Error('Invoice not found');
    }

    invoice.markAsPaid();
    await this.invoiceRepository.save(invoice);

    return invoice;
  }
}
