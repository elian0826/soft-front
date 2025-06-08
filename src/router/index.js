import { createRouter, createWebHistory } from 'vue-router';
import { authService } from '../services/authService';
import LoginView from '../views/LoginView.vue';
import PacientesView from '../views/PacientesView.vue';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/pacientes',
    name: 'Pacientes',
    component: PacientesView,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = authService.isAuthenticated();

  if (requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.path === '/login' && isAuthenticated) {
    next('/pacientes');
  } else {
    next();
  }
});

export default router;
