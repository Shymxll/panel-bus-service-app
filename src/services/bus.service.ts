// Axios instance'ını import ediyoruz (HTTP istekleri için)
import axiosInstance from '@/lib/axios';
// API endpoint URL'lerini içeren yapılandırmayı import ediyoruz
import { API_ENDPOINTS } from '@/config/api.config';
// TypeScript tip tanımlarını import ediyoruz
import type { Bus, CreateBusData, ApiResponse } from '@/types';

/**
 * Otobüs Servisi (Bus Service)
 * Bu servis, otobüs işlemleri ile ilgili tüm API çağrılarını yönetir
 * CRUD (Create, Read, Update, Delete) işlemlerini içerir
 */
class BusService {
  /**
   * Tüm otobüsleri getir
   * Sistemde kayıtlı olan tüm otobüslerin listesini API'den çeker
   * 
   * @returns Promise<Bus[]> - Tüm otobüslerin listesi (veri yoksa boş array)
   */
  async getAll(): Promise<Bus[]> {
    // GET isteği gönder - tüm otobüsleri getir
    const response = await axiosInstance.get<ApiResponse<Bus[]>>(
      API_ENDPOINTS.buses.list
    );
    // Veri varsa döndür, yoksa boş array döndür (hata fırlatmaz)
    return response.data.data || [];
  }

  /**
   * ID'ye göre otobüs getir
   * Belirli bir otobüsün detaylarını ID kullanarak API'den çeker
   * 
   * @param id - Getirilecek otobüsün benzersiz ID'si
   * @returns Promise<Bus> - Otobüs detayları
   */
  async getById(id: number): Promise<Bus> {
    // GET isteği gönder - belirli ID'ye sahip otobüsü getir
    const response = await axiosInstance.get<ApiResponse<Bus>>(
      API_ENDPOINTS.buses.detail(id)
    );
    // Veriyi döndür (non-null assertion - backend'den veri geldiği varsayılır)
    return response.data.data!;
  }

  /**
   * Yeni otobüs oluştur
   * Sistemde yeni bir otobüs kaydı oluşturur
   * 
   * @param data - Oluşturulacak otobüsün verileri (CreateBusData tipinde)
   * @returns Promise<Bus> - Oluşturulan otobüsün detayları
   */
  async create(data: CreateBusData): Promise<Bus> {
    // POST isteği gönder - yeni otobüs oluştur
    const response = await axiosInstance.post<ApiResponse<Bus>>(
      API_ENDPOINTS.buses.create,
      data
    );
    // Veriyi döndür (non-null assertion - backend'den veri geldiği varsayılır)
    return response.data.data!;
  }

  /**
   * Otobüs güncelle
   * Mevcut bir otobüsün bilgilerini günceller (plaka, model, kapasite vb.)
   * 
   * @param id - Güncellenecek otobüsün benzersiz ID'si
   * @param data - Güncellenecek veriler (Partial<CreateBusData> - tüm alanlar zorunlu değil)
   * @returns Promise<Bus> - Güncellenmiş otobüsün detayları
   */
  async update(id: number, data: Partial<CreateBusData>): Promise<Bus> {
    // PUT isteği gönder - otobüsü güncelle
    const response = await axiosInstance.put<ApiResponse<Bus>>(
      API_ENDPOINTS.buses.update(id),
      data
    );
    // Veriyi döndür (non-null assertion - backend'den veri geldiği varsayılır)
    return response.data.data!;
  }

  /**
   * Otobüs sil
   * Sistemden bir otobüs kaydını siler
   * 
   * @param id - Silinecek otobüsün benzersiz ID'si
   * @returns Promise<void> - Başarılı olursa hiçbir şey döndürmez
   */
  async delete(id: number): Promise<void> {
    // DELETE isteği gönder - otobüsü sil
    await axiosInstance.delete(API_ENDPOINTS.buses.delete(id));
  }
}

// BusService sınıfının bir instance'ını oluştur ve dışa aktar
// Bu şekilde tek bir instance kullanılarak memory tasarrufu sağlanır (Singleton pattern)
export const busService = new BusService();

