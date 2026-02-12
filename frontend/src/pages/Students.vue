<template>
  <div class="page-container">
    <div class="table-header">
      <h2>Listado de Estudiantes</h2>
      <button @click="openModal" class="btn-add">
        <i class="fa-solid fa-plus"></i> Nuevo Estudiante
      </button>
    </div>

    <div class="search-box">
      <input 
        v-model="searchQuery" 
        @input="onSearchInput"
        type="text" 
        placeholder="Buscar por nombre, carrera o email..." 
      />
    </div>
    
    <div class="records-info">
       Mostrando página <strong>{{ currentPage }}</strong> de <strong>{{ totalPages }}</strong> (Total: {{ totalItems }} registros)
    </div>

    <div class="table-wrapper">
      <table v-if="students.length > 0">
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
          <tr v-for="student in students" :key="student._id || student.id" class="clickable-row">
            <td @click="openViewModal(student)">{{ student.firstName }} {{ student.lastName }}</td>
            <td @click="openViewModal(student)">{{ student.major }}</td>
            <td @click="openViewModal(student)">
              <span class="gpa-badge" :class="getGpaColor(student.gpa)">{{ student.gpa }}</span>
            </td>
            <td @click="openViewModal(student)">{{ student.email }}</td>
            <td>
              <div class="actions">
                <button @click.stop="openEditModal(student)" class="btn-edit"><i class="fa-solid fa-pen"></i></button>
                <button @click.stop="confirmDelete(student._id || student.id)" class="btn-delete"><i class="fa-solid fa-trash"></i></button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-else class="no-data-message">
        <p v-if="loading">Cargando datos...</p>
        <p v-else>No se encontraron resultados.</p>
      </div>
    </div>

    <div class="pagination" v-if="totalPages > 1">
      <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="page-btn">
        <i class="fa-solid fa-chevron-left"></i> Anterior
      </button>
      
      <span class="page-numbers">
        Página <strong>{{ currentPage }}</strong> de {{ totalPages }}
      </span>
      
      <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="page-btn">
        Siguiente <i class="fa-solid fa-chevron-right"></i>
      </button>
    </div>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h3>{{ isEditing ? 'Editar Estudiante' : 'Nuevo Estudiante' }}</h3>
        
        <form @submit.prevent="saveStudent">
          <div class="form-group">
            <label>Nombres</label>
            <input v-model="currentStudent.firstName" type="text" :class="{'input-error': errors.firstName}">
            <span v-if="errors.firstName" class="error-text">{{ errors.firstName }}</span>
          </div>
          
          <div class="form-group">
            <label>Apellidos</label>
            <input v-model="currentStudent.lastName" type="text" :class="{'input-error': errors.lastName}">
            <span v-if="errors.lastName" class="error-text">{{ errors.lastName }}</span>
          </div>

          <div class="form-group">
            <label>Email</label>
            <input v-model="currentStudent.email" type="email" :class="{'input-error': errors.email}">
            <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
          </div>

          <div class="info-grid">
            <div class="form-group">
              <label>Carrera</label>
              <select v-model="currentStudent.major" :class="{'input-error': errors.major}">
                 <option value="" disabled>Seleccionar...</option>
                 <option value="Ingeniería civil">Ingeniería Civil</option>
                 <option value="Ingeniería informática">Ingeniería Informática</option>
                 <option value="Ingeniería Industrial">Ingeniería Industrial</option>
                 <option value="Medicina">Medicina</option>
                 <option value="Derecho">Derecho</option>
                 <option value="Contaduría">Contaduría</option>
                 <option value="Administración">Administración</option>
                 <option value="Física">Física</option>
              </select>
              <span v-if="errors.major" class="error-text">{{ errors.major }}</span>
            </div>

            <div class="form-group">
              <label>Semestre</label>
              <input v-model="currentStudent.semester" type="number" min="1" max="12" :class="{'input-error': errors.semester}">
              <span v-if="errors.semester" class="error-text">{{ errors.semester }}</span>
            </div>
          </div>

          <div class="info-grid">
            <div class="form-group">
              <label>GPA (0-4)</label>
              <input v-model="currentStudent.gpa" type="number" step="0.1" min="0" max="4" :class="{'input-error': errors.gpa}">
               <span v-if="errors.gpa" class="error-text">{{ errors.gpa }}</span>
            </div>

            <div class="form-group">
              <label>Fecha de Ingreso</label>
              <input v-model="currentStudent.enrollmentDate" type="date" :class="{'input-error': errors.enrollmentDate}">
              <span v-if="errors.enrollmentDate" class="error-text">{{ errors.enrollmentDate }}</span>
            </div>
          </div>
          
          <div class="form-group">
              <label>Teléfono (0414...)</label>
              <input v-model="currentStudent.phoneNumber" type="text" placeholder="04141234567" :class="{'input-error': errors.phoneNumber}">
              <span v-if="errors.phoneNumber" class="error-text">{{ errors.phoneNumber }}</span>
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeModal" class="btn-cancel">Cancelar</button>
            <button type="submit" class="btn-save">Guardar</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showViewModal" class="modal-overlay">
      <div class="modal-content view-card">
        <div class="view-header">
           <div class="avatar-circle">
             {{ getInitials(selectedStudent?.firstName, selectedStudent?.lastName) }}
           </div>
           <h3>{{ selectedStudent?.firstName }} {{ selectedStudent?.lastName }}</h3>
           <p style="color: #666; margin: 0;">{{ selectedStudent?.major }}</p>
        </div>

        <div class="view-body" v-if="selectedStudent">
          <div class="info-grid">
             <div class="info-row">
               <label>Email</label>
               <span>{{ selectedStudent.email }}</span>
             </div>
             <div class="info-row">
               <label>Teléfono</label>
               <span>{{ selectedStudent.phoneNumber || 'N/A' }}</span>
             </div>
          </div>
          
          <div class="info-grid">
            <div class="info-row">
              <label>Semestre</label>
              <span>{{ selectedStudent.semester }}°</span>
            </div>
             <div class="info-row">
               <label>GPA</label>
               <span class="gpa-badge" :class="getGpaColor(selectedStudent.gpa)">{{ selectedStudent.gpa }}</span>
             </div>
          </div>

          <div class="info-row">
             <label>Fecha de Ingreso</label>
             <span>{{ selectedStudent.enrollmentDate }}</span>
          </div>
        </div>

        <div class="modal-actions" style="justify-content: center; margin-top: 30px;">
          <button @click="closeViewModal" class="btn-cancel">Cerrar</button>
          <button @click="openEditFromView" class="btn-edit-main">
            <i class="fa-solid fa-pen"></i> Editar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api_service'; 
import Swal from 'sweetalert2'; 

// --- CONFIGURACIÓN ---
const itemsPerPage = 5; // Debe ser igual o menor a lo que envíe el backend por página

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
});

// --- ESTADOS ---
const students = ref([]);
const loading = ref(true);
const showModal = ref(false);
const showViewModal = ref(false);
const isEditing = ref(false);
const searchQuery = ref("");
const selectedStudent = ref(null);
const errors = ref({}); 

// --- ESTADOS DE PAGINACIÓN REAL (DEL SERVIDOR) ---
const currentPage = ref(1);
const totalPages = ref(1);
const totalItems = ref(0);

const currentStudent = ref({
  id: null,
  firstName: '',
  lastName: '',
  email: '',
  major: '',
  semester: 1,
  gpa: 0.0,
  enrollmentDate: '',
  phoneNumber: ''
});

// --- CARGA DE DATOS (SERVER-SIDE) ---
// Ahora recibimos la página como argumento
const loadStudents = async (page = 1) => {
  loading.value = true;
  try {
    // LLAMADA CLAVE: Enviamos page, limit y la búsqueda al backend
    // 'search' es el nombre del parámetro que tu backend espera para filtrar
    const filters = { search: searchQuery.value }; 
    const response = await api.getStudents(page, itemsPerPage, filters);
    
    // El backend devuelve: { totalItems, totalPages, currentPage, data }
    const resData = response.data;
    
    if (resData.data && Array.isArray(resData.data)) {
      // Estructura correcta del backend paginado
      students.value = resData.data;
      totalPages.value = resData.totalPages;
      currentPage.value = parseInt(resData.currentPage); // Aseguramos que sea número
      totalItems.value = resData.totalItems;
    } else if (Array.isArray(resData)) {
      // Fallback por si la respuesta fuera plana (no debería pasar con tu backend actual)
      students.value = resData;
      totalPages.value = 1;
      totalItems.value = resData.length;
    } else {
      students.value = [];
    }

  } catch (error) {
    console.error("Error cargando estudiantes:", error);
    Swal.fire({icon: 'error', title: 'Error', text: 'No se pudo conectar al servidor'});
  } finally {
    loading.value = false;
  }
};

// Cargar la primera página al iniciar
onMounted(() => loadStudents(1));

// --- CAMBIO DE PÁGINA ---
const changePage = (newPage) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    loadStudents(newPage); // Pedimos la nueva página al servidor
  }
};

// --- BÚSQUEDA CON RETRASO (DEBOUNCE) ---
let searchTimeout;
const onSearchInput = () => {
  // Esperamos 500ms después de que dejes de escribir para no saturar al servidor
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    loadStudents(1); // Al buscar, siempre volvemos a la página 1
  }, 500);
};

// --- VALIDACIONES ---
const validateForm = () => {
  errors.value = {};
  let isValid = true;
  if (!currentStudent.value.firstName) { errors.value.firstName = "Nombre obligatorio"; isValid = false; }
  else if (currentStudent.value.firstName.length < 2) { errors.value.firstName = "Mínimo 2 letras"; isValid = false; }
  if (!currentStudent.value.lastName) { errors.value.lastName = "Apellido obligatorio"; isValid = false; }
  if (!currentStudent.value.email) { errors.value.email = "Email obligatorio"; isValid = false; }
  else if (!/.+@.+\..+/.test(currentStudent.value.email)) { errors.value.email = "Email inválido"; isValid = false; }
  if (!currentStudent.value.major) { errors.value.major = "Selecciona carrera"; isValid = false; }
  if (!currentStudent.value.enrollmentDate) { errors.value.enrollmentDate = "Fecha requerida"; isValid = false; }
  if (currentStudent.value.gpa < 0 || currentStudent.value.gpa > 4) { errors.value.gpa = "GPA debe ser 0-4"; isValid = false; }
  if (currentStudent.value.phoneNumber) {
    const phoneRegex = /^(0412|0414|0424|0416|0426)\d{7}$/;
    if (!phoneRegex.test(currentStudent.value.phoneNumber)) {
      errors.value.phoneNumber = "Formato inválido (Ej: 04141234567)"; isValid = false;
    }
  }
  return isValid;
};

// Guardar
const saveStudent = async () => {
  if (!validateForm()) {
    Toast.fire({ icon: 'warning', title: 'Revisa los errores en rojo' });
    return; 
  }
  try {
    const payload = {
      firstName: currentStudent.value.firstName,
      lastName: currentStudent.value.lastName,
      email: currentStudent.value.email,
      major: currentStudent.value.major,
      semester: parseInt(currentStudent.value.semester),
      gpa: parseFloat(String(currentStudent.value.gpa).replace(',', '.')),
      enrollmentDate: currentStudent.value.enrollmentDate,
      phoneNumber: currentStudent.value.phoneNumber || "" 
    };
    
    // Usamos _id o id
    const idToUpdate = currentStudent.value._id || currentStudent.value.id;
    
    if (isEditing.value && idToUpdate) {
      await api.updateStudent(idToUpdate, payload);
    } else {
      await api.createStudent(payload);
    }

    // Recargamos la página actual para ver los cambios
    await loadStudents(currentPage.value);
    closeModal();
    Toast.fire({ icon: 'success', title: isEditing.value ? 'Actualizado' : 'Creado' });
  } catch (error) {
      console.error("Error al guardar:", error);
      Swal.fire({ icon: 'error', title: 'Error', text: 'Error guardando datos' });
  }
};

// Eliminar
const confirmDelete = async (id) => {
  Swal.fire({
    title: '¿Estás seguro?', text: "Esta acción no se puede deshacer", icon: 'warning',
    showCancelButton: true, confirmButtonColor: '#42b883', cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await api.deleteStudent(id);
        // Recargamos la página actual
        await loadStudents(currentPage.value);
        Toast.fire({ icon: 'success', title: 'Eliminado correctamente' });
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar' });
      }
    }
  });
};

// Modals y Helpers
const openModal = () => { isEditing.value = false; currentStudent.value = { semester: 1, gpa: 0.0 }; errors.value = {}; showModal.value = true; };
const openEditModal = (student) => { isEditing.value = true; currentStudent.value = { ...student }; errors.value = {}; showModal.value = true; };
const closeModal = () => showModal.value = false;
const openViewModal = (student) => { selectedStudent.value = student; showViewModal.value = true; };
const closeViewModal = () => { showViewModal.value = false; selectedStudent.value = null; };
const openEditFromView = () => { if (selectedStudent.value) { const studentToEdit = { ...selectedStudent.value }; closeViewModal(); openEditModal(studentToEdit); } };
const getInitials = (name, lastname) => { if (!name || !lastname) return "??"; return (name[0] + lastname[0]).toUpperCase(); };
const getGpaColor = (gpa) => { if (gpa >= 3.5) return 'text-success'; if (gpa < 2.0) return 'text-danger'; return ''; };
</script>

<style scoped>
.records-info { margin-bottom: 10px; color: #666; font-size: 0.85rem; margin-left: 5px; }
.no-data-message { padding: 40px; text-align: center; color: #888; font-size: 1.1rem; }
.input-error { border-color: #ff5252 !important; background-color: #fffafa; }
.error-text { color: #ff5252; font-size: 0.8rem; margin-top: 4px; display: block; }
.text-success { color: #2ecc71 !important; }
.text-danger { color: #e74c3c !important; }
</style>