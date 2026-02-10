<template>
  <div class="students-page">
    <h2>Listado de Estudiantes</h2>
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Carrera</th>
          <th>GPA</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="student in students" :key="student.id">
          <td>{{ student.firstName }} {{ student.lastName }}</td>
          <td>{{ student.major }}</td>
          <td>{{ student.gpa }}</td>
          <td>{{ student.email }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api_service';

const students = ref([]);

onMounted(async () => {
  try {
    const response = await api.getStudents();
    students.value = response.data;
  } catch (error) {
    console.error("Error al traer estudiantes:", error);
  }
});
</script>

<style scoped>
table { 
    width: 100%; 
    border-collapse: collapse; 
    margin-top: 20px; 
}

th, td { 
    padding: 12px; 
    border: 1px solid #444; 
    text-align: left; 
}
th { 
    background-color: #42b883; 
    color: white; }
    
tr:nth-child(even) { 
    background-color: #2a2a2a; 
}
</style>