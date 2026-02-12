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
              <button @click.stop="confirmDelete(student.id)" class="btn-delete">
                <i class="fa-solid fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="pagination" v-if="filteredStudents.length > 0">
        <button :disabled="currentPage === 1" @click="currentPage--" class="page-btn">
          <i class="fa-solid fa-chevron-left"></i> Anterior
        </button>
        <div class="page-numbers">
          <span>Página <strong>{{ currentPage }}</strong> de {{ totalPages }}</span>
        </div>
        <button :disabled="currentPage === totalPages" @click="currentPage++" class="page-btn">
          Siguiente <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </div>

    <div v-if="isModalOpen" class="modal-overlay">
      <div class="modal-content">
        <h3>{{ isEditing ? 'Editar Estudiante' : 'Nuevo Estudiante' }}</h3>
        
        <form @submit="saveStudent">
          <div class="form-group">
            <label>Nombre</label>
            <input v-model="firstName" type="text" placeholder="Ej: Juan" :class="{'input-error': errors.firstName}">
            <span class="error-text">{{ errors.firstName }}</span>
          </div>
          
          <div class="form-group">
            <label>Apellido</label>
            <input v-model="lastName" type="text" placeholder="Ej: Pérez" :class="{'input-error': errors.lastName}">
            <span class="error-text">{{ errors.lastName }}</span>
          </div>

          <div class="form-group">
            <label>Carrera</label>
            <select v-model="major" class="form-control" :class="{'input-error': errors.major}">
              <option value="" disabled>Seleccione una carrera...</option>
              <option v-for="m in majors" :key="m" :value="m">{{ m }}</option>
            </select>
            <span class="error-text">{{ errors.major }}</span>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>GPA</label>
              <input v-model="gpa" type="number" step="0.1" :class="{'input-error': errors.gpa}">
              <span class="error-text">{{ errors.gpa }}</span>
            </div>

            <div class="form-group">
              <label>Semestre</label>
              <input v-model="semester" type="number" :class="{'input-error': errors.semester}">
              <span class="error-text">{{ errors.semester }}</span>
            </div>
          </div>

          <div class="form-group">
            <label>Email</label>
            <input v-model="email" type="email" placeholder="correo@ejemplo.com" :class="{'input-error': errors.email}">
            <span class="error-text">{{ errors.email }}</span>
          </div>

          <div class="form-group">
            <label>Fecha de Inscripción</label>
            <input v-model="enrollmentDate" type="date" :class="{'input-error': errors.enrollmentDate}">
            <span class="error-text">{{ errors.enrollmentDate }}</span>
          </div>

          <div class="form-group">
            <label>Teléfono (Venezuela)</label>
            <input 
              v-model="phoneNumber" 
              type="text" 
              placeholder="Ej: 04121234567" 
              maxlength="11"
              :class="{'input-error': errors.phoneNumber}"
            >
            <span class="error-text" v-if="errors.phoneNumber">
              <i class="fa-solid fa-circle-exclamation"></i> {{ errors.phoneNumber }}
            </span>
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
        <header class="view-header" v-if="selectedStudentForView">
          <div class="avatar-circle">
            {{ selectedStudentForView.firstName[0] }}{{ selectedStudentForView.lastName[0] }}
          </div>
          <h3>Detalles del Estudiante</h3>
        </header>

        <div class="view-body" v-if="selectedStudentForView">
          <div class="info-row"><label>Nombre:</label> <span>{{ selectedStudentForView.firstName }} {{ selectedStudentForView.lastName }}</span></div>
          <div class="info-row"><label>Email:</label> <span>{{ selectedStudentForView.email }}</span></div>
          <div class="info-row"><label>Carrera:</label> <span>{{ selectedStudentForView.major }}</span></div>
          <div class="info-grid">
            <div class="info-row"><label>Semestre:</label> <span>{{ selectedStudentForView.semester }}°</span></div>
            <div class="info-row"><label>GPA:</label> <span class="gpa-badge">{{ selectedStudentForView.gpa }}</span></div>
          </div>
          <div class="info-row"><label>Teléfono:</label> <span>{{ selectedStudentForView.phoneNumber || 'No registrado' }}</span></div>
          <div class="info-row"><label>Fecha Ingreso:</label> <span>{{ selectedStudentForView.enrollmentDate }}</span></div>
        </div>

        <footer class="modal-actions">
          <button @click="isViewModalOpen = false" class="btn-cancel">Cerrar</button>
          <button @click="goToEditFromView" class="btn-edit-main">Editar</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useForm } from 'vee-validate';
import { studentSchema } from '../schemas/StudentSchema';
import api from '../services/api_service';

// --- ESTADO ---
const students = ref([]);
const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = 5;
const isModalOpen = ref(false);
const isEditing = ref(false);
const isViewModalOpen = ref(false);
const currentId = ref(null);
const selectedStudentForView = ref(null);

const majors = [
  "Ingeniería Informática", "Ingeniería Civil", "Ingeniería Industrial",
  "Administración de Empresas", "Contaduría Pública", "Derecho",
  "Psicología", "Comunicación Social"
];

// --- VEE-VALIDATE & ZOD ---

const { errors, defineField, handleSubmit, resetForm, setValues } = useForm({
  validationSchema: studentSchema,
  // ESTO ES LO QUE DEBES AGREGAR/MODIFICAR:
  initialValues: {
    firstName: '',
    lastName: '',
    email: '',
    major: '',
    gpa: 0,
    semester: 1,
    phoneNumber: '',
    enrollmentDate: new Date().toISOString().split('T')[0]
  }
});

const [firstName] = defineField('firstName');
const [lastName] = defineField('lastName');
const [email] = defineField('email');
const [major] = defineField('major');
const [gpa] = defineField('gpa');
const [semester] = defineField('semester');
const [phoneNumber] = defineField('phoneNumber');
const [enrollmentDate] = defineField('enrollmentDate');

// --- LÓGICA ---
const loadStudents = async () => {
  try {
    const response = await api.getStudents();
    students.value = response.data || [];
  } catch (error) {
    console.error("Error cargando estudiantes:", error);
  }
};

onMounted(loadStudents);

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
  return filteredStudents.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => Math.ceil(filteredStudents.value.length / itemsPerPage) || 1);

watch(searchQuery, () => currentPage.value = 1);

// --- ACCIONES ---
const openModal = () => {
  isEditing.value = false;
  currentId.value = null;
  resetForm();
  isModalOpen.value = true;
};

const editStudent = (student) => {
  isEditing.value = true;
  currentId.value = student.id;
  setValues({ ...student });
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  resetForm();
};

const saveStudent = handleSubmit(async (values) => {
  try {
    if (isEditing.value) {
      await api.updateStudent(currentId.value, values);
    } else {
      await api.createStudent(values);
    }
    await loadStudents();
    closeModal();
    alert("Operación exitosa");
  } catch (error) {
    alert("Error: " + (error.response?.data?.message || "Error de servidor"));
  }
});

const confirmDelete = async (id) => {
  if (confirm("¿Seguro que deseas eliminar este estudiante?")) {
    try {
      await api.deleteStudent(id);
      await loadStudents();
    } catch (error) {
      alert("No se pudo eliminar");
    }
  }
};

const viewStudent = (student) => {
  selectedStudentForView.value = student;
  isViewModalOpen.value = true;
};

const goToEditFromView = () => {
  const student = selectedStudentForView.value;
  isViewModalOpen.value = false;
  editStudent(student);
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

input.input-error, 
select.input-error {
  border: 2px solid #ff5252 !important;
  background-color: #fffafa !important;
  box-shadow: 0 0 5px rgba(255, 82, 82, 0.2) !important;
  animation: shake 0.2s ease-in-out 0s 2;
}

.error-text {
  color: #ff5252 !important;
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 4px;
  display: block;
  text-align: left;
}

@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(3px); }
  50% { transform: translateX(-3px); }
  75% { transform: translateX(3px); }
  100% { transform: translateX(0); }
}

/* Estilo de enfoque normal (sin error) */
input:focus:not(.input-error), 
select:focus:not(.input-error) {
  border-color: #42b883;
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.1);
  outline: none;
}
</style>