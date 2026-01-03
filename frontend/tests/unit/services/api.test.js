import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'

// Mock axios
vi.mock('axios')

describe('API Services', () => {
  let mockAxiosInstance
  let invoiceService
  let clientService
  let healthService

  beforeEach(async () => {
    vi.clearAllMocks()
    vi.resetModules()

    // Create mock axios instance
    mockAxiosInstance = {
      get: vi.fn(),
      post: vi.fn(),
      patch: vi.fn()
    }

    // Mock axios.create to return our mock instance
    axios.create = vi.fn().mockReturnValue(mockAxiosInstance)
    // Mock axios.get for healthService
    axios.get = vi.fn()

    // Import services after mocking
    const module = await import('../../../src/services/api')
    invoiceService = module.invoiceService
    clientService = module.clientService
    healthService = module.healthService
  })

  describe('invoiceService', () => {
    describe('getAll', () => {
      it('should fetch all invoices without filters', async () => {
        const mockInvoices = [{ id: '1', number: 'INV-001' }]
        mockAxiosInstance.get.mockResolvedValue({ data: mockInvoices })

        await invoiceService.getAll()

        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/invoices?')
      })

      it('should fetch invoices with filters', async () => {
        const filters = {
          clientId: 'client-1',
          status: 'PAID',
          startDate: '2026-01-01',
          endDate: '2026-12-31'
        }

        mockAxiosInstance.get.mockResolvedValue({ data: [] })

        await invoiceService.getAll(filters)

        expect(mockAxiosInstance.get).toHaveBeenCalledWith(
          '/invoices?clientId=client-1&status=PAID&startDate=2026-01-01&endDate=2026-12-31'
        )
      })
    })

    describe('getById', () => {
      it('should fetch invoice by ID', async () => {
        const mockInvoice = { id: '123', number: 'INV-001' }
        mockAxiosInstance.get.mockResolvedValue({ data: mockInvoice })

        await invoiceService.getById('123')

        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/invoices/123')
      })
    })

    describe('create', () => {
      it('should create a new invoice', async () => {
        const invoiceData = {
          clientId: 'client-1',
          date: '2026-01-07',
          lines: [{ description: 'Test', quantity: 1, unitPrice: 100 }]
        }
        const mockResponse = { id: '123', number: 'INV-001' }
        mockAxiosInstance.post.mockResolvedValue({ data: mockResponse })

        await invoiceService.create(invoiceData)

        expect(mockAxiosInstance.post).toHaveBeenCalledWith('/invoices', invoiceData)
      })
    })

    describe('markAsPaid', () => {
      it('should mark invoice as paid', async () => {
        mockAxiosInstance.patch.mockResolvedValue({ data: {} })

        await invoiceService.markAsPaid('123')

        expect(mockAxiosInstance.patch).toHaveBeenCalledWith('/invoices/123/pay')
      })
    })

    describe('getRevenue', () => {
      it('should fetch revenue with date range', async () => {
        const mockRevenue = { total: 1000 }
        mockAxiosInstance.get.mockResolvedValue({ data: mockRevenue })

        await invoiceService.getRevenue('2026-01-01', '2026-12-31')

        expect(mockAxiosInstance.get).toHaveBeenCalledWith(
          '/invoices/revenue?startDate=2026-01-01&endDate=2026-12-31'
        )
      })

      it('should fetch revenue without date range', async () => {
        const mockRevenue = { total: 1000 }
        mockAxiosInstance.get.mockResolvedValue({ data: mockRevenue })

        await invoiceService.getRevenue()

        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/invoices/revenue?')
      })
    })
  })

  describe('clientService', () => {
    describe('getAll', () => {
      it('should fetch all clients', async () => {
        const mockClients = [{ id: '1', name: 'Client 1' }]
        mockAxiosInstance.get.mockResolvedValue({ data: mockClients })

        await clientService.getAll()

        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/clients')
      })
    })

    describe('getById', () => {
      it('should fetch client by ID', async () => {
        const mockClient = { id: '123', name: 'Client 1' }
        mockAxiosInstance.get.mockResolvedValue({ data: mockClient })

        await clientService.getById('123')

        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/clients/123')
      })
    })
  })

  describe('healthService', () => {
    describe('check', () => {
      it('should perform health check', async () => {
        const mockHealth = { status: 'ok' }
        axios.get.mockResolvedValue({ data: mockHealth })

        await healthService.check()

        expect(axios.get).toHaveBeenCalledWith('/health')
      })
    })
  })
})
