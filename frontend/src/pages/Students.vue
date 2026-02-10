<template>
  <div class="students-container">
    <header class="table-header">
      <h2>Listado de Estudiantes</h2>
      <button class="btn-add" @click="openModal">
        <i class="fa-solid fa-plus"></i> Nuevo Estudiante
      </button>
    </header>

    <div class="search-box">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Buscar por nombre, carrera o email..."
      />
    </div>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Estudiante</th>
            <th>Carrera</th>
            <th>GPA</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in filteredStudents" :key="student.id">
            <td>{{ student.firstName }} {{ student.lastName }}</td>
            <td>{{ student.major }}</td>
            <td>{{ student.gpa }}</td>
            <td>{{ student.email }}</td>
            <td class="actions">
              <button @click="editStudent(student)" class="btn-edit"><i class="fa-solid fa-pen"></i></button>
              <button @click="confirmDelete(student.id)" class="btn-delete"><i class="fa-solid fa-trash"></i></button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="filteredStudents.length === 0" class="no-data">
        No se encontraron registros.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../services/api_service';

const students = ref([]);
const searchQuery = ref('');

// Función para cargar datos de tu backend Sequelize
const loadStudents = async () => {
  try {
    const response = await api.getStudents();
    console.log("Datos recibidos en Students:", response.data); // REVISA ESTO EN CONSOLA
    
    // Si tu API devuelve { data: [...] }, usamos response.data
    // Pero si por alguna razón devuelve los estudiantes directo, ajustamos:
    students.value = response.data || []; 
  } catch (error) {
    console.error("Error cargando estudiantes:", error);
  }
};

// Filtro en tiempo real (Frontend)
const filteredStudents = computed(() => {
  // Si no hay estudiantes, devolver array vacío
  if (!students.value) return [];
  
  // Si no hay nada escrito en el buscador, devolver todos
  if (!searchQuery.value) return students.value;

  const q = searchQuery.value.toLowerCase();
  return students.value.filter(s => 
    (s.firstName && s.firstName.toLowerCase().includes(q)) || 
    (s.lastName && s.lastName.toLowerCase().includes(q)) ||
    (s.major && s.major.toLowerCase().includes(q)) ||
    (s.email && s.email.toLowerCase().includes(q))
  );
});

// Función para eliminar
const confirmDelete = async (id) => {
  console.log("ID a eliminar:", id); // <--- Mira esto en la consola (F12)
  if (!id) return alert("Error: El estudiante no tiene un ID válido");

  if (confirm("¿Seguro que deseas eliminar este estudiante?")) {
    try {
      const response = await api.deleteStudent(id);
      console.log("Respuesta del servidor:", response.data);
      await loadStudents(); 
    } catch (error) {
      console.error("Error al eliminar:", error.response);
      alert("No se pudo eliminar: " + (error.response?.data?.message || "Error de servidor"));
    }
  }
};

onMounted(loadStudents);
</script>

<style scoped>
/* Estilos alineados a tu Dashboard oscuro */
.students-container { padding: 20px; }
.table-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }

.btn-add { background: #42b883; color: white; border: none; padding: 10px 15px; border-radius: 8px; cursor: pointer; }

.search-box input {
  width: 100%;
  padding: 10px;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 8px;
  color: white;
  margin-bottom: 20px;
}

.table-wrapper { background: white; border-radius: 12px; overflow: hidden; color: #333; }
table { width: 100%; border-collapse: collapse; }
th { background: #f8f9fa; padding: 15px; text-align: left; color: #777; font-size: 0.85rem; text-transform: uppercase; }
td { padding: 15px; border-top: 1px solid #eee; }

.actions { display: flex; gap: 10px; }
.btn-edit { color: #8480f1; background: none; border: none; cursor: pointer; font-size: 1.1rem; }
.btn-delete { color: #ff5252; background: none; border: none; cursor: pointer; font-size: 1.1rem; }

.no-data { padding: 40px; text-align: center; color: #999; }
</style>