<template>
  <div class="stat-card">
    <div class="card-content">
      <div class="info">
        <span class="title">{{ title }}</span>
        <h2 class="value">{{ value !== undefined && value !== null ? value : '0' }}</h2>
      </div>
      <div class="icon-box" :style="{ backgroundColor: color }">
        <i :class="icon"></i>
      </div>
    </div>
    <div class="card-decoration" :style="{ backgroundColor: color }"></div>
  </div>
</template>

<script setup>
// Definir props con tipos para evitar errores de renderizado
defineProps({
  title: String,
  value: [String, Number], // Acepta ambos
  icon: String,
  color: {
    type: String,
    default: '#8480f1' // Un color por defecto para que no se vea vacío
  }
});
</script>

<style scoped>
.stat-card {
  background: white;
  border-radius: 20px;
  padding: 25px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
  /* Flex 1 para que todas midan lo mismo en el grid */
  flex: 1;
  min-width: 250px;
  transition: transform 0.3s ease;
  border: 1px solid #f0f0f0;
}

.stat-card:hover { 
  transform: translateY(-5px); 
  box-shadow: 0 15px 30px rgba(0,0,0,0.1);
}

.card-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 2;
}

.title { 
  color: #888; 
  font-size: 0.85rem; 
  font-weight: 700; 
  text-transform: uppercase; 
  letter-spacing: 0.5px;
}

.value { 
  color: #1a1a1a; 
  font-size: 2rem; 
  margin: 8px 0 0; 
  font-weight: 800;
}

.icon-box {
  width: 55px;
  height: 55px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.6rem;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.card-decoration {
  position: absolute;
  right: -30px;
  bottom: -30px;
  width: 120px;
  height: 120px;
  opacity: 0.08;
  border-radius: 50%;
  z-index: 1;
}
</style>