<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1>Iniciar sesión</h1>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Email</label>
          <input v-model="email" type="email" required />
        </div>
        <div class="form-group">
          <label>Contraseña</label>
          <input v-model="password" type="password" required />
        </div>
        <div v-if="error" class="error-msg">{{ error }}</div>
        <button type="submit" class="btn primary full" :disabled="loading">
          {{ loading ? 'Ingresando...' : 'Ingresar' }}
        </button>
      </form>
      <p class="switch">¿No tienes cuenta? <NuxtLink to="/registro">Regístrate</NuxtLink></p>
    </div>
  </div>
</template>

<script setup>
const { login } = useAuth()
const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  loading.value = true
  error.value = ''
  try {
    await login(email.value, password.value)
    router.push('/')
  } catch (e) {
    error.value = e.data?.error || 'Error al ingresar'
  } finally { loading.value = false }
}
</script>

<style scoped>
.auth-page { display: flex; justify-content: center; align-items: center; min-height: 80vh; padding: 2rem; }
.auth-card { background: #151515; padding: 2.5rem; border-radius: 16px; width: 100%; max-width: 400px; border: 1px solid #222; }
.auth-card h1 { margin-bottom: 1.5rem; font-size: 1.5rem; }
.form-group { margin-bottom: 1rem; }
.form-group label { display: block; font-size: 0.85rem; color: #aaa; margin-bottom: 4px; }
.form-group input { width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid #333; background: #0a0a0a; color: #e5e5e5; font-size: 0.9rem; }
.form-group input:focus { outline: none; border-color: #3b82f6; }
.btn { padding: 12px 28px; border-radius: 10px; font-weight: 600; font-size: 0.95rem; cursor: pointer; border: none; }
.btn.primary { background: #3b82f6; color: #fff; }
.btn.full { width: 100%; }
.btn:disabled { opacity: 0.5; }
.error-msg { padding: 0.75rem; background: #2d0a0a; border: 1px solid #7f1d1d; border-radius: 8px; color: #fca5a5; margin-bottom: 1rem; font-size: 0.85rem; }
.switch { margin-top: 1.5rem; text-align: center; color: #888; font-size: 0.9rem; }
</style>
