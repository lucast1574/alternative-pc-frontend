<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1>Crear cuenta</h1>
      <p class="sub">Necesitamos tus datos para verificar tu identidad</p>

      <form @submit.prevent="handleRegister">
        <div class="form-row">
          <div class="form-group">
            <label>Nombre completo *</label>
            <input v-model="form.name" type="text" placeholder="Juan Pérez" required />
          </div>
          <div class="form-group">
            <label>DNI *</label>
            <input v-model="form.dni" type="text" placeholder="12345678" maxlength="8" required />
          </div>
        </div>

        <div class="form-group">
          <label>Email *</label>
          <input v-model="form.email" type="email" placeholder="tu@email.com" required />
        </div>

        <div class="form-group">
          <label>Teléfono *</label>
          <input v-model="form.phone" type="tel" placeholder="999888777" required />
        </div>

        <div class="form-group">
          <label>Dirección *</label>
          <input v-model="form.address" type="text" placeholder="Av. ejemplo 123" required />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Ciudad *</label>
            <input v-model="form.city" type="text" placeholder="Lima" required />
          </div>
          <div class="form-group">
            <label>Distrito</label>
            <input v-model="form.district" type="text" placeholder="Miraflores" />
          </div>
        </div>

        <div class="form-group">
          <label>Contraseña (mín. 6 caracteres) *</label>
          <input v-model="form.password" type="password" minlength="6" required />
        </div>

        <div v-if="error" class="error-msg">{{ error }}</div>

        <button type="submit" class="btn primary full" :disabled="loading">
          {{ loading ? 'Creando...' : 'Crear cuenta' }}
        </button>
      </form>

      <div class="divider"><span>o</span></div>

      <button @click="loginWithGoogle" class="btn google full">
        <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
        Continuar con Google
      </button>

      <p class="switch">¿Ya tienes cuenta? <NuxtLink to="/login">Ingresar</NuxtLink></p>
    </div>
  </div>
</template>

<script setup>
const { register } = useAuth()
const router = useRouter()
const form = reactive({
  name: '', email: '', password: '', phone: '',
  dni: '', address: '', city: '', district: ''
})
const error = ref('')
const loading = ref(false)

async function handleRegister() {
  loading.value = true
  error.value = ''
  try {
    await register({ ...form })
    router.push('/')
  } catch (e) {
    error.value = e.data?.error || 'Error al registrar'
  } finally { loading.value = false }
}

function loginWithGoogle() {
  // TODO: Implement Google OAuth flow with client ID
  alert('Google Auth se configurará próximamente')
}
</script>

<style scoped>
.auth-page { display: flex; justify-content: center; align-items: center; min-height: 80vh; padding: 2rem; }
.auth-card { background: #151515; padding: 2.5rem; border-radius: 16px; width: 100%; max-width: 480px; border: 1px solid #222; }
.auth-card h1 { margin-bottom: 0.25rem; font-size: 1.5rem; }
.sub { color: #888; font-size: 0.85rem; margin-bottom: 1.5rem; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.form-group { margin-bottom: 1rem; }
.form-group label { display: block; font-size: 0.85rem; color: #aaa; margin-bottom: 4px; }
.form-group input { width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid #333; background: #0a0a0a; color: #e5e5e5; font-size: 0.9rem; }
.form-group input:focus { outline: none; border-color: #3b82f6; }
.btn { padding: 12px 28px; border-radius: 10px; font-weight: 600; font-size: 0.95rem; cursor: pointer; border: none; display: flex; align-items: center; justify-content: center; gap: 8px; }
.btn.primary { background: #3b82f6; color: #fff; }
.btn.google { background: #fff; color: #333; margin-top: 0; }
.btn.google:hover { background: #f0f0f0; }
.btn.full { width: 100%; }
.btn:disabled { opacity: 0.5; }
.divider { text-align: center; margin: 1.25rem 0; position: relative; }
.divider::before { content: ''; position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: #333; }
.divider span { background: #151515; padding: 0 12px; position: relative; color: #666; font-size: 0.85rem; }
.error-msg { padding: 0.75rem; background: #2d0a0a; border: 1px solid #7f1d1d; border-radius: 8px; color: #fca5a5; margin-bottom: 1rem; font-size: 0.85rem; }
.switch { margin-top: 1.5rem; text-align: center; color: #888; font-size: 0.9rem; }
</style>
