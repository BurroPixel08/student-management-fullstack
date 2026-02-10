import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import Students from '../pages/Students.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/students', name: 'Students', component: Students }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;