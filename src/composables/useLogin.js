import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '../services/authService';
import Swal from 'sweetalert2';

export function useLogin() {
    const router = useRouter();
    const username = ref('');
    const password = ref('');
    const error = ref('');
    const loading = ref(false);

    const handleLogin = async () => {
        error.value = '';
        loading.value = true;
        try {
            await authService.login(username.value, password.value);
            await Swal.fire({
                icon: 'success',
                title: '¡Credenciales exitosas!',
                text: 'Bienvenido/a',
                timer: 1500,
                showConfirmButton: false
            });
            router.push('/pacientes');
        } catch (err) {
            error.value = err.message;
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Credenciales incorrectas',
                timer: 2000,
                showConfirmButton: false
            });
        } finally {
            loading.value = false;
        }
    };

    return {
        username,
        password,
        error,
        loading,
        handleLogin
    };
} 