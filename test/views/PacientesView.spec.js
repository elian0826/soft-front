import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PacientesView from '../../src/views/PacientesView.vue'

// Mock de vue-router
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() })
}))

// Mock de servicios
vi.mock('../../src/services/pacientesService', () => ({
  pacientesService: {
    getAllPacientes: vi.fn(() => Promise.resolve({ data: [] })),
    createPaciente: vi.fn(),
    deletePaciente: vi.fn(),
    updatePaciente: vi.fn(),
    exportarPacientes: vi.fn(),
    importarPacientes: vi.fn()
  }
}))
vi.mock('../../src/services/authService', () => ({
  authService: {
    logout: vi.fn()
  }
}))

vi.stubGlobal('alert', vi.fn())
vi.stubGlobal('confirm', vi.fn(() => true))

describe('PacientesView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renderiza la tabla de pacientes', async () => {
    const wrapper = mount(PacientesView)
    expect(wrapper.find('table').exists()).toBe(true)
    expect(wrapper.find('h1').text()).toContain('Gestión de Pacientes')
  })

  it('abre y cierra el modal de paciente', async () => {
    const wrapper = mount(PacientesView)
    expect(wrapper.find('.modal').exists()).toBe(false)
    await wrapper.find('button.btn-primary').trigger('click')
    expect(wrapper.find('.modal').exists()).toBe(true)
    await wrapper.find('.close-button').trigger('click')
    expect(wrapper.find('.modal').exists()).toBe(false)
  })

  it('llama a guardarPaciente al enviar el formulario', async () => {
    const wrapper = mount(PacientesView)
    await wrapper.find('button.btn-primary').trigger('click')
    const spy = vi.spyOn(wrapper.vm, 'guardarPaciente')
    await wrapper.find('form').trigger('submit.prevent')
    expect(spy).toHaveBeenCalled()
  })
}) 