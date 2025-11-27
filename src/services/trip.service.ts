// Axios instance'ını import ediyoruz (HTTP istekleri için)
import axiosInstance from '@/lib/axios';
// API endpoint URL'lerini içeren yapılandırmayı import ediyoruz
import { API_ENDPOINTS } from '@/config/api.config';
// TypeScript tip tanımlarını import ediyoruz
import type {
  Trip, // Sefər (seyahat/güzergah) veri tipi
  CreateTripData, // Yeni sefer oluşturma için veri tipi
  UpdateTripData, // Sefer güncelleme için veri tipi
  ApiResponse, // API yanıt formatı tipi
} from '@/types';

/**
 * Sefər Servisi (Trip Service)
 * Bu servis, sefer (güzergah) işlemleri ile ilgili tüm API çağrılarını yönetir
 * CRUD (Create, Read, Update, Delete) işlemlerini ve özel sorguları içerir
 */
class TripService {
  /**
   * Tüm seferleri getir
   * Sistemde kayıtlı olan tüm seferlerin listesini API'den çeker
   * 
   * @returns Promise<Trip[]> - Tüm seferlerin listesi
   * @throws Error - İstek başarısız olursa hata fırlatır
   */
  async getAll(): Promise<Trip[]> {
    try {
      // Konsola istek bilgisi yazdır (debug için)
      console.log('🚀 TripService.getAll - Requesting:', API_ENDPOINTS.trips.list);
      // GET isteği gönder - tüm seferleri getir
      const response = await axiosInstance.get<ApiResponse<Trip[]>>(
        API_ENDPOINTS.trips.list
      );
      // Konsola yanıt bilgisi yazdır (debug için)
      console.log('✅ TripService.getAll - Response:', {
        success: response.data.success,
        dataLength: response.data.data?.length || 0,
        data: response.data.data,
        message: response.data.message,
      });
      // Yanıt başarılı ve veri varsa, veriyi döndür
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      // Başarısız ise hata fırlat
      throw new Error(response.data.message || 'Səfərlər yüklənə bilmədi');
    } catch (error: any) {
      // Hata durumunda konsola detaylı hata bilgisi yazdır
      console.error('❌ TripService.getAll - Error:', {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
      });
      // Hata mesajını belirle ve fırlat
      throw new Error(
        error?.response?.data?.message ||
          error?.message ||
          'Səfərlər yüklənə bilmədi'
      );
    }
  }

  /**
   * ID'ye göre sefer getir
   * Belirli bir seferin detaylarını ID kullanarak API'den çeker
   * 
   * @param id - Getirilecek seferin benzersiz ID'si
   * @returns Promise<Trip> - Sefer detayları
   * @throws Error - Sefer bulunamazsa veya istek başarısız olursa hata fırlatır
   */
  async getById(id: number): Promise<Trip> {
    // GET isteği gönder - belirli ID'ye sahip seferi getir
    const response = await axiosInstance.get<ApiResponse<Trip>>(
      API_ENDPOINTS.trips.detail(id)
    );
    // Yanıt başarılı ve veri varsa, veriyi döndür
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    // Başarısız ise hata fırlat
    throw new Error(response.data.message || 'Səfər tapılmadı');
  }

  /**
   * Rota ID'sine göre seferleri getir
   * Belirli bir rotaya ait tüm seferleri API'den çeker
   * 
   * @param routeId - Seferlerin getirileceği rotanın benzersiz ID'si
   * @returns Promise<Trip[]> - O rotaya ait seferlerin listesi
   * @throws Error - İstek başarısız olursa hata fırlatır
   */
  async getByRouteId(routeId: number): Promise<Trip[]> {
    // GET isteği gönder - belirli rotaya ait seferleri getir
    const response = await axiosInstance.get<ApiResponse<Trip[]>>(
      API_ENDPOINTS.trips.byRoute(routeId)
    );
    // Yanıt başarılı ve veri varsa, veriyi döndür
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    // Başarısız ise hata fırlat
    throw new Error(response.data.message || 'Səfərlər yüklənə bilmədi');
  }

  /**
   * Yeni sefer oluştur
   * Sistemde yeni bir sefer kaydı oluşturur
   * 
   * @param data - Oluşturulacak seferin verileri (CreateTripData tipinde)
   * @returns Promise<Trip> - Oluşturulan seferin detayları
   * @throws Error - Oluşturma başarısız olursa hata fırlatır
   */
  async create(data: CreateTripData): Promise<Trip> {
    // POST isteği gönder - yeni sefer oluştur
    const response = await axiosInstance.post<ApiResponse<Trip>>(
      API_ENDPOINTS.trips.create,
      data
    );
    // Yanıt başarılı ve veri varsa, veriyi döndür
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    // Başarısız ise hata fırlat
    throw new Error(response.data.message || 'Səfər yaradıla bilmədi');
  }

  /**
   * Sefer güncelle
   * Mevcut bir seferin bilgilerini günceller
   * 
   * @param id - Güncellenecek seferin benzersiz ID'si
   * @param data - Güncellenecek veriler (UpdateTripData tipinde)
   * @returns Promise<Trip> - Güncellenmiş seferin detayları
   * @throws Error - Güncelleme başarısız olursa hata fırlatır
   */
  async update(id: number, data: UpdateTripData): Promise<Trip> {
    // PUT isteği gönder - seferi güncelle
    const response = await axiosInstance.put<ApiResponse<Trip>>(
      API_ENDPOINTS.trips.update(id),
      data
    );
    // Yanıt başarılı ve veri varsa, veriyi döndür
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    // Başarısız ise hata fırlat
    throw new Error(response.data.message || 'Səfər yenilənə bilmədi');
  }

  /**
   * Sefer sil
   * Sistemden bir sefer kaydını siler
   * 
   * @param id - Silinecek seferin benzersiz ID'si
   * @returns Promise<void> - Başarılı olursa hiçbir şey döndürmez
   * @throws Error - Silme başarısız olursa hata fırlatır
   */
  async delete(id: number): Promise<void> {
    // DELETE isteği gönder - seferi sil
    const response = await axiosInstance.delete<ApiResponse>(
      API_ENDPOINTS.trips.delete(id)
    );
    // Başarısız ise hata fırlat
    if (!response.data.success) {
      throw new Error(response.data.message || 'Səfər silinə bilmədi');
    }
  }
}

// TripService sınıfının bir instance'ını oluştur ve dışa aktar
// Bu şekilde tek bir instance kullanılarak memory tasarrufu sağlanır (Singleton pattern)
export const tripService = new TripService();

