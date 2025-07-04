<script setup>
const {user} = useAuth();
</script>

<template>
  <div>
    <h1>Welcome to the Home Page</h1>
    <p>This page is public and visible to everyone.</p>

    <div v-if="user" class="mt-4">
      <p>You are logged in as {{ user.name }}.
        <NuxtLink to="/dashboard">Go to Dashboard</NuxtLink>
      </p>
    </div>
    <div v-else class="mt-4">
      <p>You can
        <NuxtLink to="/login">login</NuxtLink>
        or
        <NuxtLink to="/register">register</NuxtLink>
        to continue.
      </p>
    </div>
  </div>
</template>