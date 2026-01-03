<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCreateInvoice } from '../composables/useInvoices'
import { useClients } from '../composables/useClients'

const router = useRouter()
const { mutate: createInvoice, isPending, error } = useCreateInvoice()
const { data: clients, isLoading: isLoadingClients } = useClients()

// Formulaire
const formData = ref({
  clientId: '',
  date: new Date().toISOString().split('T')[0],
  lines: [
    {
      description: '',
      quantity: 1,
      unitPrice: 0,
      vatRate: 20
    }
  ]
})

const addLine = () => {
  formData.value.lines.push({
    description: '',
    quantity: 1,
    unitPrice: 0,
    vatRate: 20
  })
}

const removeLine = (index) => {
  if (formData.value.lines.length > 1) {
    formData.value.lines.splice(index, 1)
  }
}

const handleSubmit = () => {
  // Basic validation
  if (!formData.value.clientId) {
    alert('Le Client ID est requis')
    return
  }

  if (formData.value.lines.some(line => !line.description || line.quantity <= 0 || line.unitPrice <= 0)) {
    alert('Toutes les lignes doivent avoir une description, quantité > 0 et prix > 0')
    return
  }

  // Prepare data
  const invoiceData = {
    clientId: formData.value.clientId,
    date: formData.value.date,
    lines: formData.value.lines.map(line => ({
      description: line.description,
      quantity: Math.round(Number(line.quantity)),
      unitPrice: Number(line.unitPrice),
      vatRate: Number(line.vatRate)
    }))
  }

  // Create invoice
  createInvoice(invoiceData, {
    onSuccess: () => {
      alert('Facture créée avec succès !')
      router.push('/invoices')
    },
    onError: (err) => {
      alert(`Erreur lors de la création: ${err.message}`)
    }
  })
}

const calculateLineTotal = (line) => {
  return line.quantity * line.unitPrice
}

const calculateTotalHT = () => {
  return formData.value.lines.reduce((sum, line) => sum + calculateLineTotal(line), 0)
}

const calculateTotalVAT = () => {
  return formData.value.lines.reduce((sum, line) => {
    const lineTotal = calculateLineTotal(line)
    return sum + (lineTotal * line.vatRate / 100)
  }, 0)
}

const calculateTotalTTC = () => {
  return calculateTotalHT() + calculateTotalVAT()
}

const formatAmount = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}
</script>

<template>
  <div class="invoice-form">
    <div class="header">
      <h1>Nouvelle Facture</h1>
      <router-link to="/invoices" class="btn btn-secondary">
        ← Annuler
      </router-link>
    </div>

    <form @submit.prevent="handleSubmit" class="form">
      <!-- Informations générales -->
      <div class="form-section">
        <h2>Informations générales</h2>

        <div class="form-group">
          <label for="clientId">Client *</label>
          <select
            id="clientId"
            v-model="formData.clientId"
            required
            :disabled="isLoadingClients"
          >
            <option value="">{{ isLoadingClients ? 'Chargement...' : 'Sélectionnez un client' }}</option>
            <option v-for="client in clients" :key="client.id" :value="client.id">
              {{ client.name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="date">Date *</label>
          <input
            id="date"
            v-model="formData.date"
            type="date"
            required
          />
        </div>
      </div>

      <!-- Lignes de facture -->
      <div class="form-section">
        <div class="section-header">
          <h2>Lignes de facturation</h2>
          <button type="button" @click="addLine" class="btn btn-sm btn-success">
            + Ajouter une ligne
          </button>
        </div>

        <div v-for="(line, index) in formData.lines" :key="index" class="invoice-line">
          <div class="line-header">
            <h3>Ligne {{ index + 1 }}</h3>
            <button
              v-if="formData.lines.length > 1"
              type="button"
              @click="removeLine(index)"
              class="btn btn-sm btn-danger"
            >
              × Supprimer
            </button>
          </div>

          <div class="line-grid">
            <div class="form-group">
              <label>Description *</label>
              <input
                v-model="line.description"
                type="text"
                required
                placeholder="Description de la prestation"
              />
            </div>

            <div class="form-group">
              <label>Quantité *</label>
              <input
                v-model.number="line.quantity"
                type="number"
                min="1"
                step="1"
                pattern="[0-9]+"
                required
              />
            </div>

            <div class="form-group">
              <label>Prix unitaire HT *</label>
              <input
                v-model.number="line.unitPrice"
                type="number"
                min="0"
                step="0.01"
                required
                placeholder="0.00"
              />
            </div>

            <div class="form-group">
              <label>TVA *</label>
              <select v-model.number="line.vatRate" required>
                <option :value="0">0%</option>
                <option :value="5.5">5.5%</option>
                <option :value="10">10%</option>
                <option :value="20">20%</option>
              </select>
            </div>

            <div class="form-group">
              <label>Total HT</label>
              <div class="calculated-value">
                {{ formatAmount(calculateLineTotal(line)) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Totaux -->
      <div class="form-section totals">
        <h2>Récapitulatif</h2>
        <div class="total-row">
          <span>Total HT:</span>
          <span class="amount">{{ formatAmount(calculateTotalHT()) }}</span>
        </div>
        <div class="total-row">
          <span>TVA:</span>
          <span class="amount">{{ formatAmount(calculateTotalVAT()) }}</span>
        </div>
        <div class="total-row total-final">
          <span>Total TTC:</span>
          <span class="amount">{{ formatAmount(calculateTotalTTC()) }}</span>
        </div>
      </div>

      <!-- Erreur -->
      <div v-if="error" class="error">
        Erreur: {{ error.message }}
      </div>

      <!-- Actions -->
      <div class="form-actions">
        <router-link to="/invoices" class="btn btn-secondary">
          Annuler
        </router-link>
        <button type="submit" :disabled="isPending" class="btn btn-primary btn-large">
          {{ isPending ? 'Création en cours...' : 'Créer la facture' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.invoice-form {
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

.form {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.form-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e0e0e0;
  border-radius: 12px;
  background: var(--bg-tertiary);
}

.form-section:last-of-type {
  border-bottom: none;
}

.form-section h2 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-size: 1.4rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  margin-bottom: 0;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #555;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;
  height: 45px;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #42b983;
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.1);
}

.invoice-line {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.line-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.line-header h3 {
  color: #2c3e50;
  font-size: 1.1rem;
  margin: 0;
}

.line-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: 1rem;
}

.calculated-value {
  padding: 0.75rem;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-weight: 600;
  color: #2c3e50;
  box-sizing: border-box;
  height: 45px;
  display: flex;
  align-items: center;
}

.totals {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
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

.amount {
  font-weight: 600;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
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

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
}

.btn-large {
  padding: 1rem 2rem;
  font-size: 1.1rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  margin-top: 1rem;
  padding: 1rem;
  background: #f8d7da;
  color: #dc3545;
  border-radius: 6px;
}

/* Responsive Mobile Styles */
@media (max-width: 768px) {
  .invoice-form {
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

  .header .btn {
    width: 100%;
    text-align: center;
  }

  .form {
    padding: 1rem;
  }

  .form-section {
    padding: 1rem;
  }

  .form-section h2 {
    font-size: 1.2rem;
  }

  .section-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .section-header .btn {
    width: 100%;
  }

  .invoice-line {
    padding: 1rem;
  }

  .line-header {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }

  .line-header .btn {
    width: 100%;
  }

  .line-grid {
    grid-template-columns: 1fr;
  }

  .totals {
    padding: 1rem;
  }

  .total-row {
    font-size: 0.9rem;
  }

  .total-final {
    font-size: 1.1rem;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .btn {
    width: 100%;
    text-align: center;
  }
}
</style>
