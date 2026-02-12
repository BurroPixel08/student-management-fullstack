import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import Students from '../pages/Students.vue';
// GUSBWORKS 1.0 - ADICIÓN DE RUTA 404 NOT FOUND
import NotFound from '../pages/NotFound.vue'; // <--- 1. Importar

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/students', name: 'Students', component: Students },
  // gusb 1.0 - ruta not found
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound } 
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;