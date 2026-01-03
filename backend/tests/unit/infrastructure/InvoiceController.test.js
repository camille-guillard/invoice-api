import { describe, it, expect, beforeEach } from 'vitest';
import { InvoiceController } from '../../../src/infrastructure/http/controllers/InvoiceController.js';

describe('InvoiceController', () => {
  let controller;
  let mockContainer;
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockRes = {
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      json: function(data) {
        this.data = data;
        return this;
      }
    };

    mockContainer = {
      getCreateInvoiceUseCase: () => ({
        execute: async () => ({ toJSON: () => ({ id: '1', number: 'INV-2025-001' }) })
      }),
      getGetInvoiceUseCase: () => ({
        execute: async () => ({ toJSON: () => ({ id: '1' }) })
      }),
      getListInvoicesUseCase: () => ({
        execute: async () => [{ toJSON: () => ({ id: '1' }) }]
      }),
      getMarkInvoiceAsPaidUseCase: () => ({
        execute: async () => ({ toJSON: () => ({ id: '1', status: 'PAID' }) })
      }),
      getGetRevenueUseCase: () => ({
        execute: async () => ({ totalRevenue: 1000 })
      })
    };

    controller = new InvoiceController(mockContainer);
  });

  describe('createInvoice', () => {
    it('should return 400 when clientId is missing', async () => {
      mockReq = { body: { lines: [] } };

      await controller.createInvoice(mockReq, mockRes);

      expect(mockRes.statusCode).toBe(400);
      expect(mockRes.data.error).toBe('clientId and lines are required');
    });

    it('should return 400 when lines is missing', async () => {
      mockReq = { body: { clientId: 'client-1' } };

      await controller.createInvoice(mockReq, mockRes);

      expect(mockRes.statusCode).toBe(400);
      expect(mockRes.data.error).toBe('clientId and lines are required');
    });

    it('should return 400 when lines is not an array', async () => {
      mockReq = { body: { clientId: 'client-1', lines: 'not-array' } };

      await controller.createInvoice(mockReq, mockRes);

      expect(mockRes.statusCode).toBe(400);
      expect(mockRes.data.error).toBe('clientId and lines are required');
    });

    it('should handle use case errors', async () => {
      mockReq = { body: { clientId: 'client-1', lines: [] } };
      mockContainer.getCreateInvoiceUseCase = () => ({
        execute: async () => { throw new Error('Test error'); }
      });

      await controller.createInvoice(mockReq, mockRes);

      expect(mockRes.statusCode).toBe(400);
      expect(mockRes.data.error).toBe('Test error');
    });
  });

  describe('getInvoice', () => {
    it('should return 404 when invoice not found', async () => {
      mockReq = { params: { id: 'unknown' } };
      mockContainer.getGetInvoiceUseCase = () => ({
        execute: async () => { throw new Error('Invoice not found'); }
      });

      await controller.getInvoice(mockReq, mockRes);

      expect(mockRes.statusCode).toBe(404);
      expect(mockRes.data.error).toBe('Invoice not found');
    });

    it('should return 400 for other errors', async () => {
      mockReq = { params: { id: '1' } };
      mockContainer.getGetInvoiceUseCase = () => ({
        execute: async () => { throw new Error('Some other error'); }
      });

      await controller.getInvoice(mockReq, mockRes);

      expect(mockRes.statusCode).toBe(400);
      expect(mockRes.data.error).toBe('Some other error');
    });
  });

  describe('listInvoices', () => {
    it('should pass all filters to use case', async () => {
      mockReq = { query: { status: 'PAID', startDate: '2025-01-01', endDate: '2025-12-31', clientId: 'client-1' } };
      let calledWith = null;
      mockContainer.getListInvoicesUseCase = () => ({
        execute: async (filters) => {
          calledWith = filters;
          return [{ toJSON: () => ({ id: '1' }) }];
        }
      });

      await controller.listInvoices(mockReq, mockRes);

      expect(calledWith).toEqual({
        status: 'PAID',
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        clientId: 'client-1'
      });
    });

    it('should handle errors', async () => {
      mockReq = { query: {} };
      mockContainer.getListInvoicesUseCase = () => ({
        execute: async () => { throw new Error('List error'); }
      });

      await controller.listInvoices(mockReq, mockRes);

      expect(mockRes.statusCode).toBe(400);
      expect(mockRes.data.error).toBe('List error');
    });
  });

  describe('markInvoiceAsPaid', () => {
    it('should return 404 when invoice not found', async () => {
      mockReq = { params: { id: 'unknown' } };
      mockContainer.getMarkInvoiceAsPaidUseCase = () => ({
        execute: async () => { throw new Error('Invoice not found'); }
      });

      await controller.markInvoiceAsPaid(mockReq, mockRes);

      expect(mockRes.statusCode).toBe(404);
      expect(mockRes.data.error).toBe('Invoice not found');
    });

    it('should return 400 for other errors', async () => {
      mockReq = { params: { id: '1' } };
      mockContainer.getMarkInvoiceAsPaidUseCase = () => ({
        execute: async () => { throw new Error('Already paid'); }
      });

      await controller.markInvoiceAsPaid(mockReq, mockRes);

      expect(mockRes.statusCode).toBe(400);
      expect(mockRes.data.error).toBe('Already paid');
    });
  });

  describe('getRevenue', () => {
    it('should return 400 when startDate is missing', async () => {
      mockReq = { query: { endDate: '2025-12-31' } };

      await controller.getRevenue(mockReq, mockRes);

      expect(mockRes.statusCode).toBe(400);
      expect(mockRes.data.error).toBe('startDate and endDate are required');
    });

    it('should return 400 when endDate is missing', async () => {
      mockReq = { query: { startDate: '2025-01-01' } };

      await controller.getRevenue(mockReq, mockRes);

      expect(mockRes.statusCode).toBe(400);
      expect(mockRes.data.error).toBe('startDate and endDate are required');
    });

    it('should handle use case errors', async () => {
      mockReq = { query: { startDate: '2025-01-01', endDate: '2025-12-31' } };
      mockContainer.getGetRevenueUseCase = () => ({
        execute: async () => { throw new Error('Revenue error'); }
      });

      await controller.getRevenue(mockReq, mockRes);

      expect(mockRes.statusCode).toBe(400);
      expect(mockRes.data.error).toBe('Revenue error');
    });
  });
});
