import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'

import App from '../App.vue'

describe('App router navigation', () => {
  it('renders the vouchers page when the route changes', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', redirect: '/form' },
        { path: '/login', name: 'login', component: { template: '<div>Login</div>' } },
        { path: '/form', name: 'form', component: { template: '<div>Petty Cash Voucher</div>' } },
        {
          path: '/vouchers',
          name: 'vouchers',
          component: { template: '<div>My Vouchers</div>' },
        },
        { path: '/admin', name: 'admin', component: { template: '<div>Admin</div>' } },
      ],
    })

    const wrapper = mount(App, {
      global: {
        plugins: [router],
      },
    })

    await router.push('/vouchers')
    await router.isReady()
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('My Vouchers')
  })
})
