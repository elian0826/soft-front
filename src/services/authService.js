import axios from 'axios';

const API_URL = 'http://localhost:8080';

axios.defaults.timeout = 5000; 
axios.defaults.withCredentials = true; 

export const authService = {
    login: async (username, password) => {
        try {
            const credentials = btoa(`${username}:${password}`);
            
            const response = await axios.get(`${API_URL}/api/pacientes`, {
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.status === 200) {
                localStorage.setItem('user', JSON.stringify({
                    username: username,
                    password: password,
                    credentials: credentials
                }));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error en login:', error);
            if (error.code === 'ERR_NETWORK') {
                throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:8080');
            }
            if (error.response && error.response.status === 401) {
                throw new Error('Credenciales inválidas');
            }
            throw new Error('Error al conectar con el servidor');
        }
    },

    logout: () => {
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem('user'));
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('user');
    },

    getAuthHeader: () => {
        const user = authService.getCurrentUser();
        if (user && user.credentials) {
            return {
                'Authorization': `Basic ${user.credentials}`,
                'Content-Type': 'application/json'
            };
        }
        return {
            'Content-Type': 'application/json'
        };
    }
}; 