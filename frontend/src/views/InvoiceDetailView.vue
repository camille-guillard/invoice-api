<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useInvoice, useMarkInvoiceAsPaid } from '../composables/useInvoices'
import { useClient } from '../composables/useClients'

const route = useRoute()
const router = useRouter()
const invoiceId = route.params.id

// Fetch invoice
const { data: invoice, isLoading, error } = useInvoice(invoiceId)

// Fetch client (based on invoice's clientId)
const clientId = computed(() => invoice?.clientId)
const { data: client, isLoading: isLoadingClient } = useClient(clientId)

// Mutation to mark as paid
const { mutate: markAsPaid, isPending: isMarkingAsPaid } = useMarkInvoiceAsPaid()

const handleMarkAsPaid = () => {
  if (confirm('Voulez-vous marquer cette facture comme payée ?')) {
    markAsPaid(invoiceId)
  }
}

const goBack = () => {
  router.push('/invoices')
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
  <div class="invoice-detail">
    <button @click="goBack" class="btn btn-secondary btn-back">
      ← Retour à la liste
    </button>

    <!-- État de chargement -->
    <div v-if="isLoading" class="loading">
      Chargement de la facture...
    </div>

    <!-- Erreur -->
    <div v-else-if="error" class="error">
      Erreur: {{ error.message }}
    </div>

    <!-- Détails de la facture -->
    <div v-else-if="invoice" class="invoice-card">
      <div class="invoice-header">
        <div>
          <h1>{{ invoice.number }}</h1>
          <p class="date">Date: {{ formatDate(invoice.date) }}</p>
        </div>
        <div>
          <span :class="['status', invoice.status.toLowerCase()]">
            {{ invoice.status === 'DRAFT' ? 'Non payé' : 'Payée' }}
          </span>
        </div>
      </div>

      <div class="invoice-info">
        <div class="info-section">
          <h3>Informations client</h3>
          <div v-if="isLoadingClient">Chargement du client...</div>
          <div v-else-if="client">
            <p><strong>Nom:</strong> {{ client.name }}</p>
            <p><strong>Email:</strong> {{ client.email }}</p>
            <p><strong>Adresse:</strong> {{ client.address }}</p>
            <p class="client-id"><strong>ID:</strong> {{ client.id }}</p>
          </div>
          <div v-else>
            <p><strong>Client ID:</strong> {{ invoice.clientId }}</p>
          </div>
        </div>
      </div>

      <!-- Lignes de facture -->
      <div class="invoice-lines">
        <h3>Lignes de facturation</h3>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantité</th>
              <th>Prix unitaire HT</th>
              <th>TVA</th>
              <th>Total HT</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(line, index) in invoice.lines" :key="index">
              <td data-label="Description">{{ line.description }}</td>
              <td data-label="Quantité" class="center">{{ line.quantity }}</td>
              <td data-label="Prix unitaire HT" class="amount">{{ formatAmount(line.unitPrice) }}</td>
              <td data-label="TVA" class="center">{{ line.vatRate }}%</td>
              <td data-label="Total HT" class="amount">{{ formatAmount(line.quantity * line.unitPrice) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Totaux -->
      <div class="invoice-totals">
        <div class="total-row">
          <span>Total HT:</span>
          <span class="amount">{{ formatAmount(invoice.totalExcludingTax) }}</span>
        </div>
        <div class="total-row">
          <span>TVA:</span>
          <span class="amount">{{ formatAmount(invoice.totalVat) }}</span>
        </div>
        <div class="total-row total-final">
          <span>Total TTC:</span>
          <span class="amount">{{ formatAmount(invoice.totalIncludingTax) }}</span>
        </div>
      </div>

      <!-- Actions -->
      <div v-if="invoice.status === 'DRAFT'" class="invoice-actions">
        <button
          @click="handleMarkAsPaid"
          :disabled="isMarkingAsPaid"
          class="btn btn-success btn-large"
        >
          {{ isMarkingAsPaid ? 'En cours...' : 'Marquer comme payée' }}
        </button>
      </div>

      <div v-else class="paid-notice">
        ✓ Cette facture a été payée
      </div>
    </div>
  </div>
</template>

<style scoped>
.invoice-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.btn-back {
  margin-bottom: 2rem;
}

.invoice-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.invoice-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #e0e0e0;
  margin-bottom: 2rem;
}

.invoice-header h1 {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.date {
  color: #7f8c8d;
  font-size: 1rem;
}

.status {
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-size: 1rem;
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

.invoice-info {
  margin-bottom: 2rem;
}

.info-section h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.info-section p {
  margin: 0.5rem 0;
  color: #555;
}

.client-id {
  font-size: 0.9rem;
  color: #7f8c8d;
}

.invoice-lines {
  margin-bottom: 2rem;
}

.invoice-lines h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
}

thead {
  background: #e9ecef;
}

th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
}

td {
  padding: 1rem;
  border-top: 1px solid #dee2e6;
}

.center {
  text-align: center;
}

.amount {
  text-align: right;
  font-weight: 600;
}

.invoice-totals {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.total-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  font-size: 1rem;
}

.total-final {
  border-top: 2px solid #dee2e6;
  margin-top: 0.75rem;
  padding-top: 1rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #2c3e50;
}

.invoice-actions {
  text-align: center;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
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

.btn-large {
  padding: 1rem 2rem;
  font-size: 1.1rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.paid-notice {
  text-align: center;
  padding: 1rem;
  background: #d4edda;
  color: #155724;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.1rem;
}

.loading,
.error {
  text-align: center;
  padding: 3rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.error {
  color: #dc3545;
  background: #f8d7da;
}

/* Dark mode */
[data-theme="dark"] .invoice-card {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

[data-theme="dark"] .invoice-header {
  border-bottom-color: var(--border-color);
}

[data-theme="dark"] .invoice-header h1 {
  color: var(--text-primary);
}

[data-theme="dark"] .date {
  color: var(--text-secondary);
}

[data-theme="dark"] .info-section h3,
[data-theme="dark"] .invoice-lines h3 {
  color: var(--text-primary);
}

[data-theme="dark"] .info-section p {
  color: var(--text-secondary);
}

[data-theme="dark"] .client-id {
  color: var(--text-tertiary);
}

[data-theme="dark"] table {
  background: var(--bg-tertiary);
}

[data-theme="dark"] thead {
  background: var(--bg-tertiary);
}

[data-theme="dark"] th {
  color: var(--text-primary);
}

[data-theme="dark"] td {
  border-top-color: var(--border-color);
  color: var(--text-primary);
}

[data-theme="dark"] .invoice-totals {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

[data-theme="dark"] .total-final {
  border-top-color: var(--border-color);
  color: var(--text-primary);
}

[data-theme="dark"] .loading {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

/* Responsive Mobile Styles */
@media (max-width: 768px) {
  .invoice-detail {
    padding: 1rem;
  }

  .invoice-card {
    padding: 1rem;
  }

  .invoice-header {
    flex-direction: column;
    gap: 1rem;
  }

  .invoice-header h1 {
    font-size: 1.5rem;
  }

  .status {
    align-self: flex-start;
  }

  /* Make table responsive with cards */
  table {
    display: block;
    overflow-x: auto;
  }

  thead {
    display: none;
  }

  tbody {
    display: block;
  }

  tr {
    display: block;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    margin-bottom: 1rem;
    padding: 1rem;
  }

  td {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
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

  .invoice-totals {
    padding: 1rem;
  }

  .total-row {
    font-size: 0.9rem;
  }

  .total-final {
    font-size: 1.1rem;
  }

  .btn-large {
    padding: 0.875rem 1.5rem;
    font-size: 1rem;
    width: 100%;
  }

  .btn-back {
    width: 100%;
  }
}
</style>
