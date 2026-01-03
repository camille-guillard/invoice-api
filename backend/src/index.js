import { createServer } from './infrastructure/http/server.js';
import { Client } from './domain/entities/Client.js';

const PORT = process.env.PORT || 3000;

const { app, container } = createServer();

// Initialize some test clients with predictable IDs
const clientRepository = container.getClientRepository();

const clients = [
  new Client({
    id: 'client-1',
    name: 'ACME Corp',
    email: 'contact@acmecorp.com',
    address: '123 Innovation Drive, San Francisco, CA 94105'
  }),
  new Client({
    id: 'client-2',
    name: 'Globex Corporation',
    email: 'hello@globexcorp.com',
    address: '456 Tech Boulevard, New York, NY 10001'
  }),
  new Client({
    id: 'client-3',
    name: 'Umbrella Corporation',
    email: 'info@umbrellacorp.com',
    address: '789 Biotech Plaza, Raccoon City, NC 27401'
  }),
  new Client({
    id: 'client-4',
    name: 'Initech',
    email: 'support@initech.com',
    address: '1520 Office Park Drive, Austin, TX 78701'
  }),
  new Client({
    id: 'client-5',
    name: 'Hooli',
    email: 'contact@hooli.com',
    address: '1501 Page Mill Road, Palo Alto, CA 94304'
  }),
  new Client({
    id: 'client-6',
    name: 'Stark Industries',
    email: 'info@starkindustries.com',
    address: '200 Park Avenue, New York, NY 10166'
  }),
  new Client({
    id: 'client-7',
    name: 'Wayne Enterprises',
    email: 'contact@wayneenterprises.com',
    address: '1007 Mountain Drive, Gotham City, NJ 07001'
  }),
  new Client({
    id: 'client-8',
    name: 'Wonka Industries',
    email: 'info@wonkaindustries.com',
    address: '42 Chocolate Factory Lane, London, UK W1A 1AA'
  }),
  new Client({
    id: 'client-9',
    name: 'Cyberdyne Systems',
    email: 'contact@cyberdyne-systems.com',
    address: '18144 El Camino Real, Sunnyvale, CA 94087'
  }),
  new Client({
    id: 'client-10',
    name: 'Tyrell Corporation',
    email: 'info@tyrellcorp.com',
    address: '2019 Nexus Boulevard, Los Angeles, CA 90012'
  }),
  new Client({
    id: 'client-11',
    name: 'Oscorp',
    email: 'contact@oscorp.com',
    address: '200 Madison Avenue, New York, NY 10016'
  }),
  new Client({
    id: 'client-12',
    name: 'Vehement Capital Partners',
    email: 'info@vehementcapital.com',
    address: '555 California Street, San Francisco, CA 94104'
  }),
  new Client({
    id: 'client-13',
    name: 'Massive Dynamic',
    email: 'contact@massivedynamic.com',
    address: '1 Massive Dynamic Plaza, Boston, MA 02108'
  }),
  new Client({
    id: 'client-14',
    name: 'Aperture Science',
    email: 'info@aperturescience.com',
    address: '1 Aperture Drive, Cleveland, OH 44101'
  })
];

for (const client of clients) {
  await clientRepository.save(client);
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`\n${clients.length} test clients created:`);
  clients.forEach(client => {
    console.log(`- ${client.name} (ID: ${client.id})`);
  });
});
