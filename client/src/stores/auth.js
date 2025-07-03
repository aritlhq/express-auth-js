import {defineStore} from 'pinia';
import {ref, computed} from 'vue';
import {useRouter} from 'vue-router';
import apiClient from '../services/api';

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null);
    const router = useRouter();

    const isAuthenticated = computed(() => !!user.value);
    const currentUser = computed(() => user.value);

    async function login(credentials) {
        try {
            const {data} = await apiClient.post('/auth/login', credentials);
            user.value = data; // Simpan data user dari response
            await router.push('/dashboard');
        } catch (error) {
            console.error('Login failed:', error.response.data.message);
            throw new Error(error.response.data.message || 'Login failed');
        }
    }

    async function register(userData) {
        try {
            await apiClient.post('/auth/register', userData);
            await router.push('/login');
        } catch (error) {
            console.error('Registration failed:', error.response.data.message);
            throw new Error(error.response.data.message || 'Registration failed');
        }
    }

    async function logout() {
        try {
            await apiClient.post('/auth/logout');
            user.value = null;
            await router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

    async function checkAuthStatus() {
        try {
            const {data} = await apiClient.get('/users/me');
            user.value = data;
        } catch (error) {
            user.value = null;
        }
    }

    return {user, isAuthenticated, currentUser, login, register, logout, checkAuthStatus};
});