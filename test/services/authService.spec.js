import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { authService } from '../../src/services/authService'
import axios from 'axios'

vi.mock('axios')


const localStorageMock = (() => {
  let store = {}
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value.toString() }),
    removeItem: vi.fn((key) => { delete store[key] }),
    clear: vi.fn(() => { store = {} })
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('authService', () => {
  let consoleErrorSpy
  beforeEach(() => {
    vi.clearAllMocks()
    window.localStorage.clear()
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  it('login exitoso guarda el usuario', async () => {
    axios.get.mockResolvedValueOnce({ status: 200 })
    const result = await authService.login('usuario', 'contraseña')
    expect(result).toBe(true)
    expect(window.localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify({
      username: 'usuario',
      password: 'contraseña',
      credentials: btoa('usuario:contraseña')
    }))
  })

  it('login fallido por credenciales lanza error específico', async () => {
    axios.get.mockRejectedValueOnce({ response: { status: 401 } })
    await expect(authService.login('usuario', 'contraseña')).rejects.toThrow('Credenciales inválidas')
    expect(window.localStorage.setItem).not.toHaveBeenCalled()
  })

  it('login fallido por red lanza error de red', async () => {
    axios.get.mockRejectedValueOnce({ code: 'ERR_NETWORK' })
    await expect(authService.login('usuario', 'contraseña')).rejects.toThrow('No se pudo conectar con el servidor')
    expect(window.localStorage.setItem).not.toHaveBeenCalled()
  })

  it('login fallido por otro error lanza error genérico', async () => {
    axios.get.mockRejectedValueOnce({})
    await expect(authService.login('usuario', 'contraseña')).rejects.toThrow('Error al conectar con el servidor')
    expect(window.localStorage.setItem).not.toHaveBeenCalled()
  })

  it('logout elimina el usuario', () => {
    window.localStorage.setItem('user', JSON.stringify({ username: 'usuario' }))
    authService.logout()
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('user')
  })

  it('isAuthenticated retorna true si hay usuario', () => {
    window.localStorage.setItem('user', JSON.stringify({ username: 'usuario' }))
    expect(authService.isAuthenticated()).toBe(true)
  })

  it('isAuthenticated retorna false si no hay usuario', () => {
    window.localStorage.removeItem('user')
    expect(authService.isAuthenticated()).toBe(false)
  })
}) 