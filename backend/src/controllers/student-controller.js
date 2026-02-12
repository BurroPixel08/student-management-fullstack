const { Op } = require('sequelize'); // gusbworks 2.0: Import required for search
const { Student, sequelize } = require('../models/student-model');
const { validateStudent, validatePartialStudent } = require('../utils/validator');

// Create a new student -------------
const createStudent = async (req, res) => {
    try {
      const result = validateStudent(req.body);

      if (!result.success) {
            return res.status(400).json({ 
                message: "Incomplete or invalid data" 
            });
        }

      const newStudent = await Student.create(result.data);
      res.status(201).json(newStudent);

    } catch (err) { 
        console.error("DEBUG ERROR:", err); 

        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ 
                message: "Email already registered",
                error: err.errors ? err.errors[0].message : err.message 
            });
        }

        return res.status(500).json({ 
            message: "Error creating student", 
            error: err.message 
        });
    }
};


// Get all students with pagination and filtering
const getAllStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    
    // gusbworks 2.0: Extract 'search' parameter
    const { major, semester, is_active, search } = req.query;

    const queryOptions = {};

    if (major) queryOptions.major = major;
    if (semester) queryOptions.semester = Number(semester);
    
    if (is_active !== undefined) {
      queryOptions.isActive = (is_active === 'true');
    } else {
      queryOptions.isActive = true; 
    }

    // gusbworks 2.0: Server-side search logic (Name, LastName, or Email)
    if (search) {
      queryOptions[Op.or] = [
        { first_name: { [Op.like]: `%${search}%` } },
        { last_name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    const paginationConfig = {
        limit: limit,
        offset: (page - 1) * limit
    };

    const { count, rows } = await Student.findAndCountAll({
      where: queryOptions,
      order: [['last_name', 'ASC']],
      ...paginationConfig 
    });

    res.json({
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        data: rows 
    });

  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
};

// Get a student by ID -----------------
const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findOne({
      where: { 
        id: id,
        isActive: true
      }
    });

    if (!student) {
      return res.status(404).json({ 
        message: 'Student not found or is currently inactive' 
      });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ 
      message: 'Server Error', 
      error: error.message 
    });
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

    await student.update({ isActive: false });

    res.status(200).json({ message: 'Student deleted (soft delete)' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete', error: error.message });
  }
}

//Get all general statiscs
const getStatistics = async (req, res) => {
    try {
        // 1. Conteo total
        const totalStudents = await Student.count({ where: { isActive: true } });

        // 2. Promedio de GPA
        const gpaData = await Student.findAll({
            attributes: [[sequelize.fn('AVG', sequelize.col('gpa')), 'avgGpa']],
            where: { isActive: true }
        });

        // 3. Agrupado por carrera
        const majorStats = await Student.findAll({
            attributes: [
                'major',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            where: { isActive: true },
            group: ['major']
        });

        res.json({
            totalStudents,
            averageGpa: parseFloat(gpaData[0].dataValues.avgGpa || 0).toFixed(2),
            majorDistribution: majorStats
        });
    } catch (err) {
        console.error("Error en estadísticas:", err);
        res.status(500).json({ message: "Error", error: err.message });
    }
};

module.exports = {
    createStudent,
    getAllStudents,
    getStudentById, 
    updatePartialStudent,
    updateStudent,
    deleteStudent,
    getStatistics
};