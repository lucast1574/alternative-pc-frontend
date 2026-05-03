export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:8080'
    }
  },

  app: {
    head: {
      title: 'Alternative PC - Compra y vende PCs de segunda mano',
      meta: [
        { name: 'description', content: 'Marketplace de PCs y componentes de segunda mano. Vende tus partes, compra PCs armadas, y servicios de mantenimiento.' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap' }
      ]
    }
  }
})
