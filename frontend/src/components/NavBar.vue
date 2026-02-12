<template>
  <nav 
    :class="{ active: !isCollapsed }" 
    @mouseenter="$emit('toggle-nav', true)" 
    @mouseleave="$emit('toggle-nav', false)"
  >
    <ul>
      <li class="logo">
        <router-link to="/" @click.native="contarClicks">
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

  <div v-if="mostrarBachata" class="easter-egg-overlay" @click="cerrarBachata">
    <div class="video-container">
      <video autoplay loop controls>
        <source src="/bachata.mp4" type="video/mp4">
        Tu navegador no soporta bachata.
      </video>
      <p class="bachata-text">¡PONGANOS 30 PROFESOR PEDRO!🔥</p>
    </div>
  </div>
</template>

<script setup>
    import { ref } from 'vue';

    // Recibimos la orden desde App.vue
    defineProps(['isCollapsed']);
    defineEmits(['toggle-nav']);

    // --- LÓGICA DEL EASTER EGG ---
    const contadorClicks = ref(0);
    const mostrarBachata = ref(false);
    let resetTimer = null;

    const contarClicks = () => {
      contadorClicks.value++;

      // Si pasan más de 1 segundo sin dar click, reiniciamos la cuenta
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        contadorClicks.value = 0;
      }, 1000);

      // Si llega a 5 clicks... ¡FIESTA!
      if (contadorClicks.value === 5) {
        mostrarBachata.value = true;
        contadorClicks.value = 0; // Reiniciar cuenta
      }
    };

    const cerrarBachata = () => {
      mostrarBachata.value = false;
    };
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
  background: #6a5acd; 
  border-left: 10px solid #6a5acd;
  transition: 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
  z-index: 100;
  left: 0;
  top: 0;
  overflow: hidden;
}

nav.active {
  width: 250px;
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
  background-color: #242424; 
  transform: translateX(10px);
}

nav ul li a {
  position: relative;
  display: flex;
  width: 100%;
  text-decoration: none;
  color: white;
  align-items: center;
  /* IMPORTANTE: Para que detecte el click en todo el botón */
  cursor: pointer; 
  user-select: none;
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
  opacity: 0; 
  transition: opacity 0.3s ease;
  padding-left: 10px;
}

nav.active ul li a h2 {
  opacity: 1; 
}

.router-link-active {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px 0 0 20px;
}

.logo {
  margin-bottom: 40px;
  font-weight: bold;
}

/* --- ESTILOS DEL EASTER EGG --- */
.easter-egg-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.95);
  z-index: 9999; /* ¡Por encima de todo! */
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.5s;
}

.video-container {
  text-align: center;
  width: 80%;
  max-width: 800px;
}

video {
  width: 100%;
  border-radius: 20px;
  box-shadow: 0 0 50px #ff6b6b, 0 0 20px #feca57; /* Resplandor Saiyajin */
  border: 4px solid white;
}

.bachata-text {
  color: white;
  font-size: 2rem;
  font-weight: bold;
  margin-top: 20px;
  text-transform: uppercase;
  animation: bounce 1s infinite;
  text-shadow: 0 4px 10px rgba(0,0,0,0.5);
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
</style>