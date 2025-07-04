<template>
  <div class="form-container">
    <h2>Login</h2>
    <p v-if="error" class="error">{{ error }}</p>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required>
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <button type="submit">Login</button>
      <div style="text-align: center; margin-top: 1rem;">
        <NuxtLink to="/forgot-password">Forgot Password?</NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup>
// Terapkan middleware 'guest'
definePageMeta({
  middleware: 'guest'
});

const {setUser} = useAuth();
const router = useRouter();

const email = ref('');
const password = ref('');
const error = ref(null);

async function handleLogin() {
  try {
    error.value = null;
    const user = await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value,
      }
    });
    setUser(user); // Set user state global
    await router.push('/dashboard'); // Redirect ke dashboard
  } catch (err) {
    error.value = err.data?.message || 'An unexpected error occurred.';
  }
}
</script>