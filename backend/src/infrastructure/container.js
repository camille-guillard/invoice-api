import { MongoInvoiceRepository } from './repositories/MongoInvoiceRepository.js';
import { MongoClientRepository } from './repositories/MongoClientRepository.js';
import { InMemoryInvoiceRepository } from './repositories/InMemoryInvoiceRepository.js';
import { InMemoryClientRepository } from './repositories/InMemoryClientRepository.js';
import { CreateInvoice } from '../application/usecases/CreateInvoice.js';
import { GetInvoice } from '../application/usecases/GetInvoice.js';
import { ListInvoices } from '../application/usecases/ListInvoices.js';
import { MarkInvoiceAsPaid } from '../application/usecases/MarkInvoiceAsPaid.js';
import { GetRevenue } from '../application/usecases/GetRevenue.js';

/**
 * Simple container for dependency injection
 */
export class Container {
  constructor() {
    // Use MongoDB in development, InMemory in production (Railway doesn't support MongoDB Memory Server)
    const useInMemory = process.env.USE_IN_MEMORY === 'true';

    if (useInMemory) {
      console.log('Using InMemory repositories (production mode)');
      this.invoiceRepository = new InMemoryInvoiceRepository();
      this.clientRepository = new InMemoryClientRepository();
    } else {
      console.log('Using MongoDB repositories (development mode)');
      this.invoiceRepository = new MongoInvoiceRepository();
      this.clientRepository = new MongoClientRepository();
    }
  }

  // Use cases
  getCreateInvoiceUseCase() {
    return new CreateInvoice(this.invoiceRepository, this.clientRepository);
  }

  getGetInvoiceUseCase() {
    return new GetInvoice(this.invoiceRepository);
  }

  getListInvoicesUseCase() {
    return new ListInvoices(this.invoiceRepository);
  }

  getMarkInvoiceAsPaidUseCase() {
    return new MarkInvoiceAsPaid(this.invoiceRepository);
  }

  getGetRevenueUseCase() {
    return new GetRevenue(this.invoiceRepository);
  }

  // Repositories (for direct access if needed)
  getInvoiceRepository() {
    return this.invoiceRepository;
  }

  getClientRepository() {
    return this.clientRepository;
  }
}
