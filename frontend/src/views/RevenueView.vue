<script setup>
import { ref, computed } from 'vue'
import { useRevenue } from '../composables/useInvoices'

// Default period: last 12 months
const today = new Date()
const currentYear = today.getFullYear()
const firstDayOfMonth = new Date(currentYear, today.getMonth(), 1)
const lastDayOfMonth = new Date(currentYear, today.getMonth() + 1, 0)
const twelveMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 12, today.getDate())

const startDate = ref(twelveMonthsAgo.toISOString().split('T')[0])
const endDate = ref(today.toISOString().split('T')[0])

// Fetch revenue
const { data: revenue, isLoading, error, refetch } = useRevenue(startDate, endDate)

const handleSearch = () => {
  refetch()
}

const setThisMonth = () => {
  startDate.value = firstDayOfMonth.toISOString().split('T')[0]
  endDate.value = lastDayOfMonth.toISOString().split('T')[0]
  refetch()
}

const setLastMonth = () => {
  const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
  const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0)
  startDate.value = firstDayLastMonth.toISOString().split('T')[0]
  endDate.value = lastDayLastMonth.toISOString().split('T')[0]
  refetch()
}

const setThisYear = () => {
  const firstDayOfYear = new Date(today.getFullYear(), 0, 1)
  const lastDayOfYear = new Date(today.getFullYear(), 11, 31)
  startDate.value = firstDayOfYear.toISOString().split('T')[0]
  endDate.value = lastDayOfYear.toISOString().split('T')[0]
  refetch()
}

const setLast3Months = () => {
  const threeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate())
  startDate.value = threeMonthsAgo.toISOString().split('T')[0]
  endDate.value = today.toISOString().split('T')[0]
  refetch()
}

const setLast6Months = () => {
  const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate())
  startDate.value = sixMonthsAgo.toISOString().split('T')[0]
  endDate.value = today.toISOString().split('T')[0]
  refetch()
}

const setLast12Months = () => {
  const twelveMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 12, today.getDate())
  startDate.value = twelveMonthsAgo.toISOString().split('T')[0]
  endDate.value = today.toISOString().split('T')[0]
  refetch()
}

const formatAmount = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template>
  <div class="revenue">
    <h1>Analyse des Revenus</h1>

    <!-- Filtres de période -->
    <div class="filters">
      <div class="filter-group">
        <label>Date début:</label>
        <input v-model="startDate" type="date" />
      </div>

      <div class="filter-group">
        <label>Date fin:</label>
        <input v-model="endDate" type="date" />
      </div>

      <button @click="handleSearch" class="btn btn-primary">
        Rechercher
      </button>
    </div>

    <!-- Raccourcis de période -->
    <div class="period-shortcuts">
      <button @click="setThisMonth" class="btn btn-secondary btn-sm">
        Ce mois
      </button>
      <button @click="setLastMonth" class="btn btn-secondary btn-sm">
        Mois dernier
      </button>
      <button @click="setLast3Months" class="btn btn-secondary btn-sm">
        3 derniers mois
      </button>
      <button @click="setLast6Months" class="btn btn-secondary btn-sm">
        6 derniers mois
      </button>
      <button @click="setLast12Months" class="btn btn-secondary btn-sm">
        12 derniers mois
      </button>
      <button @click="setThisYear" class="btn btn-secondary btn-sm">
        Cette année
      </button>
    </div>

    <!-- État de chargement -->
    <div v-if="isLoading" class="loading">
      Calcul des revenus en cours...
    </div>

    <!-- Erreur -->
    <div v-else-if="error" class="error">
      Erreur: {{ error.message }}
    </div>

    <!-- Résultats -->
    <div v-else-if="revenue" class="results">
      <div class="period-info">
        <h2>Période analysée</h2>
        <p>Du {{ formatDate(revenue.startDate) }} au {{ formatDate(revenue.endDate) }}</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card primary">
          <div class="stat-content">
            <div class="stat-label">Revenu total</div>
            <div class="stat-value">{{ formatAmount(revenue.totalRevenue) }}</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-content">
            <div class="stat-label">Total HT</div>
            <div class="stat-value">{{ formatAmount(revenue.totalExcludingTax) }}</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-content">
            <div class="stat-label">TVA collectée</div>
            <div class="stat-value">{{ formatAmount(revenue.totalVat) }}</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-content">
            <div class="stat-label">Nombre de factures</div>
            <div class="stat-value">{{ revenue.invoiceCount }}</div>
          </div>
        </div>
      </div>

      <!-- Informations additionnelles -->
      <div class="info-box">
        <h3>Informations</h3>
        <ul>
          <li>Seules les factures <strong>payées</strong> sont comptabilisées</li>
          <li>Le revenu total correspond au montant TTC (taxes incluses)</li>
          <li>La période est inclusive (dates de début et de fin comprises)</li>
          <li>Les montants sont en euros (EUR)</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.revenue {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  align-items: flex-end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.filter-group label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #555;
  font-size: 0.9rem;
}

.filter-group input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  height: 47px;
  box-sizing: border-box;
}

.period-shortcuts {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  height: 47px;
  box-sizing: border-box;
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

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.results {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 0;
  overflow: hidden;
}

.period-info {
  text-align: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid #e0e0e0;
  border-radius: 12px 12px 0 0;
}

.period-info h2 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 1.4rem;
}

.period-info p {
  color: #7f8c8d;
  font-size: 1.1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 0 2rem;
}

.stat-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #e0e0e0;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-card.primary {
  background: linear-gradient(135deg, #42b983 0%, #359268 100%);
  color: white;
  border-color: #42b983;
}

.stat-icon {
  font-size: 2.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

.stat-card.primary .stat-icon {
  color: white;
}

.stat-content {
  flex: 1;
  text-align: center;
  width: 100%;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
  margin-bottom: 0.5rem;
}

.stat-card.primary .stat-label {
  color: rgba(255, 255, 255, 0.9);
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  word-break: break-word;
}

.stat-card.primary .stat-value {
  color: white;
}

.info-box {
  background: #e7f3ff;
  border-left: 4px solid #2196f3;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 0 2rem 2rem 2rem;
}

.info-box h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.info-box ul {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.info-box li {
  padding: 0.5rem 0;
  color: var(--text-secondary);
}

.info-box li:before {
  content: "• ";
  color: var(--text-secondary);
  font-weight: bold;
  margin-right: 0.5rem;
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

/* Responsive Mobile Styles */
@media (max-width: 768px) {
  .revenue {
    padding: 1rem;
  }

  h1 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .filters {
    flex-direction: column;
    padding: 1rem;
    align-items: stretch;
  }

  .filter-group {
    flex: unset;
    width: 100%;
  }

  .filters .btn {
    width: 100%;
  }

  .period-shortcuts {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .period-shortcuts .btn {
    width: 100%;
    text-align: center;
  }

  .period-info {
    padding: 1rem;
  }

  .period-info h2 {
    font-size: 1.2rem;
  }

  .period-info p {
    font-size: 0.95rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    padding: 0 1rem;
    gap: 1rem;
  }

  .stat-card {
    padding: 1rem;
  }

  .stat-value {
    font-size: 1.3rem;
  }

  .info-box {
    margin: 0 1rem 1rem 1rem;
    padding: 1rem;
  }

  .info-box h3 {
    font-size: 1.1rem;
  }

  .info-box li {
    font-size: 0.9rem;
  }
}
</style>
