<template>
  <div class="page">
    <div class="container">
      <div class="header-row">
        <h1>Mis publicaciones</h1>
        <button v-if="isSeller" @click="showForm = !showForm" class="btn primary">
          {{ showForm ? 'Cancelar' : '+ Nueva publicación' }}
        </button>
      </div>

      <!-- Create form -->
      <div v-if="showForm" class="create-form">
        <h2>Crear publicación</h2>
        <form @submit.prevent="createListing">
          <div class="form-row">
            <div class="form-group">
              <label>Título *</label>
              <input v-model="form.title" type="text" required />
            </div>
            <div class="form-group">
              <label>Categoría *</label>
              <select v-model="form.category" required>
                <option value="">Seleccionar...</option>
                <option value="pc_armada">PC Armada</option>
                <option value="componente">Componente</option>
                <option value="periferico">Periférico</option>
                <option value="accesorio">Accesorio</option>
                <option value="otro">Otro</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>Descripción *</label>
            <textarea v-model="form.description" rows="3" required></textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Precio (S/) *</label>
              <input v-model.number="form.price" type="number" min="1" step="0.01" required />
            </div>
            <div class="form-group">
              <label>Condición *</label>
              <select v-model="form.condition" required>
                <option value="">Seleccionar...</option>
                <option value="Nuevo">Nuevo</option>
                <option value="Como nuevo">Como nuevo</option>
                <option value="Buen estado">Buen estado</option>
                <option value="Uso normal">Uso normal</option>
              </select>
            </div>
          </div>
          <div v-if="formError" class="error-msg">{{ formError }}</div>
          <button type="submit" class="btn primary" :disabled="formLoading">
            {{ formLoading ? 'Publicando...' : 'Publicar' }}
          </button>
        </form>
      </div>

      <!-- Listings list -->
      <div v-if="listings.length" class="my-listings">
        <div v-for="item in listings" :key="item.id" class="listing-row">
          <div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.category }} · S/ {{ item.price }} · {{ item.condition }}</p>
          </div>
          <span class="status-tag" :class="item.status">{{ statusLabel(item.status) }}</span>
        </div>
      </div>
      <div v-else class="empty">
        <p>No tienes publicaciones aún</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig()
const { isLoggedIn, isSeller, authHeaders } = useAuth()
const router = useRouter()

onMounted(() => {
  if (!isLoggedIn.value) { router.push('/login'); return }
  loadListings()
})

const listings = ref([])
const showForm = ref(false)
const form = reactive({ title: '', description: '', price: 0, category: '', condition: '' })
const formLoading = ref(false)
const formError = ref('')

async function loadListings() {
  try {
    listings.value = await $fetch(`${config.public.apiUrl}/api/my-listings`, { headers: authHeaders() })
  } catch {}
}

async function createListing() {
  formLoading.value = true
  formError.value = ''
  try {
    await $fetch(`${config.public.apiUrl}/api/listings`, {
      method: 'POST', headers: authHeaders(), body: { ...form }
    })
    showForm.value = false
    Object.assign(form, { title: '', description: '', price: 0, category: '', condition: '' })
    await loadListings()
  } catch (e) {
    formError.value = e.data?.error || 'Error al publicar'
  } finally { formLoading.value = false }
}

function statusLabel(s) {
  return { pending: 'Pendiente', approved: 'Aprobada', rejected: 'Rechazada' }[s] || s
}
</script>

<style scoped>
.page { padding: 2rem 0; }
.container { max-width: 800px; margin: 0 auto; padding: 0 1.5rem; }
.header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.btn { padding: 10px 20px; border-radius: 8px; font-weight: 600; border: none; cursor: pointer; }
.btn.primary { background: #3b82f6; color: #fff; }
.btn:disabled { opacity: 0.5; }

.create-form { background: #151515; padding: 2rem; border-radius: 12px; border: 1px solid #222; margin-bottom: 2rem; }
.create-form h2 { margin-bottom: 1rem; font-size: 1.2rem; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.form-group { margin-bottom: 1rem; }
.form-group label { display: block; font-size: 0.85rem; color: #aaa; margin-bottom: 4px; }
.form-group input, .form-group select, .form-group textarea {
  width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #333; background: #0a0a0a; color: #e5e5e5; font-size: 0.9rem; font-family: inherit;
}
.error-msg { padding: 0.75rem; background: #2d0a0a; border: 1px solid #7f1d1d; border-radius: 8px; color: #fca5a5; margin-bottom: 1rem; }

.my-listings { display: flex; flex-direction: column; gap: 0.75rem; }
.listing-row {
  background: #151515; padding: 1rem 1.25rem; border-radius: 10px; border: 1px solid #222;
  display: flex; justify-content: space-between; align-items: center;
}
.listing-row h3 { font-size: 1rem; margin-bottom: 2px; }
.listing-row p { font-size: 0.8rem; color: #888; }

.status-tag { padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; }
.status-tag.pending { background: #78350f; color: #fbbf24; }
.status-tag.approved { background: #052e16; color: #86efac; }
.status-tag.rejected { background: #2d0a0a; color: #fca5a5; }

.empty { text-align: center; padding: 3rem; color: #666; }
</style>
