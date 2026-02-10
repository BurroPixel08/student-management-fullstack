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
        :value="stats.majorDistribution.length" 
        icon="fa-solid fa-book" 
        color="#ff9f43" 
      />
    </div>

    <div class="majors-list">
      <h3>Estudiantes por Carrera</h3>
      
      <div v-if="stats.majorDistribution.length > 0">
        <div v-for="(item, index) in stats.majorDistribution" :key="index" class="major-item">
          <span class="major-name">{{ item.major }}</span>
          <span class="major-count">
            {{ item.count || (item.dataValues ? item.dataValues.count : 0) }} Estudiantes
          </span>
        </div>
      </div>
      
      <div v-else class="loading-state">
        <p>No hay datos disponibles o el servidor no responde...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api_service'; // Asegúrate de que este servicio use axios.get
import StatCard from '../components/StatCard.vue';

// Definimos el objeto con la estructura exacta que manda tu backend
const stats = ref({
  totalStudents: 0,
  averageGpa: "0.00",
  majorDistribution: []
});

onMounted(async () => {
  try {
    // Llamada al endpoint de estadísticas
    const response = await api.getStatistics();
    
    // IMPORTANTE: Imprimimos para verificar que response.data traiga el objeto
    console.log("JSON recibido:", response.data);

    // Asignamos la data directamente al valor del ref
    if (response.data) {
      stats.value = response.data;
    }
  } catch (error) {
    console.error("Error al conectar con el backend:", error);
  }
});
</script>

<style scoped>
/* Mantén tus estilos actuales de grid y lista */
.stats-grid { display: flex; gap: 20px; margin-top: 20px; flex-wrap: wrap; }
.majors-list { margin-top: 40px; background: #2a2a2a; padding: 20px; border-radius: 12px; }
.major-item { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #444; }
.major-name { color: #eee; }
.major-count { color: #8480f1; font-weight: bold; }
</style>