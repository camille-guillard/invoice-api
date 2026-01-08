# Invoice App - Full Stack Application

**Application en ligne:** https://invoice-frontend-production-4e48.up.railway.app

Application complète de gestion de factures.

## Structure du projet

```
invoice-app/
├── backend/          # API REST (Node.js + Express)
├── frontend/         # Interface utilisateur (Vue.js 3 + Vite)
└── package.json      # Configuration workspace
```

## Installation

```bash
# Installer toutes les dépendances (backend + frontend)
npm install
```

## Développement

### Lancer backend + frontend simultanément

```bash
npm run dev
```

Cela va démarrer :
- **Backend** : http://localhost:3000
- **Frontend** : http://localhost:5173
- **API Swagger** : http://localhost:3000/api-docs

### Lancer séparément

```bash
# Backend uniquement
npm run dev:backend

# Frontend uniquement
npm run dev:frontend
```

## Build

```bash
# Build du frontend (production)
npm run build:frontend
```

## Tests

```bash
# Tests backend
npm run test:backend

# Tous les tests
npm run test
```

## Documentation

- **Backend** : Voir [backend/README.md](./backend/README.md)
- **Frontend** : Voir [frontend/README.md](./frontend/README.md)

## Stack Technique

### Backend
- Node.js + Express.js
- Architecture hexagonale (Ports & Adapters)
- Swagger UI
- Vitest

### Frontend
- Vue.js 3 (Composition API)
- Vite
- Vue Router
- TanStack Query (vue-query)
- Axios

## Fonctionnalités

- Créer des factures
- Liste des factures avec filtres
- Voir les détails d'une facture
- Marquer une facture comme payée
- Calculer le revenu par période
- Documentation API interactive (Swagger)
