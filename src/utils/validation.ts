import { z } from 'zod';

// Common validation rules
export const emailSchema = z.string().email('Düzgün email daxil edin');

export const passwordSchema = z
  .string()
  .min(6, 'Şifrə ən azı 6 simvol olmalıdır')
  .max(50, 'Şifrə maksimum 50 simvol ola bilər');

export const phoneSchema = z
  .string()
  .regex(/^(\+994|0)?[1-9]\d{8}$/, 'Düzgün telefon nömrəsi daxil edin')
  .optional()
  .or(z.literal(''));

export const requiredStringSchema = z.string().min(1, 'Bu sahə məcburidir');

export const positiveNumberSchema = z.number().positive('Müsbət ədəd daxil edin');

// Auth validation schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: requiredStringSchema,
});

export const registerSchema = z.object({
  name: requiredStringSchema.min(2, 'Ad ən azı 2 simvol olmalıdır'),
  email: emailSchema,
  password: passwordSchema,
  phone: phoneSchema,
});

// Bus validation schema
export const busSchema = z.object({
  plateNumber: requiredStringSchema.regex(
    /^[0-9]{2}[A-Z]{1,3}[0-9]{2,4}$/,
    'Düzgün plaka nömrəsi daxil edin (məs: 34ABC123)'
  ),
  brand: z.string().optional(),
  model: z.string().optional(),
  capacity: positiveNumberSchema.min(1, 'Tutum ən azı 1 olmalıdır'),
  driverId: z.number().optional(),
});

// Student validation schema
export const studentSchema = z.object({
  name: requiredStringSchema.min(2, 'Ad ən azı 2 simvol olmalıdır'),
  studentNumber: requiredStringSchema,
  grade: z.string().optional(),
  parentName: z.string().optional(),
  parentPhone: phoneSchema,
  address: z.string().optional(),
});

// Driver validation schema
export const driverSchema = z.object({
  name: requiredStringSchema.min(2, 'Ad ən azı 2 simvol olmalıdır'),
  email: emailSchema,
  password: passwordSchema,
  phone: phoneSchema,
});

// Route validation schema
export const routeSchema = z.object({
  name: requiredStringSchema,
  description: z.string().optional(),
  busId: z.number().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type BusFormData = z.infer<typeof busSchema>;
export type StudentFormData = z.infer<typeof studentSchema>;
export type DriverFormData = z.infer<typeof driverSchema>;
export type RouteFormData = z.infer<typeof routeSchema>;

