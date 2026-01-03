<script setup>
import { ref } from 'vue'
import { RouterView, RouterLink } from 'vue-router'
import { useTheme } from './composables/useTheme'

const { theme, toggleTheme } = useTheme()
const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}
</script>

<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-container">
        <RouterLink to="/" class="logo" @click="closeMobileMenu">
          📊 Invoice App
        </RouterLink>

        <button class="hamburger" @click="toggleMobileMenu" :class="{ active: mobileMenuOpen }">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div class="nav-links" :class="{ open: mobileMenuOpen }">
          <RouterLink to="/" class="nav-link" @click="closeMobileMenu">Accueil</RouterLink>
          <RouterLink to="/invoices" class="nav-link" @click="closeMobileMenu">Factures</RouterLink>
          <RouterLink to="/clients" class="nav-link" @click="closeMobileMenu">Clients</RouterLink>
          <RouterLink to="/revenue" class="nav-link" @click="closeMobileMenu">Revenus</RouterLink>
          <button @click="toggleTheme" class="theme-toggle" :title="theme === 'dark' ? 'Mode clair' : 'Mode sombre'">
            {{ theme === 'dark' ? '☀' : '☾' }}
          </button>
        </div>
      </div>
    </nav>

    <main class="main-content">
      <RouterView />
    </main>

    <footer class="footer">
      <p>Invoice App 2026 - Gestion de factures avec architecture hexagonale</p>
    </footer>
  </div>
</template>

<style>
:root {
  /* Light theme colors */
  --bg-primary: #f5f5f5;
  --bg-secondary: #ffffff;
  --bg-tertiary: #f8f9fa;
  --text-primary: #2c3e50;
  --text-secondary: #555;
  --text-tertiary: #7f8c8d;
  --border-color: #e0e0e0;
  --border-color-light: #ddd;
  --shadow: rgba(0, 0, 0, 0.1);
  --accent: #42b983;
  --accent-hover: #359268;
}

[data-theme='dark'] {
  /* Dark theme colors */
  --bg-primary: #1a1a1a;
  --bg-secondary: #2d2d2d;
  --bg-tertiary: #242424;
  --text-primary: #e0e0e0;
  --text-secondary: #b0b0b0;
  --text-tertiary: #888;
  --border-color: #404040;
  --border-color-light: #4a4a4a;
  --shadow: rgba(0, 0, 0, 0.3);
  --accent: #42b983;
  --accent-hover: #359268;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.6;
  transition: background-color 0.3s, color 0.3s;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  background: var(--bg-secondary);
  box-shadow: 0 2px 8px var(--shadow);
  position: sticky;
  top: 0;
  z-index: 100;
  transition: background-color 0.3s;
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  text-decoration: none;
  transition: color 0.2s;
}

.logo:hover {
  color: var(--accent);
}

.nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
  padding: 0.5rem 0;
  border-bottom: 2px solid transparent;
}

.nav-link:hover {
  color: var(--accent);
}

.nav-link.router-link-active {
  color: var(--accent);
  border-bottom-color: var(--accent);
}

.theme-toggle {
  background: var(--bg-primary);
  border: 2px solid var(--text-primary);
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
  width: 44px;
  height: 44px;
}

.theme-toggle:hover {
  transform: scale(1.1);
  border-color: var(--accent);
  color: var(--accent);
}

.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 101;
}

.hamburger span {
  display: block;
  width: 28px;
  height: 3px;
  background: var(--text-primary);
  border-radius: 3px;
  transition: all 0.3s ease;
}

.hamburger.active span:nth-child(1) {
  transform: rotate(45deg) translate(8px, 8px);
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
}

.hamburger.active span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -7px);
}

.main-content {
  flex: 1;
  padding: 2rem 0;
}

.footer {
  background: var(--bg-secondary);
  color: var(--text-primary);
  text-align: center;
  padding: 1.5rem;
  margin-top: auto;
  border-top: 1px solid var(--border-color);
  transition: background-color 0.3s, color 0.3s;
}

.footer p {
  margin: 0;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .nav-container {
    padding: 1rem;
  }

  .hamburger {
    display: flex;
  }

  .nav-links {
    position: fixed;
    top: 0;
    right: -100%;
    height: 100vh;
    width: 70%;
    max-width: 300px;
    background: var(--bg-secondary);
    flex-direction: column;
    padding: 5rem 2rem 2rem;
    gap: 1.5rem;
    box-shadow: -2px 0 10px var(--shadow);
    transition: right 0.3s ease;
    align-items: flex-start;
  }

  .nav-links.open {
    right: 0;
  }

  .nav-link {
    width: 100%;
    padding: 0.75rem 0;
    border-bottom: 2px solid transparent;
    font-size: 1.1rem;
  }

  .theme-toggle {
    margin-top: 1rem;
  }

  .main-content {
    padding: 1rem 0;
  }

  .footer {
    font-size: 0.9rem;
    padding: 1rem;
  }
}
</style>
