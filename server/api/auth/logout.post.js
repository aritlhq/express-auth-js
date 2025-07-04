export default defineEventHandler((event) => {
    // Hapus cookie 'token'
    deleteCookie(event, 'token', {
        path: '/',
    });
    return {message: 'Logged out'};
});