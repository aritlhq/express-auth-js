export const useAuth = () => {
    // useState adalah ref yang aman untuk SSR
    const user = useState('user', () => null);

    const setUser = (newUser) => {
        user.value = newUser;
    };

    const clearUser = () => {
        user.value = null;
    };

    return {
        user,
        setUser,
        clearUser,
    };
};