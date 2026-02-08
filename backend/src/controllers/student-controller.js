const Student = require('../models/student-model');
const { validateStudent, validatePartialStudent } = require('../utils/validator');

// Create a new student -------------
const createStudent = async (req, res) => {
    const result = validateStudent(req.body);
    
    if (!result.success) {
        return res.status(400).json({ error: result.error.errors });
    }

    try {
        const newStudent = await Student.create(result.data);
        res.status(201).json(newStudent);
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ 
                message: "Email already registered",
                error: err.errors[0].message 
            });
        }

        res.status(500).json({ message: "error creating student", error: err.message });
    }
};


// Get all the students and filter-----------------
const getAllStudents = async (req, res) => {
  try {
    const { major, semester, is_active } = req.query;
    const queryOptions = {};

    if (major) queryOptions.major = major;

    if (semester) queryOptions.semester = Number(semester);

    if (is_active !== undefined) {
      queryOptions.isActive = is_active === 'true';
    }

    const students = await Student.findAll({
      where: queryOptions
    });

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error getting students', error: error.message });
  }
};


// Get a student by ID -----------------
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


// Update a student partially
const updatePartialStudent = async (req, res) => {

  const result = validatePartialStudent(req.body);

  if (!result.success) {
    return res.status(400).json({ error: result.error.errors });
  }

  try {
    const id = req.params.id;
  
    const student = await Student.findByPk(id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await student.update(result.data);
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Error updating student', error: error.message });
  }
}


// Update a estudent completely -----------------
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const result = validateStudent(req.body);

    if (!result.success) {
      return res.status(400).json({ 
        message: 'Incomplete or invalid data for complete update',
        errors: result.error.errors 
      });
    }

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await student.update(result.data);

    res.status(200).json(student);

  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}


// Delete a student (Sot delet)
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await student.destroy();

    res.status(200).json({ message: 'Student deleted (soft delete)' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete', error: error.message });
  }
}


module.exports = {
    createStudent,
    getAllStudents,
    getStudentById, 
    updatePartialStudent,
    updateStudent,
    deleteStudent
};