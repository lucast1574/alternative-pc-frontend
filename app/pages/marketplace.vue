<template>
  <div class="page">
    <div class="container">
      <h1>Marketplace</h1>
      <p class="subtitle">Todos los artículos verificados y listos para comprar</p>

      <div v-if="listings.length" class="listing-grid">
        <div v-for="item in listings" :key="item.id" class="listing-card">
          <div class="listing-img">🖥️</div>
          <div class="listing-info">
            <span class="category-tag">{{ categoryLabel(item.category) }}</span>
            <h3>{{ item.title }}</h3>
            <p class="desc">{{ item.description }}</p>
            <p class="condition">{{ item.condition }} · por {{ item.sellerName }}</p>
            <p class="price">S/ {{ item.price.toFixed(2) }}</p>
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        <h3>🏪 Marketplace vacío</h3>
        <p>Aún no hay publicaciones aprobadas. ¡Vuelve pronto!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig()
const listings = ref([])

onMounted(async () => {
  try {
    listings.value = await $fetch(`${config.public.apiUrl}/api/listings`)
  } catch (e) { /* empty */ }
})

function categoryLabel(cat) {
  const labels = { pc_armada: 'PC Armada', componente: 'Componente', periferico: 'Periférico', accesorio: 'Accesorio', otro: 'Otro' }
  return labels[cat] || cat
}
</script>

<style scoped>
.page { padding: 3rem 0; }
.container { max-width: 1000px; margin: 0 auto; padding: 0 1.5rem; }
h1 { font-size: 2rem; }
.subtitle { color: #888; margin-bottom: 2rem; }
.listing-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
.listing-card { background: #151515; border-radius: 12px; overflow: hidden; border: 1px solid #222; }
.listing-card:hover { border-color: #3b82f6; }
.listing-img { height: 160px; background: #1a1a1a; display: flex; align-items: center; justify-content: center; font-size: 3rem; }
.listing-info { padding: 1rem; }
.category-tag { font-size: 0.7rem; background: #1e3a5f; color: #60a5fa; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; }
.listing-info h3 { margin: 8px 0 4px; font-size: 1rem; }
.desc { font-size: 0.8rem; color: #999; margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.condition { font-size: 0.75rem; color: #666; }
.price { font-size: 1.2rem; font-weight: 700; color: #22c55e; margin-top: 8px; }
.empty-state { text-align: center; padding: 4rem 2rem; background: #111; border-radius: 16px; }
.empty-state h3 { font-size: 1.3rem; margin-bottom: 0.5rem; }
.empty-state p { color: #666; }
</style>
