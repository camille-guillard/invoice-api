import { useQuery } from '@tanstack/vue-query'
import { clientService } from '../services/api'

// Hook to fetch all clients
export function useClients() {
  return useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const response = await clientService.getAll()
      return response.data
    },
    staleTime: 60000 // Cache for 1 minute
  })
}

// Hook to fetch a client by ID
export function useClient(id) {
  return useQuery({
    queryKey: ['client', id],
    queryFn: async () => {
      const response = await clientService.getById(id)
      return response.data
    },
    enabled: !!id,
    staleTime: 60000
  })
}
