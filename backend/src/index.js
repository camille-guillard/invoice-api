import { createServer } from './infrastructure/http/server.js';
import { Client } from './domain/entities/Client.js';
import { initMongoDB, closeMongoDB } from './infrastructure/database/mongodb.js';

const PORT = process.env.PORT || 3000;

// Initialize MongoDB before starting the server
await initMongoDB();

const { app, container } = createServer();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await closeMongoDB();
  process.exit(0);
});

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

// Create some test invoices
const invoiceRepository = container.getInvoiceRepository();
const createInvoiceUseCase = container.getCreateInvoiceUseCase();

const today = new Date().toISOString().split('T')[0];
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const yesterdayDate = yesterday.toISOString().split('T')[0];

const twoMonthsAgo = new Date();
twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
const twoMonthsAgoDate = twoMonthsAgo.toISOString().split('T')[0];

const fiveMonthsAgo = new Date();
fiveMonthsAgo.setMonth(fiveMonthsAgo.getMonth() - 5);
const fiveMonthsAgoDate = fiveMonthsAgo.toISOString().split('T')[0];

const elevenMonthsAgo = new Date();
elevenMonthsAgo.setMonth(elevenMonthsAgo.getMonth() - 11);
const elevenMonthsAgoDate = elevenMonthsAgo.toISOString().split('T')[0];

const lastMonth = new Date();
lastMonth.setMonth(lastMonth.getMonth() - 1);
const lastMonthDate = lastMonth.toISOString().split('T')[0];

const markAsPaidUseCase = container.getMarkInvoiceAsPaidUseCase();

// Create invoices in chronological order to get proper invoice numbers

// Invoice 1: 11 months ago - Wayne Enterprises (INV-2025-001) - paid
const invoice1 = await createInvoiceUseCase.execute({
  clientId: 'client-7', // Wayne Enterprises
  date: elevenMonthsAgoDate,
  lines: [
    { description: 'Advanced Technology Consulting', quantity: 100, unitPrice: 300, vatRate: 20 },
    { description: 'Security System Integration', quantity: 1, unitPrice: 15000, vatRate: 20 }
  ]
});
await markAsPaidUseCase.execute(invoice1.id);

// Invoice 2: 5 months ago - Massive Dynamic (INV-2025-002) - paid
const invoice2 = await createInvoiceUseCase.execute({
  clientId: 'client-13', // Massive Dynamic
  date: fiveMonthsAgoDate,
  lines: [
    { description: 'Strategic Consulting', quantity: 50, unitPrice: 220, vatRate: 20 },
    { description: 'Market Analysis', quantity: 1, unitPrice: 8000, vatRate: 20 }
  ]
});
await markAsPaidUseCase.execute(invoice2.id);

// Invoice 3: 2 months ago - Globex Corporation (INV-2025-003) - paid
const invoice3 = await createInvoiceUseCase.execute({
  clientId: 'client-2', // Globex Corporation
  date: twoMonthsAgoDate,
  lines: [
    { description: 'Software Development', quantity: 80, unitPrice: 160, vatRate: 20 },
    { description: 'Infrastructure Setup', quantity: 20, unitPrice: 200, vatRate: 20 }
  ]
});
await markAsPaidUseCase.execute(invoice3.id);

// Invoice 4: Last month - Umbrella Corporation (INV-2025-004) - paid
const invoice4 = await createInvoiceUseCase.execute({
  clientId: 'client-3', // Umbrella Corporation
  date: lastMonthDate,
  lines: [
    { description: 'Research & Development', quantity: 60, unitPrice: 250, vatRate: 20 },
    { description: 'Laboratory Equipment Rental', quantity: 1, unitPrice: 5000, vatRate: 20 }
  ]
});
await markAsPaidUseCase.execute(invoice4.id);

// Invoice 5: Yesterday - Wonka Industries (INV-2026-001) - paid
const invoice5 = await createInvoiceUseCase.execute({
  clientId: 'client-8', // Wonka Industries
  date: yesterdayDate,
  lines: [
    { description: 'Chocolate Production Optimization', quantity: 30, unitPrice: 180, vatRate: 20 },
    { description: 'Quality Control System', quantity: 1, unitPrice: 3000, vatRate: 20 }
  ]
});
await markAsPaidUseCase.execute(invoice5.id);

// Invoice 6: Today - Oscorp (INV-2026-002) - unpaid
const invoice6 = await createInvoiceUseCase.execute({
  clientId: 'client-11', // Oscorp
  date: today,
  lines: [
    { description: 'Web Development Services', quantity: 40, unitPrice: 150, vatRate: 20 },
    { description: 'Server Configuration', quantity: 8, unitPrice: 200, vatRate: 20 }
  ]
});

// Invoice 7: Today - ACME Corp (INV-2026-003) - paid
const invoice7 = await createInvoiceUseCase.execute({
  clientId: 'client-1', // ACME Corp
  date: today,
  lines: [
    { description: 'Consulting Services', quantity: 20, unitPrice: 180, vatRate: 20 },
    { description: 'Technical Support', quantity: 5, unitPrice: 120, vatRate: 20 }
  ]
});
await markAsPaidUseCase.execute(invoice7.id);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`\n${clients.length} test clients created:`);
  clients.forEach(client => {
    console.log(`- ${client.name} (ID: ${client.id})`);
  });
  console.log(`\n7 test invoices created (in chronological order):`);
  console.log(`- ${invoice1.number} - Wayne Enterprises - ${elevenMonthsAgoDate} - PAID`);
  console.log(`- ${invoice2.number} - Massive Dynamic - ${fiveMonthsAgoDate} - PAID`);
  console.log(`- ${invoice3.number} - Globex Corporation - ${twoMonthsAgoDate} - PAID`);
  console.log(`- ${invoice4.number} - Umbrella Corporation - ${lastMonthDate} - PAID`);
  console.log(`- ${invoice5.number} - Wonka Industries - ${yesterdayDate} - PAID`);
  console.log(`- ${invoice6.number} - Oscorp - ${today} - ${invoice6.status}`);
  console.log(`- ${invoice7.number} - ACME Corp - ${today} - PAID`);
});
