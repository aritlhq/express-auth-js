export default defineEventHandler(async (event) => {
    // Hapus cookie 'token'
    deleteCookie(event, 'token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/', // Pastikan path sesuai dengan saat cookie dibuat
    });

    return {message: 'Logged out successfully.'};
});