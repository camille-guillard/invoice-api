import { describe, it, expect } from 'vitest';
import { ClientRepository } from '../../../src/domain/repositories/ClientRepository.js';

describe('ClientRepository (Port)', () => {
  const repository = new ClientRepository();

  it('should throw error when save is not implemented', async () => {
    await expect(repository.save({})).rejects.toThrow('Method save() must be implemented');
  });

  it('should throw error when findById is not implemented', async () => {
    await expect(repository.findById('123')).rejects.toThrow('Method findById() must be implemented');
  });

  it('should throw error when findAll is not implemented', async () => {
    await expect(repository.findAll()).rejects.toThrow('Method findAll() must be implemented');
  });
});
