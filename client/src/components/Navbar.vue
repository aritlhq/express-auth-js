<template>
  <nav>
    <router-link to="/">Home</router-link>
    <template v-if="auth.isAuthenticated">
      <router-link to="/dashboard">Dashboard</router-link>
      <a href="#" @click.prevent="handleLogout">Logout</a>
    </template>
    <template v-else>
      <router-link to="/login">Login</router-link>
      <router-link to="/register">Register</router-link>
    </template>
  </nav>
</template>

<script setup>
import {useAuthStore} from '../stores/auth';

const auth = useAuthStore();

const handleLogout = async () => {
  await auth.logout();
};
</script>

<style scoped>
nav {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background-color: #f0f0f0;
}

a {
  text-decoration: none;
  color: #333;
  cursor: pointer;
}

.router-link-active {
  font-weight: bold;
}
</style>