import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Importa el archivo del paso 1

const app = createApp(App);
app.use(router); // Activa el router
app.mount('#app');