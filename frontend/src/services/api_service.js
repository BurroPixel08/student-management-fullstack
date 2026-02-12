import axios from 'axios';

// Configuramos la dirección de tu backend (Puerto 3000)
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api/students',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default {
// Función para traer todos los estudiantes
// gusbworks 1.0: Actualizado para recibir page y limit como argumentos
  getStudents(page = 1, limit = 5, filters = {}) {
    // gusbworks 1.1: Construimos los params para enviar al backend
    const params = {
      page,
      limit,
      ...filters
    };
    return apiClient.get('/', { params });
  },

  // Función para traer las estadísticas (GPA, carreras, etc.)
  getStatistics() {
    return apiClient.get('/statistics');
  },

  // Función por si quieres crear un estudiante desde el frontend
  createStudent(data) {
    return apiClient.post('/', data);
  },

  deleteStudent(id) {
    return apiClient.delete(`/${id}`); 
  },

  updateStudent(id, data) {
    return apiClient.put(`/${id}`, data);
  },
  
  updatePartialStudent(id, data) {
    return apiClient.patch(`/${id}`, data);
  }
};