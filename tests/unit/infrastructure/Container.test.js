import { describe, it, expect } from 'vitest';
import { Container } from '../../../src/infrastructure/container.js';

describe('Container', () => {
  it('should return invoice repository', () => {
    const container = new Container();
    const repo = container.getInvoiceRepository();

    expect(repo).toBeDefined();
    expect(repo).toBe(container.invoiceRepository);
  });

  it('should return client repository', () => {
    const container = new Container();
    const repo = container.getClientRepository();

    expect(repo).toBeDefined();
    expect(repo).toBe(container.clientRepository);
  });
});
