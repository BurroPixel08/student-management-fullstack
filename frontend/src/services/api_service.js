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
  getStudents() {
    return apiClient.get('/');
  },

  // Función para traer las estadísticas (GPA, carreras, etc.)
  getStatistics() {
    return apiClient.get('/statistics');
  },

  // Función por si quieres crear un estudiante desde el frontend
  createStudent(data) {
    return apiClient.post('/', data);
  }
};