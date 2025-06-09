import { describe, it, expect, vi, beforeEach } from 'vitest'
import { pacientesService } from '../../src/services/pacientesService'
import axios from 'axios'

vi.mock('axios')

describe('pacientesService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getAllPacientes llama a axios.get con la URL correcta', async () => {
    axios.get.mockResolvedValueOnce({ data: [{ id: 1, nombre: 'Firulais' }] })
    const result = await pacientesService.getAllPacientes()
    expect(axios.get).toHaveBeenCalled()
    expect(result[0].nombre).toBe('Firulais')
  })

  it('createPaciente llama a axios.post con los datos correctos', async () => {
    axios.post.mockResolvedValueOnce({ data: { id: 2, nombre: 'Luna' } })
    const paciente = { nombre: 'Luna' }
    const result = await pacientesService.createPaciente(paciente)
    expect(axios.post).toHaveBeenCalled()
    expect(result.nombre).toBe('Luna')
  })

  it('deletePaciente llama a axios.delete con el id correcto', async () => {
    axios.delete.mockResolvedValueOnce({ data: true })
    const result = await pacientesService.deletePaciente(1)
    expect(axios.delete).toHaveBeenCalled()
    expect(result).toBe(true)
  })

  it('updatePaciente llama a axios.put con los datos correctos', async () => {
    axios.put.mockResolvedValueOnce({ data: { id: 1, nombre: 'Firulais', raza: 'Labrador' } })
    const paciente = { id: 1, nombre: 'Firulais', raza: 'Labrador' }
    const result = await pacientesService.updatePaciente(paciente)
    expect(axios.put).toHaveBeenCalled()
    expect(result.raza).toBe('Labrador')
  })
}) 