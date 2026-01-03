export class ClientController {
  constructor(container) {
    this.clientRepository = container.getClientRepository();
  }

  /**
   * Get all clients
   */
  async getAllClients(req, res) {
    try {
      const clients = await this.clientRepository.findAll();

      // Convert to plain objects for JSON response
      const clientsData = clients.map(client => ({
        id: client.id,
        name: client.name,
        email: client.email,
        address: client.address
      }));

      res.json(clientsData);
    } catch (error) {
      console.error('Error getting clients:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get a client by ID
   */
  async getClientById(req, res) {
    try {
      const { id } = req.params;
      const client = await this.clientRepository.findById(id);

      if (!client) {
        return res.status(404).json({ error: 'Client not found' });
      }

      res.json({
        id: client.id,
        name: client.name,
        email: client.email,
        address: client.address
      });
    } catch (error) {
      console.error('Error getting client:', error);
      res.status(500).json({ error: error.message });
    }
  }
}
