import { createRouter, createWebHistory } from 'vue-router'
import Admin from '../admin.vue'
import Settings from '../settings.vue'
import Signup from '../signup.vue'
import Voucher from '../voucher.vue'
import VoucherForm from '../voucherform.vue'
import { isAdmin, isLoggedIn } from '../stores/appState'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: { name: 'login' } },
    { path: '/login', name: 'login', component: Signup },
    { path: '/form', name: 'form', component: VoucherForm },
    { path: '/vouchers', name: 'vouchers', component: Voucher },
    { path: '/settings', name: 'settings', component: Settings },
    { path: '/admin', name: 'admin', component: Admin },
  ],
})

router.beforeEach((to, _from) => {
  const publicRoutes = ['login']
  const requiresAuth = !publicRoutes.includes(String(to.name))

  if (requiresAuth && !isLoggedIn.value) {
    return { name: 'login' }
  }

  if (to.name === 'login' && isLoggedIn.value) {
    return { name: isAdmin.value ? 'admin' : 'form' }
  }

  if (to.name === 'admin' && !isAdmin.value) {
    return { name: 'form' }
  }

  return true
})

export default router
