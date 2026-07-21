<template>
  <div class="app-layout">
    <Sidebar v-if="route.name !== 'login' && route.name !== 'approve'" />
    <main class="app-content">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './sidebar.vue'
import { fetchVouchers } from './stores/appState'

onMounted(async () => {
  try {
    await fetchVouchers()
  } catch (error) {
    console.error('Failed to load vouchers', error)
  }
})

const route = useRoute()
</script>
