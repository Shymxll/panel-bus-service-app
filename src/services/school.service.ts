// Axios instance'ını import ediyoruz (HTTP istekleri için)
import axiosInstance from '@/lib/axios';
// API endpoint URL'lerini içeren yapılandırmayı import ediyoruz
import { API_ENDPOINTS } from '@/config/api.config';
// TypeScript tip tanımlarını import ediyoruz
import type {
  School, // Okul veri tipi
  CreateSchoolData, // Yeni okul oluşturma için veri tipi
  UpdateSchoolData, // Okul güncelleme için veri tipi
  ApiResponse, // API yanıt formatı tipi
} from '@/types';

/**
 * Okul Servisi (School Service)
 * Bu servis, okul işlemleri ile ilgili tüm API çağrılarını yönetir
 * CRUD (Create, Read, Update, Delete) işlemlerini içerir
 */
class SchoolService {
  /**
   * Tüm okulları getir
   * Sistemde kayıtlı olan tüm okulların listesini API'den çeker
   * 
   * @returns Promise<School[]> - Tüm okulların listesi
   * @throws Error - İstek başarısız olursa hata fırlatır
   */
  async getAllSchools(): Promise<School[]> {
    // GET isteği gönder - tüm okulları getir
    const response = await axiosInstance.get<ApiResponse<School[]>>(
      API_ENDPOINTS.schools.list
    );
    // Yanıt başarılı ve veri varsa, veriyi döndür
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    // Başarısız ise hata fırlat
    throw new Error(response.data.message || 'Məktəblər yüklənə bilmədi');
  }

  /**
   * ID'ye göre okul getir
   * Belirli bir okulun detaylarını ID kullanarak API'den çeker
   * 
   * @param id - Getirilecek okulun benzersiz ID'si
   * @returns Promise<School> - Okul detayları
   * @throws Error - Okul bulunamazsa veya istek başarısız olursa hata fırlatır
   */
  async getSchoolById(id: number): Promise<School> {
    // GET isteği gönder - belirli ID'ye sahip okulu getir
    const response = await axiosInstance.get<ApiResponse<School>>(
      API_ENDPOINTS.schools.detail(id)
    );
    // Yanıt başarılı ve veri varsa, veriyi döndür
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    // Başarısız ise hata fırlat
    throw new Error(response.data.message || 'Məktəb tapılmadı');
  }

  /**
   * Yeni okul oluştur
   * Sistemde yeni bir okul kaydı oluşturur
   * 
   * @param data - Oluşturulacak okulun verileri (CreateSchoolData tipinde)
   * @returns Promise<School> - Oluşturulan okulun detayları
   * @throws Error - Oluşturma başarısız olursa hata fırlatır
   */
  async createSchool(data: CreateSchoolData): Promise<School> {
    // POST isteği gönder - yeni okul oluştur
    const response = await axiosInstance.post<ApiResponse<School>>(
      API_ENDPOINTS.schools.create,
      data
    );
    // Yanıt başarılı ve veri varsa, veriyi döndür
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    // Başarısız ise hata fırlat
    throw new Error(response.data.message || 'Məktəb yaradıla bilmədi');
  }

  /**
   * Okul güncelle
   * Mevcut bir okulun bilgilerini günceller
   * 
   * @param id - Güncellenecek okulun benzersiz ID'si
   * @param data - Güncellenecek veriler (UpdateSchoolData tipinde)
   * @returns Promise<School> - Güncellenmiş okulun detayları
   * @throws Error - Güncelleme başarısız olursa hata fırlatır
   */
  async updateSchool(id: number, data: UpdateSchoolData): Promise<School> {
    // PUT isteği gönder - okulu güncelle
    const response = await axiosInstance.put<ApiResponse<School>>(
      API_ENDPOINTS.schools.update(id),
      data
    );
    // Yanıt başarılı ve veri varsa, veriyi döndür
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    // Başarısız ise hata fırlat
    throw new Error(response.data.message || 'Məktəb yenilənə bilmədi');
  }

  /**
   * Okul sil
   * Sistemden bir okul kaydını siler
   * 
   * @param id - Silinecek okulun benzersiz ID'si
   * @returns Promise<void> - Başarılı olursa hiçbir şey döndürmez
   * @throws Error - Silme başarısız olursa hata fırlatır
   */
  async deleteSchool(id: number): Promise<void> {
    // DELETE isteği gönder - okulu sil
    const response = await axiosInstance.delete<ApiResponse>(
      API_ENDPOINTS.schools.delete(id)
    );
    // Başarısız ise hata fırlat
    if (!response.data.success) {
      throw new Error(response.data.message || 'Məktəb silinə bilmədi');
    }
  }
}

// SchoolService sınıfının bir instance'ını oluştur ve dışa aktar
// Bu şekilde tek bir instance kullanılarak memory tasarrufu sağlanır (Singleton pattern)
export const schoolService = new SchoolService();

