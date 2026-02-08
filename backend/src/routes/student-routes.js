const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student-controller');

//ROUTE TO OBTAIN ALL STUDENTS (GET)
router.get('/', studentController.getAllStudents);

// ROUTE TO GET ONE BY ID (GET)
router.get('/:id', studentController.getStudentById);

// ROUTE TO CREATE A NEW ONE (POST)
router.post("/", studentController.createStudent)

// ROUTE TO PARTIALLY UPDATE (PATCH)
router.patch('/:id', studentController.updatePartialStudent);

// ROUTE TO UPDATE (PUT)
router.put('/:id', studentController.updateStudent);

// PATH TO DELETE A STUDENT
router.delete('/:id', studentController.deleteStudent);

module.exports = router;