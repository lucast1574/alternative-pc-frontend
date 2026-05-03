<template>
  <div class="container">
    <div class="card">
      <h1>🖥️ Alternative PC</h1>
      <p class="subtitle">Sistema de gestión</p>

      <div class="status-section">
        <h2>Estado del sistema</h2>

        <div class="status-item" :class="backendStatus.class">
          <span class="dot"></span>
          <div>
            <strong>Backend API</strong>
            <p>{{ backendStatus.message }}</p>
          </div>
        </div>

        <div class="status-item" :class="dbStatus.class">
          <span class="dot"></span>
          <div>
            <strong>Base de datos (MongoDB)</strong>
            <p>{{ dbStatus.message }}</p>
          </div>
        </div>

        <div v-if="statusData" class="details">
          <p><strong>Servicio:</strong> {{ statusData.service }}</p>
          <p><strong>Versión:</strong> {{ statusData.version }}</p>
          <p><strong>Base de datos:</strong> {{ statusData.dbName }}</p>
          <p><strong>Última verificación:</strong> {{ statusData.time }}</p>
        </div>

        <div v-if="error" class="error-details">
          <p>{{ error }}</p>
        </div>
      </div>

      <button @click="checkStatus" :disabled="loading" class="btn">
        {{ loading ? 'Verificando...' : '🔄 Verificar conexión' }}
      </button>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig()
const statusData = ref(null)
const error = ref(null)
const loading = ref(false)

const backendStatus = computed(() => {
  if (loading.value) return { class: 'loading', message: 'Verificando...' }
  if (error.value) return { class: 'error', message: 'No se pudo conectar al backend' }
  if (statusData.value) return { class: 'ok', message: `Conectado — ${config.public.apiUrl}` }
  return { class: 'unknown', message: 'Sin verificar' }
})

const dbStatus = computed(() => {
  if (loading.value) return { class: 'loading', message: 'Verificando...' }
  if (!statusData.value) return { class: 'unknown', message: 'Sin verificar' }
  if (statusData.value.database === 'connected') return { class: 'ok', message: 'Conectada y operativa' }
  return { class: 'error', message: statusData.value.database || 'Desconectada' }
})

async function checkStatus() {
  loading.value = true
  error.value = null
  statusData.value = null

  try {
    const data = await $fetch(`${config.public.apiUrl}/api/status`)
    statusData.value = data
  } catch (e) {
    error.value = e.message || 'Error de conexión'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  checkStatus()
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  background: #0f172a;
  color: #e2e8f0;
  min-height: 100vh;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
}

.card {
  background: #1e293b;
  border-radius: 16px;
  padding: 2.5rem;
  max-width: 520px;
  width: 100%;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

h1 {
  font-size: 1.8rem;
  margin-bottom: 0.25rem;
}

.subtitle {
  color: #94a3b8;
  margin-bottom: 2rem;
}

h2 {
  font-size: 1.1rem;
  color: #94a3b8;
  margin-bottom: 1rem;
}

.status-section {
  margin-bottom: 1.5rem;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  background: #0f172a;
  margin-bottom: 8px;
}

.status-item .dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-item.ok .dot { background: #22c55e; box-shadow: 0 0 8px #22c55e; }
.status-item.error .dot { background: #ef4444; box-shadow: 0 0 8px #ef4444; }
.status-item.loading .dot { background: #eab308; animation: pulse 1s infinite; }
.status-item.unknown .dot { background: #64748b; }

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.status-item strong {
  display: block;
  font-size: 0.95rem;
}

.status-item p {
  font-size: 0.8rem;
  color: #94a3b8;
  margin-top: 2px;
}

.details {
  margin-top: 16px;
  padding: 16px;
  background: #0f172a;
  border-radius: 10px;
  font-size: 0.85rem;
}

.details p {
  margin-bottom: 4px;
  color: #cbd5e1;
}

.error-details {
  margin-top: 12px;
  padding: 12px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  font-size: 0.85rem;
  color: #fca5a5;
}

.btn {
  width: 100%;
  padding: 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.btn:hover { background: #2563eb; }
.btn:disabled { background: #475569; cursor: not-allowed; }
</style>
