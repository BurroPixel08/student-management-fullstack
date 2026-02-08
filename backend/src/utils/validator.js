const { z } = require('zod');

const studentSchema = z.object({

  firstName: z.string().min(2, "Name too short").max(50),
  lastName: z.string().min(2, "Last name too short").max(50),
  email: z.string().email("Invalid email format"),
  major: z.string().min(2, "Major is required"),
  semester: z.number().int().min(1).max(12),
  gpa: z.number().min(0).max(4.0),
  enrollmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date (YYYY-MM-DD)")
});

const validateStudent = (object) => {
  return studentSchema.safeParse(object);
};

const validatePartialStudent = (object) => {
  return studentSchema.partial().safeParse(object);
};

module.exports = {
  validateStudent,
  validatePartialStudent
};