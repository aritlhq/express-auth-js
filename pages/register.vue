<script setup>
definePageMeta({
  middleware: 'guest',
});

const router = useRouter();

const name = ref('');
const email = ref('');
const password = ref('');
const errorMsg = ref(null);
const successMsg = ref(null);

const handleRegister = async () => {
  try {
    errorMsg.value = null;
    successMsg.value = null;

    await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        name: name.value,
        email: email.value,
        password: password.value,
      },
    });

    successMsg.value = 'Registration successful! Redirecting to login...';
    setTimeout(() => {
      router.push('/login');
    }, 2000);

  } catch (error) {
    errorMsg.value = error.data?.statusMessage || 'An unexpected error occurred.';
  }
};
</script>

<template>
  <div>
    <h2>Register</h2>
    <p v-if="errorMsg" style="color: red;">{{ errorMsg }}</p>
    <p v-if="successMsg" style="color: green;">{{ successMsg }}</p>

    <form @submit.prevent="handleRegister">
      <div>
        <label for="name">Name:</label>
        <input type="text" id="name" v-model="name" required>
      </div>
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required>
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" minlength="6" required>
      </div>
      <button type="submit">Register</button>
    </form>
  </div>
</template>