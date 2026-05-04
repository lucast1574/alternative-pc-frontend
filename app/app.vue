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
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

:root {
  --bg: #000;
  --bg-card: #0a0a0a;
  --bg-elevated: #111;
  --border: #1a1a1a;
  --border-hover: #333;
  --text: #fff;
  --text-secondary: #888;
  --text-muted: #555;
  --accent: #fff;
  --accent-hover: #ddd;
  --green: #00ff6a;
  --red: #ff3b30;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Inter', -apple-system, system-ui, sans-serif;
  background: var(--bg);
  color: var(--text);
  -webkit-font-smoothing: antialiased;
}

a { color: var(--text); text-decoration: none; }
a:hover { opacity: 0.8; }

::selection { background: #fff; color: #000; }

input, select, textarea {
  font-family: inherit;
}
</style>
