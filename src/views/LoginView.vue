<template>
  <div class="login-wrapper">
    <div class="login-container">
      <div class="login-image">
        <img src="/src/assets/login_img.png" alt="Veterinario con gato">
      </div>
      <div class="login-card">
        <div class="login-header">
          <h1>Bienvenido a Veterinaria Caribe</h1>
          <p>Inicie sesión para acceder a su cuenta</p>
        </div>
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="username">Usuario</label>
            <input 
              type="text" 
              id="username" 
              v-model="username" 
              required 
              :disabled="loading"
              placeholder="Ingrese su usuario"
              autocomplete="username"
            >
          </div>
          <div class="form-group">
            <label for="password">Contraseña</label>
            <input 
              type="password" 
              id="password" 
              v-model="password" 
              required 
              :disabled="loading"
              placeholder="Ingrese su contraseña"
              autocomplete="current-password"
            >
          </div>
          <button 
            type="submit" 
            class="login-button" 
            :disabled="loading"
          >
            {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>
          <div v-if="error" class="error-message">
            {{ error }}
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '../services/authService';
import '../styles/login.css';
import { useLogin } from '../composables/useLogin';

export default {
  name: 'LoginView',
  setup() {
    const { username, password, error, loading, handleLogin } = useLogin();

    return {
      username,
      password,
      error,
      loading,
      handleLogin
    };
  }
};
</script> 