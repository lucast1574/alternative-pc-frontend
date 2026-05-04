<template>
  <div class="page">
    <div class="container">
      <div class="page-head">
        <h1>Marketplace</h1>
        <p>Artículos verificados y listos para comprar</p>
      </div>

      <div v-if="listings.length" class="grid">
        <div v-for="item in listings" :key="item.id" class="card">
          <div class="card-img">
            <span class="card-cat">{{ categoryLabel(item.category) }}</span>
          </div>
          <div class="card-body">
            <h3>{{ item.title }}</h3>
            <p class="card-desc">{{ item.description }}</p>
            <p class="card-meta">{{ item.condition }}</p>
            <div class="card-bottom">
              <span class="card-price">S/ {{ item.price.toFixed(0) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="empty">
        <p>Marketplace vacío por ahora. ¡Vuelve pronto!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig()
const listings = ref([])
onMounted(async () => {
  try { listings.value = await $fetch(`${config.public.apiUrl}/api/listings`) } catch {}
})
function categoryLabel(c) {
  return { pc_armada:'PC Armada', componente:'Componente', periferico:'Periférico', accesorio:'Accesorio', otro:'Otro' }[c] || c
}
</script>

<style scoped>
.page { padding: 4rem 0; }
.container { max-width: 1100px; margin: 0 auto; padding: 0 2rem; }
.page-head { margin-bottom: 3rem; }
.page-head h1 { font-size: 2.2rem; font-weight: 800; letter-spacing: -0.03em; }
.page-head p { color: var(--text-muted); margin-top: 0.25rem; }

.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
@media (max-width: 768px) { .grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px) { .grid { grid-template-columns: 1fr; } }
.card { background: var(--bg); transition: background 0.15s; }
.card:hover { background: var(--bg-elevated); }
.card-img { height: 140px; background: var(--bg-card); padding: 12px; }
.card-cat {
  font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.06em;
  background: rgba(255,255,255,0.08); padding: 3px 8px; border-radius: 3px; color: var(--text-secondary);
}
.card-body { padding: 1.25rem; }
.card-body h3 { font-size: 0.95rem; font-weight: 600; margin-bottom: 6px; line-height: 1.3; }
.card-desc { font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.card-meta { font-size: 0.7rem; color: var(--text-muted); margin-top: 6px; }
.card-bottom { margin-top: 12px; }
.card-price { font-size: 1.15rem; font-weight: 700; }

.empty { text-align: center; padding: 5rem 2rem; color: var(--text-muted); border: 1px solid var(--border); border-radius: 12px; }
</style>
