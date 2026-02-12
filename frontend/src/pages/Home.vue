<template>
  <div class="dashboard-container">
    <h1 class="page-title">Dashboard Académico</h1>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="card-content">
          <span class="card-label">ESTUDIANTES ACTIVOS</span>
          <span class="card-value">{{ stats.totalStudents || 0 }}</span>
        </div>
        <div class="card-icon bg-purple">
          <i class="fa-solid fa-users"></i>
        </div>
      </div>

      <div class="stat-card">
        <div class="card-content">
          <span class="card-label">PROMEDIO GPA</span>
          <span class="card-value">{{ formatNumber(stats.averageGpa) }}</span>
        </div>
        <div class="card-icon bg-green">
          <i class="fa-solid fa-chart-line"></i>
        </div>
      </div>

      <div class="stat-card">
        <div class="card-content">
          <span class="card-label">CARRERAS DISPONIBLES</span>
          <span class="card-value">{{ majorsList.length }}</span>
        </div>
        <div class="card-icon bg-orange">
          <i class="fa-solid fa-book"></i>
        </div>
      </div>
    </div>

    <div class="majors-section">
      <h3 class="section-title">Estudiantes por Carrera</h3>
      
      <div class="majors-list">
        <div v-if="majorsList.length === 0" class="no-data">
          No hay datos registrados aún.
        </div>

        <div v-for="(item, index) in majorsList" :key="index" class="major-row">
          <span class="major-name">{{ item.major }}</span>
          <span class="major-count">{{ item.count }} Estudiantes</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../services/api_service';

const stats = ref({
  totalStudents: 0,
  averageGpa: 0,
  majorDistribution: [] 
});

// Convertimos la distribución en una lista fácil de usar
const majorsList = computed(() => {
  const dist = stats.value.majorDistribution;
  if (!dist) return [];
  // Si el backend envía array (lo normal en Sequelize con group by):
  if (Array.isArray(dist)) return dist;
  // Si enviara objeto, lo convertimos a array para poder recorrerlo
  return Object.keys(dist).map(key => ({ major: key, count: dist[key] }));
});

const formatNumber = (num) => Number(num).toFixed(2);

onMounted(async () => {
  try {
    const response = await api.getStatistics();
    stats.value = response.data;
  } catch (error) {
    console.error("Error cargando dashboard:", error);
  }
});
</script>

<style scoped>
/* Estilos oscuros para igualar tu diseño anterior */
.dashboard-container {
  padding: 30px;
  color: #e0e0e0;
}

.page-title {
  font-size: 1.8rem;
  margin-bottom: 30px;
  color: #ffffff;
}

/* GRID DE TARJETAS */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
}

.stat-card {
  background: #1e1e1e; /* Fondo oscuro de tarjeta */
  padding: 25px;
  border-radius: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.card-content {
  display: flex;
  flex-direction: column;
}

.card-label {
  font-size: 0.85rem;
  color: #888;
  font-weight: bold;
  letter-spacing: 1px;
  margin-bottom: 10px;
  text-transform: uppercase;
}

.card-value {
  font-size: 2.2rem;
  font-weight: bold;
  color: #fff;
}

.card-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.bg-purple { background: #6c63ff; }
.bg-green { background: #42b883; }
.bg-orange { background: #ff9f43; }

/* SECCIÓN LISTA DE CARRERAS */
.majors-section {
  background: #1e1e1e;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.section-title {
  margin-bottom: 20px;
  font-size: 1.1rem;
  color: #ccc;
  border-bottom: 1px solid #333;
  padding-bottom: 15px;
}

.major-row {
  display: flex;
  justify-content: space-between;
  padding: 15px 0;
  border-bottom: 1px solid #2a2a2a;
  transition: background 0.2s;
}

.major-row:last-child {
  border-bottom: none;
}

.major-row:hover {
  background: rgba(255,255,255,0.03);
}

.major-name {
  font-weight: 500;
  color: #fff;
}

.major-count {
  color: #6c63ff; /* Color morado para el número */
  font-weight: bold;
}

.no-data {
  text-align: center;
  padding: 20px;
  color: #666;
}
</style>