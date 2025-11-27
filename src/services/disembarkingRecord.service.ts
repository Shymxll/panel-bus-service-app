// Axios instance'ını import ediyoruz (HTTP istekleri için)
import axiosInstance from '@/lib/axios';
// API endpoint URL'lerini içeren yapılandırmayı import ediyoruz
import { API_ENDPOINTS } from '@/config/api.config';
// TypeScript tip tanımlarını import ediyoruz
import type {
  DisembarkingRecord, // İniş (disembarking/alighting) kaydı veri tipi
  CreateDisembarkingRecordData, // Yeni iniş kaydı oluşturma için veri tipi
  UpdateDisembarkingRecordData, // İniş kaydı güncelleme için veri tipi
  ApiResponse, // API yanıt formatı tipi
} from '@/types';

/**
 * İniş Kaydı Servisi (Disembarking Record Service)
 * Bu servis, öğrencilerin otobüsten iniş işlemleri ile ilgili tüm API çağrılarını yönetir
 * CRUD (Create, Read, Update, Delete) işlemlerini ve özel sorguları içerir
 */
class DisembarkingRecordService {
  /**
   * Tüm iniş kayıtlarını getir
   * Sistemde kayıtlı olan tüm iniş kayıtlarının listesini API'den çeker
   * 
   * @returns Promise<DisembarkingRecord[]> - Tüm iniş kayıtlarının listesi
   * @throws Error - İstek başarısız olursa hata fırlatır
   */
  async getAll(): Promise<DisembarkingRecord[]> {
    // GET isteği gönder - tüm iniş kayıtlarını getir
    const response = await axiosInstance.get<ApiResponse<DisembarkingRecord[]>>(
      API_ENDPOINTS.disembarkingRecords.list
    );
    // Yanıt başarılı ve veri varsa, veriyi döndür
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    // Başarısız ise hata fırlat
    throw new Error(response.data.message || 'Düşmə qeydləri yüklənə bilmədi');
  }

  /**
   * ID'ye göre iniş kaydı getir
   * Belirli bir iniş kaydının detaylarını ID kullanarak API'den çeker
   * 
   * @param id - Getirilecek iniş kaydının benzersiz ID'si
   * @returns Promise<DisembarkingRecord> - İniş kaydı detayları
   * @throws Error - Kayıt bulunamazsa veya istek başarısız olursa hata fırlatır
   */
  async getById(id: number): Promise<DisembarkingRecord> {
    // GET isteği gönder - belirli ID'ye sahip iniş kaydını getir
    const response = await axiosInstance.get<ApiResponse<DisembarkingRecord>>(
      API_ENDPOINTS.disembarkingRecords.detail(id)
    );
    // Yanıt başarılı ve veri varsa, veriyi döndür
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    // Başarısız ise hata fırlat
    throw new Error(response.data.message || 'Düşmə qeydi tapılmadı');
  }

  /**
   * Tarihe göre iniş kayıtlarını getir
   * Belirli bir tarihte yapılan tüm iniş kayıtlarını API'den çeker
   * 
   * @param date - İniş kayıtlarının getirileceği tarih (string formatında, örn: "2024-01-15")
   * @returns Promise<DisembarkingRecord[]> - O tarihe ait iniş kayıtlarının listesi
   * @throws Error - İstek başarısız olursa hata fırlatır
   */
  async getByDate(date: string): Promise<DisembarkingRecord[]> {
    // GET isteği gönder - belirli tarihe ait iniş kayıtlarını getir
    const response = await axiosInstance.get<ApiResponse<DisembarkingRecord[]>>(
      API_ENDPOINTS.disembarkingRecords.byDate(date)
    );
    // Yanıt başarılı ve veri varsa, veriyi döndür
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    // Başarısız ise hata fırlat
    throw new Error(response.data.message || 'Düşmə qeydləri yüklənə bilmədi');
  }

  /**
   * Öğrenci ID'sine göre iniş kayıtlarını getir
   * Belirli bir öğrencinin tüm iniş kayıtlarını API'den çeker
   * 
   * @param studentId - İniş kayıtlarının getirileceği öğrencinin benzersiz ID'si
   * @returns Promise<DisembarkingRecord[]> - O öğrenciye ait iniş kayıtlarının listesi
   * @throws Error - İstek başarısız olursa hata fırlatır
   */
  async getByStudentId(studentId: number): Promise<DisembarkingRecord[]> {
    // GET isteği gönder - belirli öğrenciye ait iniş kayıtlarını getir
    const response = await axiosInstance.get<ApiResponse<DisembarkingRecord[]>>(
      API_ENDPOINTS.disembarkingRecords.byStudent(studentId)
    );
    // Yanıt başarılı ve veri varsa, veriyi döndür
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    // Başarısız ise hata fırlat
    throw new Error(response.data.message || 'Düşmə qeydləri yüklənə bilmədi');
  }

  /**
   * Yeni iniş kaydı oluştur
   * Sistemde yeni bir iniş kaydı oluşturur (öğrencinin otobüsten inişini kaydeder)
   * 
   * @param data - Oluşturulacak iniş kaydının verileri (CreateDisembarkingRecordData tipinde)
   * @returns Promise<DisembarkingRecord> - Oluşturulan iniş kaydının detayları
   * @throws Error - Oluşturma başarısız olursa hata fırlatır
   */
  async create(data: CreateDisembarkingRecordData): Promise<DisembarkingRecord> {
    // POST isteği gönder - yeni iniş kaydı oluştur
    const response = await axiosInstance.post<ApiResponse<DisembarkingRecord>>(
      API_ENDPOINTS.disembarkingRecords.create,
      data
    );
    // Yanıt başarılı ve veri varsa, veriyi döndür
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    // Başarısız ise hata fırlat
    throw new Error(response.data.message || 'Düşmə qeydi yaradıla bilmədi');
  }

  /**
   * İniş kaydı güncelle
   * Mevcut bir iniş kaydının bilgilerini günceller
   * 
   * @param id - Güncellenecek iniş kaydının benzersiz ID'si
   * @param data - Güncellenecek veriler (UpdateDisembarkingRecordData tipinde)
   * @returns Promise<DisembarkingRecord> - Güncellenmiş iniş kaydının detayları
   * @throws Error - Güncelleme başarısız olursa hata fırlatır
   */
  async update(id: number, data: UpdateDisembarkingRecordData): Promise<DisembarkingRecord> {
    // PUT isteği gönder - iniş kaydını güncelle
    const response = await axiosInstance.put<ApiResponse<DisembarkingRecord>>(
      API_ENDPOINTS.disembarkingRecords.update(id),
      data
    );
    // Yanıt başarılı ve veri varsa, veriyi döndür
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    // Başarısız ise hata fırlat
    throw new Error(response.data.message || 'Düşmə qeydi yenilənə bilmədi');
  }

  /**
   * İniş kaydı sil
   * Sistemden bir iniş kaydını siler
   * 
   * @param id - Silinecek iniş kaydının benzersiz ID'si
   * @returns Promise<void> - Başarılı olursa hiçbir şey döndürmez
   * @throws Error - Silme başarısız olursa hata fırlatır
   */
  async delete(id: number): Promise<void> {
    // DELETE isteği gönder - iniş kaydını sil
    const response = await axiosInstance.delete<ApiResponse>(
      API_ENDPOINTS.disembarkingRecords.delete(id)
    );
    // Başarısız ise hata fırlat
    if (!response.data.success) {
      throw new Error(response.data.message || 'Düşmə qeydi silinə bilmədi');
    }
  }
}

// DisembarkingRecordService sınıfının bir instance'ını oluştur ve dışa aktar
// Bu şekilde tek bir instance kullanılarak memory tasarrufu sağlanır (Singleton pattern)
export const disembarkingRecordService = new DisembarkingRecordService();

