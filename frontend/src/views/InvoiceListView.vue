<script setup>
import { ref, computed } from 'vue'
import { useInvoices, useMarkInvoiceAsPaid } from '../composables/useInvoices'
import { useClients } from '../composables/useClients'
import { useRouter } from 'vue-router'

const router = useRouter()

// Default period: last 12 months
const today = new Date()
const twelveMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 12, today.getDate())

// Filters
const filters = ref({
  clientId: '',
  status: '',
  startDate: twelveMonthsAgo.toISOString().split('T')[0],
  endDate: today.toISOString().split('T')[0]
})

// Fetch invoices with filters
const { data: invoices, isLoading, error, refetch } = useInvoices(filters)

// Fetch clients
const { data: clients, isLoading: isLoadingClients } = useClients()

// Map clients by ID for quick access
const clientsMap = computed(() => {
  if (!clients.value || !Array.isArray(clients.value)) return {}
  return clients.value.reduce((map, client) => {
    map[client.id] = client
    return map
  }, {})
})

// Mutation to mark as paid
const { mutate: markAsPaid, isPending: isMarkingAsPaid } = useMarkInvoiceAsPaid()

const getClientName = (clientId) => {
  const clientMap = clientsMap.value
  if (!clientMap) return clientId
  return clientMap[clientId]?.name || clientId
}

const handleMarkAsPaid = (id) => {
  if (confirm('Voulez-vous marquer cette facture comme payée ?')) {
    markAsPaid(id)
  }
}

const viewDetails = (id) => {
  router.push(`/invoices/${id}`)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

const formatAmount = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}
</script>

<template>
  <div class="invoice-list">
    <div class="header">
      <h1>Liste des Factures</h1>
      <router-link to="/invoices/new" class="btn btn-primary">
        Nouvelle Facture
      </router-link>
    </div>

    <!-- Filtres -->
    <div class="filters">
      <div class="filter-group">
        <label>Client:</label>
        <select v-model="filters.clientId" :disabled="isLoadingClients">
          <option value="">{{ isLoadingClients ? 'Chargement...' : 'Tous les clients' }}</option>
          <option v-for="client in clients" :key="client.id" :value="client.id">
            {{ client.name }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label>Statut:</label>
        <select v-model="filters.status">
          <option value="">Tous</option>
          <option value="DRAFT">Non payé</option>
          <option value="PAID">Payée</option>
        </select>
      </div>

      <div class="filter-group">
        <label>Date début:</label>
        <input v-model="filters.startDate" type="date" />
      </div>

      <div class="filter-group">
        <label>Date fin:</label>
        <input v-model="filters.endDate" type="date" />
      </div>
    </div>

    <!-- État de chargement -->
    <div v-if="isLoading" class="loading">
      Chargement des factures...
    </div>

    <!-- Erreur -->
    <div v-else-if="error" class="error">
      Erreur: {{ error.message }}
    </div>

    <!-- Liste des factures -->
    <div v-else-if="invoices && invoices.length > 0" class="table-container">
      <table>
        <thead>
          <tr>
            <th>Numéro</th>
            <th>Client</th>
            <th>Date</th>
            <th>Montant TTC</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="invoice in invoices" :key="invoice.id">
            <td data-label="Numéro">{{ invoice.number }}</td>
            <td data-label="Client">{{ getClientName(invoice.clientId) }}</td>
            <td data-label="Date">{{ formatDate(invoice.date) }}</td>
            <td data-label="Montant TTC" class="amount">{{ formatAmount(invoice.totalIncludingTax) }}</td>
            <td data-label="Statut">
              <span :class="['status', invoice.status.toLowerCase()]">
                {{ invoice.status === 'DRAFT' ? 'Non payé' : 'Payée' }}
              </span>
            </td>
            <td data-label="Actions" class="actions">
              <button @click="viewDetails(invoice.id)" class="btn btn-sm btn-secondary">
                Voir
              </button>
              <button
                v-if="invoice.status === 'DRAFT'"
                @click="handleMarkAsPaid(invoice.id)"
                :disabled="isMarkingAsPaid"
                class="btn btn-sm btn-success"
              >
                Payer
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Aucune facture -->
    <div v-else class="empty">
      <p>Aucune facture trouvée.</p>
      <router-link to="/invoices/new" class="btn btn-primary">
        Créer la première facture
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.invoice-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

h1 {
  font-size: 2rem;
  color: #2c3e50;
}

.filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-group label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #555;
  font-size: 0.9rem;
}

.filter-group input,
.filter-group select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.table-container {
  overflow-x: auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f8f9fa;
}

th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #e0e0e0;
}

td {
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.amount {
  font-weight: 600;
  color: #2c3e50;
}

.status {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
}

.status.draft {
  background: #fff3cd;
  color: #856404;
}

.status.paid {
  background: #d4edda;
  color: #155724;
}

.actions {
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  transition: all 0.2s;
}

.btn-primary {
  background: #42b983;
  color: white;
}

.btn-primary:hover {
  background: #359268;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #545b62;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-success:hover {
  background: #218838;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading,
.error,
.empty {
  text-align: center;
  padding: 3rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.error {
  color: #dc3545;
  background: #f8d7da;
}

.empty p {
  margin-bottom: 1rem;
  color: #7f8c8d;
}

/* Responsive Mobile Styles */
@media (max-width: 768px) {
  .invoice-list {
    padding: 1rem;
  }

  .header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .header h1 {
    font-size: 1.5rem;
  }

  .filters {
    grid-template-columns: 1fr;
    padding: 1rem;
  }

  /* Hide table, show cards on mobile */
  .table-container {
    background: transparent;
    box-shadow: none;
  }

  table {
    display: block;
  }

  thead {
    display: none;
  }

  tbody {
    display: block;
  }

  tr {
    display: block;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    margin-bottom: 1rem;
    padding: 1rem;
    box-shadow: 0 2px 4px var(--shadow);
  }

  td {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: none;
    border-top: 1px solid var(--border-color-light);
  }

  td:first-child {
    border-top: none;
  }

  td::before {
    content: attr(data-label);
    font-weight: 600;
    color: var(--text-secondary);
  }

  .actions {
    flex-direction: column;
    gap: 0.5rem;
  }

  .actions .btn {
    width: 100%;
    text-align: center;
  }
}
</style>
