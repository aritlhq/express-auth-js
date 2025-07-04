export default defineNuxtRouteMiddleware((to, from) => {
    const {user} = useAuth();

    // Jika user tidak login dan mencoba mengakses halaman terproteksi
    if (!user.value) {
        // Redirect ke halaman login
        return navigateTo('/login');
    }
});