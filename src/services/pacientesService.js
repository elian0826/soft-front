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

    getAllPacientes: async () => {
        try {
            const response = await axios.get(API_URL, getAuthConfig());
            return response.data;
        } catch (error) {
            throw error;
        }
    },


    getPacienteById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`, getAuthConfig());
            return response.data;
        } catch (error) {
            throw error;
        }
    },


    createPaciente: async (paciente) => {
        try {
            const response = await axios.post(`${API_URL}/registrar`, paciente, getAuthConfig());
            return response.data;
        } catch (error) {
            throw error;
        }
    },


    updatePaciente: async (paciente) => {
        try {
            const response = await axios.put(`${API_URL}/actualizar`, paciente, getAuthConfig());
            return response.data;
        } catch (error) {
            throw error;
        }
    },


    deletePaciente: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/eliminar/${id}`, getAuthConfig());
            return response.data;
        } catch (error) {
            throw error;
        }
    },


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