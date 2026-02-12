<template>
  <div class="page-container">
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
        v-for="student in studentsList" 
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

<div class="pagination">
    <button 
      :disabled="currentPage === 1" 
      @click="changePage(currentPage - 1)"
      class="page-btn"
    >
      <i class="fa-solid fa-chevron-left"></i> Previous
    </button>

    <div class="page-numbers">
      <span>Page <strong>{{ currentPage }}</strong> of {{ totalPages }}</span>
    </div>

    <button 
      :disabled="currentPage === totalPages" 
      @click="changePage(currentPage + 1)"
      class="page-btn"
    >
      Next <i class="fa-solid fa-chevron-right"></i>
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
            <input v-model="currentStudent.gpa" type="number" step="0.1" min="0" max="4" required>
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
import Swal from 'sweetalert2'; // <--- POP UPS


const students = ref([]);
const studentsList = ref([]); // Lista real que viene del server
const searchQuery = ref("");
const currentPage = ref(1);
const totalPages = ref(1); // gusbworks 1.2: Variables de estado para la paginación - total de paginas
const itemsPerPage = 5;
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

// gusbworks 3.1: SweetAlert Toast Configuration
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end', // Sale en la esquina superior derecha
  showConfirmButton: false,
  timer: 3000, // Dura 3 segundos
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
});

// GUSBWORKS 1.0 - ADICIÓN DE LA FUNCION AUXILIAR Y MODIFICACIÓN DE LA FUNCION LOAD Students 

// gusbworks 1.7: Corrección de formato de fecha al cargar desde la DB
const mapBackendToFrontend = (data) => {
  // Extraemos la fecha raw y la cortamos por la 'T' para obtener solo YYYY-MM-DD
  const rawDate = data.enrollment_date || data.enrollmentDate || '';
  const formattedDate = rawDate.split('T')[0];

  return {
    id: data.id,
    firstName: data.first_name || data.firstName,
    lastName: data.last_name || data.lastName,
    email: data.email,
    major: data.major,
    semester: data.semester,
    gpa: data.gpa,
    enrollmentDate: formattedDate, // ¡Fecha limpia para el formulario HTML!
    phoneNumber: data.phone_number || data.phoneNumber
  };
};

// gusbworks 2.0: Updated to send search query to API
const loadStudents = async () => {
  try {
    // Creamos el objeto filters con lo que haya en la caja de búsqueda
    const filters = { search: searchQuery.value }; 
    
    // Lo enviamos como tercer parámetro a nuestro api_service
    const response = await api.getStudents(currentPage.value, itemsPerPage, filters);
    
    if (response.data.data) {
      studentsList.value = response.data.data.map(mapBackendToFrontend);
      totalPages.value = response.data.totalPages;
      currentPage.value = response.data.currentPage;
    } else {
      studentsList.value = response.data.map(mapBackendToFrontend);
    }
  } catch (error) {
    console.error("Error loading students:", error);
  }
};

// gusbworks 2.0: Debounce search to prevent API spam
let searchTimeout;
watch(searchQuery, () => {
  clearTimeout(searchTimeout);
  
  searchTimeout = setTimeout(() => {
    currentPage.value = 1; // Volvemos a la página 1 al buscar
    loadStudents();        // Llamamos al backend con la nueva palabra
  }, 300);
});

// gusbworks 1.2: New page change handler
const changePage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
    loadStudents();
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


// gusb 1.2 removido el calculo de paginas

// 4. RESET: Si el usuario busca, lo regresamos a la página 1
// Reset to page 1 on search
watch(searchQuery, () => {
  currentPage.value = 1;
  // Note: Add logic here if backend search is implemented
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
  currentStudent.value = { id: null, firstName: '', lastName: '', major: '', gpa: 0, email: '', semester: 1 };
  isModalOpen.value = true;
};

// Abre el modal para editar existente
const editStudent = (student) => {
  isEditing.value = true;
  // Copiamos los datos para no editar la tabla en tiempo real
  currentStudent.value = { ...student };
  isModalOpen.value = true;
};

const closeModal = () => { isModalOpen.value = false; };

// Función para eliminar
const confirmDelete = async (id) => {
  // gusbworks 3.1: SweetAlert Confirmation Dialog
  Swal.fire({
    title: '¿Estás seguro?',
    text: "No podrás revertir esta acción",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#42b883', // Usamos tu verde
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    background: '#fff',
    color: '#333'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await api.deleteStudent(id);
        
        await loadStudents();
        
        // Mensaje de éxito tras borrar
        Toast.fire({
          icon: 'success',
          title: 'Estudiante eliminado'
        });
        
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar el estudiante'
        });
      }
    }
  });
};


// Función para guardar o actualizar
const saveStudent = async () => {
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

    if (isEditing.value) {
      await api.updateStudent(currentStudent.value.id, payload);
    } else {
      await api.createStudent(payload);
    }

    await loadStudents();
    closeModal();
    
    // gusbworks 3.1: Beautiful Success Message
    Toast.fire({
      icon: 'success',
      title: isEditing.value ? 'Estudiante actualizado' : 'Estudiante creado exitosamente'
    });

  } catch (error) {
      console.error("DEBUG:", error.response?.data);
      let detalleBackend = error.response?.data?.message || "Error de servidor";
      
      if (error.response?.data?.errors) {
        // Detector de errores mejorado (atrapa singular y plural)
          detalleBackend = error.response.data.errors.map(e => `${e.path}: ${e.message}`).join(", ");
      } else if (error.response?.data?.error) {
        // Si el backend manda "error" en lugar de "errors" else if
          detalleBackend = JSON.stringify(error.response.data.error);
      }
      
      // gusbworks 3.1: Beautiful Error Message
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: detalleBackend,
      });
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

