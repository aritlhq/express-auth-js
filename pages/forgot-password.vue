<template>
  <div class="form-container">
    <h2>Forgot Password</h2>
    <p>Enter your email address and we will send you a link to reset your password.</p>

    <!-- Tampilkan pesan error atau sukses -->
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="message" class="success">{{ message }}</p>

    <form @submit.prevent="handleForgotPassword">
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required>
      </div>
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Sending...' : 'Send Reset Link' }}
      </button>
    </form>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'guest'
});

const email = ref('');
const error = ref(null);
const message = ref(null); // Untuk pesan sukses
const isLoading = ref(false);

async function handleForgotPassword() {
  isLoading.value = true;
  error.value = null;
  message.value = null;

  try {
    // Panggil API forgot-password
    const response = await $fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: {email: email.value}
    });

    // Tampilkan pesan sukses dari backend
    message.value = response.message;

  } catch (err) {
    error.value = err.data?.statusMessage || 'An unexpected error occurred.';
  } finally {
    isLoading.value = false;
  }
}
</script>