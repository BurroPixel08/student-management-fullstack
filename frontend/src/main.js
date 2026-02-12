import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Importa el archivo del paso 1
import './assets/main.css'; // <--- Agrega esto

const app = createApp(App);
app.use(router); // Activa el router
app.mount('#app');