const sequelize = require('./db-config');
const Student = require('../models/student-model');

const initDb = async () => {
  try {
    console.log('Conectando base de datos');
    
    // 1. Reads your Student model
    // 2. Creates the students table  
    // 3. If the table already exists, it deletes it and creates it again from scratch 
    await sequelize.sync({ force: true });
    
    console.log('Insertando datos de prueba');

    const testStudents = [
      { firstName: 'Maikol', lastName: 'Miery', email: 'maikol.miery@gmail.com', major: 'Ingeniería informática', semester: 8, gpa: 3.8, enrollmentDate: '2021-01-19' },
      { firstName: 'Elimar', lastName: 'Rodríguez', email: 'elirg@gmail.com', major: 'Ingeniería informática', semester: 8, gpa: 3.7, enrollmentDate: '2021-01-19' },
      { firstName: 'Carlos', lastName: 'Pacheco', email: 'carlos234@gmail.com', major: 'Ingeniería informática', semester: 8, gpa: 3, enrollmentDate: '2021-01-20' },
      { firstName: 'Kaira', lastName: 'Henao', email: 'henaok@gmail.com', major: 'Medicina', semester: 4, gpa: 3.7, enrollmentDate: '2023-08-15' },
      { firstName: 'Angel', lastName: 'Bandres', email: 'bandresan@gmail.com', major: 'Contaduría', semester: 2, gpa: 3.2, enrollmentDate: '2024-01-10' },
      { firstName: 'Cheiderson', lastName: 'Belizario', email: 'belizarioch@gmail', major: 'Contaduría', semester: 2, gpa: 4.0, enrollmentDate: '2024-01-10' },
      { firstName: 'Omar', lastName: 'Gonzalez', email: 'omargo@gmail.com', major: 'Física', semester: 1, gpa: 3.0, enrollmentDate: '2024-02-01' },
      { firstName: 'Maura', lastName: 'Meza', email: 'maurameza@gmail.com', major: 'Administración', semester: 10, gpa: 3.9, enrollmentDate: '2020-08-15' },
      { firstName: 'José', lastName: 'Miery', email: 'josemiery@gmail.com', major: 'Administración', semester: 12, gpa: 4.0, enrollmentDate: '2019-01-20' },
      { firstName: 'Norihuska', lastName: 'Parada', email: 'nparada456@gmail.com', major: 'Medicina', semester: 5, gpa: 3.6, enrollmentDate: '2022-08-15' }
    ];

    // inserts multiple records
    await Student.bulkCreate(testStudents);
    
    console.log('Base de datos inicializada con 10 registros.');
    process.exit(0); 
  } catch (error) {
    console.error('Error fatal al inicializar: ', error);
    process.exit(1);
  }
};

initDb();