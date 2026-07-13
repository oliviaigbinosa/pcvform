<template>
  <div class="app-layout">
    <Sidebar v-if="route.name !== 'login'" />
    <main class="app-content">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import Sidebar from './sidebar.vue'

const route = useRoute()
</script>
