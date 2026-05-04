<template>
  <div>
    <!-- Hero -->
    <section class="hero">
      <div class="hero-content">
        <img src="/img/logo-white.svg" alt="Alternative PC" class="hero-logo" />
        <h1>Compra. Vende. Repara.</h1>
        <p>El marketplace de PCs y componentes de segunda mano. Verificados, con garantía y a precio justo.</p>
        <div class="hero-btns">
          <NuxtLink to="/marketplace" class="btn-w">Explorar marketplace →</NuxtLink>
          <a href="#vende" class="btn-o">Vender mis partes</a>
        </div>
        <div class="hero-stats">
          <div><strong>{{ listings.length }}+</strong><span>Artículos</span></div>
          <div class="sep"></div>
          <div><strong>100%</strong><span>Verificados</span></div>
          <div class="sep"></div>
          <div><strong>24h</strong><span>Respuesta</span></div>
        </div>
      </div>
    </section>

    <!-- Listings -->
    <section class="section" id="listings">
      <div class="container">
        <div class="section-head">
          <h2>Publicaciones recientes</h2>
          <NuxtLink to="/marketplace" class="link-arrow">Ver todo →</NuxtLink>
        </div>
        <div v-if="listings.length" class="grid">
          <div v-for="item in listings.slice(0, 6)" :key="item.id" class="card">
            <div class="card-img">
              <span class="card-cat">{{ categoryLabel(item.category) }}</span>
            </div>
            <div class="card-body">
              <h3>{{ item.title }}</h3>
              <p class="card-cond">{{ item.condition }}</p>
              <div class="card-footer">
                <span class="card-price">S/ {{ item.price.toFixed(0) }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="empty">
          <p>Pronto tendremos artículos disponibles</p>
        </div>
      </div>
    </section>

    <!-- Vende hoy -->
    <section id="vende" class="section dark">
      <div class="container narrow">
        <div class="section-head center">
          <span class="tag">VENDE HOY</span>
          <h2>Convierte tus partes en efectivo</h2>
          <p class="section-sub">Completa el formulario, revisamos tu pieza y te hacemos una oferta. Pago rápido y seguro.</p>
        </div>

        <form @submit.prevent="submitSell" class="form-card">
          <div class="row">
            <div class="field">
              <label>¿Qué quieres vender?</label>
              <select v-model="sell.partType" required>
                <option value="">Seleccionar...</option>
                <optgroup label="Equipos completos">
                  <option value="pc_desktop">PC de escritorio</option>
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
            <div class="field">
              <label>Estado</label>
              <select v-model="sell.condition" required>
                <option value="">Seleccionar...</option>
                <option value="como_nuevo">Como nuevo</option>
                <option value="buen_estado">Buen estado</option>
                <option value="uso_normal">Uso normal</option>
                <option value="necesita_reparacion">Necesita reparación</option>
              </select>
            </div>
          </div>
          <div class="row">
            <div class="field">
              <label>Marca</label>
              <input v-model="sell.brand" placeholder="Ej: Intel, AMD, NVIDIA..." required />
            </div>
            <div class="field">
              <label>Modelo</label>
              <input v-model="sell.model" placeholder="Ej: Core i5-12400, RTX 3060..." required />
            </div>
          </div>
          <div class="field">
            <label>Descripción <span class="opt">(opcional)</span></label>
            <textarea v-model="sell.description" placeholder="Tiempo de uso, detalles adicionales..." rows="3"></textarea>
          </div>

          <div v-if="sellEstimate" class="estimate">
            <div class="estimate-label">Estimado de pago</div>
            <div class="estimate-amount">S/ {{ sellEstimate.min }} — {{ sellEstimate.max }}</div>
            <div class="estimate-note">*El monto final se determina tras revisión física</div>
          </div>

          <button type="submit" class="btn-w full" :disabled="sellLoading">
            {{ sellLoading ? 'Enviando...' : 'Enviar solicitud de venta' }}
          </button>

          <p v-if="sellMsg" class="msg ok">{{ sellMsg }}</p>
          <p v-if="sellErr" class="msg err">{{ sellErr }}</p>
        </form>
      </div>
    </section>

    <!-- Mantenimiento -->
    <section class="section">
      <div class="container narrow">
        <div class="section-head center">
          <span class="tag">SERVICIO TÉCNICO</span>
          <h2>Mantenimiento profesional</h2>
          <p class="section-sub">¿Tu PC anda lenta o tiene problemas? Nuestro equipo técnico la deja como nueva.</p>
        </div>

        <form @submit.prevent="submitMaint" class="form-card">
          <div class="row">
            <div class="field">
              <label>Tipo de servicio</label>
              <select v-model="maint.serviceType" required>
                <option value="">Seleccionar...</option>
                <option value="limpieza">Limpieza general</option>
                <option value="reparacion">Reparación</option>
                <option value="upgrade">Upgrade / Mejora</option>
                <option value="diagnostico">Diagnóstico</option>
                <option value="formateo">Formateo / Reinstalación</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            <div class="field">
              <label>Tipo de equipo</label>
              <select v-model="maint.deviceType" required>
                <option value="">Seleccionar...</option>
                <option value="desktop">PC de escritorio</option>
                <option value="laptop">Laptop</option>
                <option value="all_in_one">All-in-One</option>
                <option value="otro">Otro</option>
              </select>
            </div>
          </div>
          <div class="field">
            <label>Marca del equipo <span class="opt">(opcional)</span></label>
            <input v-model="maint.deviceBrand" placeholder="Ej: HP, Lenovo, armada..." />
          </div>
          <div class="field">
            <label>Describe el problema</label>
            <textarea v-model="maint.description" placeholder="Cuéntanos qué le pasa a tu equipo..." rows="3" required></textarea>
          </div>

          <button type="submit" class="btn-w full" :disabled="maintLoading">
            {{ maintLoading ? 'Enviando...' : 'Solicitar mantenimiento' }}
          </button>

          <p v-if="maintMsg" class="msg ok">{{ maintMsg }}</p>
          <p v-if="maintErr" class="msg err">{{ maintErr }}</p>
        </form>
      </div>
    </section>
  </div>
</template>

<script setup>
const config = useRuntimeConfig()
const { isLoggedIn, authHeaders } = useAuth()
const router = useRouter()

const listings = ref([])
onMounted(async () => {
  try { listings.value = await $fetch(`${config.public.apiUrl}/api/listings`) } catch {}
})

function categoryLabel(c) {
  return { pc_armada:'PC Armada', componente:'Componente', periferico:'Periférico', accesorio:'Accesorio', otro:'Otro' }[c] || c
}

// === Sell ===
const sell = reactive({ partType:'', brand:'', model:'', condition:'', description:'' })
const sellLoading = ref(false)
const sellMsg = ref('')
const sellErr = ref('')
const estimates = {
  pc_desktop:{min:100,max:600}, laptop:{min:80,max:500}, all_in_one:{min:80,max:450},
  cpu:{min:30,max:150}, gpu:{min:50,max:300}, ram:{min:15,max:60}, motherboard:{min:25,max:120},
  storage:{min:15,max:80}, psu:{min:15,max:60}, case:{min:10,max:40}, cooler:{min:10,max:30},
  monitor:{min:30,max:150}, keyboard:{min:5,max:25}, mouse:{min:5,max:15}, otro:{min:5,max:100}
}
const sellEstimate = computed(() => sell.partType ? estimates[sell.partType] || estimates.otro : null)

async function submitSell() {
  if (!isLoggedIn.value) { router.push('/login'); return }
  sellLoading.value = true; sellMsg.value = ''; sellErr.value = ''
  try {
    const res = await $fetch(`${config.public.apiUrl}/api/sell-requests`, { method:'POST', headers:authHeaders(), body:{...sell} })
    sellMsg.value = res.message
    Object.keys(sell).forEach(k => sell[k] = '')
  } catch (e) { sellErr.value = e.data?.error || 'Error al enviar' }
  finally { sellLoading.value = false }
}

// === Maintenance ===
const maint = reactive({ serviceType:'', description:'', deviceType:'', deviceBrand:'' })
const maintLoading = ref(false)
const maintMsg = ref('')
const maintErr = ref('')

async function submitMaint() {
  if (!isLoggedIn.value) { router.push('/login'); return }
  maintLoading.value = true; maintMsg.value = ''; maintErr.value = ''
  try {
    const res = await $fetch(`${config.public.apiUrl}/api/maintenance-requests`, { method:'POST', headers:authHeaders(), body:{...maint} })
    maintMsg.value = res.message
    Object.keys(maint).forEach(k => maint[k] = '')
  } catch (e) { maintErr.value = e.data?.error || 'Error al enviar' }
  finally { maintLoading.value = false }
}
</script>

<style scoped>
.container { max-width: 1100px; margin: 0 auto; padding: 0 2rem; }
.narrow { max-width: 680px; }

/* Hero */
.hero {
  min-height: 85vh; display: flex; align-items: center; justify-content: center;
  text-align: center; padding: 4rem 2rem;
  background: radial-gradient(ellipse at 50% 0%, #111 0%, #000 70%);
}
.hero-logo { height: 40px; margin-bottom: 2rem; opacity: 0.7; }
.hero h1 { font-size: 3.5rem; font-weight: 800; letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 1rem; }
.hero p { font-size: 1.1rem; color: var(--text-secondary); max-width: 500px; margin: 0 auto 2.5rem; line-height: 1.6; }
.hero-btns { display: flex; gap: 1rem; justify-content: center; margin-bottom: 3rem; }
.hero-stats { display: flex; gap: 2rem; justify-content: center; align-items: center; }
.hero-stats div { text-align: center; }
.hero-stats strong { display: block; font-size: 1.3rem; font-weight: 700; }
.hero-stats span { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
.hero-stats .sep { width: 1px; height: 30px; background: var(--border); }

/* Buttons */
.btn-w {
  display: inline-block; padding: 12px 28px; background: #fff; color: #000;
  border: none; border-radius: 8px; font-weight: 600; font-size: 0.9rem;
  cursor: pointer; transition: all 0.15s; text-decoration: none;
}
.btn-w:hover { background: #ddd; opacity: 1; }
.btn-w.full { width: 100%; text-align: center; }
.btn-w:disabled { opacity: 0.3; cursor: not-allowed; }
.btn-o {
  display: inline-block; padding: 12px 28px; border: 1px solid var(--border-hover);
  color: var(--text-secondary); border-radius: 8px; font-weight: 500; font-size: 0.9rem;
  text-decoration: none; transition: all 0.15s;
}
.btn-o:hover { border-color: #fff; color: #fff; opacity: 1; }

/* Sections */
.section { padding: 5rem 0; }
.section.dark { background: var(--bg-card); }
.section-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2rem; }
.section-head.center { flex-direction: column; align-items: center; text-align: center; }
.section-head h2 { font-size: 1.8rem; font-weight: 700; letter-spacing: -0.02em; }
.section-sub { color: var(--text-secondary); margin-top: 0.5rem; max-width: 480px; line-height: 1.5; }
.link-arrow { font-size: 0.85rem; color: var(--text-muted); }
.link-arrow:hover { color: #fff; }
.tag {
  font-size: 0.7rem; letter-spacing: 0.12em; font-weight: 600;
  color: var(--text-muted); border: 1px solid var(--border); padding: 4px 12px;
  border-radius: 4px; margin-bottom: 1rem; display: inline-block;
}

/* Cards grid */
.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
@media (max-width: 768px) { .grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px) { .grid { grid-template-columns: 1fr; } }
.card { background: var(--bg); transition: background 0.15s; }
.card:hover { background: var(--bg-elevated); }
.card-img {
  height: 140px; background: var(--bg-card); display: flex; align-items: flex-start;
  justify-content: flex-start; padding: 12px; position: relative;
}
.card-cat {
  font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.06em;
  background: rgba(255,255,255,0.08); padding: 3px 8px; border-radius: 3px; color: var(--text-secondary);
}
.card-body { padding: 1rem; }
.card-body h3 { font-size: 0.9rem; font-weight: 600; margin-bottom: 4px; line-height: 1.3; }
.card-cond { font-size: 0.75rem; color: var(--text-muted); }
.card-footer { margin-top: 10px; }
.card-price { font-size: 1.1rem; font-weight: 700; }

.empty { text-align: center; padding: 4rem; color: var(--text-muted); border: 1px solid var(--border); border-radius: 12px; }

/* Forms */
.form-card {
  margin-top: 2rem; background: var(--bg); border: 1px solid var(--border);
  border-radius: 12px; padding: 2rem;
}
.section.dark .form-card { background: var(--bg-elevated); }
.row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
@media (max-width: 600px) { .row { grid-template-columns: 1fr; } }
.field { margin-bottom: 1.25rem; }
.field label { display: block; font-size: 0.8rem; font-weight: 500; color: var(--text-secondary); margin-bottom: 6px; }
.field .opt { color: var(--text-muted); font-weight: 400; }
.field input, .field select, .field textarea {
  width: 100%; padding: 10px 12px; border-radius: 6px;
  border: 1px solid var(--border); background: var(--bg);
  color: var(--text); font-size: 0.9rem;
}
.section.dark .field input, .section.dark .field select, .section.dark .field textarea { background: var(--bg-card); }
.field input:focus, .field select:focus, .field textarea:focus { outline: none; border-color: var(--border-hover); }
.field input::placeholder, .field textarea::placeholder { color: var(--text-muted); }

.estimate {
  text-align: center; padding: 1.25rem; margin-bottom: 1.25rem;
  border: 1px solid var(--border); border-radius: 8px;
}
.estimate-label { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
.estimate-amount { font-size: 1.8rem; font-weight: 800; margin: 4px 0; }
.estimate-note { font-size: 0.7rem; color: var(--text-muted); }

.msg { margin-top: 1rem; padding: 0.75rem; border-radius: 6px; font-size: 0.85rem; text-align: center; }
.msg.ok { background: rgba(0,255,106,0.08); border: 1px solid rgba(0,255,106,0.2); color: var(--green); }
.msg.err { background: rgba(255,59,48,0.08); border: 1px solid rgba(255,59,48,0.2); color: var(--red); }

@media (max-width: 768px) {
  .hero h1 { font-size: 2.2rem; }
  .hero-btns { flex-direction: column; align-items: center; }
}
</style>
