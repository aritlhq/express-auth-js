<script setup>
definePageMeta({
  middleware: 'guest',
});

const {login} = useAuth();
const router = useRouter();
const email = ref('');
const password = ref('');
const errorMsg = ref(null);

const handleLogin = async () => {
  try {
    errorMsg.value = null;
    await login({email: email.value, password: password.value});
    router.push('/dashboard');
  } catch (error) {
    errorMsg.value = error.data?.statusMessage || 'An unexpected error occurred.';
  }
};
</script>

<template>
  <div>
    <h2>Login</h2>
    <p v-if="errorMsg" style="color: red;">{{ errorMsg }}</p>
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
    </form>
  </div>
</template>