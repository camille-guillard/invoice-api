import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/invoices',
    name: 'InvoiceList',
    component: () => import('../views/InvoiceListView.vue')
  },
  {
    path: '/invoices/new',
    name: 'InvoiceCreate',
    component: () => import('../views/InvoiceFormView.vue')
  },
  {
    path: '/invoices/:id',
    name: 'InvoiceDetail',
    component: () => import('../views/InvoiceDetailView.vue')
  },
  {
    path: '/revenue',
    name: 'Revenue',
    component: () => import('../views/RevenueView.vue')
  },
  {
    path: '/clients',
    name: 'ClientList',
    component: () => import('../views/ClientListView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
