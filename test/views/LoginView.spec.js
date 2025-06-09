import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'


const push = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push
  })
}))


vi.mock('../../src/composables/useLogin', () => {
  return {
    useLogin: () => ({
      username: '',
      password: '',
      error: null,
      loading: false,
      handleLogin: async () => {
        push('/pacientes')
      }
    })
  }
})

import LoginView from '../../src/views/LoginView.vue'

describe('LoginView', () => {
  it('renderiza correctamente el formulario de login', () => {
    const wrapper = mount(LoginView)
    expect(wrapper.find('h1').text()).toBe('Bienvenido a Veterinaria Caribe')
    expect(wrapper.find('input[type="text"]').exists()).toBe(true)
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('redirecciona a /pacientes cuando el login es exitoso', async () => {
    const wrapper = mount(LoginView)
    await wrapper.find('form').trigger('submit')
    expect(push).toHaveBeenCalledWith('/pacientes')
  })
}) 