import { describe, it, expect } from 'vitest';
import { InMemoryClientRepository } from '../../../src/infrastructure/repositories/InMemoryClientRepository.js';
import { Client } from '../../../src/domain/entities/Client.js';

describe('InMemoryClientRepository', () => {
  it('should find all clients', async () => {
    const repository = new InMemoryClientRepository();

    const client1 = new Client({
      id: '1',
      name: 'Client 1',
      email: 'client1@test.com',
      address: 'Address 1'
    });

    const client2 = new Client({
      id: '2',
      name: 'Client 2',
      email: 'client2@test.com',
      address: 'Address 2'
    });

    await repository.save(client1);
    await repository.save(client2);

    const all = await repository.findAll();

    expect(all).toHaveLength(2);
    expect(all).toContain(client1);
    expect(all).toContain(client2);
  });

  it('should clear all clients', async () => {
    const repository = new InMemoryClientRepository();

    const client = new Client({
      id: '1',
      name: 'Client 1',
      email: 'client1@test.com',
      address: 'Address 1'
    });

    await repository.save(client);
    repository.clear();

    const result = await repository.findById('1');
    expect(result).toBeNull();
  });
});
