// Axios instance'ını ve AxiosError tipini import ediyoruz (HTTP istekleri için)
import axiosInstance from '@/lib/axios';
import type { AxiosError } from 'axios';
// API endpoint URL'lerini içeren yapılandırmayı import ediyoruz
import { API_ENDPOINTS } from '@/config/api.config';
// TypeScript tip tanımlarını import ediyoruz
import type {
  LoginCredentials, // Giriş bilgileri (email, password) veri tipi
  RegisterData, // Kayıt verileri veri tipi
  AuthResponse, // Kimlik doğrulama yanıtı veri tipi
  User, // Kullanıcı veri tipi
  ApiResponse, // API yanıt formatı tipi
} from '@/types';

/**
 * Kimlik Doğrulama Servisi (Authentication Service)
 * Bu servis, kullanıcı kimlik doğrulama işlemleri ile ilgili tüm API çağrılarını yönetir
 * Giriş, çıkış, kayıt, kullanıcı bilgilerini getirme ve admin/sürücü oluşturma işlemlerini içerir
 */
class AuthService {
  /**
   * Kullanıcı kaydı (Register)
   * Yeni bir kullanıcı hesabı oluşturur
   *
   * @param data - Kayıt için gerekli kullanıcı bilgileri (RegisterData tipinde)
   * @returns Promise<AuthResponse> - Başarılı kayıt sonrası kullanıcı bilgileri ve mesaj
   * @throws Error - Kayıt başarısız olursa hata fırlatır
   *
   * Backend yanıt formatı: { success: true, message: "...", data: user }
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    // POST isteği gönder - yeni kullanıcı kaydı oluştur
    const response = await axiosInstance.post<ApiResponse<User>>(API_ENDPOINTS.auth.register, data);
    // Backend'den gelen yanıt: { success: true, message: "...", data: user }
    // Yanıt başarılı ve kullanıcı verisi varsa
    if (response.data.success && response.data.data) {
      // AuthResponse formatında döndür
      return {
        success: true,
        message: response.data.message || 'Registration successful',
        data: response.data.data,
      };
    }
    // Başarısız ise hata fırlat
    throw new Error(response.data.message || 'Registration failed');
  }

  /**
   * Kullanıcı girişi (Login)
   * Mevcut bir kullanıcının sisteme giriş yapmasını sağlar
   *
   * @param credentials - Giriş bilgileri (email ve password)
   * @returns Promise<AuthResponse> - Başarılı giriş sonrası kullanıcı bilgileri ve mesaj
   * @throws Error - Giriş başarısız olursa hata fırlatır
   *
   * Backend yanıt formatı: { success: true, message: "...", data: user }
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // POST isteği gönder - kullanıcı girişi yap
    const response = await axiosInstance.post<ApiResponse<User>>(
      API_ENDPOINTS.auth.login,
      credentials
    );
    // Backend'den gelen yanıt: { success: true, message: "...", data: user }
    // Yanıt başarılı ve kullanıcı verisi varsa
    if (response.data.success && response.data.data) {
      // AuthResponse formatında döndür
      return {
        success: true,
        message: response.data.message || 'Login successful',
        data: response.data.data,
      };
    }
    // Başarısız ise hata fırlat
    throw new Error(response.data.message || 'Login failed');
  }

  /**
   * Admin girişi (Admin Login)
   * Admin rolüne sahip kullanıcıların sisteme giriş yapmasını sağlar
   * Daha detaylı hata yönetimi ve loglama içerir
   *
   * @param credentials - Giriş bilgileri (email ve password)
   * @returns Promise<AuthResponse> - Başarılı giriş sonrası admin kullanıcı bilgileri ve mesaj
   * @throws Error - Giriş başarısız olursa detaylı hata mesajı fırlatır
   *
   * Backend yanıt formatı: { success: true, message: "...", data: user }
   */
  async adminLogin(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Konsola admin giriş denemesi bilgisi yazdır (debug için)
      console.log('Admin login attempt:', { email: credentials.email });
      // POST isteği gönder - admin girişi yap
      const response = await axiosInstance.post<ApiResponse<User>>(
        API_ENDPOINTS.auth.adminLogin,
        credentials
      );
      // Konsola admin giriş yanıtı yazdır (debug için)
      console.log('Admin login response:', response.data);

      // Backend'den gelen yanıt: { success: true, message: "...", data: user }
      // Yanıt başarılı ve kullanıcı verisi varsa
      if (response.data.success && response.data.data) {
        // AuthResponse formatında döndür
        return {
          success: true,
          message: response.data.message || 'Admin login successful',
          data: response.data.data,
        };
      }
      // Başarısız ise hata fırlat
      throw new Error(response.data.message || 'Admin login failed');
    } catch (error) {
      // Hata durumunda detaylı hata bilgilerini yönet (401 ve diğer hatalar)
      // Axios hatası kontrolü
      const axiosError = error as AxiosError<{ message?: string }>;
      // Konsola hata detaylarını yazdır (debug için)
      console.error('Admin login error details:', {
        status: axiosError?.response?.status,
        data: axiosError?.response?.data,
        message: axiosError?.message,
      });

      // Hata mesajını belirle: önce backend mesajı, sonra genel mesaj, sonra varsayılan mesaj
      const errorMessage =
        axiosError?.response?.data?.message ||
        axiosError?.message ||
        'Email və ya şifrə yanlışdır. Zəhmət olmasa əvvəlcə "Admin İstifadəçi Yarat" düyməsinə basın.';
      // Hata fırlat
      throw new Error(errorMessage);
    }
  }

  /**
   * Kullanıcı çıkışı (Logout)
   * Oturum açmış kullanıcının sistemden çıkış yapmasını sağlar
   * Backend'deki oturum bilgilerini temizler
   *
   * @returns Promise<ApiResponse> - Çıkış işleminin sonuç durumu
   */
  async logout(): Promise<ApiResponse> {
    // POST isteği gönder - kullanıcı çıkışı yap
    const response = await axiosInstance.post<ApiResponse>(API_ENDPOINTS.auth.logout);
    // Yanıt verisini döndür
    return response.data;
  }

  /**
   * Mevcut kullanıcı bilgilerini getir
   * Oturum açmış kullanıcının bilgilerini API'den çeker
   * Genellikle sayfa yenilendiğinde veya uygulama açıldığında kullanılır
   *
   * @returns Promise<User> - Oturum açmış kullanıcının bilgileri
   */
  async getCurrentUser(): Promise<User> {
    // GET isteği gönder - mevcut kullanıcı bilgilerini getir
    const response = await axiosInstance.get<ApiResponse<User>>(API_ENDPOINTS.auth.me);
    // Kullanıcı verisini döndür (non-null assertion - backend'den veri geldiği varsayılır)
    return response.data.data!;
  }

  /**
   * Admin kullanıcı oluştur
   * İlk kurulum veya test için varsayılan bir admin kullanıcı oluşturur
   * Bu metod genellikle sadece ilk kurulum sırasında kullanılır
   *
   * @returns Promise<User> - Oluşturulan admin kullanıcının bilgileri
   * @throws Error - Oluşturma başarısız olursa hata fırlatır
   */
  async createAdmin(): Promise<User> {
    try {
      // Konsola admin oluşturma işlemi başladı bilgisi yazdır (debug için)
      console.log('Creating admin user...');
      // GET isteği gönder - varsayılan admin kullanıcı oluştur (endpoint otomatik oluşturur)
      const response = await axiosInstance.get<ApiResponse<User>>(API_ENDPOINTS.auth.createAdmin);
      // Konsola admin oluşturma yanıtı yazdır (debug için)
      console.log('Create admin response:', response.data);

      // Yanıt başarılı ve kullanıcı verisi varsa
      if (response.data.success && response.data.data) {
        // Kullanıcı verisini döndür
        return response.data.data;
      }
      // Başarısız ise hata fırlat
      throw new Error(response.data.message || 'Admin creation failed');
    } catch (error) {
      // Hata durumunda konsola hata detaylarını yazdır (debug için)
      // Axios hatası kontrolü
      const axiosError = error as AxiosError<{ message?: string }>;
      console.error('Create admin error:', {
        status: axiosError?.response?.status,
        data: axiosError?.response?.data,
        message: axiosError?.message,
      });
      // Hatayı yeniden fırlat (çağrı yapan kodun yönetmesi için)
      throw error;
    }
  }

  /**
   * Sürücü kullanıcı oluştur
   * Admin tarafından yeni bir sürücü kullanıcı hesabı oluşturulur
   *
   * @param data - Oluşturulacak sürücünün bilgileri (RegisterData tipinde)
   * @returns Promise<User> - Oluşturulan sürücü kullanıcının bilgileri
   */
  async createDriver(data: RegisterData): Promise<User> {
    // POST isteği gönder - yeni sürücü kullanıcı oluştur
    const response = await axiosInstance.post<ApiResponse<User>>(
      API_ENDPOINTS.auth.createDriver,
      data
    );
    // Sürücü kullanıcı verisini döndür (non-null assertion - backend'den veri geldiği varsayılır)
    return response.data.data!;
  }
}

// AuthService sınıfının bir instance'ını oluştur ve dışa aktar
// Bu şekilde tek bir instance kullanılarak memory tasarrufu sağlanır (Singleton pattern)
export const authService = new AuthService();
