<template>
  <div class="auth-page">
    <div class="auth-card">
      <img src="/img/logo-white.svg" alt="Alternative PC" class="auth-logo" />
      <h1>Crear cuenta</h1>
      <p class="sub">Necesitamos verificar tu identidad para transacciones seguras</p>

      <button class="btn-google full" @click="googleLogin">
        <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
        Continuar con Google
      </button>

      <div class="divider"><span>o registrarse con email</span></div>

      <form @submit.prevent="handleRegister">
        <div class="row">
          <div class="field"><label>Nombre completo</label><input v-model="f.name" required /></div>
          <div class="field"><label>DNI</label><input v-model="f.dni" maxlength="8" required /></div>
        </div>
        <div class="field"><label>Email</label><input v-model="f.email" type="email" required /></div>
        <div class="field"><label>Teléfono</label><input v-model="f.phone" type="tel" required /></div>
        <div class="field"><label>Dirección</label><input v-model="f.address" required /></div>
        <div class="row">
          <div class="field"><label>Ciudad</label><input v-model="f.city" required /></div>
          <div class="field"><label>Distrito <span class="opt">(opcional)</span></label><input v-model="f.district" /></div>
        </div>
        <div class="field"><label>Contraseña (mín. 6 caracteres)</label><input v-model="f.password" type="password" minlength="6" required /></div>
        <p v-if="error" class="msg err">{{ error }}</p>
        <button type="submit" class="btn-w full" :disabled="loading">
          {{ loading ? 'Creando...' : 'Crear cuenta' }}
        </button>
      </form>
      <p class="switch">¿Ya tienes cuenta? <NuxtLink to="/login">Ingresar</NuxtLink></p>
    </div>
  </div>
</template>

<script setup>
const { register } = useAuth()
const router = useRouter()
const f = reactive({ name:'', email:'', password:'', phone:'', dni:'', address:'', city:'', district:'' })
const error = ref(''); const loading = ref(false)

async function handleRegister() {
  loading.value = true; error.value = ''
  try { await register({...f}); router.push('/') }
  catch (e) { error.value = e.data?.error || 'Error al registrar' }
  finally { loading.value = false }
}
function googleLogin() { alert('Google Auth se configurará próximamente') }
</script>

<style scoped>
.auth-page { display: flex; justify-content: center; align-items: center; min-height: 85vh; padding: 2rem; }
.auth-card { width: 100%; max-width: 440px; }
.auth-logo { height: 28px; opacity: 0.5; margin-bottom: 2rem; display: block; }
h1 { font-size: 1.6rem; font-weight: 700; margin-bottom: 0.25rem; }
.sub { color: var(--text-muted); font-size: 0.85rem; margin-bottom: 2rem; }
.row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.field { margin-bottom: 1rem; }
.field label { display: block; font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 6px; }
.field .opt { color: var(--text-muted); font-weight: 400; }
.field input { width: 100%; padding: 10px 12px; border-radius: 6px; border: 1px solid var(--border); background: var(--bg); color: var(--text); font-size: 0.9rem; }
.field input:focus { outline: none; border-color: var(--border-hover); }
.btn-w { display: block; padding: 12px; background: #fff; color: #000; border: none; border-radius: 8px; font-weight: 600; font-size: 0.9rem; cursor: pointer; width: 100%; }
.btn-w:hover { background: #ddd; }
.btn-w:disabled { opacity: 0.3; }
.btn-google { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 12px; border-radius: 8px; background: var(--bg-elevated); border: 1px solid var(--border); color: var(--text); cursor: pointer; font-size: 0.9rem; }
.btn-google:hover { border-color: var(--border-hover); }
.divider { text-align: center; margin: 1.5rem 0; position: relative; }
.divider::before { content: ''; position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: var(--border); }
.divider span { background: var(--bg); padding: 0 12px; position: relative; color: var(--text-muted); font-size: 0.8rem; }
.msg { margin-bottom: 1rem; padding: 0.75rem; border-radius: 6px; font-size: 0.85rem; text-align: center; }
.msg.err { background: rgba(255,59,48,0.08); border: 1px solid rgba(255,59,48,0.2); color: var(--red); }
.switch { margin-top: 2rem; text-align: center; color: var(--text-muted); font-size: 0.85rem; }
.switch a { color: #fff; text-decoration: underline; }
.full { width: 100%; }
</style>
