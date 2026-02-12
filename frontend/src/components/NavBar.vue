<template>
  <nav 
    :class="{ active: !isCollapsed }" 
    @mouseenter="$emit('toggle-nav', true)" 
    @mouseleave="$emit('toggle-nav', false)"
  >
    <ul>
      <li class="logo">
        <router-link to="/">
          <div class="icon">
            <i class="fa-solid fa-graduation-cap"></i>
          </div>
          <h2>Pixel Manage</h2>
        </router-link>
      </li>

      <li>
        <router-link to="/">
          <div class="icon">
            <i class="fa-solid fa-display"></i>
          </div>
          <h2>Dashboard</h2>
        </router-link>
      </li>

      <li>
        <router-link to="/students">
          <div class="icon">
            <i class="fa-solid fa-user-graduate"></i>
          </div>
          <h2>Estudiantes</h2>
        </router-link>
      </li>

      <li>
        <router-link to="/perfil">
          <div class="icon">
            <i class="fa-solid fa-gears"></i>
          </div>
          <h2>Configuración</h2>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script setup>
    // Recibimos la orden desde App.vue
    defineProps(['isCollapsed']);
    
    // Emitimos eventos para cuando pasas el mouse en escritorio
    defineEmits(['toggle-nav']);
</script>

<style scoped>
/* Variables de color adaptadas */
:host {
  --violet: #6a5acd;
  --white: #ffffff;
}

nav {
  position: fixed;
  width: 80px;
  height: 100vh;
  background: #6a5acd; /* Color violeta base */
  border-left: 10px solid #6a5acd;
  transition: 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
  z-index: 100;
  left: 0;
  top: 0;
  overflow: hidden;
}

/* Cuando esta clase se activa (por la prop), el menú crece */
nav.active {
  width: 250px; /* Ancho expandido */
}

nav ul {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding-left: 5px;
  margin-top: 20px;
}

nav ul li {
  position: relative;
  width: 100%;
  list-style: none;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  transition: 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28);
  margin-bottom: 5px;
}

nav ul li:hover {
  background-color: #242424; /* Color de fondo de tu app */
  transform: translateX(10px);
}

nav ul li a {
  position: relative;
  display: flex;
  width: 100%;
  text-decoration: none;
  color: white;
  align-items: center;
}

nav ul li a .icon {
  position: relative;
  display: block;
  min-width: 60px;
  height: 60px;
  line-height: 70px;
  text-align: center;
}

nav ul li a .icon i {
  font-size: 1.5rem;
}

nav ul li a h2 {
  position: relative;
  display: block;
  height: 60px;
  line-height: 60px;
  text-align: start;
  white-space: nowrap;
  text-transform: capitalize;
  font-size: 1rem;
  opacity: 0; /* Oculto por defecto */
  transition: opacity 0.3s ease;
  padding-left: 10px;
}

/* REGLA MÁGICA: Si nav tiene la clase .active, muestra el texto */
nav.active ul li a h2 {
  opacity: 1; 
}

/* Estilo para el link activo de Vue Router */
.router-link-active {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px 0 0 20px;
}

.logo {
  margin-bottom: 40px;
  font-weight: bold;
}
</style>