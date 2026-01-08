<template>
  <div class="home">
    <h1>Invoice App - Gestion de Factures</h1>
    <p class="subtitle">Application de gestion de factures</p>

    <div class="cards">
      <router-link to="/invoices" class="card">
        <h2>Liste des Factures</h2>
        <p>Consulter et gérer toutes les factures</p>
      </router-link>

      <router-link to="/invoices/new" class="card">
        <h2>Nouvelle Facture</h2>
        <p>Créer une nouvelle facture</p>
      </router-link>

      <router-link to="/revenue" class="card">
        <h2>Revenus</h2>
        <p>Analyser les revenus par période</p>
      </router-link>
    </div>

    <div class="info">
      <h3>Démarrage rapide</h3>
      <ul>
        <li>Créez une nouvelle facture</li>
        <li>Consultez la liste des factures</li>
        <li>Marquez les factures comme payées</li>
        <li>Analysez vos revenus</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.subtitle {
  font-size: 1.2rem;
  color: #7f8c8d;
  margin-bottom: 3rem;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.card {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 2rem;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
}

.card:hover {
  border-color: #42b983;
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.2);
  transform: translateY(-4px);
}

.card h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.card p {
  color: #7f8c8d;
}

.info {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 2rem;
}

.info h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.info ul {
  list-style: none;
  padding-left: 0;
}

.info li {
  padding: 0.5rem 0;
  color: var(--text-secondary);
}

.info li:before {
  content: "• ";
  color: var(--text-secondary);
  font-weight: bold;
  margin-right: 0.5rem;
}
</style>
