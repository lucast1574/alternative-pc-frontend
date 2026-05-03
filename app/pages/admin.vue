<template>
  <div class="page">
    <div class="container">
      <h1>Panel de administración</h1>

      <div class="tabs">
        <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
          :class="{ active: activeTab === tab.id }" class="tab">
          {{ tab.label }} <span v-if="tab.count" class="count">{{ tab.count }}</span>
        </button>
      </div>

      <!-- Pending Listings -->
      <div v-if="activeTab === 'listings'" class="tab-content">
        <div v-if="pendingListings.length" class="admin-list">
          <div v-for="item in pendingListings" :key="item.id" class="admin-item">
            <div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
              <small>{{ item.category }} · {{ item.condition }} · S/ {{ item.price }} · por {{ item.sellerName }}</small>
            </div>
            <div class="actions">
              <button @click="approveListing(item.id)" class="btn-approve">✅ Aprobar</button>
              <button @click="rejectListing(item.id)" class="btn-reject">❌ Rechazar</button>
            </div>
          </div>
        </div>
        <p v-else class="empty">No hay publicaciones pendientes</p>
      </div>

      <!-- Sell Requests -->
      <div v-if="activeTab === 'sell'" class="tab-content">
        <div v-if="sellRequests.length" class="admin-list">
          <div v-for="req in sellRequests" :key="req.id" class="admin-item">
            <div>
              <h3>{{ req.partType }} — {{ req.brand }} {{ req.model }}</h3>
              <p>{{ req.description || 'Sin descripción' }}</p>
              <small>Estado: {{ req.condition }} · Estimado: S/ {{ req.estimateMin }}-{{ req.estimateMax }}</small>
              <br><small>Contacto: {{ req.sellerName }} · {{ req.sellerEmail }} · {{ req.sellerPhone }}</small>
              <br><small class="status-tag" :class="req.status">{{ req.status }}</small>
            </div>
          </div>
        </div>
        <p v-else class="empty">No hay solicitudes de venta</p>
      </div>

      <!-- Maintenance Requests -->
      <div v-if="activeTab === 'maint'" class="tab-content">
        <div v-if="maintRequests.length" class="admin-list">
          <div v-for="req in maintRequests" :key="req.id" class="admin-item">
            <div>
              <h3>{{ req.serviceType }} — {{ req.deviceType }}</h3>
              <p>{{ req.description }}</p>
              <small>Equipo: {{ req.deviceBrand || 'N/A' }}</small>
              <br><small>Contacto: {{ req.clientName }} · {{ req.clientEmail }} · {{ req.clientPhone }}</small>
              <br><small class="status-tag" :class="req.status">{{ req.status }}</small>
            </div>
          </div>
        </div>
        <p v-else class="empty">No hay solicitudes de mantenimiento</p>
      </div>

      <!-- Users -->
      <div v-if="activeTab === 'users'" class="tab-content">
        <div v-if="users.length" class="admin-list">
          <div v-for="u in users" :key="u.id" class="admin-item user-item">
            <div>
              <h3>{{ u.name }}</h3>
              <small>{{ u.email }} · <span class="role-badge" :class="u.role">{{ u.role }}</span></small>
            </div>
            <div class="actions">
              <select @change="changeRole(u.id, $event.target.value)" :value="u.role">
                <option value="user">User</option>
                <option value="seller">Seller</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig()
const { isAdmin, authHeaders } = useAuth()
const router = useRouter()

onMounted(() => {
  if (!isAdmin.value) { router.push('/'); return }
  loadAll()
})

const activeTab = ref('listings')
const pendingListings = ref([])
const sellRequests = ref([])
const maintRequests = ref([])
const users = ref([])

const tabs = computed(() => [
  { id: 'listings', label: 'Publicaciones pendientes', count: pendingListings.value.length },
  { id: 'sell', label: 'Solicitudes de venta', count: sellRequests.value.length },
  { id: 'maint', label: 'Mantenimientos', count: maintRequests.value.length },
  { id: 'users', label: 'Usuarios' },
])

async function loadAll() {
  const h = { headers: authHeaders() }
  try { pendingListings.value = await $fetch(`${config.public.apiUrl}/api/admin/listings/pending`, h) } catch {}
  try { sellRequests.value = await $fetch(`${config.public.apiUrl}/api/admin/sell-requests`, h) } catch {}
  try { maintRequests.value = await $fetch(`${config.public.apiUrl}/api/admin/maintenance-requests`, h) } catch {}
  try { users.value = await $fetch(`${config.public.apiUrl}/api/admin/users`, h) } catch {}
}

async function approveListing(id) {
  await $fetch(`${config.public.apiUrl}/api/admin/listings/${id}/approve`, { method: 'PATCH', headers: authHeaders() })
  pendingListings.value = pendingListings.value.filter(l => l.id !== id)
}

async function rejectListing(id) {
  await $fetch(`${config.public.apiUrl}/api/admin/listings/${id}/reject`, { method: 'PATCH', headers: authHeaders() })
  pendingListings.value = pendingListings.value.filter(l => l.id !== id)
}

async function changeRole(userId, role) {
  await $fetch(`${config.public.apiUrl}/api/admin/users/${userId}/role`, {
    method: 'PATCH', headers: authHeaders(), body: { role }
  })
  const u = users.value.find(x => x.id === userId)
  if (u) u.role = role
}
</script>

<style scoped>
.page { padding: 2rem 0; }
.container { max-width: 1000px; margin: 0 auto; padding: 0 1.5rem; }
h1 { margin-bottom: 1.5rem; }

.tabs { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
.tab {
  padding: 8px 16px; border-radius: 8px; background: #1a1a1a;
  border: 1px solid #333; color: #aaa; cursor: pointer; font-size: 0.85rem;
}
.tab.active { background: #3b82f6; color: #fff; border-color: #3b82f6; }
.count { background: #ef4444; color: #fff; padding: 1px 6px; border-radius: 10px; font-size: 0.7rem; margin-left: 4px; }

.admin-list { display: flex; flex-direction: column; gap: 1rem; }
.admin-item {
  background: #151515; padding: 1.25rem; border-radius: 12px;
  border: 1px solid #222; display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem;
}
.admin-item h3 { font-size: 1rem; margin-bottom: 4px; }
.admin-item p { font-size: 0.85rem; color: #999; }
.admin-item small { font-size: 0.75rem; color: #666; }

.actions { display: flex; gap: 0.5rem; flex-shrink: 0; }
.btn-approve, .btn-reject {
  padding: 6px 12px; border-radius: 6px; border: none; cursor: pointer; font-size: 0.8rem;
}
.btn-approve { background: #052e16; color: #86efac; }
.btn-reject { background: #2d0a0a; color: #fca5a5; }

.actions select {
  padding: 6px; border-radius: 6px; background: #1a1a1a; border: 1px solid #333; color: #e5e5e5;
}

.status-tag { padding: 2px 6px; border-radius: 4px; font-weight: 600; }
.status-tag.pending { background: #78350f; color: #fbbf24; }
.status-tag.reviewed { background: #1e3a5f; color: #60a5fa; }
.status-tag.accepted { background: #052e16; color: #86efac; }
.status-tag.rejected { background: #2d0a0a; color: #fca5a5; }
.status-tag.contacted { background: #1e3a5f; color: #60a5fa; }
.status-tag.scheduled { background: #312e81; color: #a5b4fc; }
.status-tag.completed { background: #052e16; color: #86efac; }

.role-badge { padding: 2px 6px; border-radius: 4px; font-weight: 600; text-transform: uppercase; }
.role-badge.admin { background: #ef4444; color: #fff; }
.role-badge.seller { background: #f59e0b; color: #000; }
.role-badge.user { background: #333; color: #aaa; }

.empty { color: #666; text-align: center; padding: 2rem; }
</style>
