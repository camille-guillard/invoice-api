import { ClientRepository } from '../../domain/repositories/ClientRepository.js';

export class InMemoryClientRepository extends ClientRepository {
  constructor() {
    super();
    this.clients = new Map();
  }

  async save(client) {
    this.clients.set(client.id, client);
    return client;
  }

  async findById(id) {
    return this.clients.get(id) || null;
  }

  async findAll() {
    return Array.from(this.clients.values());
  }

  // Useful method for tests
  clear() {
    this.clients.clear();
  }
}
