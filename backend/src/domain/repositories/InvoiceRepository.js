/**
 * Port (interface) for the invoice repository
 * Adapters must implement these methods
 */
export class InvoiceRepository {
  async save(invoice) {
    throw new Error('Method save() must be implemented');
  }

  async findById(id) {
    throw new Error('Method findById() must be implemented');
  }

  async findAll() {
    throw new Error('Method findAll() must be implemented');
  }

  async findByFilters({ status, startDate, endDate, clientId }) {
    throw new Error('Method findByFilters() must be implemented');
  }

  async getNextInvoiceNumber(year) {
    throw new Error('Method getNextInvoiceNumber() must be implemented');
  }
}
