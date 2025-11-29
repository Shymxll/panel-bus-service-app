// Zod kütüphanesini import ediyoruz - TypeScript için şema tabanlı validasyon kütüphanesi
import { z } from 'zod';

// ========== Ortak Validasyon Kuralları (Common Validation Rules) ==========

/**
 * Email Validasyon Şeması
 * Geçerli bir email adresi formatını kontrol eder
 */
export const emailSchema = z.string().email('Düzgün email daxil edin');

/**
 * Şifre Validasyon Şeması
 * Şifrenin minimum 6, maksimum 50 karakter olmasını zorunlu kılar
 */
export const passwordSchema = z
  .string()
  .min(6, 'Şifrə ən azı 6 simvol olmalıdır')
  .max(50, 'Şifrə maksimum 50 simvol ola bilər');

/**
 * Telefon Numarası Validasyon Şeması
 * Azerbaycan telefon numarası formatını kontrol eder
 * Format: +994 veya 0 ile başlayan, toplamda 9 haneli numara
 * İsteğe bağlıdır (optional) veya boş string olabilir
 */
export const phoneSchema = z
  .string()
  .regex(/^(\+994|0)?[1-9]\d{8}$/, 'Düzgün telefon nömrəsi daxil edin')
  .optional()
  .or(z.literal(''));

/**
 * Zorunlu String Validasyon Şeması
 * Boş olmayan bir string değeri zorunlu kılar
 */
export const requiredStringSchema = z.string().min(1, 'Bu sahə məcburidir');

/**
 * Pozitif Sayı Validasyon Şeması
 * Sıfırdan büyük bir sayı değeri zorunlu kılar
 */
export const positiveNumberSchema = z.number().positive('Müsbət ədəd daxil edin');

// ========== Kimlik Doğrulama Validasyon Şemaları (Auth Validation Schemas) ==========

/**
 * Giriş Formu Validasyon Şeması
 * Email ve şifre alanlarını doğrular
 */
export const loginSchema = z.object({
  email: emailSchema, // Email formatı kontrol edilir
  password: requiredStringSchema, // Şifre boş olamaz
});

/**
 * Kayıt Formu Validasyon Şeması
 * Yeni kullanıcı kaydı için gerekli alanları doğrular
 */
export const registerSchema = z.object({
  name: requiredStringSchema.min(2, 'Ad ən azı 2 simvol olmalıdır'), // Minimum 2 karakter
  email: emailSchema, // Email formatı kontrol edilir
  password: passwordSchema, // Şifre kurallarına uygun olmalı
  phone: phoneSchema, // Telefon numarası (isteğe bağlı)
});

// ========== Otobüs Validasyon Şeması (Bus Validation Schema) ==========

/**
 * Otobüs Formu Validasyon Şeması
 * Otobüs oluşturma/güncelleme için gerekli alanları doğrular
 */
export const busSchema = z.object({
  plateNumber: requiredStringSchema.regex(
    // Plaka numarası formatı: 2 rakam + 1-3 harf + 2-4 rakam (örn: 34ABC123)
    /^[0-9]{2}[A-Z]{1,3}[0-9]{2,4}$/,
    'Düzgün plaka nömrəsi daxil edin (məs: 34ABC123)'
  ),
  brand: z.string().optional(), // Marka (isteğe bağlı)
  model: z.string().optional(), // Model (isteğe bağlı)
  capacity: positiveNumberSchema.min(1, 'Tutum ən azı 1 olmalıdır'), // Kapasite pozitif ve en az 1
  driverId: z.number().optional(), // Sürücü ID (isteğe bağlı)
});

// ========== Öğrenci Validasyon Şeması (Student Validation Schema) ==========

/**
 * Öğrenci Formu Validasyon Şeması
 * Öğrenci oluşturma/güncelleme için gerekli alanları doğrular
 */
export const studentSchema = z.object({
  name: requiredStringSchema.min(2, 'Ad ən azı 2 simvol olmalıdır'), // Minimum 2 karakter
  studentNumber: requiredStringSchema, // Öğrenci numarası zorunlu
  grade: z.string().optional(), // Sınıf (isteğe bağlı)
  parentName: z.string().optional(), // Valideyin adı (isteğe bağlı)
  parentPhone: phoneSchema, // Valideyin telefonu (isteğe bağlı)
  address: z.string().optional(), // Adres (isteğe bağlı)
});

// ========== Sürücü Validasyon Şeması (Driver Validation Schema) ==========

/**
 * Sürücü Formu Validasyon Şeması
 * Sürücü oluşturma/güncelleme için gerekli alanları doğrular
 */
export const driverSchema = z.object({
  name: requiredStringSchema.min(2, 'Ad ən azı 2 simvol olmalıdır'), // Minimum 2 karakter
  email: emailSchema, // Email formatı kontrol edilir
  password: passwordSchema, // Şifre kurallarına uygun olmalı
  phone: phoneSchema, // Telefon numarası (isteğe bağlı)
});

// ========== Rota Validasyon Şeması (Route Validation Schema) ==========

/**
 * Rota Formu Validasyon Şeması
 * Rota oluşturma/güncelleme için gerekli alanları doğrular
 */
export const routeSchema = z.object({
  name: requiredStringSchema, // Rota adı zorunlu
  description: z.string().optional(), // Açıklama (isteğe bağlı)
  busId: z.number().optional(), // Otobüs ID (isteğe bağlı)
});

// ========== Form Data Tipleri (Form Data Types) ==========
// Zod şemalarından TypeScript tipleri otomatik olarak çıkarılır
// Bu tipler, form verilerinin tip güvenliğini sağlar

/**
 * Giriş Formu Veri Tipi
 * loginSchema'dan otomatik olarak çıkarılan tip
 */
export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Kayıt Formu Veri Tipi
 * registerSchema'dan otomatik olarak çıkarılan tip
 */
export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Otobüs Formu Veri Tipi
 * busSchema'dan otomatik olarak çıkarılan tip
 */
export type BusFormData = z.infer<typeof busSchema>;

/**
 * Öğrenci Formu Veri Tipi
 * studentSchema'dan otomatik olarak çıkarılan tip
 */
export type StudentFormData = z.infer<typeof studentSchema>;

/**
 * Sürücü Formu Veri Tipi
 * driverSchema'dan otomatik olarak çıkarılan tip
 */
export type DriverFormData = z.infer<typeof driverSchema>;

/**
 * Rota Formu Veri Tipi
 * routeSchema'dan otomatik olarak çıkarılan tip
 */
export type RouteFormData = z.infer<typeof routeSchema>;

