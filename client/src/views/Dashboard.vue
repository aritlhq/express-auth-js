<template>
  <div>
    <h1>Dashboard</h1>
    <div v-if="auth.isAuthenticated && auth.currentUser">
      <h2>Welcome, {{ auth.currentUser.name }}!</h2>
      <p>This is a protected page. Only logged-in users can see this.</p>
      <p>Your email is: {{ auth.currentUser.email }}</p>
    </div>
    <div v-else>
      <p>Loading user data...</p>
    </div>
  </div>
</template>

<script setup>
import {useAuthStore} from '../stores/auth';

const auth = useAuthStore();
</script>