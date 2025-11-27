// Axios instance'ını import ediyoruz (HTTP istekleri için)
import axiosInstance from '@/lib/axios';
// API endpoint URL'lerini içeren yapılandırmayı import ediyoruz
import { API_ENDPOINTS } from '@/config/api.config';
// TypeScript tip tanımlarını import ediyoruz
import type {
  DailyPlan, // Günlük plan veri tipi
  CreateDailyPlanData, // Yeni günlük plan oluşturma için veri tipi
  UpdateDailyPlanData, // Günlük plan güncelleme için veri tipi
  ApiResponse, // API yanıt formatı tipi
} from '@/types';

/**
 * Günlük Plan Servisi (Daily Plan Service)
 * Bu servis, günlük planlar (öğrenci-otobüs eşleştirmeleri, rota planlamaları) ile ilgili 
 * tüm API çağrılarını yönetir. CRUD (Create, Read, Update, Delete) işlemlerini ve özel sorguları içerir
 */
class DailyPlanService {
  /**
   * Tüm günlük planları getir
   * Sistemde kayıtlı olan tüm günlük planların listesini API'den çeker
   * 
   * @returns Promise<DailyPlan[]> - Tüm günlük planların listesi
   * @throws Error - İstek başarısız olursa hata fırlatır
   */
  async getAll(): Promise<DailyPlan[]> {
    // GET isteği gönder - tüm günlük planları getir
    const response = await axiosInstance.get<ApiResponse<DailyPlan[]>>(
      API_ENDPOINTS.dailyPlans.list
    );
    // Yanıt başarılı ve veri varsa, veriyi döndür
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    // Başarısız ise hata fırlat
    throw new Error(response.data.message || 'Planlar yüklənə bilmədi');
  }

  /**
   * ID'ye göre günlük plan getir
   * Belirli bir günlük planın detaylarını ID kullanarak API'den çeker
   * 
   * @param id - Getirilecek günlük planın benzersiz ID'si
   * @returns Promise<DailyPlan> - Günlük plan detayları
   * @throws Error - Plan bulunamazsa veya istek başarısız olursa hata fırlatır
   */
  async getById(id: number): Promise<DailyPlan> {
    // GET isteği gönder - belirli ID'ye sahip günlük planı getir
    const response = await axiosInstance.get<ApiResponse<DailyPlan>>(
      API_ENDPOINTS.dailyPlans.detail(id)
    );
    // Yanıt başarılı ve veri varsa, veriyi döndür
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    // Başarısız ise hata fırlat
    throw new Error(response.data.message || 'Plan tapılmadı');
  }

  /**
   * Tarihe göre günlük planları getir
   * Belirli bir tarihe ait tüm günlük planları API'den çeker
   * 
   * @param date - Günlük planların getirileceği tarih (string formatında, örn: "2024-01-15")
   * @returns Promise<DailyPlan[]> - O tarihe ait günlük planların listesi
   * @throws Error - İstek başarısız olursa hata fırlatır
   */
  async getByDate(date: string): Promise<DailyPlan[]> {
    // GET isteği gönder - belirli tarihe ait günlük planları getir
    const response = await axiosInstance.get<ApiResponse<DailyPlan[]>>(
      API_ENDPOINTS.dailyPlans.byDate(date)
    );
    // Yanıt başarılı ve veri varsa, veriyi döndür
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    // Başarısız ise hata fırlat
    throw new Error(response.data.message || 'Planlar yüklənə bilmədi');
  }

  /**
   * Öğrenci ID'sine göre günlük planları getir
   * Belirli bir öğrenciye ait tüm günlük planları API'den çeker
   * 
   * @param studentId - Günlük planların getirileceği öğrencinin benzersiz ID'si
   * @returns Promise<DailyPlan[]> - O öğrenciye ait günlük planların listesi
   * @throws Error - İstek başarısız olursa hata fırlatır
   */
  async getByStudentId(studentId: number): Promise<DailyPlan[]> {
    // GET isteği gönder - belirli öğrenciye ait günlük planları getir
    const response = await axiosInstance.get<ApiResponse<DailyPlan[]>>(
      API_ENDPOINTS.dailyPlans.byStudent(studentId)
    );
    // Yanıt başarılı ve veri varsa, veriyi döndür
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    // Başarısız ise hata fırlat
    throw new Error(response.data.message || 'Planlar yüklənə bilmədi');
  }

  /**
   * Yeni günlük plan oluştur
   * Sistemde yeni bir günlük plan kaydı oluşturur (öğrenci-otobüs eşleştirmesi vb.)
   * 
   * @param data - Oluşturulacak günlük planın verileri (CreateDailyPlanData tipinde)
   * @returns Promise<DailyPlan> - Oluşturulan günlük planın detayları
   * @throws Error - Oluşturma başarısız olursa hata fırlatır
   */
  async create(data: CreateDailyPlanData): Promise<DailyPlan> {
    // POST isteği gönder - yeni günlük plan oluştur
    const response = await axiosInstance.post<ApiResponse<DailyPlan>>(
      API_ENDPOINTS.dailyPlans.create,
      data
    );
    // Yanıt başarılı ve veri varsa, veriyi döndür
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    // Başarısız ise hata fırlat
    throw new Error(response.data.message || 'Plan yaradıla bilmədi');
  }

  /**
   * Günlük plan güncelle
   * Mevcut bir günlük planın bilgilerini günceller
   * 
   * @param id - Güncellenecek günlük planın benzersiz ID'si
   * @param data - Güncellenecek veriler (UpdateDailyPlanData tipinde)
   * @returns Promise<DailyPlan> - Güncellenmiş günlük planın detayları
   * @throws Error - Güncelleme başarısız olursa hata fırlatır
   */
  async update(id: number, data: UpdateDailyPlanData): Promise<DailyPlan> {
    // PUT isteği gönder - günlük planı güncelle
    const response = await axiosInstance.put<ApiResponse<DailyPlan>>(
      API_ENDPOINTS.dailyPlans.update(id),
      data
    );
    // Yanıt başarılı ve veri varsa, veriyi döndür
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    // Başarısız ise hata fırlat
    throw new Error(response.data.message || 'Plan yenilənə bilmədi');
  }

  /**
   * Günlük plan sil
   * Sistemden bir günlük plan kaydını siler
   * 
   * @param id - Silinecek günlük planın benzersiz ID'si
   * @returns Promise<void> - Başarılı olursa hiçbir şey döndürmez
   * @throws Error - Silme başarısız olursa hata fırlatır
   */
  async delete(id: number): Promise<void> {
    // DELETE isteği gönder - günlük planı sil
    const response = await axiosInstance.delete<ApiResponse>(
      API_ENDPOINTS.dailyPlans.delete(id)
    );
    // Başarısız ise hata fırlat
    if (!response.data.success) {
      throw new Error(response.data.message || 'Plan silinə bilmədi');
    }
  }
}

// DailyPlanService sınıfının bir instance'ını oluştur ve dışa aktar
// Bu şekilde tek bir instance kullanılarak memory tasarrufu sağlanır (Singleton pattern)
export const dailyPlanService = new DailyPlanService();

