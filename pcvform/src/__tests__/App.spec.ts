import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
// @ts-ignore: no declaration file for .vue component
import App from '../pcvForm.vue'

describe('App', () => {
  it('mounts renders properly', () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('You did it!')
  })
})
