import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'

// Mock the services
vi.mock('../../../src/services/api', () => ({
  invoiceService: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    markAsPaid: vi.fn(),
    getRevenue: vi.fn()
  }
}))

// Mock TanStack Vue Query
vi.mock('@tanstack/vue-query', () => ({
  useQuery: vi.fn((options) => ({
    data: ref(null),
    isLoading: ref(false),
    error: ref(null),
    queryKey: options.queryKey,
    queryFn: options.queryFn,
    enabled: options.enabled
  })),
  useMutation: vi.fn((options) => ({
    mutate: vi.fn(),
    isPending: ref(false),
    mutationFn: options.mutationFn,
    onSuccess: options.onSuccess
  })),
  useQueryClient: vi.fn(() => ({
    invalidateQueries: vi.fn()
  }))
}))

describe('useInvoices composables', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useInvoices', () => {
    it('should return query object for fetching invoices', async () => {
      const { useInvoices } = await import('../../../src/composables/useInvoices')
      const filters = ref({ status: 'PAID' })

      const result = useInvoices(filters)

      expect(result).toBeDefined()
      expect(result.queryKey).toBeDefined()
      expect(result.queryFn).toBeDefined()
    })
  })

  describe('useInvoice', () => {
    it('should return query object for fetching single invoice', async () => {
      const { useInvoice } = await import('../../../src/composables/useInvoices')

      const result = useInvoice('invoice-123')

      expect(result).toBeDefined()
      expect(result.queryKey).toBeDefined()
      expect(result.queryFn).toBeDefined()
      expect(result.enabled).toBeDefined()
    })
  })

  describe('useCreateInvoice', () => {
    it('should return mutation object for creating invoices', async () => {
      const { useCreateInvoice } = await import('../../../src/composables/useInvoices')

      const result = useCreateInvoice()

      expect(result).toBeDefined()
      expect(result.mutate).toBeDefined()
      expect(result.mutationFn).toBeDefined()
      expect(result.onSuccess).toBeDefined()
    })
  })

  describe('useMarkInvoiceAsPaid', () => {
    it('should return mutation object for marking invoice as paid', async () => {
      const { useMarkInvoiceAsPaid } = await import('../../../src/composables/useInvoices')

      const result = useMarkInvoiceAsPaid()

      expect(result).toBeDefined()
      expect(result.mutate).toBeDefined()
      expect(result.mutationFn).toBeDefined()
      expect(result.onSuccess).toBeDefined()
    })
  })

  describe('useRevenue', () => {
    it('should return query object for fetching revenue', async () => {
      const { useRevenue } = await import('../../../src/composables/useInvoices')
      const startDate = ref('2026-01-01')
      const endDate = ref('2026-12-31')

      const result = useRevenue(startDate, endDate)

      expect(result).toBeDefined()
      expect(result.queryKey).toBeDefined()
      expect(result.queryFn).toBeDefined()
      expect(result.enabled).toBeDefined()
    })
  })
})
