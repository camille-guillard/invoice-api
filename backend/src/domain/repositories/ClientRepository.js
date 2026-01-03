/**
 * Port (interface) for the client repository
 * Adapters must implement these methods
 */
export class ClientRepository {
  async save(client) {
    throw new Error('Method save() must be implemented');
  }

  async findById(id) {
    throw new Error('Method findById() must be implemented');
  }

  async findAll() {
    throw new Error('Method findAll() must be implemented');
  }
}
