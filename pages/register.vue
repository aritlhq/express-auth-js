<template>
  <div class="form-container">
    <h2>Register</h2>
    <!-- Tampilkan pesan error jika ada -->
    <p v-if="error" class="error">{{ error }}</p>

    <!-- Gunakan @submit.prevent untuk menangani submit form tanpa reload halaman -->
    <form @submit.prevent="handleRegister">
      <div>
        <label for="name">Name:</label>
        <!-- v-model mengikat input ke variabel reaktif di script -->
        <input type="text" id="name" v-model="name" required>
      </div>
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required>
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Registering...' : 'Register' }}
      </button>
    </form>
  </div>
</template>

<script setup>
// Terapkan middleware 'guest' untuk mencegah user yang sudah login mengakses halaman ini
definePageMeta({
  middleware: 'guest'
});

const router = useRouter(); // Untuk navigasi/redirect

// Variabel reaktif untuk data form dan status UI
const name = ref('');
const email = ref('');
const password = ref('');
const error = ref(null); // Untuk menyimpan pesan error
const isLoading = ref(false);

// Fungsi yang dipanggil saat form disubmit
async function handleRegister() {
  isLoading.value = true;
  error.value = null; // Reset error setiap kali submit

  try {
    // Panggil API register yang telah kita buat
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        name: name.value,
        email: email.value,
        password: password.value,
      }
    });

    // Jika berhasil, arahkan ke halaman login
    await router.push('/login');

  } catch (err) {
    // Tangkap dan tampilkan error dari API
    error.value = err.data?.statusMessage || 'An unexpected error occurred.';
  } finally {
    isLoading.value = false;
  }
}
</script>