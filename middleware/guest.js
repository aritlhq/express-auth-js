export default defineNuxtRouteMiddleware((to, from) => {
    const {user} = useAuth();

    // Jika user sudah login
    if (user.value) {
        // Redirect ke dashboard
        return navigateTo('/dashboard');
    }
});