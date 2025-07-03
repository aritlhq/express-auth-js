<template>
  <div class="form-container">
    <h2>Login</h2>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
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

<script setup>
import {ref} from 'vue';
import {useAuthStore} from '../stores/auth';

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const authStore = useAuthStore();

const handleLogin = async () => {
  try {
    errorMessage.value = '';
    await authStore.login({email: email.value, password: password.value});
  } catch (error) {
    errorMessage.value = error.message;
  }
};
</script>

<style scoped>
.error {
  color: red;
}

</style>