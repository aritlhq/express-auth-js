<template>
  <div id="app-layout">
    <Navbar/>
    <main>
      <router-view/>
    </main>
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue';
</script>

<style>
main {
  padding: 1rem;
}
</style>