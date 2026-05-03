<template>
  <div class="layout">
    <header class="navbar">
      <div class="nav-container">
        <NuxtLink to="/" class="logo">🖥️ Alternative PC</NuxtLink>
        <nav class="nav-links">
          <NuxtLink to="/">Inicio</NuxtLink>
          <NuxtLink to="/marketplace">Marketplace</NuxtLink>
          <template v-if="isLoggedIn">
            <NuxtLink v-if="isSeller" to="/mis-publicaciones">Mis publicaciones</NuxtLink>
            <NuxtLink v-if="isAdmin" to="/admin">Admin</NuxtLink>
            <div class="user-menu">
              <span class="user-name">{{ user?.name }}</span>
              <span class="role-badge" :class="user?.role">{{ user?.role }}</span>
              <button @click="logout" class="btn-logout">Salir</button>
            </div>
          </template>
          <template v-else>
            <NuxtLink to="/login" class="btn-nav">Ingresar</NuxtLink>
            <NuxtLink to="/registro" class="btn-nav primary">Registrarse</NuxtLink>
          </template>
        </nav>
      </div>
    </header>

    <main class="main-content">
      <slot />
    </main>

    <footer class="footer">
      <p>© 2026 Alternative PC — Compra, vende y repara tu PC</p>
    </footer>
  </div>
</template>

<script setup>
const { user, isLoggedIn, isAdmin, isSeller, logout } = useAuth()
</script>

<style scoped>
.layout { min-height: 100vh; display: flex; flex-direction: column; }

.navbar {
  background: #111;
  border-bottom: 1px solid #222;
  padding: 0 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.logo {
  font-size: 1.3rem;
  font-weight: 700;
  color: #fff !important;
  text-decoration: none !important;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-links a {
  color: #a1a1a1;
  font-size: 0.9rem;
  text-decoration: none;
  transition: color 0.2s;
}
.nav-links a:hover, .nav-links a.router-link-active { color: #fff; }

.btn-nav {
  padding: 6px 16px;
  border-radius: 8px;
  font-weight: 500;
  background: #1e1e1e;
}
.btn-nav.primary { background: #3b82f6; color: #fff !important; }
.btn-nav.primary:hover { background: #2563eb; }

.user-menu {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-name { color: #e5e5e5; font-size: 0.9rem; }

.role-badge {
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 12px;
  text-transform: uppercase;
  font-weight: 600;
}
.role-badge.admin { background: #ef4444; color: #fff; }
.role-badge.seller { background: #f59e0b; color: #000; }
.role-badge.user { background: #333; color: #aaa; }

.btn-logout {
  background: none;
  border: 1px solid #333;
  color: #aaa;
  padding: 4px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
}
.btn-logout:hover { border-color: #ef4444; color: #ef4444; }

.main-content { flex: 1; }

.footer {
  text-align: center;
  padding: 2rem;
  color: #555;
  font-size: 0.85rem;
  border-top: 1px solid #1a1a1a;
}
</style>
