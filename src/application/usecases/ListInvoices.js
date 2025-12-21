export class ListInvoices {
  constructor(invoiceRepository) {
    this.invoiceRepository = invoiceRepository;
  }

  async execute(filters = {}) {
    const { status, startDate, endDate, clientId } = filters;

    if (status || startDate || endDate || clientId) {
      return await this.invoiceRepository.findByFilters({
        status,
        startDate,
        endDate,
        clientId
      });
    }

    return await this.invoiceRepository.findAll();
  }
}
