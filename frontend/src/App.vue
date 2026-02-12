<template>
  <div class="app-layout">
    
    <button class="mobile-toggle" @click="toggleMobileMenu">
      <i class="fa-solid fa-bars"></i>
    </button>

    <div 
      class="mobile-overlay" 
      v-if="isMobileOpen" 
      @click="isMobileOpen = false"
    ></div>

    <aside class="sidebar-wrapper" :class="{ 'mobile-open': isMobileOpen }">
          <Navbar 
            @toggle-nav="handleDesktopToggle" 
            :is-collapsed="!(isNavActive || isMobileOpen)" 
          />
        </aside>

    <main :class="['main-content', { 'shifted': isNavActive }]">
      <router-view />
    </main>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import Navbar from './components/Navbar.vue';

// Estado para Escritorio (Expandido/Colapsado)
const isNavActive = ref(false);

// Estado para Móvil (Abierto/Cerrado)
const isMobileOpen = ref(false);

const handleDesktopToggle = (val) => {
  isNavActive.value = val;
};

const toggleMobileMenu = () => {
  isMobileOpen.value = !isMobileOpen.value;
};
</script>

<style>
/* --- ESTILOS BASE (ESCRITORIO) --- */
body {
  margin: 0;
  background-color: #242424;
  color: white;
  overflow-x: hidden;
}

.app-layout {
  display: flex;
  min-height: 100vh;
}

/* Wrapper del Sidebar */
.sidebar-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 100;
  transition: transform 0.3s ease;
  /* En escritorio NO tiene fondo ni ancho fijo aquí, eso lo maneja el Navbar */
}

.main-content {
  margin-left: 80px; 
  padding: 40px;
  transition: margin-left 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box; 
}

.main-content.shifted {
  margin-left: 280px; 
}

/* Ocultamos elementos móviles por defecto */
.mobile-toggle, .mobile-overlay {
  display: none;
}

/* --- RESPONSIVE (MÓVIL) --- */
@media (max-width: 768px) {
  
  /* 1. Ajuste del Contenido Principal */
  .main-content, .main-content.shifted {
    margin-left: 0 !important; 
    padding: 20px 15px; 
    padding-top: 80px; /* Espacio para que el botón no tape el título */
  }

  /* 2. Botón Hamburguesa */
  .mobile-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 15px;
    left: 15px;
    z-index: 1001; /* Por encima de todo */
    background: #42b883; 
    color: white;
    border: none;
    width: 45px;
    height: 45px;
    border-radius: 12px;
    font-size: 1.2rem;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  }

  /* 3. Sidebar Oculto (Off-canvas) */
  .sidebar-wrapper {
    transform: translateX(-100%) !important; /* Fuera de pantalla */
    width: 280px !important;
    background-color: #1e1e1e;
    z-index: 1000;
    box-shadow: 4px 0 15px rgba(0,0,0,0.5);
  }

  /* Sidebar Abierto */
  .sidebar-wrapper.mobile-open {
    transform: translateX(0) !important;
  }

  /* 4. Overlay Oscuro */
  .mobile-overlay {
    display: block;
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(3px);
    z-index: 999;
  }
}
</style>