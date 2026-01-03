import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock vue-router
vi.mock('vue-router', () => ({
  createRouter: vi.fn((config) => config),
  createWebHistory: vi.fn(() => 'web-history')
}))

describe('Router', () => {
  let router

  beforeEach(async () => {
    vi.resetModules()
    router = await import('../../../src/router/index')
  })

  it('should have correct number of routes', () => {
    expect(router.default.routes).toBeDefined()
    expect(router.default.routes).toHaveLength(6)
  })

  it('should have Home route', () => {
    const homeRoute = router.default.routes.find(r => r.name === 'Home')
    expect(homeRoute).toBeDefined()
    expect(homeRoute.path).toBe('/')
  })

  it('should have InvoiceList route', () => {
    const route = router.default.routes.find(r => r.name === 'InvoiceList')
    expect(route).toBeDefined()
    expect(route.path).toBe('/invoices')
  })

  it('should have InvoiceCreate route', () => {
    const route = router.default.routes.find(r => r.name === 'InvoiceCreate')
    expect(route).toBeDefined()
    expect(route.path).toBe('/invoices/new')
  })

  it('should have InvoiceDetail route with dynamic id', () => {
    const route = router.default.routes.find(r => r.name === 'InvoiceDetail')
    expect(route).toBeDefined()
    expect(route.path).toBe('/invoices/:id')
  })

  it('should have Revenue route', () => {
    const route = router.default.routes.find(r => r.name === 'Revenue')
    expect(route).toBeDefined()
    expect(route.path).toBe('/revenue')
  })

  it('should have ClientList route', () => {
    const route = router.default.routes.find(r => r.name === 'ClientList')
    expect(route).toBeDefined()
    expect(route.path).toBe('/clients')
  })

  it('should use web history mode', () => {
    expect(router.default.history).toBe('web-history')
  })

  it('should have lazy-loaded components', () => {
    router.default.routes.forEach(route => {
      expect(route.component).toBeDefined()
      expect(typeof route.component).toBe('function')
    })
  })
})
