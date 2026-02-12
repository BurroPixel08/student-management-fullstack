## Student management fullstack - Frontend
Interfaz de usuario moderna para el sistema **Student Management**, desarrollada como una Single Page Application (SPA) con **Vue.js 3**. El proyecto ofrece un panel administrativo dinámico para la gestión académica, análisis de datos y control de registros estudiantiles.

---

## Tecnologías Utilizadas

- **Framework:** Vue.js 3.5 (Composition API)
- **Herramienta de Construcción:** Vite 7.2
- **Enrutamiento:** Vue Router 4.6
- **Cliente HTTP:** Axios 1.13
- **Iconografía:** Font Awesome 6.5
- **Estilos:** CSS3 Moderno con soporte para Temas (Dark/Light)

---

##  Instalación y Ejecución

**1. Clonar el repositorio:**
```
git clone https://github.com/BurroPixel08/student-management-fullstack.git
cd student-management-fullstack
```
**2. Desplegar Backend**
```
cd backend
npm install
npm start
```
**3. Desplegar Frontend**
```
cd frontend
npm install
```


**4. Interfaz de usuario disponible en:**
```
 http://localhost:5173/
```

**Nota:** Asegurese de tener la API REST ejecutándose en el puerto 3000 para que el frontend pueda consumir los datos.

## Estructura del Proyecto

Para mantener un código limpio y escalable, se ha seguido la siguiente organización:

    src/components/: Componentes UI reutilizables (StatCard, Navbar).

    src/pages/: Vistas principales de la aplicación (Home, Students).

    src/services/: Configuración de Axios y llamadas a la API REST.

    src/router/: Definición de rutas y navegación.

    src/assets/: Estilos globales y variables CSS de diseño.

## Funcionalidades

- Dashboard Académico: Resumen visual de KPIs (Estudiantes totales, GPA promedio y distribución por carreras).

- Gestión CRUD: Interfaz completa para crear, editar, eliminar y consultar estudiantes en tiempo real.

- Sidebar Inteligente: Navegación lateral expansible con efectos de transición suaves y detección de ruta activa.

- Búsqueda y Filtros: Motor de búsqueda y sistema de paginación para manejar grandes volúmenes de datos.

- Soporte Dark Mode: Interfaz optimizada que se adapta automáticamente a las preferencias visuales del sistema.

## Uso de la IA

Al igual que en el desarrollo del backend, se integró Inteligencia Artificial para:

- Optimización de componentes de Vue y manejo del estado.

- Diseño de interfaces responsivas y transiciones CSS fluidas.

- Estructuración de la lógica de servicios para el consumo de Axios.

- Integración de Validaciones Reales

- Toque Creativo (Easter Egg)


## Estándares de Codificación

- SFC (Single File Components): Uso de la sintaxis <script setup> para mayor legibilidad.

- Arquitectura de Servicios: Separación estricta entre la UI y las peticiones al servidor.

- Nomenclatura: Uso de camelCase para lógica de JavaScript y Kebab-case para clases de CSS.

- Modularidad: Componentes pequeños y enfocados en una sola responsabilidad.


## Autores:

Maikol Miery
Elimar Rodriguez
Gustavo Barreto
Kaira Henao