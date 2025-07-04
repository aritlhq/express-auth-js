<template>
  <div>
    <h1>Welcome to the Home Page</h1>
    <p>This page is public and visible to everyone.</p>

    <!-- Tambahkan beberapa link untuk navigasi mudah -->
    <div v-if="!user" style="margin-top: 2rem;">
      <p>You are not logged in.</p>
      <NuxtLink to="/login">Go to Login</NuxtLink>
      |
      <NuxtLink to="/register">Go to Register</NuxtLink>
    </div>
    <div v-else style="margin-top: 2rem;">
      <p>Welcome back, {{ user.name }}!</p>
      <NuxtLink to="/dashboard">Go to your Dashboard</NuxtLink>
    </div>
  </div>
</template>

<script setup>
// Menggunakan useAuth untuk mengetahui status login user
const {user} = useAuth();
</script>

<style scoped>
/* Anda bisa menambahkan style khusus untuk halaman ini */
div {
  text-align: center;
  padding: 2rem;
}
</style>