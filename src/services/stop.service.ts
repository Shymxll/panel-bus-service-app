// Axios instance'ını import ediyoruz (HTTP istekleri için)
import axiosInstance from '@/lib/axios';
// API endpoint URL'lerini içeren yapılandırmayı import ediyoruz
import { API_ENDPOINTS } from '@/config/api.config';
// TypeScript tip tanımlarını import ediyoruz
import type {
  Stop, // Durak veri tipi
  CreateStopData, // Yeni durak oluşturma için veri tipi
  UpdateStopData, // Durak güncelleme için veri tipi
  ApiResponse, // API yanıt formatı tipi
} from '@/types';

/**
 * Durak Servisi (Stop Service)
 * Bu servis, otobüs durakları ile ilgili tüm API çağrılarını yönetir
 * CRUD (Create, Read, Update, Delete) işlemlerini içerir
 */
class StopService {
  /**
   * Tüm durakları getir
   * Sistemde kayıtlı olan tüm durakların listesini API'den çeker
   * 
   * @returns Promise<Stop[]> - Tüm durakların listesi
   * @throws Error - İstek başarısız olursa hata fırlatır
   */
  async getAll(): Promise<Stop[]> {
    // GET isteği gönder - tüm durakları getir
    // API_ENDPOINTS.stops yapılandırması yoksa varsayılan endpoint kullan
    const response = await axiosInstance.get<ApiResponse<Stop[]>>(
      API_ENDPOINTS.stops?.list || '/api/stops'
    );
    // Yanıt başarılı ve veri varsa, veriyi döndür
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    // Başarısız ise hata fırlat
    throw new Error(response.data.message || 'Dayanacaqlar yüklənə bilmədi');
  }

  /**
   * ID'ye göre durak getir
   * Belirli bir durağın detaylarını ID kullanarak API'den çeker
   * 
   * @param id - Getirilecek durağın benzersiz ID'si
   * @returns Promise<Stop> - Durak detayları
   * @throws Error - Durak bulunamazsa veya istek başarısız olursa hata fırlatır
   */
  async getById(id: number): Promise<Stop> {
    // GET isteği gönder - belirli ID'ye sahip durağı getir
    // API_ENDPOINTS.stops yapılandırması yoksa varsayılan endpoint kullan
    const response = await axiosInstance.get<ApiResponse<Stop>>(
      API_ENDPOINTS.stops?.detail?.(id) || `/api/stops/${id}`
    );
    // Yanıt başarılı ve veri varsa, veriyi döndür
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    // Başarısız ise hata fırlat
    throw new Error(response.data.message || 'Dayanacaq tapılmadı');
  }

  /**
   * Yeni durak oluştur
   * Sistemde yeni bir durak kaydı oluşturur
   * 
   * @param data - Oluşturulacak durağın verileri (CreateStopData tipinde)
   * @returns Promise<Stop> - Oluşturulan durağın detayları
   * @throws Error - Oluşturma başarısız olursa hata fırlatır
   */
  async create(data: CreateStopData): Promise<Stop> {
    // POST isteği gönder - yeni durak oluştur
    // API_ENDPOINTS.stops yapılandırması yoksa varsayılan endpoint kullan
    const response = await axiosInstance.post<ApiResponse<Stop>>(
      API_ENDPOINTS.stops?.create || '/api/stops',
      data
    );
    // Yanıt başarılı ve veri varsa, veriyi döndür
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    // Başarısız ise hata fırlat
    throw new Error(response.data.message || 'Dayanacaq yaradıla bilmədi');
  }

  /**
   * Durak güncelle
   * Mevcut bir durağın bilgilerini günceller (ad, konum vb.)
   * 
   * @param id - Güncellenecek durağın benzersiz ID'si
   * @param data - Güncellenecek veriler (UpdateStopData tipinde)
   * @returns Promise<Stop> - Güncellenmiş durağın detayları
   * @throws Error - Güncelleme başarısız olursa hata fırlatır
   */
  async update(id: number, data: UpdateStopData): Promise<Stop> {
    // PUT isteği gönder - durağı güncelle
    // API_ENDPOINTS.stops yapılandırması yoksa varsayılan endpoint kullan
    const response = await axiosInstance.put<ApiResponse<Stop>>(
      API_ENDPOINTS.stops?.update?.(id) || `/api/stops/${id}`,
      data
    );
    // Yanıt başarılı ve veri varsa, veriyi döndür
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    // Başarısız ise hata fırlat
    throw new Error(response.data.message || 'Dayanacaq yenilənə bilmədi');
  }

  /**
   * Durak sil
   * Sistemden bir durak kaydını siler
   * 
   * @param id - Silinecek durağın benzersiz ID'si
   * @returns Promise<void> - Başarılı olursa hiçbir şey döndürmez
   * @throws Error - Silme başarısız olursa hata fırlatır
   */
  async delete(id: number): Promise<void> {
    // DELETE isteği gönder - durağı sil
    // API_ENDPOINTS.stops yapılandırması yoksa varsayılan endpoint kullan
    const response = await axiosInstance.delete<ApiResponse>(
      API_ENDPOINTS.stops?.delete?.(id) || `/api/stops/${id}`
    );
    // Başarısız ise hata fırlat
    if (!response.data.success) {
      throw new Error(response.data.message || 'Dayanacaq silinə bilmədi');
    }
  }
}

// StopService sınıfının bir instance'ını oluştur ve dışa aktar
// Bu şekilde tek bir instance kullanılarak memory tasarrufu sağlanır (Singleton pattern)
export const stopService = new StopService();

