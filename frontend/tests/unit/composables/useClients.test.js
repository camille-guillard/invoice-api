import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the services
vi.mock('../../../src/services/api', () => ({
  clientService: {
    getAll: vi.fn(),
    getById: vi.fn()
  }
}))

// Mock TanStack Vue Query
vi.mock('@tanstack/vue-query', () => ({
  useQuery: vi.fn((options) => ({
    data: null,
    isLoading: false,
    error: null,
    queryKey: options.queryKey,
    queryFn: options.queryFn,
    enabled: options.enabled,
    staleTime: options.staleTime
  }))
}))

describe('useClients composables', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useClients', () => {
    it('should return query object for fetching all clients', async () => {
      const { useClients } = await import('../../../src/composables/useClients')

      const result = useClients()

      expect(result).toBeDefined()
      expect(result.queryKey).toEqual(['clients'])
      expect(result.queryFn).toBeDefined()
      expect(result.staleTime).toBe(60000)
    })
  })

  describe('useClient', () => {
    it('should return query object for fetching single client', async () => {
      const { useClient } = await import('../../../src/composables/useClients')

      const result = useClient('client-123')

      expect(result).toBeDefined()
      expect(result.queryKey).toBeDefined()
      expect(result.queryFn).toBeDefined()
      expect(result.enabled).toBe(true)
      expect(result.staleTime).toBe(60000)
    })

    it('should disable query when id is falsy', async () => {
      const { useClient } = await import('../../../src/composables/useClients')

      const result = useClient(null)

      expect(result.enabled).toBe(false)
    })
  })
})
