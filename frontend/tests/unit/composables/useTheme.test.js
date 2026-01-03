import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('useTheme', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    // Reset document attribute
    document.documentElement.removeAttribute('data-theme')
    // Reset the module to get a fresh instance
    vi.resetModules()
  })

  it('should default to light theme', async () => {
    const { useTheme } = await import('../../../src/composables/useTheme')
    const { theme } = useTheme()
    expect(theme.value).toBe('light')
  })

  it('should load theme from localStorage', async () => {
    localStorage.setItem('theme', 'dark')
    const { useTheme } = await import('../../../src/composables/useTheme')
    const { theme } = useTheme()
    expect(theme.value).toBe('dark')
  })

  it('should toggle theme from light to dark', async () => {
    const { useTheme } = await import('../../../src/composables/useTheme')
    const { theme, toggleTheme } = useTheme()
    expect(theme.value).toBe('light')
    toggleTheme()
    expect(theme.value).toBe('dark')
  })

  it('should toggle theme from dark to light', async () => {
    localStorage.setItem('theme', 'dark')
    const { useTheme } = await import('../../../src/composables/useTheme')
    const { theme, toggleTheme } = useTheme()
    expect(theme.value).toBe('dark')
    toggleTheme()
    expect(theme.value).toBe('light')
  })

  it('should set theme using setTheme', async () => {
    const { useTheme } = await import('../../../src/composables/useTheme')
    const { theme, setTheme } = useTheme()
    setTheme('dark')
    expect(theme.value).toBe('dark')
    setTheme('light')
    expect(theme.value).toBe('light')
  })

  it('should save theme to localStorage', async () => {
    const { useTheme } = await import('../../../src/composables/useTheme')
    const { setTheme } = useTheme()
    setTheme('dark')
    // Wait for watcher to update localStorage
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it('should update document data-theme attribute', async () => {
    const { useTheme } = await import('../../../src/composables/useTheme')
    const { setTheme } = useTheme()
    setTheme('dark')
    // Wait for watcher to update
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  it('should return isDark function that checks if theme is dark', async () => {
    const { useTheme } = await import('../../../src/composables/useTheme')
    const { isDark, setTheme } = useTheme()
    setTheme('light')
    expect(isDark()).toBe(false)
    setTheme('dark')
    expect(isDark()).toBe(true)
  })
})
