<template>
  <div class="form-container">
    <!-- Tampilkan pesan error jika token tidak valid -->
    <div v-if="error">
      <h2>Invalid Link</h2>
      <p class="error">{{ error.data?.message || 'This password reset link is invalid or has expired.' }}</p>
      <NuxtLink to="/forgot-password">Request a new link</NuxtLink>
    </div>

    <!-- Tampilkan form hanya jika token valid (tidak ada error) -->
    <div v-else>
      <h2>Reset Password</h2>

      <p v-if="resetMessage" class="success">{{ resetMessage }}</p>

      <form v-if="!resetMessage" @submit.prevent="handleResetPassword">
        <div>
          <label for="password">New Password:</label>
          <input type="password" id="password" v-model="password" required minlength="6">
        </div>
        <div>
          <label for="confirmPassword">Confirm New Password:</label>
          <input type="password" id="confirmPassword" v-model="confirmPassword" required>
        </div>
        <button type="submit" :disabled="isLoading">
          {{ isLoading ? 'Resetting...' : 'Reset Password' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const router = useRouter();
const token = route.params.token;

// --- Validasi Token Saat Halaman Dimuat ---
// useAsyncData akan berjalan di server saat render awal.
const {error} = await useAsyncData('verify-token', () =>
    $fetch(`/api/auth/verify-token?token=${token}`)
);

// Variabel untuk form reset
const password = ref('');
const confirmPassword = ref('');
const resetMessage = ref(null);
const isLoading = ref(false);

// Fungsi handleResetPassword tetap sama
async function handleResetPassword() {
  if (password.value !== confirmPassword.value) {
    // Anda bisa menambahkan error handling di sini
    return;
  }
  isLoading.value = true;
  try {
    const response = await $fetch('/api/auth/reset-password', {
      method: 'POST',
      body: {token: token, password: password.value}
    });
    resetMessage.value = response.message + ' Redirecting to login...';
    setTimeout(() => router.push('/login'), 3000);
  } catch (err) {
    // Tangani error jika token tiba-tiba kadaluwarsa saat form disubmit
    resetMessage.value = err.data?.message || 'An error occurred.';
  } finally {
    isLoading.value = false;
  }
}
</script>