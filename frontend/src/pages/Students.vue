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
        <th>Nombre</th>
        <th>Carrera</th>
        <th>GPA</th>
        <th>Email</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr 
        v-for="student in paginatedStudents" 
        :key="student.id" 
        @click="viewStudent(student)"
        class="clickable-row"
      >
        <td>{{ student.firstName }} {{ student.lastName }}</td>
        <td>{{ student.major }}</td>
        <td>{{ student.gpa }}</td>
        <td>{{ student.email }}</td>
        <td class="actions">
          <button @click.stop="editStudent(student)" class="btn-edit">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button @click.stop="deleteStudent(student.id)" class="btn-delete">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      </tr>
    </tbody>
  </table>

  <div class="pagination" v-if="filteredStudents.length > 0">
    <button 
      :disabled="currentPage === 1" 
      @click="currentPage--"
      class="page-btn"
    >
      <i class="fa-solid fa-chevron-left"></i> Anterior
    </button>

    <div class="page-numbers">
      <span>Página <strong>{{ currentPage }}</strong> de {{ totalPages }}</span>
    </div>

    <button 
      :disabled="currentPage === totalPages" 
      @click="currentPage++"
      class="page-btn"
    >
      Siguiente <i class="fa-solid fa-chevron-right"></i>
    </button>
  </div>
</div>
    <div v-if="isModalOpen" class="modal-overlay">
      <div class="modal-content">
        <h3>{{ isEditing ? 'Editar Estudiante' : 'Nuevo Estudiante' }}</h3>
        
        <form @submit.prevent="saveStudent">
          <div class="form-group">
            <label>Nombre</label>
            <input v-model="currentStudent.firstName" type="text" required placeholder="Ej: Juan">
          </div>
          
          <div class="form-group">
            <label>Apellido</label>
            <input v-model="currentStudent.lastName" type="text" required placeholder="Ej: Pérez">
          </div>

         <div class="form-group">
          <label>Carrera</label>
          <select v-model="currentStudent.major" required class="form-control">
            <option value="" disabled>Seleccione una carrera...</option>
            <option v-for="major in majors" :key="major" :value="major">
              {{ major }}
            </option>
          </select>
        </div>

          <div class="form-group">
            <label>GPA</label>
            <input v-model="currentStudent.gpa" type="number" step="0.1" min="0" max="5" required>
          </div>

          <div class="form-group">
            <label>Email</label>
            <input v-model="currentStudent.email" type="email" required placeholder="correo@ejemplo.com">
          </div>

          <div class="form-group">
            <label>Semestre</label>
            <input v-model="currentStudent.semester" type="number" min="1" max="12" required>
          </div>

          <div class="form-group">
            <label>Fecha de Inscripción</label>
            <input v-model="currentStudent.enrollmentDate" type="date" required>
          </div>

          <div class="form-group">
            <label>Teléfono (Opcional)</label>
            <input v-model="currentStudent.phoneNumber" type="text" placeholder="04121234567">
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeModal" class="btn-cancel">Cancelar</button>
            <button type="submit" class="btn-save">
              {{ isEditing ? 'Actualizar' : 'Guardar Estudiante' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="isViewModalOpen" class="modal-overlay">
      <div class="modal-content view-card">
        <header class="view-header">
          <div class="avatar-circle">
            {{ currentStudent.firstName[0] }}{{ currentStudent.lastName[0] }}
          </div>
          <h3>Detalles del Estudiante</h3>
        </header>

        <div class="view-body">
          <div class="info-row">
            <label>Nombre Completo:</label>
            <span>{{ currentStudent.firstName }} {{ currentStudent.lastName }}</span>
          </div>
          <div class="info-row">
            <label>Correo Electrónico:</label>
            <span>{{ currentStudent.email }}</span>
          </div>
          <div class="info-row">
            <label>Carrera:</label>
            <span>{{ currentStudent.major }}</span>
          </div>
          <div class="info-grid">
            <div class="info-row">
              <label>Semestre:</label>
              <span>{{ currentStudent.semester }}°</span>
            </div>
            <div class="info-row">
              <label>GPA:</label>
              <span class="gpa-badge">{{ currentStudent.gpa }}</span>
            </div>
          </div>
          <div class="info-row">
            <label>Teléfono:</label>
            <span>{{ currentStudent.phoneNumber || 'No registrado' }}</span>
          </div>
          <div class="info-row">
            <label>Fecha de Ingreso:</label>
            <span>{{ currentStudent.enrollmentDate }}</span>
          </div>
        </div>

        <footer class="modal-actions">
          <button @click="isViewModalOpen = false" class="btn-cancel">Cerrar</button>
          <button @click="goToEditFromView" class="btn-edit-main">
            <i class="fa-solid fa-pen"></i> Editar Información
          </button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import api from '../services/api_service';


const students = ref([]);
const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = 5
const majors = [
  "Ingeniería Informática",
  "Ingeniería Civil",
  "Ingeniería Industrial",
  "Administración de Empresas",
  "Contaduría Pública",
  "Derecho",
  "Psicología",
  "Comunicación Social"
];

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
  if (!searchQuery.value) return students.value;
  
  const query = searchQuery.value.toLowerCase();
  return students.value.filter(s => 
    s.firstName.toLowerCase().includes(query) ||
    s.lastName.toLowerCase().includes(query) ||
    s.email.toLowerCase().includes(query) ||
    s.major.toLowerCase().includes(query)
  );
});

const paginatedStudents = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredStudents.value.slice(start, end);
});

// 3. CÁLCULO: Total de páginas basado en los resultados filtrados
const totalPages = computed(() => {
  const total = Math.ceil(filteredStudents.value.length / itemsPerPage);
  return total > 0 ? total : 1;
});

// 4. RESET: Si el usuario busca, lo regresamos a la página 1
watch(searchQuery, () => {
  currentPage.value = 1;
});

const isModalOpen = ref(false);
const isEditing = ref(false);
const currentStudent = ref({
  id: null,
  firstName: '',
  lastName: '',
  major: '',
  gpa: 0,
  email: '',
  semester: 1, // Nuevo
  enrollmentDate: new Date().toISOString().split('T')[0], 
  phoneNumber: '' 
});

// Abre el modal para crear nuevo
const openModal = () => {
  isEditing.value = false;
  currentStudent.value = { id: null, firstName: '', lastName: '', major: '', gpa: 0, email: '' };
  isModalOpen.value = true;
};

// Abre el modal para editar existente
const editStudent = (student) => {
  isEditing.value = true;
  // Copiamos los datos para no editar la tabla en tiempo real
  currentStudent.value = { ...student };
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

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

const saveStudent = async () => {
  try {
    // 1. Limpiamos los datos para que coincidan con tu validador del backend
    // Aseguramos que el GPA sea un número decimal
    const payload = {
      firstName: currentStudent.value.firstName,
      lastName: currentStudent.value.lastName,
      email: currentStudent.value.email,
      major: currentStudent.value.major,
      semester: parseInt(currentStudent.value.semester),
      gpa: parseFloat(currentStudent.value.gpa),
      enrollmentDate: currentStudent.value.enrollmentDate,
      // ESTA LÍNEA ES LA MAGIA: Quita cualquier cosa que no sea un número
      phoneNumber: currentStudent.value.phoneNumber ? currentStudent.value.phoneNumber.replace(/\D/g, '') : ""
    };

    if (isEditing.value) {
      // 2. Si estamos editando, llamamos a updateStudent (el PUT que tienes en el backend)
      await api.updateStudent(currentStudent.value.id, payload);
      console.log("Estudiante actualizado correctamente");
    } else {
      // 3. Si es nuevo, llamamos a createStudent (el POST que tienes en el backend)
      await api.createStudent(payload);
      console.log("Estudiante creado correctamente");
    }

    // 4. Acciones finales tras el éxito:
    await loadStudents(); // Recargamos la tabla para ver los cambios
    closeModal();         // Cerramos el modal
    alert("Operación exitosa");

  } catch (error) {
      console.error("DEBUG COMPLETO:", error.response); // Esto es para ti en la consola (F12)
      
      // Si el backend nos da detalles (como los errores de Zod)
      const detalleBackend = error.response?.data?.errors 
          ? error.response.data.errors.map(e => `${e.path}: ${e.message}`).join(", ")
          : error.response?.data?.message;

      alert("Atención: " + (detalleBackend || "Error desconocido en el servidor"));
  }
};

const isViewModalOpen = ref(false);

const viewStudent = (student) => {
  // Cargamos los datos en currentStudent para mostrarlos
  currentStudent.value = { ...student };
  isViewModalOpen.value = true;
};

const goToEditFromView = () => {
  isViewModalOpen.value = false;
  isEditing.value = true; // Cambiamos a modo edición
  isModalOpen.value = true; // Abrimos el modal que ya tenías
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

/* Estilos del Modal */
.modal-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex; justify-content: center; align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 100%;
  max-width: 450px;
  color: #333;
}

.form-group { margin-bottom: 15px; }
.form-group label { display: block; margin-bottom: 5px; font-weight: bold; color: #555; }
.form-group input, select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
}


.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.btn-cancel { background: #eee; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; }
.btn-save { background: #42b883; color: white; border: none; padding: 10px 20px;}

.view-card {
  max-width: 500px;
  border-top: 5px solid #42b883;
}

.view-header {
  text-align: center;
  margin-bottom: 20px;
}

.avatar-circle {
  width: 60px;
  height: 60px;
  background: #42b883;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 auto 10px;
}

.view-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-row {
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 5px;
}

.info-row label {
  font-size: 0.8rem;
  color: #888;
  font-weight: bold;
  text-transform: uppercase;
}

.info-row span {
  font-size: 1.1rem;
  color: #333;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.gpa-badge {
  color: #42b883 !important;
  font-weight: bold;
}

.btn-edit-main {
  background: #8480f1;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Contenedor Principal */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  margin-top: 2rem;
  padding: 1rem;
  background: #1e1e1e; /* Un gris un poco más claro que el fondo para que resalte */
  border-radius: 12px;
  border: 1px solid #333;
}

/* Botones Anterior/Siguiente */
.page-btn {
  background-color: #2a2a2a;
  color: #ffffff;
  border: 1px solid #444;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-btn i {
  font-size: 0.8rem;
}

/* Efecto Hover */
.page-btn:hover:not(:disabled) {
  background-color: #42b883;
  border-color: #42b883;
  color: #121212; /* Texto oscuro para que resalte con el verde */
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 184, 131, 0.3);
}

/* Efecto Click */
.page-btn:active:not(:disabled) {
  transform: translateY(0);
}

/* Botón Deshabilitado */
.page-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  filter: grayscale(1);
  background-color: #1a1a1a;
}

/* Información de la Página */
.page-numbers {
  color: #888;
  font-size: 0.95rem;
  font-family: 'Inter', sans-serif;
  letter-spacing: 0.5px;
}

.page-numbers strong {
  color: #42b883;
  font-size: 1.1rem;
  padding: 0 4px;
}

/* Adaptación para pantallas pequeñas */
@media (max-width: 480px) {
  .pagination {
    gap: 0.5rem;
    flex-direction: column;
  }
  
  .page-numbers {
    order: -1;
    margin-bottom: 0.5rem;
  }
}
</style>