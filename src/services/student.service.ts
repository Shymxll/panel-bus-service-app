// Axios instance'ını import ediyoruz (HTTP istekleri için)
import axiosInstance from '@/lib/axios';
// API endpoint URL'lerini içeren yapılandırmayı import ediyoruz
import { API_ENDPOINTS } from '@/config/api.config';
// TypeScript tip tanımlarını import ediyoruz
import type {
  Student, // Öğrenci veri tipi
  CreateStudentData, // Yeni öğrenci oluşturma için veri tipi
  UpdateStudentData, // Öğrenci güncelleme için veri tipi
  ApiResponse, // API yanıt formatı tipi
} from '@/types';

/**
 * Öğrenci Servisi (Student Service)
 * Bu servis, öğrenci işlemleri ile ilgili tüm API çağrılarını yönetir
 * CRUD (Create, Read, Update, Delete) işlemlerini, QR kod ile öğrenci aramayı ve
 * QR kod oluşturmayı içerir
 */
class StudentService {
  /**
   * Tüm öğrencileri getir
   * Sistemde kayıtlı olan tüm öğrencilerin listesini API'den çeker
   * 
   * @returns Promise<Student[]> - Tüm öğrencilerin listesi
   * @throws Error - İstek başarısız olursa hata fırlatır
   */
  async getAllStudents(): Promise<Student[]> {
    // GET isteği gönder - tüm öğrencileri getir
    const response = await axiosInstance.get<ApiResponse<Student[]>>(
      API_ENDPOINTS.students.list
    );
    // Yanıt başarılı ve veri varsa, veriyi döndür
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    // Başarısız ise hata fırlat
    throw new Error(response.data.message || 'Şagirdlər yüklənə bilmədi');
  }

  /**
   * ID'ye göre öğrenci getir
   * Belirli bir öğrencinin detaylarını ID kullanarak API'den çeker
   * 
   * @param id - Getirilecek öğrencinin benzersiz ID'si
   * @returns Promise<Student> - Öğrenci detayları
   * @throws Error - Öğrenci bulunamazsa veya istek başarısız olursa hata fırlatır
   */
  async getStudentById(id: number): Promise<Student> {
    // GET isteği gönder - belirli ID'ye sahip öğrenciyi getir
    const response = await axiosInstance.get<ApiResponse<Student>>(
      API_ENDPOINTS.students.detail(id)
    );
    // Yanıt başarılı ve veri varsa, veriyi döndür
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    // Başarısız ise hata fırlat
    throw new Error(response.data.message || 'Şagird tapılmadı');
  }

  /**
   * QR koda göre öğrenci getir
   * Belirli bir QR kod ile öğrenciyi API'den çeker
   * Bu metod sürücülerin öğrencileri QR kod ile tarayarak bulması için kullanılır
   * 
   * @param qrCode - Öğrenciye ait QR kod (string)
   * @returns Promise<Student> - QR koda sahip öğrencinin detayları
   * @throws Error - Öğrenci bulunamazsa veya istek başarısız olursa hata fırlatır
   */
  async getStudentByQrCode(qrCode: string): Promise<Student> {
    // QR kod'u temizle ve encode et (URL güvenliği için)
    const cleanQrCode = encodeURIComponent(qrCode.trim());
    
    // GET isteği gönder - QR kod ile öğrenciyi getir
    const response = await axiosInstance.get<ApiResponse<Student>>(
      API_ENDPOINTS.students.byQrCode(cleanQrCode)
    );
    // Yanıt başarılı ve veri varsa, veriyi döndür
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    // Başarısız ise hata fırlat
    throw new Error(response.data.message || 'Şagird tapılmadı');
  }

  /**
   * Yeni öğrenci oluştur
   * Sistemde yeni bir öğrenci kaydı oluşturur
   * 
   * @param data - Oluşturulacak öğrencinin verileri (CreateStudentData tipinde)
   * @returns Promise<Student> - Oluşturulan öğrencinin detayları
   * @throws Error - Oluşturma başarısız olursa hata fırlatır
   */
  async createStudent(data: CreateStudentData): Promise<Student> {
    // POST isteği gönder - yeni öğrenci oluştur
    const response = await axiosInstance.post<ApiResponse<Student>>(
      API_ENDPOINTS.students.create,
      data
    );
    // Yanıt başarılı ve veri varsa, veriyi döndür
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    // Başarısız ise hata fırlat
    throw new Error(response.data.message || 'Şagird yaradıla bilmədi');
  }

  /**
   * Öğrenci güncelle
   * Mevcut bir öğrencinin bilgilerini günceller
   * 
   * @param id - Güncellenecek öğrencinin benzersiz ID'si
   * @param data - Güncellenecek veriler (UpdateStudentData tipinde)
   * @returns Promise<Student> - Güncellenmiş öğrencinin detayları
   * @throws Error - Güncelleme başarısız olursa hata fırlatır
   */
  async updateStudent(id: number, data: UpdateStudentData): Promise<Student> {
    // PUT isteği gönder - öğrenciyi güncelle
    const response = await axiosInstance.put<ApiResponse<Student>>(
      API_ENDPOINTS.students.update(id),
      data
    );
    // Yanıt başarılı ve veri varsa, veriyi döndür
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    // Başarısız ise hata fırlat
    throw new Error(response.data.message || 'Şagird yenilənə bilmədi');
  }

  /**
   * Öğrenci sil
   * Sistemden bir öğrenci kaydını siler
   * 
   * @param id - Silinecek öğrencinin benzersiz ID'si
   * @returns Promise<void> - Başarılı olursa hiçbir şey döndürmez
   * @throws Error - Silme başarısız olursa hata fırlatır
   */
  async deleteStudent(id: number): Promise<void> {
    // DELETE isteği gönder - öğrenciyi sil
    const response = await axiosInstance.delete<ApiResponse>(
      API_ENDPOINTS.students.delete(id)
    );
    // Başarısız ise hata fırlat
    if (!response.data.success) {
      throw new Error(response.data.message || 'Şagird silinə bilmədi');
    }
  }

  /**
   * QR kod oluştur (Frontend'de)
   * Yeni bir öğrenci için benzersiz bir QR kod string'i oluşturur
   * Bu metod sadece frontend'de kullanılır, backend'de de QR kod oluşturulabilir
   * 
   * Format: "STU-{timestamp}-{random}" (örn: "STU-LX123ABC-DEF456")
   * 
   * @returns string - Oluşturulan QR kod string'i (büyük harflerle)
   */
  generateQrCode(): string {
    // Mevcut zamanı base36 formatına çevir (daha kısa string için)
    const timestamp = Date.now().toString(36);
    // Rastgele bir string oluştur (base36 formatında, 6 karakter)
    const random = Math.random().toString(36).substring(2, 8);
    // QR kod formatı: "STU-" + timestamp + "-" + random (büyük harflerle)
    return `STU-${timestamp}-${random}`.toUpperCase();
  }
}

// StudentService sınıfının bir instance'ını oluştur ve dışa aktar
// Bu şekilde tek bir instance kullanılarak memory tasarrufu sağlanır (Singleton pattern)
export const studentService = new StudentService();

