<script setup>
const {user, logout} = useAuth();
const router = useRouter();

const handleLogout = async () => {
  await logout();
  router.push('/login');
};
</script>

<template>
  <nav>
    <NuxtLink to="/">Home</NuxtLink>
    <template v-if="user">
      <NuxtLink to="/dashboard">Dashboard</NuxtLink>
      <button @click="handleLogout">Logout</button>
    </template>
    <template v-else>
      <NuxtLink to="/login">Login</NuxtLink>
      <NuxtLink to="/register">Register</NuxtLink>
    </template>
  </nav>
</template>