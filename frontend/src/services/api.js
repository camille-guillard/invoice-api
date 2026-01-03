import axios from 'axios'

// Base axios configuration
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Invoice management service
export const invoiceService = {
  // GET /api/invoices - List invoices with optional filters
  getAll(filters = {}) {
    const params = new URLSearchParams()

    if (filters.clientId) params.append('clientId', filters.clientId)
    if (filters.status) params.append('status', filters.status)
    if (filters.startDate) params.append('startDate', filters.startDate)
    if (filters.endDate) params.append('endDate', filters.endDate)

    return api.get(`/invoices?${params.toString()}`)
  },

  // GET /api/invoices/:id - Get invoice by ID
  getById(id) {
    return api.get(`/invoices/${id}`)
  },

  // POST /api/invoices - Create a new invoice
  create(invoiceData) {
    return api.post('/invoices', invoiceData)
  },

  // PATCH /api/invoices/:id/pay - Mark invoice as paid
  markAsPaid(id) {
    return api.patch(`/invoices/${id}/pay`)
  },

  // GET /api/invoices/revenue - Calculate revenue for a period
  getRevenue(startDate, endDate) {
    const params = new URLSearchParams()
    if (startDate) params.append('startDate', startDate)
    if (endDate) params.append('endDate', endDate)

    return api.get(`/invoices/revenue?${params.toString()}`)
  }
}

// Client management service
export const clientService = {
  // GET /api/clients - List all clients
  getAll() {
    return api.get('/clients')
  },

  // GET /api/clients/:id - Get client by ID
  getById(id) {
    return api.get(`/clients/${id}`)
  }
}

// Health check service
export const healthService = {
  check() {
    return axios.get('/health')
  }
}

export default api
