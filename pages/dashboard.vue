<template>
  <div>
    <h1>Dashboard</h1>
    <!-- Tampilkan data user jika sudah tersedia -->
    <template v-if="user">
      <h2>Welcome, {{ user.name }}!</h2>
      <p>This is a protected page. Only logged-in users can see this.</p>
      <p>Your email is: {{ user.email }}</p>
    </template>
    <!-- Tampilkan pesan loading jika data user belum ada -->
    <p v-else>Loading user data...</p>
  </div>
</template>

<script setup>
// Terapkan middleware 'auth' untuk melindungi halaman ini
definePageMeta({
  middleware: 'auth'
});

// Ambil state user dari composable useAuth
const {user} = useAuth();
</script>