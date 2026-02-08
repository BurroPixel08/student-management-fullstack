# API REST student-management

API REST desarrollada con **Node.js y Express** que implementa operaciones **CRUD (Create, Read, Update, Delete)** para la gestión de información de estudiantes universitarios, utilizando **SQLite** como base de datos.

---

## Tecnologías utilizadas

- Lenguaje: Node.js
- Framework: Express
- Base de datos: SQLite
- Validación de datos: Zod
- ORM: Sequelize
- Control de versiones: Git

---

##  Instalación

**1. Clonar el repositorio:**
Descarga los archivos del proyecto a tu computadora

```
git clone https://github.com/BurroPixel08/student-management-api.git
cd student-management-api
```

**2. Instalar Dependencias:**
Este comando descargará todas las librerías necesarias especificadas en el archivo package.json, como Express, Sequelize y Zod:

```
npm install
```

## Ejecución del proyecto

**1. Incialización de la base de datos y despliegue del servidor:**
Crea la base de datos, inserta 10 registros de prueba y despliega el servidor
```
npm start
```

**2. La API estará disponible en:**
```
 http://localhost:3000
```

## Endpoints
La URL base para todas las consultas es: ``http://localhost:3000``

**Obtener todos los Estudiantes**
Muestra la lista de estudiantes activos.
GET ``/api/students/``

Filtros opcionales:
``?major=Carrera&semester=1``

- - -
**Obtener un Estudiante por ID**
GET ``/api/students/:id``

- - -
**Crear un nuevo Estudiante**
Crea un registro validando los datos con Zod.

POST `` /api/students/``

Cuerpo (JSON):
```json
{
  "firstName": "Andrés",
  "lastName": "Pérez",
  "email": "andres@universidad.edu",
  "major": "Ingeniería de Sistemas",
  "semester": 4,
  "gpa": 4.5,
  "enrollmentDate": "2024-02-15"
}
```
- - -
**Actualizar un Estudiante (Parcial)**
Permite modificar uno o varios campos de un estudiante existente.

PATCH``/api/students/:id``

Cuerpo (JSON):
```Json
{
  "gpa": 4.8,
  "semester": 5
}
```
**Actualización Completa de un Estudiante**
Se utiliza para reemplazar todos los datos de un estudiante. 
Si un campo no se envía, Sequelize podría marcarlo como nulo o usar el valor por defecto.

PUT ```/api/students/:id```

Cuerpo (JSON): Debes enviar el objeto completo para asegurar la integridad.
```json
{
  "firstName": "Lucía",
  "lastName": "Méndez García",
  "email": "lucia.m.garcia@universidad.edu",
  "major": "Medicina Interna",
  "semester": 4,
  "gpa": 4.3,
  "is_active": true,
  "enrollmentDate": "2024-01-15"
}
```
---
**Eliminación Lógica (Soft Delete)**
Aplica el método destroy de Sequelize con paranoid: true, lo que llena el campo deletedAt en lugar de borrar la fila.

DELETE ```/api/students/:id```


## Uso de la IA

Durante el desarrollo del proyecto se utilizó Inteligencia Artificial como herramienta de apoyo en:

- Generación de código base.
- Sugerencias de estructura de endpoints REST.
- Resolución de errores y mejoras de lógica.
- Ayuda en la redacción de documentación (README).

Adicionalmente, la IA ayudó en la generación y explicación de algunos de los métodos utilizados por las librerías y frameworks empleados (documentación de Express, SQLite y Zod), ya que no se cuenta con un manejo total de cada una de estas librerías.

## Estándares de codificación utilizados
- Uso de camelCase para variables y funciones.
- Validación de datos de entrada utilizando Zod.
- Separación de rutas, controladores y configuración.
- Manejo de errores HTTP.
- Uso de .gitignore para excluir node_modules y archivos innecesarios.

## Autores
- Maikol Miery
- Elimar Rodríguez