import {createRouter, createWebHistory} from 'vue-router';
import {useAuthStore} from '../stores/auth';

import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Dashboard from '../views/Dashboard.vue';

const routes = [
    {path: '/', name: 'Home', component: Home},
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: {guest: true} // Hanya untuk tamu
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
        meta: {guest: true} // Hanya untuk tamu
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: {requiresAuth: true} // Membutuhkan login
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();

    if (authStore.user === null) {
        await authStore.checkAuthStatus();
    }

    const isAuthenticated = authStore.isAuthenticated;

    if (to.meta.requiresAuth && !isAuthenticated) {
        next({name: 'Login'});
    } else if (to.meta.guest && isAuthenticated) {
        next({name: 'Dashboard'});
    } else {
        next();
    }
});

export default router;