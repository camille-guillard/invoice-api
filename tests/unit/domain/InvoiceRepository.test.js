import { describe, it, expect } from 'vitest';
import { InvoiceRepository } from '../../../src/domain/repositories/InvoiceRepository.js';

describe('InvoiceRepository (Port)', () => {
  const repository = new InvoiceRepository();

  it('should throw error when save is not implemented', async () => {
    await expect(repository.save({})).rejects.toThrow('Method save() must be implemented');
  });

  it('should throw error when findById is not implemented', async () => {
    await expect(repository.findById('123')).rejects.toThrow('Method findById() must be implemented');
  });

  it('should throw error when findAll is not implemented', async () => {
    await expect(repository.findAll()).rejects.toThrow('Method findAll() must be implemented');
  });

  it('should throw error when findByFilters is not implemented', async () => {
    await expect(repository.findByFilters({})).rejects.toThrow('Method findByFilters() must be implemented');
  });

  it('should throw error when getNextInvoiceNumber is not implemented', async () => {
    await expect(repository.getNextInvoiceNumber(2025)).rejects.toThrow('Method getNextInvoiceNumber() must be implemented');
  });
});
