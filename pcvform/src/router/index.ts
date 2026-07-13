import { createRouter, createWebHistory } from 'vue-router'
import Admin from '../admin.vue'
import Signup from '../signup.vue'
import Voucher from '../voucher.vue'
import VoucherForm from '../voucherform.vue'
import { isLoggedIn } from '../stores/appState'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: { name: 'login' } },
    { path: '/login', name: 'login', component: Signup },
    { path: '/form', name: 'form', component: VoucherForm },
    { path: '/vouchers', name: 'vouchers', component: Voucher },
    { path: '/admin', name: 'admin', component: Admin },
  ],
})

router.beforeEach((to, _from, next) => {
  const publicRoutes = ['login']
  const requiresAuth = !publicRoutes.includes(String(to.name))

  if (requiresAuth && !isLoggedIn.value) {
    next({ name: 'login' })
    return
  }

  if (to.name === 'login' && isLoggedIn.value) {
    next({ name: 'form' })
    return
  }

  next()
})

export default router
