const sequelize = require('./db-config');
const { Student } = require('../models/student-model');

const initDb = async () => {
  try {
    console.log('Conectando base de datos');
    
    // 1. Reads your Student model
    // 2. Creates the students table  
    // 3. If the table already exists, it deletes it and creates it again from scratch 
    await sequelize.sync({ force: true });
    
    console.log('Insertando datos de prueba');

    const testStudents = [
  { firstName: 'Maikol', lastName: 'Miery', email: 'maikol.miery@gmail.com', major: 'Ingeniería informática', semester: 8, gpa: 3.8, enrollmentDate: '2021-01-19', phoneNumber: '04121234567', isActive: true },
  { firstName: 'Elimar', lastName: 'Rodríguez', email: 'elirg@gmail.com', major: 'Ingeniería informática', semester: 8, gpa: 3.7, enrollmentDate: '2021-01-19', phoneNumber: '04142345678', isActive: true },
  { firstName: 'Carlos', lastName: 'Pacheco', email: 'carlos234@gmail.com', major: 'Ingeniería informática', semester: 8, gpa: 3.0, enrollmentDate: '2021-01-20', phoneNumber: '04243456789', isActive: true },
  { firstName: 'Kaira', lastName: 'Henao', email: 'henaok@gmail.com', major: 'Medicina', semester: 4, gpa: 3.7, enrollmentDate: '2023-08-15', phoneNumber: '04164567890', isActive: true },
  { firstName: 'Angel', lastName: 'Bandres', email: 'bandresan@gmail.com', major: 'Contaduría', semester: 2, gpa: 3.2, enrollmentDate: '2024-01-10', phoneNumber: '04125678901', isActive: true },
  { firstName: 'Cheiderson', lastName: 'Belizario', email: 'belizarioch@gmail.com', major: 'Contaduría', semester: 2, gpa: 4.0, enrollmentDate: '2024-01-10', phoneNumber: '04146789012', isActive: true },
  { firstName: 'Omar', lastName: 'Gonzalez', email: 'omargo@gmail.com', major: 'Física', semester: 1, gpa: 3.0, enrollmentDate: '2024-02-01', phoneNumber: '0424-7890123', isActive: true },
  { firstName: 'Maura', lastName: 'Meza', email: 'maurameza@gmail.com', major: 'Administración', semester: 10, gpa: 3.9, enrollmentDate: '2020-08-15', phoneNumber: '04168901234', isActive: true },
  { firstName: 'José', lastName: 'Miery', email: 'josemiery@gmail.com', major: 'Administración', semester: 12, gpa: 4.0, enrollmentDate: '2019-01-20', phoneNumber: '04129012345', isActive: true },
  { firstName: 'Norihuska', lastName: 'Parada', email: 'nparada456@gmail.com', major: 'Medicina', semester: 5, gpa: 3.6, enrollmentDate: '2022-08-15', phoneNumber: '04140123456', isActive: true },
  { firstName: 'Michell', lastName: 'Malpica', email: 'michell.malpica@gmail.com', major: 'Ingeniería informática', semester: 3, gpa: 3.5, enrollmentDate: '2023-01-15', phoneNumber: '04241112233', isActive: true },
  { firstName: 'Gustavo', lastName: 'Barreto', email: 'gbarreto@gmail.com', major: 'Ingeniería informática', semester: 5, gpa: 3.4, enrollmentDate: '2022-08-20', phoneNumber: '0416-4445566', isActive: true },
  { firstName: 'Cristian', lastName: 'Miery', email: 'cmiery@gmail.com', major: 'Física', semester: 2, gpa: 3.9, enrollmentDate: '2024-01-15', phoneNumber: '04127778899', isActive: true },
  { firstName: 'Laurimar', lastName: 'Rodriguez', email: 'laurimar.rod@gmail.com', major: 'Ingeniería civil', semester: 6, gpa: 3.8, enrollmentDate: '2022-01-10', phoneNumber: '04142223344', isActive: true },
  { firstName: 'David', lastName: 'Peña', email: 'dpena@gmail.com', major: 'Medicina', semester: 4, gpa: 3.1, enrollmentDate: '2023-01-20', phoneNumber: '04245556677', isActive: true }
];

    // inserts multiple records
    await Student.bulkCreate(testStudents);
    
    console.log('Base de datos inicializada con 15 registros.');
    process.exit(0); 
  } catch (error) {
    console.error('Error fatal al inicializar: ', error);
    process.exit(1);
  }
};

initDb();