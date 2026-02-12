# API Full Stack student-management
Aplicación Full Stack diseñada para la gestión Académica. Permite registrar, consultar, actualizar y eliminar (CRUD) información de estudiantes a través de una interfaz de usuario conectada a una API REST.

## Tecnologías Principales
Se trabaja bajo un ecosistema basado en JavaScript.
- Frontend: Vue.js 3 (HTML5 / CSS3)
- Backend: Node.js & Express
- Base de Datos: SQLite
- ORM: Sequelize
- Validación: Zod


##Instrucciones de instalación
Sigue estos pasos para levantar el entorno:

**1. Clonar el repositorio**
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
---

##Estructura del proyecto

student-management/
├── 📂 backend/
│   ├── 📂 src/
│   │   ├── 📁 controllers/
│   │   ├── 📁 database/
│   │   ├── 📁 models/
│   │   ├── 📁 routes/
│   │   ├── 📁 utils/
│   │   └── 📄 index.js
│   ├── 🗄️ database.db
│   ├──📄 README_backend.md
│   └── ⚡ test.http
│
├── 📂 frontend/
│   ├── 📂 src/
│   │   ├── 📁 assets/
│   │   ├── 📁 components/
│   │   ├── 📁 pages/
│   │   ├── 📁 router/
│   │   ├── 📁 services/
│   │   ├── 📄 App.vue
│   │   └── 📄 main.js
│   ├── ⚙️.gitignore
│   ├── 🌐 index.html
│   ├── ⚙️ vite.config.js
│   └── 📄 README_frontend.md
│
├── ⚙️.gitignore
├── 📄 package-lock.json
└── 📄 README.md


____
## Uso de la IA
En este proyecto, se integraron herramientas de Inteligencia Artificial (IA) como apoyo técnico, optimizando el flujo de trabajo en ambas capas de la aplicación.

**- En el Backend**

- Generación de código base y sugerencias para la estructura de los endpoints REST.
- Resolución de errores complejos y optimización de la lógica.
- Apoyo en la explicación de métodos específicos de librerías como Express, SQLite y Zod, facilitando la comprensión de herramientas sobre las que no se tenía un dominio total.

**En el Frontend**

- Apoyo en la definición correcta de métodos y propiedades específicos del framework.
- Ayuda en la integración de herramientas externas y manejo de la reactividad.
- Corrección de errores puntuales de sintaxis en JavaScript y CSS.

**[NOTE]**
El uso de la IA se enfocó servir de soporte técnico para el proyecto. Es importante destacar que toda la información y código proporcionados por la IA fueron analizados, filtrados y adaptados para asegurar su compatibilidad con los requerimientos específicos de nuestro sistema.


## Autores
- Maikol Miery
- Elimar Rodríguez
- Gustavo Barreto
- Kaira Henao
