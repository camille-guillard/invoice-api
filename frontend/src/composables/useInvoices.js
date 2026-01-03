import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { invoiceService } from '../services/api'

// Hook to fetch all invoices with filters
export function useInvoices(filters) {
  return useQuery({
    queryKey: ['invoices', filters],
    queryFn: async () => {
      const response = await invoiceService.getAll(filters.value)
      return response.data
    }
  })
}

// Hook to fetch an invoice by ID
export function useInvoice(id) {
  return useQuery({
    queryKey: ['invoice', id],
    queryFn: async () => {
      const response = await invoiceService.getById(id)
      return response.data
    },
    enabled: () => !!id
  })
}

// Hook to create an invoice
export function useCreateInvoice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (invoiceData) => invoiceService.create(invoiceData),
    onSuccess: () => {
      // Invalidate all caches related to invoices and revenue
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
      queryClient.invalidateQueries({ queryKey: ['revenue'] })
    }
  })
}

// Hook to mark an invoice as paid
export function useMarkInvoiceAsPaid() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => invoiceService.markAsPaid(id),
    onSuccess: (data, invoiceId) => {
      // Invalidate related caches (invoices and revenue)
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
      queryClient.invalidateQueries({ queryKey: ['invoice', invoiceId] })
      queryClient.invalidateQueries({ queryKey: ['revenue'] })
    }
  })
}

// Hook to fetch revenue
export function useRevenue(startDate, endDate) {
  return useQuery({
    queryKey: ['revenue', startDate, endDate],
    queryFn: async () => {
      const response = await invoiceService.getRevenue(startDate.value, endDate.value)
      return response.data
    },
    enabled: () => !!startDate.value && !!endDate.value
  })
}
