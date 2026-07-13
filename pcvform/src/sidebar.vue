<template>
  <div>
    <div v-if="sidebarOpen" class="sidebar-overlay" @click="sidebarOpen = false" />
    <aside class="sidebar" :class="{ open: sidebarOpen }">
      <div class="sidebar__brand">
        <div class="sidebar__icon">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <rect x="2" y="7" width="20" height="14" rx="2" />
            <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
          </svg>
        </div>
        <div>
          <p class="sidebar__company">Getpayed Ltd.</p>
          <p class="sidebar__system">PCV System</p>
        </div>
        <button class="sidebar__close" @click="sidebarOpen = false" aria-label="Close menu">
          ✕
        </button>
      </div>

      <div class="sidebar__user">
        <div class="sidebar__avatar">{{ userInitial }}</div>
        <div class="sidebar__user-info">
          <p class="sidebar__user-email">{{ userEmail }}</p>
          <p class="sidebar__user-role">Signed in</p>
        </div>
      </div>

      <nav class="sidebar__nav">
        <p class="sidebar__nav-group">Navigation</p>
        <router-link
          class="sidebar__nav-item"
          :class="{ active: route.name === 'form' }"
          :to="{ name: 'form' }"
          @click="sidebarOpen = false"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          Form
        </router-link>
        <router-link
          class="sidebar__nav-item"
          :class="{ active: route.name === 'vouchers' }"
          :to="{ name: 'vouchers' }"
          @click="sidebarOpen = false"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
          Vouchers
          <span v-if="myVouchers.length" class="sidebar__badge">{{ myVouchers.length }}</span>
        </router-link>
      </nav>

      <div class="sidebar__footer">
        <router-link
          class="sidebar__nav-item sidebar__admin-btn"
          :class="{ active: route.name === 'admin' }"
          :to="{ name: 'admin' }"
          @click="sidebarOpen = false"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          Admin Panel
          <span v-if="allVouchers.length" class="sidebar__badge sidebar__badge--admin">{{
            allVouchers.length
          }}</span>
        </router-link>

        <div class="sidebar__divider"></div>

        <button class="sidebar__logout" @click="handleLogout">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { allVouchers, logoutUser, userEmail } from './stores/appState'

const route = useRoute()
const router = useRouter()
const sidebarOpen = ref(false)

const myVouchers = computed(() =>
  allVouchers.value.filter((voucher) => voucher.submittedBy === userEmail.value),
)
const userInitial = computed(() => userEmail.value.charAt(0).toUpperCase())

function handleLogout() {
  logoutUser()
  sidebarOpen.value = false
  router.push({ name: 'login' })
}
</script>
