// Axios instance'ını import ediyoruz (HTTP istekleri için)
import axiosInstance from '@/lib/axios';
// API endpoint URL'lerini içeren yapılandırmayı import ediyoruz
import { API_ENDPOINTS } from '@/config/api.config';
// TypeScript tip tanımlarını import ediyoruz
import type { User, ApiResponse } from '@/types';

/**
 * Kullanıcı Servisi (User Service)
 * Bu servis, genel kullanıcı işlemleri ile ilgili tüm API çağrılarını yönetir
 * CRUD (Create, Read, Update, Delete) işlemlerini içerir
 * Not: Admin ve sürücü oluşturma işlemleri AuthService içinde yönetilir
 */
class UserService {
  /**
   * Tüm kullanıcıları getir
   * Sistemde kayıtlı olan tüm kullanıcıların listesini API'den çeker
   * 
   * @returns Promise<User[]> - Tüm kullanıcıların listesi (veri yoksa boş array)
   */
  async getAll(): Promise<User[]> {
    // GET isteği gönder - tüm kullanıcıları getir
    const response = await axiosInstance.get<ApiResponse<User[]>>(
      API_ENDPOINTS.users.list
    );
    // Veri varsa döndür, yoksa boş array döndür (hata fırlatmaz)
    return response.data.data || [];
  }

  /**
   * ID'ye göre kullanıcı getir
   * Belirli bir kullanıcının detaylarını ID kullanarak API'den çeker
   * 
   * @param id - Getirilecek kullanıcının benzersiz ID'si
   * @returns Promise<User> - Kullanıcı detayları
   */
  async getById(id: number): Promise<User> {
    // GET isteği gönder - belirli ID'ye sahip kullanıcıyı getir
    const response = await axiosInstance.get<ApiResponse<User>>(
      API_ENDPOINTS.users.detail(id)
    );
    // Veriyi döndür (non-null assertion - backend'den veri geldiği varsayılır)
    return response.data.data!;
  }

  /**
   * Yeni kullanıcı oluştur
   * Sistemde yeni bir kullanıcı kaydı oluşturur
   * 
   * @param data - Oluşturulacak kullanıcının verileri (Partial<User> - tüm alanlar zorunlu değil)
   * @returns Promise<User> - Oluşturulan kullanıcının detayları
   */
  async create(data: Partial<User>): Promise<User> {
    // POST isteği gönder - yeni kullanıcı oluştur
    const response = await axiosInstance.post<ApiResponse<User>>(
      API_ENDPOINTS.users.create,
      data
    );
    // Veriyi döndür (non-null assertion - backend'den veri geldiği varsayılır)
    return response.data.data!;
  }

  /**
   * Kullanıcı güncelle
   * Mevcut bir kullanıcının bilgilerini günceller (ad, email, rol vb.)
   * 
   * @param id - Güncellenecek kullanıcının benzersiz ID'si
   * @param data - Güncellenecek veriler (Partial<User> - tüm alanlar zorunlu değil)
   * @returns Promise<User> - Güncellenmiş kullanıcının detayları
   */
  async update(id: number, data: Partial<User>): Promise<User> {
    // PUT isteği gönder - kullanıcıyı güncelle
    const response = await axiosInstance.put<ApiResponse<User>>(
      API_ENDPOINTS.users.update(id),
      data
    );
    // Veriyi döndür (non-null assertion - backend'den veri geldiği varsayılır)
    return response.data.data!;
  }

  /**
   * Kullanıcı sil
   * Sistemden bir kullanıcı kaydını siler
   * 
   * @param id - Silinecek kullanıcının benzersiz ID'si
   * @returns Promise<void> - Başarılı olursa hiçbir şey döndürmez
   */
  async delete(id: number): Promise<void> {
    // DELETE isteği gönder - kullanıcıyı sil
    await axiosInstance.delete(API_ENDPOINTS.users.delete(id));
  }
}

// UserService sınıfının bir instance'ını oluştur ve dışa aktar
// Bu şekilde tek bir instance kullanılarak memory tasarrufu sağlanır (Singleton pattern)
export const userService = new UserService();

