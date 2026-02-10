<template>
  <div class="home-container">
    <h1>Dashboard Académico</h1>

    <div class="stats-grid">
      <StatCard 
        title="Estudiantes Activos" 
        :value="stats.totalStudents" 
        icon="fa-solid fa-users" 
        color="#8480f1" 
      />
      
      <StatCard 
        title="Promedio GPA" 
        :value="stats.averageGpa" 
        icon="fa-solid fa-chart-line" 
        color="#42b883" 
      />

      <StatCard 
        title="Carreras Disponibles" 
        :value="stats.majorDistribution?.length" 
        icon="fa-solid fa-book" 
        color="#ff9f43" 
      />
    </div>

    <div class="majors-list">
      <h3>Estudiantes por Carrera</h3>
      
      <div v-if="stats.majorDistribution && stats.majorDistribution.length > 0">
        <div v-for="(item, index) in stats.majorDistribution" :key="index" class="major-item">
          <span class="major-name">{{ item.major }}</span>
          <span class="major-count">{{ item.dataValues.count }} Estudiantes</span>
        </div>
      </div>
      
      <div v-else class="loading-text">
        <p>Esperando datos del servidor...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api_service';
import StatCard from '../components/StatCard.vue';

const stats = ref({
  totalStudents: 0,
  averageGpa: "0.00",
  majorDistribution: []
});

onMounted(async () => {
  try {
    const response = await api.getStatistics();
    
    // ESTO ES LO QUE NECESITAS:
    console.log("--- RESPUESTA DEL ENDPOINT ---");
    console.log(response.data);
    
    // Asignamos la data
    stats.value = response.data;
  } catch (error) {
    console.error("Error cargando el JSON:", error);
  }
});
</script>

<style scoped>
.stats-grid { display: flex; gap: 20px; margin-top: 20px; flex-wrap: wrap; }
.majors-list { margin-top: 40px; background: #2a2a2a; padding: 20px; border-radius: 12px; }
.major-item { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #444; }
.major-name { color: #eee; font-size: 1.1rem; }
.major-count { color: #8480f1; font-weight: bold; }
.loading-text { color: #888; padding: 20px; text-align: center; }
</style>