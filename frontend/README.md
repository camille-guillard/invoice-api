# Invoice App - Frontend

Interface utilisateur pour la gestion de factures, construite avec Vue.js 3 et Vite.

## Stack Technique

- **Vue.js 3** - Framework JavaScript progressif (Composition API)
- **Vite** - Build tool ultra-rapide
- **Vue Router** - Routage côté client
- **TanStack Query** (vue-query) - Gestion des états et cache des données API
- **Axios** - Client HTTP pour les appels API

## Structure du projet

```
frontend/
├── src/
│   ├── components/          # Composants réutilisables
│   ├── composables/         # Hooks Vue Query
│   │   └── useInvoices.js   # Hooks pour les factures
│   ├── services/            # Couche API
│   │   └── api.js           # Configuration Axios + endpoints
│   ├── router/              # Configuration Vue Router
│   │   └── index.js
│   ├── views/               # Pages/Vues
│   │   ├── HomeView.vue
│   │   ├── InvoiceListView.vue
│   │   ├── InvoiceDetailView.vue
│   │   ├── InvoiceFormView.vue
│   │   └── RevenueView.vue
│   ├── App.vue              # Composant racine
│   └── main.js              # Point d'entrée
├── public/                  # Assets statiques
├── index.html               # Template HTML
├── vite.config.js           # Configuration Vite
└── package.json
```

## Installation

```bash
# Depuis le dossier frontend/
npm install
```

## Développement

```bash
# Démarrer le serveur de développement
npm run dev
```

L'application sera accessible sur **http://localhost:5173**

Le proxy Vite redirige automatiquement les appels API vers le backend sur `http://localhost:3000`

## Build de production

```bash
# Créer le build optimisé
npm run build

# Prévisualiser le build
npm run preview
```

Les fichiers de production seront générés dans le dossier `dist/`

## Fonctionnalités

### Pages

- **Accueil** (`/`) - Tableau de bord avec accès rapide
- **Liste des factures** (`/invoices`) - Affichage avec filtres (client, statut, dates)
- **Détails d'une facture** (`/invoices/:id`) - Vue détaillée avec possibilité de payer
- **Créer une facture** (`/invoices/new`) - Formulaire de création multi-lignes
- **Revenus** (`/revenue`) - Analyse des revenus par période

### Fonctionnalités principales

- **Liste des factures** avec filtres multiples
- **Création de factures** avec lignes multiples
- **Détails complets** d'une facture
- **Marquer comme payée** avec mise à jour en temps réel
- **Calcul automatique** des totaux (HT, TVA, TTC)
- **Analyse des revenus** par période personnalisable
- **Interface responsive** (mobile-friendly)
- **Gestion du cache** avec TanStack Query
- **États de chargement** et gestion d'erreurs

## API

Le frontend communique avec l'API backend via les endpoints suivants :

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/invoices` | Liste des factures (avec filtres) |
| `GET` | `/api/invoices/:id` | Détails d'une facture |
| `POST` | `/api/invoices` | Créer une facture |
| `PATCH` | `/api/invoices/:id/pay` | Marquer comme payée |
| `GET` | `/api/invoices/revenue` | Calculer les revenus |

## Configuration

### Proxy Vite (vite.config.js)

Le proxy Vite est configuré pour rediriger les appels API vers le backend :

```javascript
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true
    }
  }
}
```

### Vue Query

Configuration du cache et des requêtes dans `main.js` :

```javascript
VueQueryPlugin.use({
  queryClientConfig: {
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: 5000
      }
    }
  }
})
```

## Styles

Les styles sont définis en **scoped CSS** dans chaque composant Vue, permettant :
- Une isolation des styles par composant
- Pas de conflits CSS
- Facilité de maintenance

## Conventions de code

- **Composition API** avec `<script setup>`
- **Reactive refs** pour l'état local
- **Vue Query hooks** pour les données API (dans `composables/`)
- **Services API** centralisés (dans `services/api.js`)
- **Formatage des montants** en EUR (euros)
- **Dates** au format français (DD/MM/YYYY)

## Développement Backend requis

Le frontend nécessite que le backend soit démarré sur le port 3000.

Depuis la racine du projet :

```bash
npm run dev:backend
```

Ou depuis le dossier backend :

```bash
cd backend && npm start
```

## Démarrage rapide complet

Depuis la **racine** du projet :

```bash
# Installer toutes les dépendances
npm install

# Démarrer backend + frontend simultanément
npm run dev
```

Puis ouvrez votre navigateur sur **http://localhost:5173**

## Dépendances principales

- `vue` - Framework Vue.js 3
- `vue-router` - Routage
- `@tanstack/vue-query` - Gestion d'état et cache
- `axios` - Client HTTP
- `@vitejs/plugin-vue` - Plugin Vite pour Vue
- `vite` - Build tool et dev server
 
