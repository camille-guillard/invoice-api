import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createServer } from '../../src/infrastructure/http/server.js';
import { Client } from '../../src/domain/entities/Client.js';
import { randomUUID } from 'crypto';

describe('Invoices API E2E', () => {
  let app;
  let container;
  let clientId;

  beforeEach(async () => {
    ({ app, container } = createServer());

    // Create test client
    const client = new Client({
      id: randomUUID(),
      name: 'Test Client',
      email: 'test@example.com',
      address: '123 Test Street'
    });

    await container.getClientRepository().save(client);
    clientId = client.id;
  });

  describe('POST /api/invoices', () => {
    it('should create a new invoice', async () => {
      const response = await request(app)
        .post('/api/invoices')
        .send({
          clientId,
          lines: [
            {
              description: 'Consulting service',
              quantity: 2,
              unitPrice: 100,
              vatRate: 20
            }
          ]
        });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        number: 'INV-2025-001',
        clientId,
        status: 'DRAFT',
        totalExcludingTax: 200,
        totalVat: 40,
        totalIncludingTax: 240
      });
      expect(response.body.id).toBeDefined();
      expect(response.body.lines).toHaveLength(1);
    });

    it('should return 400 for missing clientId', async () => {
      const response = await request(app)
        .post('/api/invoices')
        .send({
          lines: [{ description: 'Test', quantity: 1, unitPrice: 100, vatRate: 20 }]
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it('should return 400 for invalid client', async () => {
      const response = await request(app)
        .post('/api/invoices')
        .send({
          clientId: 'unknown',
          lines: [{ description: 'Test', quantity: 1, unitPrice: 100, vatRate: 20 }]
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Client not found');
    });

    it('should return 400 for invalid line data', async () => {
      const response = await request(app)
        .post('/api/invoices')
        .send({
          clientId,
          lines: [{ description: 'Test', quantity: -1, unitPrice: 100, vatRate: 20 }]
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Quantity must be a positive number');
    });
  });

  describe('GET /api/invoices/:id', () => {
    it('should retrieve an invoice by id', async () => {
      const createResponse = await request(app)
        .post('/api/invoices')
        .send({
          clientId,
          lines: [{ description: 'Test', quantity: 1, unitPrice: 100, vatRate: 20 }]
        });

      const invoiceId = createResponse.body.id;

      const response = await request(app).get(`/api/invoices/${invoiceId}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(invoiceId);
    });

    it('should return 404 for non-existent invoice', async () => {
      const response = await request(app).get('/api/invoices/unknown');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Invoice not found');
    });
  });

  describe('GET /api/invoices', () => {
    beforeEach(async () => {
      // Create multiple test invoices
      await request(app)
        .post('/api/invoices')
        .send({
          clientId,
          lines: [{ description: 'Test 1', quantity: 1, unitPrice: 100, vatRate: 20 }]
        });

      await request(app)
        .post('/api/invoices')
        .send({
          clientId,
          lines: [{ description: 'Test 2', quantity: 1, unitPrice: 200, vatRate: 20 }]
        });
    });

    it('should list all invoices', async () => {
      const response = await request(app).get('/api/invoices');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
    });

    it('should filter invoices by status', async () => {
      const response = await request(app).get('/api/invoices?status=DRAFT');

      expect(response.status).toBe(200);
      expect(response.body.every(inv => inv.status === 'DRAFT')).toBe(true);
    });

    it('should filter invoices by clientId', async () => {
      const response = await request(app).get(`/api/invoices?clientId=${clientId}`);

      expect(response.status).toBe(200);
      expect(response.body.every(inv => inv.clientId === clientId)).toBe(true);
    });
  });

  describe('PATCH /api/invoices/:id/pay', () => {
    it('should mark invoice as paid', async () => {
      const createResponse = await request(app)
        .post('/api/invoices')
        .send({
          clientId,
          lines: [{ description: 'Test', quantity: 1, unitPrice: 100, vatRate: 20 }]
        });

      const invoiceId = createResponse.body.id;

      const response = await request(app).patch(`/api/invoices/${invoiceId}/pay`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('PAID');
    });

    it('should return 404 for non-existent invoice', async () => {
      const response = await request(app).patch('/api/invoices/unknown/pay');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Invoice not found');
    });

    it('should return 400 when already paid', async () => {
      const createResponse = await request(app)
        .post('/api/invoices')
        .send({
          clientId,
          lines: [{ description: 'Test', quantity: 1, unitPrice: 100, vatRate: 20 }]
        });

      const invoiceId = createResponse.body.id;

      await request(app).patch(`/api/invoices/${invoiceId}/pay`);
      const response = await request(app).patch(`/api/invoices/${invoiceId}/pay`);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invoice is already paid');
    });
  });

  describe('GET /api/invoices/revenue', () => {
    it('should calculate revenue for period', async () => {
      const createResponse = await request(app)
        .post('/api/invoices')
        .send({
          clientId,
          lines: [{ description: 'Test', quantity: 1, unitPrice: 100, vatRate: 20 }]
        });

      const invoiceId = createResponse.body.id;
      await request(app).patch(`/api/invoices/${invoiceId}/pay`);

      const response = await request(app).get(
        '/api/invoices/revenue?startDate=2025-01-01&endDate=2025-12-31'
      );

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        invoiceCount: 1
      });
      expect(response.body.totalRevenue).toBeGreaterThan(0);
    });

    it('should return 400 without startDate', async () => {
      const response = await request(app).get('/api/invoices/revenue?endDate=2025-12-31');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('startDate and endDate are required');
    });

    it('should return 400 without endDate', async () => {
      const response = await request(app).get('/api/invoices/revenue?startDate=2025-01-01');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('startDate and endDate are required');
    });

    it('should only include paid invoices', async () => {
      await request(app)
        .post('/api/invoices')
        .send({
          clientId,
          lines: [{ description: 'Test', quantity: 1, unitPrice: 100, vatRate: 20 }]
        });

      const response = await request(app).get(
        '/api/invoices/revenue?startDate=2025-01-01&endDate=2025-12-31'
      );

      expect(response.status).toBe(200);
      expect(response.body.totalRevenue).toBe(0);
      expect(response.body.invoiceCount).toBe(0);
    });
  });

  describe('GET /health', () => {
    it('should return ok status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ok');
    });
  });

  describe('Complete workflow', () => {
    it('should handle complete invoice lifecycle', async () => {
      // 1. Create invoice
      const createResponse = await request(app)
        .post('/api/invoices')
        .send({
          clientId,
          lines: [
            { description: 'Service 1', quantity: 2, unitPrice: 100, vatRate: 20 },
            { description: 'Service 2', quantity: 1, unitPrice: 50, vatRate: 10 }
          ]
        });

      expect(createResponse.status).toBe(201);
      const invoiceId = createResponse.body.id;

      // 2. Get invoice
      const getResponse = await request(app).get(`/api/invoices/${invoiceId}`);
      expect(getResponse.status).toBe(200);
      expect(getResponse.body.status).toBe('DRAFT');

      // 3. List invoices
      const listResponse = await request(app).get('/api/invoices');
      expect(listResponse.status).toBe(200);
      expect(listResponse.body.some(inv => inv.id === invoiceId)).toBe(true);

      // 4. Mark as paid
      const payResponse = await request(app).patch(`/api/invoices/${invoiceId}/pay`);
      expect(payResponse.status).toBe(200);
      expect(payResponse.body.status).toBe('PAID');

      // 5. Calculate revenue
      const revenueResponse = await request(app).get(
        '/api/invoices/revenue?startDate=2025-01-01&endDate=2025-12-31'
      );
      expect(revenueResponse.status).toBe(200);
      expect(revenueResponse.body.totalRevenue).toBe(295); // 200 + 40 (TVA 20%) + 50 + 5 (TVA 10%)
    });
  });
});
