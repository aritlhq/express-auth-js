export const useAuth = () => {
    const user = useState('user', () => null);

    const fetchUser = async () => {
        const data = await $fetch('/api/auth/user', {
            headers: useRequestHeaders(['cookie']),
        });
        user.value = data;
    };

    const login = async ({email, password}) => {
        await $fetch('/api/auth/login', {
            method: 'POST',
            body: {email, password},
        });
        await fetchUser();
    };

    const logout = async () => {
        await $fetch('/api/auth/logout', {method: 'POST'});
        user.value = null;
    };

    return {
        user,
        fetchUser,
        login,
        logout,
    };
};