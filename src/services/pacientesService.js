import axios from 'axios';
import { authService } from './authService';

const API_URL = 'http://localhost:8080/api/pacientes';

const getAuthConfig = () => {
    return {
        headers: {
            ...authService.getAuthHeader()
        }
    };
};

export const pacientesService = {
    // Obtener todos los pacientes
    getAllPacientes: async () => {
        try {
            const response = await axios.get(API_URL, getAuthConfig());
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Obtener un paciente por ID
    getPacienteById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`, getAuthConfig());
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Crear un nuevo paciente
    createPaciente: async (paciente) => {
        try {
            const response = await axios.post(`${API_URL}/registrar`, paciente, getAuthConfig());
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Actualizar un paciente
    updatePaciente: async (paciente) => {
        try {
            const response = await axios.put(`${API_URL}/actualizar`, paciente, getAuthConfig());
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Eliminar un paciente
    deletePaciente: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/eliminar/${id}`, getAuthConfig());
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Exportar pacientes a Excel
    exportarPacientes: async () => {
        try {
            const response = await axios.get(`${API_URL}/exportar`, {
                ...getAuthConfig(),
                responseType: 'blob'
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Importar pacientes desde Excel
    importarPacientes: async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await axios.post(`${API_URL}/importar`, formData, {
                ...getAuthConfig(),
                headers: {
                    ...getAuthConfig().headers,
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}; 