<script setup>
definePageMeta({
  middleware: 'auth-middleware',
});

const {user} = useAuth();
</script>

<template>
  <div>
    <h1>Dashboard</h1>
    <div v-if="user">
      <h2>Welcome, {{ user.name }}!</h2>
      <p>This is a protected page. Only logged-in users can see this.</p>
      <p>Your email is: {{ user.email }}</p>
    </div>
  </div>
</template>