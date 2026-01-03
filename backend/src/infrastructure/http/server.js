import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { Container } from '../container.js';
import { InvoiceController } from './controllers/InvoiceController.js';
import { ClientController } from './controllers/ClientController.js';
import { createInvoiceRoutes } from './routes/invoiceRoutes.js';
import { createClientRoutes } from './routes/clientRoutes.js';
import { swaggerSpec } from './swagger.js';

export function createServer() {
  const app = express();
  const container = new Container();
  const invoiceController = new InvoiceController(container);
  const clientController = new ClientController(container);

  // Middleware
  app.use(express.json());

  // Swagger documentation
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Invoice API Documentation',
    customCss: '.swagger-ui .topbar { display: none }'
  }));

  // Routes
  app.use('/api', createInvoiceRoutes(invoiceController));
  app.use('/api', createClientRoutes(clientController));

  // Health check
  /**
   * @swagger
   * /health:
   *   get:
   *     summary: Health check endpoint
   *     tags: [Health]
   *     responses:
   *       200:
   *         description: Service is healthy
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: ok
   */
  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Error handler
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
  });

  return { app, container };
}
