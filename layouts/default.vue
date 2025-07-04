<!-- layouts/default.vue (SOLUSI) -->
<template>
  <div>
    <nav>
      <NuxtLink to="/">Home</NuxtLink>

      <!-- Bungkus bagian yang dinamis dengan ClientOnly -->
      <ClientOnly>
        <template v-if="user">
          <NuxtLink to="/dashboard">Dashboard</NuxtLink>
          <a href="#" @click.prevent="logout">Logout</a>
        </template>
        <template v-else>
          <NuxtLink to="/login">Login</NuxtLink>
          <NuxtLink to="/register">Register</NuxtLink>
        </template>

        <!-- Sediakan fallback agar server dan client render hal yang sama pada awalnya -->
        <template #fallback>
          <!-- Tampilkan placeholder atau tidak sama sekali selagi menunggu client-side render -->
          <a href="/login">Loading...</a>
        </template>
      </ClientOnly>

    </nav>
    <main>
      <slot/>
    </main>
  </div>
</template>

<script setup>
const {user, clearUser} = useAuth();
const router = useRouter();

async function logout() {
  try {
    // Kita tidak bisa menggunakan $fetch di sini karena itu composable
    // Gunakan useFetch atau definisikan ulang $fetch
    await $fetch('/api/auth/logout', {method: 'POST'});
    clearUser();
    await router.push('/login');
  } catch (error) {
    console.error('Logout failed:', error);
  }
}
</script>