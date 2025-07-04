// plugins/auth.js (VERSI BARU YANG LEBIH BAIK)

export default defineNuxtPlugin(async (nuxtApp) => {
    const {setUser} = useAuth();

    // Jika state user sudah ada (misalnya dari navigasi sisi klien), tidak perlu fetch lagi.
    const user = useState('user');
    if (user.value) {
        return;
    }

    try {
        // Gunakan useFetch untuk mengambil data user.
        // useFetch secara otomatis menangani pengambilan data baik di server maupun client.
        const {data, error} = await useFetch('/api/auth/me');

        // Jika ada data dan tidak ada error, set state user.
        if (data.value && !error.value) {
            setUser(data.value);
        }
    } catch (e) {
        // Jika terjadi error, biarkan state user tetap null.
        console.error('Failed to fetch user on load', e);
    }
});