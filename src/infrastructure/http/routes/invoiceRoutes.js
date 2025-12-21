import { Router } from 'express';

export function createInvoiceRoutes(controller) {
  const router = Router();

  /**
   * @swagger
   * /api/invoices:
   *   post:
   *     summary: Create a new invoice
   *     tags: [Invoices]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateInvoiceRequest'
   *     responses:
   *       201:
   *         description: Invoice created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Invoice'
   *       400:
   *         description: Bad request
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.post('/invoices', (req, res) => controller.createInvoice(req, res));

  /**
   * @swagger
   * /api/invoices:
   *   get:
   *     summary: List all invoices
   *     tags: [Invoices]
   *     parameters:
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [DRAFT, PAID]
   *         description: Filter by invoice status
   *       - in: query
   *         name: clientId
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Filter by client ID
   *       - in: query
   *         name: startDate
   *         schema:
   *           type: string
   *           format: date
   *         description: Filter by start date (YYYY-MM-DD)
   *       - in: query
   *         name: endDate
   *         schema:
   *           type: string
   *           format: date
   *         description: Filter by end date (YYYY-MM-DD)
   *     responses:
   *       200:
   *         description: List of invoices
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Invoice'
   */
  router.get('/invoices', (req, res) => controller.listInvoices(req, res));

  /**
   * @swagger
   * /api/invoices/revenue:
   *   get:
   *     summary: Calculate revenue for a period
   *     tags: [Invoices]
   *     parameters:
   *       - in: query
   *         name: startDate
   *         required: true
   *         schema:
   *           type: string
   *           format: date
   *         description: Start date (YYYY-MM-DD)
   *         example: '2025-01-01'
   *       - in: query
   *         name: endDate
   *         required: true
   *         schema:
   *           type: string
   *           format: date
   *         description: End date (YYYY-MM-DD)
   *         example: '2025-12-31'
   *     responses:
   *       200:
   *         description: Revenue calculation
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Revenue'
   *       400:
   *         description: Bad request
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.get('/invoices/revenue', (req, res) => controller.getRevenue(req, res));

  /**
   * @swagger
   * /api/invoices/{id}:
   *   get:
   *     summary: Get an invoice by ID
   *     tags: [Invoices]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Invoice ID
   *     responses:
   *       200:
   *         description: Invoice details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Invoice'
   *       404:
   *         description: Invoice not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.get('/invoices/:id', (req, res) => controller.getInvoice(req, res));

  /**
   * @swagger
   * /api/invoices/{id}/pay:
   *   patch:
   *     summary: Mark an invoice as paid
   *     tags: [Invoices]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Invoice ID
   *     responses:
   *       200:
   *         description: Invoice marked as paid
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Invoice'
   *       400:
   *         description: Bad request (e.g., already paid)
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Invoice not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.patch('/invoices/:id/pay', (req, res) => controller.markInvoiceAsPaid(req, res));

  return router;
}
