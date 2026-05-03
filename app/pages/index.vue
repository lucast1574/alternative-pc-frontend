<template>
  <div>
    <!-- Hero -->
    <section class="hero">
      <div class="container">
        <h1>Tu próxima PC está aquí</h1>
        <p>Compra PCs armadas con componentes verificados, vende tus partes, o solicita mantenimiento profesional.</p>
        <div class="hero-actions">
          <NuxtLink to="/marketplace" class="btn primary">Ver marketplace</NuxtLink>
          <a href="#vende" class="btn secondary">Vende tus partes</a>
        </div>
      </div>
    </section>

    <!-- Featured Listings -->
    <section class="section">
      <div class="container">
        <h2>🔥 Publicaciones recientes</h2>
        <div v-if="listings.length" class="listing-grid">
          <div v-for="item in listings.slice(0, 6)" :key="item.id" class="listing-card">
            <div class="listing-img">🖥️</div>
            <div class="listing-info">
              <span class="category-tag">{{ categoryLabel(item.category) }}</span>
              <h3>{{ item.title }}</h3>
              <p class="condition">{{ item.condition }}</p>
              <p class="price">S/ {{ item.price.toFixed(2) }}</p>
            </div>
          </div>
        </div>
        <div v-else class="empty-state">
          <p>Aún no hay publicaciones. ¡Sé el primero en publicar!</p>
        </div>
      </div>
    </section>

    <!-- Vende Hoy -->
    <section id="vende" class="section sell-section">
      <div class="container">
        <div class="sell-header">
          <h2>💰 ¡Vende hoy lo que ya no uses!</h2>
          <p>Completa el formulario, revisamos tu parte y te hacemos una oferta. Pago rápido.</p>
        </div>

        <form @submit.prevent="submitSellRequest" class="sell-form">
          <div class="form-row">
            <div class="form-group">
              <label>Tipo de parte *</label>
              <select v-model="sellForm.partType" required>
                <option value="">Seleccionar...</option>
                <optgroup label="Equipos completos">
                  <option value="pc_desktop">PC de escritorio completa</option>
                  <option value="laptop">Laptop</option>
                  <option value="all_in_one">All-in-One</option>
                </optgroup>
                <optgroup label="Componentes">
                  <option value="cpu">Procesador (CPU)</option>
                  <option value="gpu">Tarjeta de video (GPU)</option>
                  <option value="ram">Memoria RAM</option>
                  <option value="motherboard">Placa madre</option>
                  <option value="storage">Almacenamiento (SSD/HDD)</option>
                  <option value="psu">Fuente de poder</option>
                  <option value="case">Case / Gabinete</option>
                  <option value="cooler">Cooler / Ventilador</option>
                </optgroup>
                <optgroup label="Periféricos">
                  <option value="monitor">Monitor</option>
                  <option value="keyboard">Teclado</option>
                  <option value="mouse">Mouse</option>
                </optgroup>
                <option value="otro">Otro</option>
              </select>
            </div>
            <div class="form-group">
              <label>Estado *</label>
              <select v-model="sellForm.condition" required>
                <option value="">Seleccionar...</option>
                <option value="como_nuevo">Como nuevo</option>
                <option value="buen_estado">Buen estado</option>
                <option value="uso_normal">Uso normal</option>
                <option value="necesita_reparacion">Necesita reparación</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Marca *</label>
              <input v-model="sellForm.brand" type="text" placeholder="Ej: Intel, AMD, NVIDIA..." required />
            </div>
            <div class="form-group">
              <label>Modelo *</label>
              <input v-model="sellForm.model" type="text" placeholder="Ej: Core i5-12400, RTX 3060..." required />
            </div>
          </div>

          <div class="form-group">
            <label>Descripción adicional</label>
            <textarea v-model="sellForm.description" placeholder="Detalles adicionales, tiempo de uso, etc." rows="3"></textarea>
          </div>

          <div v-if="estimate" class="estimate-box">
            <p>💵 Estimado de pago:</p>
            <span class="estimate-range">S/ {{ estimate.min }} — S/ {{ estimate.max }}</span>
            <small>*El monto final se determina después de la revisión física</small>
          </div>

          <h3 class="form-subtitle">Tus datos de contacto</h3>
          <div class="form-row three">
            <div class="form-group">
              <label>Nombre *</label>
              <input v-model="sellForm.sellerName" type="text" required />
            </div>
            <div class="form-group">
              <label>Email *</label>
              <input v-model="sellForm.sellerEmail" type="email" required />
            </div>
            <div class="form-group">
              <label>Teléfono *</label>
              <input v-model="sellForm.sellerPhone" type="tel" required />
            </div>
          </div>

          <button type="submit" class="btn primary full" :disabled="sellLoading">
            {{ sellLoading ? 'Enviando...' : '📦 Enviar solicitud de venta' }}
          </button>

          <div v-if="sellSuccess" class="success-msg">
            ✅ {{ sellSuccess }}
          </div>
          <div v-if="sellError" class="error-msg">
            ❌ {{ sellError }}
          </div>
        </form>
      </div>
    </section>

    <!-- Mantenimiento -->
    <section class="section maint-section">
      <div class="container">
        <div class="sell-header">
          <h2>🔧 Servicio de mantenimiento</h2>
          <p>¿Tu PC anda lenta o tiene problemas? Nuestro experto la deja como nueva.</p>
        </div>

        <form @submit.prevent="submitMaintenance" class="sell-form">
          <div class="form-row">
            <div class="form-group">
              <label>Tipo de servicio *</label>
              <select v-model="maintForm.serviceType" required>
                <option value="">Seleccionar...</option>
                <option value="limpieza">Limpieza general</option>
                <option value="reparacion">Reparación</option>
                <option value="upgrade">Upgrade / Mejora</option>
                <option value="diagnostico">Diagnóstico</option>
                <option value="formateo">Formateo / Reinstalación</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            <div class="form-group">
              <label>Tipo de equipo *</label>
              <select v-model="maintForm.deviceType" required>
                <option value="">Seleccionar...</option>
                <option value="desktop">PC de escritorio</option>
                <option value="laptop">Laptop</option>
                <option value="all_in_one">All-in-One</option>
                <option value="otro">Otro</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>Marca del equipo</label>
            <input v-model="maintForm.deviceBrand" type="text" placeholder="Ej: HP, Lenovo, armada..." />
          </div>

          <div class="form-group">
            <label>Describe el problema o lo que necesitas *</label>
            <textarea v-model="maintForm.description" placeholder="Cuéntanos qué le pasa a tu equipo..." rows="3" required></textarea>
          </div>

          <h3 class="form-subtitle">Tus datos de contacto</h3>
          <div class="form-row three">
            <div class="form-group">
              <label>Nombre *</label>
              <input v-model="maintForm.clientName" type="text" required />
            </div>
            <div class="form-group">
              <label>Email *</label>
              <input v-model="maintForm.clientEmail" type="email" required />
            </div>
            <div class="form-group">
              <label>Teléfono *</label>
              <input v-model="maintForm.clientPhone" type="tel" required />
            </div>
          </div>

          <button type="submit" class="btn primary full" :disabled="maintLoading">
            {{ maintLoading ? 'Enviando...' : '🔧 Solicitar mantenimiento' }}
          </button>

          <div v-if="maintSuccess" class="success-msg">
            ✅ {{ maintSuccess }}
          </div>
          <div v-if="maintError" class="error-msg">
            ❌ {{ maintError }}
          </div>
        </form>
      </div>
    </section>
  </div>
</template>

<script setup>
const config = useRuntimeConfig()

// Listings
const listings = ref([])
onMounted(async () => {
  try {
    listings.value = await $fetch(`${config.public.apiUrl}/api/listings`)
  } catch (e) { /* empty marketplace */ }
})

function categoryLabel(cat) {
  const labels = {
    pc_armada: 'PC Armada', componente: 'Componente',
    periferico: 'Periférico', accesorio: 'Accesorio', otro: 'Otro'
  }
  return labels[cat] || cat
}

// Sell form
const sellForm = reactive({
  partType: '', brand: '', model: '', condition: '',
  description: '', sellerName: '', sellerEmail: '', sellerPhone: ''
})
const sellLoading = ref(false)
const sellSuccess = ref('')
const sellError = ref('')
const estimate = ref(null)

const estimates = {
  pc_desktop: { min: 100, max: 600 }, laptop: { min: 80, max: 500 },
  all_in_one: { min: 80, max: 450 },
  cpu: { min: 30, max: 150 }, gpu: { min: 50, max: 300 },
  ram: { min: 15, max: 60 }, motherboard: { min: 25, max: 120 },
  storage: { min: 15, max: 80 }, psu: { min: 15, max: 60 },
  case: { min: 10, max: 40 }, cooler: { min: 10, max: 30 },
  monitor: { min: 30, max: 150 }, keyboard: { min: 5, max: 25 },
  mouse: { min: 5, max: 15 }, otro: { min: 5, max: 100 }
}

watch(() => sellForm.partType, (val) => {
  estimate.value = val ? estimates[val] || estimates.otro : null
})

async function submitSellRequest() {
  sellLoading.value = true
  sellSuccess.value = ''
  sellError.value = ''
  try {
    const res = await $fetch(`${config.public.apiUrl}/api/sell-requests`, {
      method: 'POST', body: { ...sellForm }
    })
    sellSuccess.value = res.message
    Object.keys(sellForm).forEach(k => sellForm[k] = '')
    estimate.value = null
  } catch (e) {
    sellError.value = e.data?.error || 'Error al enviar solicitud'
  } finally { sellLoading.value = false }
}

// Maintenance form
const maintForm = reactive({
  serviceType: '', description: '', deviceType: '',
  deviceBrand: '', clientName: '', clientEmail: '', clientPhone: ''
})
const maintLoading = ref(false)
const maintSuccess = ref('')
const maintError = ref('')

async function submitMaintenance() {
  maintLoading.value = true
  maintSuccess.value = ''
  maintError.value = ''
  try {
    const res = await $fetch(`${config.public.apiUrl}/api/maintenance-requests`, {
      method: 'POST', body: { ...maintForm }
    })
    maintSuccess.value = res.message
    Object.keys(maintForm).forEach(k => maintForm[k] = '')
  } catch (e) {
    maintError.value = e.data?.error || 'Error al enviar solicitud'
  } finally { maintLoading.value = false }
}
</script>

<style scoped>
.container { max-width: 1000px; margin: 0 auto; padding: 0 1.5rem; }

.hero {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  padding: 5rem 2rem;
  text-align: center;
}
.hero h1 { font-size: 2.8rem; font-weight: 700; margin-bottom: 1rem; color: #fff; }
.hero p { font-size: 1.15rem; color: #94a3b8; max-width: 600px; margin: 0 auto 2rem; }
.hero-actions { display: flex; gap: 1rem; justify-content: center; }

.btn {
  padding: 12px 28px; border-radius: 10px; font-weight: 600;
  font-size: 0.95rem; cursor: pointer; border: none; display: inline-block;
  text-decoration: none; transition: all 0.2s;
}
.btn.primary { background: #3b82f6; color: #fff; }
.btn.primary:hover { background: #2563eb; text-decoration: none; }
.btn.secondary { background: #1e293b; color: #e2e8f0; border: 1px solid #334155; }
.btn.secondary:hover { background: #334155; text-decoration: none; }
.btn.full { width: 100%; text-align: center; }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }

.section { padding: 4rem 0; }
.section h2 { font-size: 1.6rem; margin-bottom: 2rem; }

.listing-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}
.listing-card {
  background: #151515; border-radius: 12px; overflow: hidden;
  border: 1px solid #222; transition: border-color 0.2s;
}
.listing-card:hover { border-color: #3b82f6; }
.listing-img {
  height: 160px; background: #1a1a1a; display: flex;
  align-items: center; justify-content: center; font-size: 3rem;
}
.listing-info { padding: 1rem; }
.category-tag {
  font-size: 0.7rem; background: #1e3a5f; color: #60a5fa;
  padding: 2px 8px; border-radius: 4px; text-transform: uppercase;
}
.listing-info h3 { margin: 8px 0 4px; font-size: 1rem; }
.condition { font-size: 0.8rem; color: #888; }
.price { font-size: 1.2rem; font-weight: 700; color: #22c55e; margin-top: 8px; }

.empty-state {
  text-align: center; padding: 3rem; background: #111;
  border-radius: 12px; color: #666;
}

.sell-section { background: #0d1117; }
.maint-section { background: #0a0a0a; }

.sell-header { text-align: center; margin-bottom: 2rem; }
.sell-header p { color: #94a3b8; margin-top: 0.5rem; }

.sell-form {
  max-width: 700px; margin: 0 auto;
  background: #151515; padding: 2rem; border-radius: 16px; border: 1px solid #222;
}

.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.form-row.three { grid-template-columns: 1fr 1fr 1fr; }
@media (max-width: 600px) {
  .form-row, .form-row.three { grid-template-columns: 1fr; }
}

.form-group { margin-bottom: 1rem; }
.form-group label {
  display: block; font-size: 0.85rem; color: #aaa;
  margin-bottom: 4px; font-weight: 500;
}
.form-group input, .form-group select, .form-group textarea {
  width: 100%; padding: 10px 12px; border-radius: 8px;
  border: 1px solid #333; background: #0a0a0a; color: #e5e5e5;
  font-size: 0.9rem; font-family: inherit;
}
.form-group input:focus, .form-group select:focus, .form-group textarea:focus {
  outline: none; border-color: #3b82f6;
}

.form-subtitle {
  font-size: 1rem; color: #ccc; margin: 1.5rem 0 0.5rem;
  padding-top: 1rem; border-top: 1px solid #222;
}

.estimate-box {
  background: #0f2a1a; border: 1px solid #166534; border-radius: 10px;
  padding: 1rem; text-align: center; margin-bottom: 1rem;
}
.estimate-box p { color: #86efac; font-weight: 500; }
.estimate-range { font-size: 1.5rem; font-weight: 700; color: #22c55e; }
.estimate-box small { display: block; color: #4ade80; margin-top: 4px; font-size: 0.75rem; }

.success-msg {
  margin-top: 1rem; padding: 1rem; background: #052e16;
  border: 1px solid #166534; border-radius: 8px; color: #86efac;
}
.error-msg {
  margin-top: 1rem; padding: 1rem; background: #2d0a0a;
  border: 1px solid #7f1d1d; border-radius: 8px; color: #fca5a5;
}
</style>
