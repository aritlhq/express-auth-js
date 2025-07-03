<template>
  <div class="form-container">
    <h2>Register</h2>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
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
        <input type="password" id="password" v-model="password" required>
      </div>
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import {useAuthStore} from '../stores/auth';

const name = ref('');
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const authStore = useAuthStore();

const handleRegister = async () => {
  try {
    errorMessage.value = '';
    await authStore.register({
      name: name.value,
      email: email.value,
      password: password.value
    });
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