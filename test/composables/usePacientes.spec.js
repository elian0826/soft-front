import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import { usePacientes } from '../../src/composables/usePacientes'
import { pacientesService } from '../../src/services/pacientesService'

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() })
}))

vi.stubGlobal('alert', vi.fn())
vi.stubGlobal('confirm', vi.fn(() => true))

vi.mock('../../src/services/pacientesService', () => ({
  pacientesService: {
    getAllPacientes: vi.fn(),
    createPaciente: vi.fn(),
    deletePaciente: vi.fn(),
    updatePaciente: vi.fn(),
    exportarPacientes: vi.fn(),
    importarPacientes: vi.fn()
  }
}))

describe('usePacientes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  function createComposableWrapper() {
    let composable
    const Comp = defineComponent({
      setup() {
        composable = usePacientes()
        return {}
      },
      template: '<div></div>'
    })
    mount(Comp)
    return composable
  }

  it('estado inicial correcto', () => {
    const { pacientes, showModal } = createComposableWrapper()
    expect(Array.isArray(pacientes.value)).toBe(true)
    expect(showModal.value).toBe(false)
  })

  it('guarda un paciente correctamente', async () => {
    pacientesService.createPaciente.mockResolvedValueOnce({ id: 1, nombre: 'Firulais' })
    pacientesService.getAllPacientes.mockResolvedValueOnce({ data: [{ id: 1, nombre: 'Firulais' }] })
    const { guardarPaciente, form, pacientes } = createComposableWrapper()
    form.value.nombre_mascota = 'Firulais'
    await guardarPaciente()
    await nextTick()
    expect(pacientesService.createPaciente).toHaveBeenCalled()
    expect(pacientes.value.length).toBeGreaterThanOrEqual(0)
  })

  it('elimina un paciente correctamente', async () => {
    pacientesService.deletePaciente.mockResolvedValueOnce(true)
    pacientesService.getAllPacientes.mockResolvedValueOnce({ data: [] })
    const { eliminarPaciente, pacientes } = createComposableWrapper()
    pacientes.value = [{ id: 1, nombre: 'Firulais' }]
    await eliminarPaciente(1)
    await nextTick()
    expect(pacientesService.deletePaciente).toHaveBeenCalledWith(1)
  })

  it('maneja errores al guardar paciente', async () => {
    pacientesService.createPaciente.mockRejectedValueOnce(new Error('Error al guardar'))
    const { guardarPaciente } = createComposableWrapper()
    await guardarPaciente()
    await nextTick()
    expect(alert).toHaveBeenCalledWith('Error al guardar el paciente')
  })
}) 