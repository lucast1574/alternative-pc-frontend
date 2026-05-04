<template>
  <div class="layout">
    <header class="nav">
      <div class="nav-inner">
        <NuxtLink to="/" class="nav-logo">
          <img src="/img/logo-white.svg" alt="Alternative PC" />
        </NuxtLink>

        <nav class="nav-links">
          <NuxtLink to="/marketplace">Marketplace</NuxtLink>
          <template v-if="isLoggedIn">
            <NuxtLink v-if="isSeller" to="/mis-publicaciones">Mis publicaciones</NuxtLink>
            <NuxtLink v-if="isAdmin" to="/admin">Admin</NuxtLink>
            <div class="nav-user">
              <span class="nav-role" :class="user?.role">{{ user?.role }}</span>
              <span class="nav-name">{{ user?.name?.split(' ')[0] }}</span>
              <button @click="logout" class="nav-logout">Salir</button>
            </div>
          </template>
          <template v-else>
            <NuxtLink to="/login" class="nav-btn">Ingresar</NuxtLink>
            <NuxtLink to="/registro" class="nav-btn filled">Crear cuenta</NuxtLink>
          </template>
        </nav>
      </div>
    </header>

    <main><slot /></main>

    <footer class="foot">
      <div class="foot-inner">
        <img src="/img/logo-white.svg" alt="Alternative PC" class="foot-logo" />
        <p>© 2026 Alternative PC. Todos los derechos reservados.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
const { user, isLoggedIn, isAdmin, isSeller, logout } = useAuth()
</script>

<style scoped>
.layout { min-height: 100vh; display: flex; flex-direction: column; }

.nav {
  position: sticky; top: 0; z-index: 100;
  background: rgba(0,0,0,0.85);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
}
.nav-inner {
  max-width: 1200px; margin: 0 auto; padding: 0 2rem;
  display: flex; align-items: center; justify-content: space-between; height: 60px;
}
.nav-logo img { height: 28px; opacity: 0.95; }
.nav-logo img:hover { opacity: 1; }

.nav-links { display: flex; align-items: center; gap: 2rem; }
.nav-links a { font-size: 0.85rem; color: var(--text-secondary); letter-spacing: -0.01em; transition: color 0.15s; }
.nav-links a:hover, .nav-links a.router-link-active { color: #fff; opacity: 1; }

.nav-btn {
  font-size: 0.85rem; padding: 6px 16px; border-radius: 6px;
  border: 1px solid var(--border-hover); color: var(--text-secondary);
}
.nav-btn:hover { color: #fff; border-color: #555; }
.nav-btn.filled { background: #fff; color: #000; border-color: #fff; }
.nav-btn.filled:hover { background: #ddd; opacity: 1; }

.nav-user { display: flex; align-items: center; gap: 8px; }
.nav-name { font-size: 0.85rem; color: var(--text-secondary); }
.nav-role {
  font-size: 0.65rem; padding: 2px 6px; border-radius: 3px;
  text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;
}
.nav-role.admin { background: #fff; color: #000; }
.nav-role.seller { background: var(--border-hover); color: #fff; }
.nav-role.user { background: var(--border); color: var(--text-muted); }
.nav-logout {
  font-size: 0.8rem; background: none; border: 1px solid var(--border);
  color: var(--text-muted); padding: 4px 10px; border-radius: 4px; cursor: pointer;
}
.nav-logout:hover { border-color: var(--red); color: var(--red); }

main { flex: 1; }

.foot { border-top: 1px solid var(--border); padding: 3rem 2rem; }
.foot-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; }
.foot-logo { height: 22px; opacity: 0.4; }
.foot p { font-size: 0.75rem; color: var(--text-muted); }

@media (max-width: 768px) {
  .nav-links { gap: 1rem; }
  .nav-links a:not(.nav-btn) { display: none; }
}
</style>
