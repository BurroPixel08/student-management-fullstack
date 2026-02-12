import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

const baseSchema = z.object({
  firstName: z.string({ required_error: "El nombre es obligatorio" })
    .trim()
    .min(1, "El nombre es obligatorio")
    .min(2, "Mínimo 2 caracteres"),
  
  lastName: z.string({ required_error: "El apellido es obligatorio" })
    .trim()
    .min(1, "El apellido es obligatorio")
    .min(2, "Mínimo 2 caracteres"),
  
  email: z.string({ required_error: "El correo es obligatorio" })
    .min(1, "El correo es obligatorio")
    .email("Formato de correo inválido"),
  
  major: z.string({ required_error: "La carrera es obligatoria" })
    .min(1, "Selecciona una carrera"),
  
  gpa: z.preprocess(
    (val) => {
      // Si el valor es una cadena vacía, null o undefined, devolvemos undefined
      // para que Zod dispare el 'required_error'
      if (val === "" || val === null || val === undefined) return undefined;
      return Number(val);
    },
    z.number({ 
      invalid_type_error: "El GPA debe ser un número", // Error si escriben letras
      required_error: "El GPA es obligatorio"          // Error si está vacío (reemplaza al inglés)
    })
    .min(0, "El mínimo es 0")
    .max(4, "El máximo es 4")
  ),
  
  semester: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number({ invalid_type_error: "Debe ser un número", required_error: "Obligatorio" })
      .int().min(1, "Mínimo 1").max(12, "Máximo 12")
  ),

  phoneNumber: z.string()
    .nullable()
    .optional()
    .transform(val => (val === "" ? null : val))
    .refine((val) => {
      if (!val) return true;
      const regex = /^(0412|0414|0424|0416|0426)\d{7}$/;
      return regex.test(val);
    }, {
      message: "Formato: 04XXXXXXXXX (11 dígitos)"
    }),

  enrollmentDate: z.string({ required_error: "La fecha es obligatoria" })
    .min(1, "La fecha es obligatoria")
});

export const studentSchema = toTypedSchema(baseSchema);