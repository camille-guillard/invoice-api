import { createServer } from './infrastructure/http/server.js';
import { Client } from './domain/entities/Client.js';

const PORT = process.env.PORT || 3000;

const { app, container } = createServer();

// Initialize some test clients with predictable IDs
const clientRepository = container.getClientRepository();

const client1 = new Client({
  id: 'client-1',
  name: 'Company A',
  email: 'contact@company-a.com',
  address: '123 Main Street'
});

const client2 = new Client({
  id: 'client-2',
  name: 'Company B',
  email: 'contact@company-b.com',
  address: '456 Main Street'
});

await clientRepository.save(client1);
await clientRepository.save(client2);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`\nTest clients created:`);
  console.log(`- ${client1.name} (ID: ${client1.id})`);
  console.log(`- ${client2.name} (ID: ${client2.id})`);
});
