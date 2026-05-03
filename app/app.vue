<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
const { init } = useAuth()
onMounted(() => init())
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Inter', system-ui, sans-serif;
  background: #0a0a0a;
  color: #e5e5e5;
  min-height: 100vh;
}

a { color: #3b82f6; text-decoration: none; }
a:hover { text-decoration: underline; }
</style>
