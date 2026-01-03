<script setup>
import { useClients } from '../composables/useClients'

// Fetch clients
const { data: clients, isLoading, error } = useClients()
</script>

<template>
  <div class="client-list">
    <div class="header">
      <h1>Liste des Clients</h1>
    </div>

    <!-- État de chargement -->
    <div v-if="isLoading" class="loading">
      Chargement des clients...
    </div>

    <!-- Erreur -->
    <div v-else-if="error" class="error">
      Erreur: {{ error.message }}
    </div>

    <!-- Liste des clients -->
    <div v-else-if="clients && clients.length > 0" class="table-container">
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Adresse</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="client in clients" :key="client.id">
            <td data-label="Nom" class="client-name">{{ client.name }}</td>
            <td data-label="Email">{{ client.email }}</td>
            <td data-label="Adresse">{{ client.address }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Aucun client -->
    <div v-else class="empty">
      <p>Aucun client trouvé.</p>
    </div>
  </div>
</template>

<style scoped>
.client-list {
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

.client-name {
  font-weight: 600;
  color: #2c3e50;
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
  .client-list {
    padding: 1rem;
  }

  .header h1 {
    font-size: 1.5rem;
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
}
</style>
