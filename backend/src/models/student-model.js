const { DataTypes } = require('sequelize');
const sequelize = require('../database/db-config');

const Student = sequelize.define('Student', {
  firstName: { type: DataTypes.STRING, allowNull: false, field: 'first_name' },
  lastName: { type: DataTypes.STRING, allowNull: false, field: 'last_name' },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  major: { type: DataTypes.STRING, allowNull: false },
  semester: { type: DataTypes.INTEGER, allowNull: false },
  gpa: { type: DataTypes.DECIMAL(3, 2) },
  enrollmentDate: { type: DataTypes.DATEONLY, allowNull: false, field: 'enrollment_date' },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_active' }
}, {
  tableName: 'students',
  underscored: true,
  timestamps: true,  //columns 'createdAt' y 'updatedAt'
  paranoid: true  
});

module.exports = Student;