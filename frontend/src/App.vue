<template>
  <!-- <nav class="navbar">
    <router-link to="/">Inicio</router-link> | 
    <router-link to="/students">Lista de Estudiantes</router-link>
  </nav> -->
  <Navbar @toggle-nav="(val) => isNavActive = val" />
  <main :class="['main-content', { 'shifted': isNavActive }]">
    <router-view />
  </main>
</template>

<script setup>
  import { ref } from 'vue';
  import Navbar from './components/Navbar.vue';

  const isNavActive = ref(false);
</script>

<style>
.main-content {
  margin-left: 80px; 
  padding: 40px;
  transition: margin-left 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
  min-height: 100vh;
}

.main-content.shifted {
  margin-left: 280px; 
}

body {
  margin: 0;
  background-color: #242424;
  color: white;
  overflow-x: hidden;
}
</style>
