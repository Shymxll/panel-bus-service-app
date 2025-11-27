// Axios instance'ını import ediyoruz (HTTP istekleri için)
import axiosInstance from '@/lib/axios';
// API endpoint URL'lerini içeren yapılandırmayı import ediyoruz
import { API_ENDPOINTS } from '@/config/api.config';
// TypeScript tip tanımlarını import ediyoruz
import type {
  BoardingRecord, // Biniş (boarding) kaydı veri tipi
  CreateBoardingRecordData, // Yeni biniş kaydı oluşturma için veri tipi
  UpdateBoardingRecordData, // Biniş kaydı güncelleme için veri tipi
  ApiResponse, // API yanıt formatı tipi
} from '@/types';

/**
 * Biniş Kaydı Servisi (Boarding Record Service)
 * Bu servis, öğrencilerin otobüse biniş işlemleri ile ilgili tüm API çağrılarını yönetir
 * CRUD (Create, Read, Update, Delete) işlemlerini ve özel sorguları içerir
 */
class BoardingRecordService {
  /**
   * Tüm biniş kayıtlarını getir
   * Sistemde kayıtlı olan tüm biniş kayıtlarının listesini API'den çeker
   * 
   * @returns Promise<BoardingRecord[]> - Tüm biniş kayıtlarının listesi
   * @throws Error - İstek başarısız olursa hata fırlatır
   */
  async getAll(): Promise<BoardingRecord[]> {
    // GET isteği gönder - tüm biniş kayıtlarını getir
    const response = await axiosInstance.get<ApiResponse<BoardingRecord[]>>(
      API_ENDPOINTS.boardingRecords.list
    );
    // Yanıt başarılı ve veri varsa, veriyi döndür
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    // Başarısız ise hata fırlat
    throw new Error(response.data.message || 'Minmə qeydləri yüklənə bilmədi');
  }

  /**
   * ID'ye göre biniş kaydı getir
   * Belirli bir biniş kaydının detaylarını ID kullanarak API'den çeker
   * 
   * @param id - Getirilecek biniş kaydının benzersiz ID'si
   * @returns Promise<BoardingRecord> - Biniş kaydı detayları
   * @throws Error - Kayıt bulunamazsa veya istek başarısız olursa hata fırlatır
   */
  async getById(id: number): Promise<BoardingRecord> {
    // GET isteği gönder - belirli ID'ye sahip biniş kaydını getir
    const response = await axiosInstance.get<ApiResponse<BoardingRecord>>(
      API_ENDPOINTS.boardingRecords.detail(id)
    );
    // Yanıt başarılı ve veri varsa, veriyi döndür
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    // Başarısız ise hata fırlat
    throw new Error(response.data.message || 'Minmə qeydi tapılmadı');
  }

  /**
   * Tarihe göre biniş kayıtlarını getir
   * Belirli bir tarihte yapılan tüm biniş kayıtlarını API'den çeker
   * 
   * @param date - Biniş kayıtlarının getirileceği tarih (string formatında, örn: "2024-01-15")
   * @returns Promise<BoardingRecord[]> - O tarihe ait biniş kayıtlarının listesi
   * @throws Error - İstek başarısız olursa hata fırlatır
   */
  async getByDate(date: string): Promise<BoardingRecord[]> {
    // GET isteği gönder - belirli tarihe ait biniş kayıtlarını getir
    const response = await axiosInstance.get<ApiResponse<BoardingRecord[]>>(
      API_ENDPOINTS.boardingRecords.byDate(date)
    );
    // Yanıt başarılı ve veri varsa, veriyi döndür
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    // Başarısız ise hata fırlat
    throw new Error(response.data.message || 'Minmə qeydləri yüklənə bilmədi');
  }

  /**
   * Öğrenci ID'sine göre biniş kayıtlarını getir
   * Belirli bir öğrencinin tüm biniş kayıtlarını API'den çeker
   * 
   * @param studentId - Biniş kayıtlarının getirileceği öğrencinin benzersiz ID'si
   * @returns Promise<BoardingRecord[]> - O öğrenciye ait biniş kayıtlarının listesi
   * @throws Error - İstek başarısız olursa hata fırlatır
   */
  async getByStudentId(studentId: number): Promise<BoardingRecord[]> {
    // GET isteği gönder - belirli öğrenciye ait biniş kayıtlarını getir
    const response = await axiosInstance.get<ApiResponse<BoardingRecord[]>>(
      API_ENDPOINTS.boardingRecords.byStudent(studentId)
    );
    // Yanıt başarılı ve veri varsa, veriyi döndür
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    // Başarısız ise hata fırlat
    throw new Error(response.data.message || 'Minmə qeydləri yüklənə bilmədi');
  }

  /**
   * Yeni biniş kaydı oluştur
   * Sistemde yeni bir biniş kaydı oluşturur (öğrencinin otobüse binişini kaydeder)
   * 
   * @param data - Oluşturulacak biniş kaydının verileri (CreateBoardingRecordData tipinde)
   * @returns Promise<BoardingRecord> - Oluşturulan biniş kaydının detayları
   * @throws Error - Oluşturma başarısız olursa hata fırlatır
   */
  async create(data: CreateBoardingRecordData): Promise<BoardingRecord> {
    // POST isteği gönder - yeni biniş kaydı oluştur
    const response = await axiosInstance.post<ApiResponse<BoardingRecord>>(
      API_ENDPOINTS.boardingRecords.create,
      data
    );
    // Yanıt başarılı ve veri varsa, veriyi döndür
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    // Başarısız ise hata fırlat
    throw new Error(response.data.message || 'Minmə qeydi yaradıla bilmədi');
  }

  /**
   * Biniş kaydı güncelle
   * Mevcut bir biniş kaydının bilgilerini günceller
   * 
   * @param id - Güncellenecek biniş kaydının benzersiz ID'si
   * @param data - Güncellenecek veriler (UpdateBoardingRecordData tipinde)
   * @returns Promise<BoardingRecord> - Güncellenmiş biniş kaydının detayları
   * @throws Error - Güncelleme başarısız olursa hata fırlatır
   */
  async update(id: number, data: UpdateBoardingRecordData): Promise<BoardingRecord> {
    // PUT isteği gönder - biniş kaydını güncelle
    const response = await axiosInstance.put<ApiResponse<BoardingRecord>>(
      API_ENDPOINTS.boardingRecords.update(id),
      data
    );
    // Yanıt başarılı ve veri varsa, veriyi döndür
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    // Başarısız ise hata fırlat
    throw new Error(response.data.message || 'Minmə qeydi yenilənə bilmədi');
  }

  /**
   * Biniş kaydı sil
   * Sistemden bir biniş kaydını siler
   * 
   * @param id - Silinecek biniş kaydının benzersiz ID'si
   * @returns Promise<void> - Başarılı olursa hiçbir şey döndürmez
   * @throws Error - Silme başarısız olursa hata fırlatır
   */
  async delete(id: number): Promise<void> {
    // DELETE isteği gönder - biniş kaydını sil
    const response = await axiosInstance.delete<ApiResponse>(
      API_ENDPOINTS.boardingRecords.delete(id)
    );
    // Başarısız ise hata fırlat
    if (!response.data.success) {
      throw new Error(response.data.message || 'Minmə qeydi silinə bilmədi');
    }
  }
}

// BoardingRecordService sınıfının bir instance'ını oluştur ve dışa aktar
// Bu şekilde tek bir instance kullanılarak memory tasarrufu sağlanır (Singleton pattern)
export const boardingRecordService = new BoardingRecordService();

