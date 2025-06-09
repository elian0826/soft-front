import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import { useLogin } from '../../src/composables/useLogin'
import { authService } from '../../src/services/authService'

const push = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push
  })
}))


vi.mock('../../src/services/authService', () => ({
  authService: {
    login: vi.fn()
  }
}))

describe('useLogin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  function createComposableWrapper() {
    let composable
    const Comp = defineComponent({
      setup() {
        composable = useLogin()
        return {}
      },
      template: '<div></div>'
    })
    mount(Comp)
    return composable
  }

  it('tiene el estado inicial correcto', () => {
    const { username, password, error, loading } = createComposableWrapper()
    expect(username.value).toBe('')
    expect(password.value).toBe('')
    expect(error.value).toBe('')
    expect(loading.value).toBe(false)
  })

  it('login exitoso actualiza loading y no muestra error', async () => {
    authService.login.mockResolvedValueOnce({ token: 'fake-token' })
    const { username, password, error, loading, handleLogin } = createComposableWrapper()
    username.value = 'usuario'
    password.value = 'contraseña'

    const promise = handleLogin()
    expect(loading.value).toBe(true)
    await promise
    await nextTick()
    expect(loading.value).toBe(false)
    expect(error.value).toBe('')
    expect(authService.login).toHaveBeenCalledWith('usuario', 'contraseña')
  })

  it('login fallido actualiza error y loading', async () => {
    authService.login.mockRejectedValueOnce(new Error('Credenciales inválidas'))
    const { username, password, error, loading, handleLogin } = createComposableWrapper()
    username.value = 'usuario'
    password.value = 'contraseña'

    const promise = handleLogin()
    expect(loading.value).toBe(true)
    await promise
    await nextTick()
    expect(loading.value).toBe(false)
    expect(error.value).toBe('Credenciales inválidas')
    expect(authService.login).toHaveBeenCalledWith('usuario', 'contraseña')
  })
}) 