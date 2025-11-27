// Axios instance'ını import ediyoruz (HTTP istekleri için)
import axiosInstance from '@/lib/axios';
// API endpoint URL'lerini içeren yapılandırmayı import ediyoruz
import { API_ENDPOINTS } from '@/config/api.config';
// TypeScript tip tanımlarını import ediyoruz
import type {
  Route, // Rota (güzergah) veri tipi
  CreateRouteData, // Yeni rota oluşturma için veri tipi
  UpdateRouteData, // Rota güncelleme için veri tipi
  RouteStop, // Rota durağı veri tipi
  CreateRouteStopData, // Yeni rota durağı oluşturma için veri tipi
  UpdateRouteStopData, // Rota durağı güncelleme için veri tipi
  ApiResponse, // API yanıt formatı tipi
} from '@/types';

/**
 * Rota Servisi (Route Service)
 * Bu servis, rota (güzergah) işlemleri ile ilgili tüm API çağrılarını yönetir
 * CRUD (Create, Read, Update, Delete) işlemlerini, rota-otobüs ilişkilerini ve
 * rota durakları (Route Stops) yönetimini içerir
 */
class RouteService {
  /**
   * Tüm rotaları getir
   * Sistemde kayıtlı olan tüm rotaların listesini API'den çeker
   * 
   * @returns Promise<Route[]> - Tüm rotaların listesi
   * @throws Error - İstek başarısız olursa hata fırlatır
   */
  async getAll(): Promise<Route[]> {
    // GET isteği gönder - tüm rotaları getir
    const response = await axiosInstance.get<ApiResponse<Route[]>>(
      API_ENDPOINTS.routes.list
    );
    // Yanıt başarılı ve veri varsa, veriyi döndür
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    // Başarısız ise hata fırlat
    throw new Error(response.data.message || 'Marşrutlar yüklənə bilmədi');
  }

  /**
   * ID'ye göre rota getir
   * Belirli bir rotanın detaylarını ID kullanarak API'den çeker
   * 
   * @param id - Getirilecek rotanın benzersiz ID'si
   * @returns Promise<Route> - Rota detayları
   * @throws Error - Rota bulunamazsa veya istek başarısız olursa hata fırlatır
   */
  async getById(id: number): Promise<Route> {
    // GET isteği gönder - belirli ID'ye sahip rotayı getir
    const response = await axiosInstance.get<ApiResponse<Route>>(
      API_ENDPOINTS.routes.detail(id)
    );
    // Yanıt başarılı ve veri varsa, veriyi döndür
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    // Başarısız ise hata fırlat
    throw new Error(response.data.message || 'Marşrut tapılmadı');
  }

  /**
   * Otobüs ID'sine göre rotaları getir
   * Belirli bir otobüse atanmış tüm rotaları API'den çeker
   * 
   * @param busId - Rotaların getirileceği otobüsün benzersiz ID'si
   * @returns Promise<Route[]> - O otobüse ait rotaların listesi
   * @throws Error - İstek başarısız olursa hata fırlatır
   */
  async getByBusId(busId: number): Promise<Route[]> {
    // GET isteği gönder - belirli otobüse ait rotaları getir
    const response = await axiosInstance.get<ApiResponse<Route[]>>(
      `/api/routes/bus/${busId}`
    );
    // Yanıt başarılı ve veri varsa, veriyi döndür
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    // Başarısız ise hata fırlat
    throw new Error(response.data.message || 'Marşrutlar yüklənə bilmədi');
  }

  /**
   * Yeni rota oluştur
   * Sistemde yeni bir rota kaydı oluşturur
   * 
   * @param data - Oluşturulacak rotanın verileri (CreateRouteData tipinde)
   * @returns Promise<Route> - Oluşturulan rotanın detayları
   * @throws Error - Oluşturma başarısız olursa hata fırlatır
   */
  async create(data: CreateRouteData): Promise<Route> {
    // POST isteği gönder - yeni rota oluştur
    const response = await axiosInstance.post<ApiResponse<Route>>(
      API_ENDPOINTS.routes.create,
      data
    );
    // Yanıt başarılı ve veri varsa, veriyi döndür
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    // Başarısız ise hata fırlat
    throw new Error(response.data.message || 'Marşrut yaradıla bilmədi');
  }

  /**
   * Rota güncelle
   * Mevcut bir rotanın bilgilerini günceller
   * 
   * @param id - Güncellenecek rotanın benzersiz ID'si
   * @param data - Güncellenecek veriler (UpdateRouteData tipinde)
   * @returns Promise<Route> - Güncellenmiş rotanın detayları
   * @throws Error - Güncelleme başarısız olursa hata fırlatır
   */
  async update(id: number, data: UpdateRouteData): Promise<Route> {
    // PUT isteği gönder - rotayı güncelle
    const response = await axiosInstance.put<ApiResponse<Route>>(
      API_ENDPOINTS.routes.update(id),
      data
    );
    // Yanıt başarılı ve veri varsa, veriyi döndür
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    // Başarısız ise hata fırlat
    throw new Error(response.data.message || 'Marşrut yenilənə bilmədi');
  }

  /**
   * Rota sil
   * Sistemden bir rota kaydını siler
   * 
   * @param id - Silinecek rotanın benzersiz ID'si
   * @returns Promise<void> - Başarılı olursa hiçbir şey döndürmez
   * @throws Error - Silme başarısız olursa hata fırlatır
   */
  async delete(id: number): Promise<void> {
    // DELETE isteği gönder - rotayı sil
    const response = await axiosInstance.delete<ApiResponse>(
      API_ENDPOINTS.routes.delete(id)
    );
    // Başarısız ise hata fırlat
    if (!response.data.success) {
      throw new Error(response.data.message || 'Marşrut silinə bilmədi');
    }
  }

  // ========== Rota Durakları Yönetimi (Route Stops Management) ==========

  /**
   * Rotanın duraklarını getir
   * Belirli bir rotaya ait tüm durakları API'den çeker
   * 
   * @param routeId - Durakların getirileceği rotanın benzersiz ID'si
   * @returns Promise<RouteStop[]> - O rotaya ait durakların listesi
   * @throws Error - İstek başarısız olursa hata fırlatır
   */
  async getRouteStops(routeId: number): Promise<RouteStop[]> {
    // GET isteği gönder - belirli rotaya ait durakları getir
    const response = await axiosInstance.get<ApiResponse<RouteStop[]>>(
      `/api/routes/${routeId}/stops`
    );
    // Yanıt başarılı ve veri varsa, veriyi döndür
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    // Başarısız ise hata fırlat
    throw new Error(response.data.message || 'Dayanacaqlar yüklənə bilmədi');
  }

  /**
   * Rotaya durak ekle
   * Mevcut bir rotaya yeni bir durak ekler
   * 
   * @param data - Eklenecek durak bilgileri (CreateRouteStopData tipinde, routeId içerir)
   * @returns Promise<RouteStop> - Eklenen durak bilgileri
   * @throws Error - Ekleme başarısız olursa hata fırlatır
   */
  async addRouteStop(data: CreateRouteStopData): Promise<RouteStop> {
    // POST isteği gönder - rotaya yeni durak ekle
    const response = await axiosInstance.post<ApiResponse<RouteStop>>(
      `/api/routes/${data.routeId}/stops`,
      data
    );
    // Yanıt başarılı ve veri varsa, veriyi döndür
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    // Başarısız ise hata fırlat
    throw new Error(response.data.message || 'Dayanacaq əlavə edilə bilmədi');
  }

  /**
   * Rota durağını güncelle
   * Mevcut bir rota durağının bilgilerini günceller (sıra, süre vb.)
   * 
   * @param routeStopId - Güncellenecek rota durağının benzersiz ID'si
   * @param data - Güncellenecek veriler (UpdateRouteStopData tipinde)
   * @returns Promise<RouteStop> - Güncellenmiş rota durağı bilgileri
   * @throws Error - Güncelleme başarısız olursa hata fırlatır
   */
  async updateRouteStop(
    routeStopId: number,
    data: UpdateRouteStopData
  ): Promise<RouteStop> {
    // PUT isteği gönder - rota durağını güncelle
    const response = await axiosInstance.put<ApiResponse<RouteStop>>(
      `/api/routes/stops/${routeStopId}`,
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
   * Rota durağını sil
   * Bir rotadan belirli bir durağı kaldırır
   * 
   * @param routeStopId - Silinecek rota durağının benzersiz ID'si
   * @returns Promise<void> - Başarılı olursa hiçbir şey döndürmez
   * @throws Error - Silme başarısız olursa hata fırlatır
   */
  async deleteRouteStop(routeStopId: number): Promise<void> {
    // DELETE isteği gönder - rota durağını sil
    const response = await axiosInstance.delete<ApiResponse>(
      `/api/routes/stops/${routeStopId}`
    );
    // Başarısız ise hata fırlat
    if (!response.data.success) {
      throw new Error(response.data.message || 'Dayanacaq silinə bilmədi');
    }
  }
}

// RouteService sınıfının bir instance'ını oluştur ve dışa aktar
// Bu şekilde tek bir instance kullanılarak memory tasarrufu sağlanır (Singleton pattern)
export const routeService = new RouteService();

