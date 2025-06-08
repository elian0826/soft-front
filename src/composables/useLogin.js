import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '../services/authService';

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
            router.push('/pacientes');
        } catch (err) {
            error.value = err.message;
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