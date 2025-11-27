// Axios kütüphanesini ve gerekli tipleri import ediyoruz
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
// API yapılandırma ayarlarını import ediyoruz (baseURL, timeout vb.)
import { API_CONFIG } from '@/config/api.config';
// Bildirim gösterimi için toast kütüphanesini import ediyoruz
import { toast } from 'sonner';

/**
 * Axios instance oluşturuluyor
 * Bu instance, tüm API isteklerinde kullanılacak temel yapılandırmayı içerir
 */
export const axiosInstance = axios.create({
  // API'nin temel URL adresi (API_CONFIG'den alınıyor)
  baseURL: API_CONFIG.baseURL,
  // İsteklerin zaman aşımı süresi (milisaniye cinsinden)
  timeout: API_CONFIG.timeout,
  // Çerezlerin (cookies) otomatik olarak gönderilmesi için
  withCredentials: API_CONFIG.withCredentials,
  // Varsayılan HTTP başlıkları
  headers: {
    'Content-Type': 'application/json', // İstek gövdesinin JSON formatında olduğunu belirtiyoruz
  },
});

/**
 * İstek (Request) Interceptor
 * Her API isteği gönderilmeden önce bu fonksiyon çalışır
 * Burada kimlik doğrulama token'ı gibi bilgileri ekleyebiliriz
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Backend cookie tabanlı kimlik doğrulaması kullanıyor, ancak Bearer token da destekleniyor
    // Token backend tarafından httpOnly çerezde saklanıyor, bu yüzden manuel olarak eklememize gerek yok
    // Ancak geriye dönük uyumluluk için localStorage'da token varsa onu kullanıyoruz
    const token = localStorage.getItem('auth_token');

    // Eğer token mevcutsa ve Authorization başlığı henüz eklenmemişse, Bearer token olarak ekle
    if (token && config.headers && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Yapılandırılmış config nesnesini döndür (istek bu ayarlarla gönderilecek)
    return config;
  },
  // İstek hazırlanırken bir hata oluşursa (çok nadir durum)
  (error: AxiosError) => {
    // Hatayı reddet (reject) - istek gönderilmeyecek
    return Promise.reject(error);
  }
);

/**
 * Yanıt (Response) Interceptor
 * Her API yanıtı geldiğinde bu fonksiyon çalışır
 * Burada hata durumlarını merkezi olarak yönetebiliriz
 */
axiosInstance.interceptors.response.use(
  // Başarılı yanıt durumunda (status 200-299 arası)
  (response) => {
    // Yanıtı olduğu gibi döndür (herhangi bir işlem yapmadan)
    return response;
  },
  // Hata durumunda (status 400+ veya ağ hatası)
  (error: AxiosError<{ success?: boolean; message?: string; error?: string }>) => {
    // Yaygın hata durumlarını yönetiyoruz

    // Sunucudan yanıt alındı ancak hata durumu var (ör: 401, 404, 500)
    if (error.response) {
      // HTTP durum kodunu al (401, 403, 404, 500 vb.)
      const status = error.response.status;
      
      // Sunucudan gelen hata mesajını al (mesaj veya error alanından)
      // Response data'nın tipini kontrol et
      let responseData: { success?: boolean; message?: string; error?: string } | null = null;
      
      if (error.response.data) {
        // Eğer data bir obje ise
        if (typeof error.response.data === 'object' && error.response.data !== null) {
          responseData = error.response.data as { success?: boolean; message?: string; error?: string };
        }
        // Eğer data bir string ise (bazı backend'ler string döndürebilir)
        else if (typeof error.response.data === 'string') {
          try {
            responseData = JSON.parse(error.response.data);
          } catch {
            // Parse edilemezse string olarak kullan
            responseData = { message: error.response.data };
          }
        }
      }
      
      // Hata mesajını belirle: önce message, yoksa error, yoksa varsayılan mesaj
      const message = responseData?.message || responseData?.error || 'Bir xəta baş verdi';

      // HTTP durum koduna göre uygun işlemleri yap
      switch (status) {
        case 401:
          // Yetkisiz erişim - kullanıcı oturumu sonlandırılmış veya geçersiz
          // Login sayfalarında 401 hatası normaldir (yanlış şifre), bu yüzden interceptor'da işlem yapmayalım
          const isLoginPage = window.location.pathname.includes('/login') || 
                              window.location.pathname.includes('/admin/login') ||
                              window.location.pathname.includes('/driver/login');
          
          if (!isLoginPage) {
            // Sadece login sayfaları dışında otomatik yönlendirme yap
            // Kimlik doğrulama token'ını ve kullanıcı verilerini temizle
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            toast.error('Sessiya bitdi. Yenidən daxil olun.');
            window.location.href = '/login';
          }
          // Login sayfalarında hata mesajını sadece çağrı yapan kod göstersin (toast göstermeyelim)
          break;
        case 403:
          // Yasak - kullanıcının bu işlem için yetkisi yok
          toast.error('Bu əməliyyat üçün icazəniz yoxdur.');
          break;
        case 404:
          // Bulunamadı - istenen kaynak mevcut değil
          toast.error('Məlumat tapılmadı.');
          break;
        case 409:
          // Çakışma - genellikle kayıt işlemlerinde çift kayıt gibi durumlar için
          toast.error(message);
          break;
        case 500:
          // Sunucu hatası - backend'de beklenmeyen bir hata oluştu
          toast.error('Server xətası. Zəhmət olmasa sonra yenidən cəhd edin.');
          break;
        default:
          // Diğer tüm hata durumları için genel mesaj göster
          toast.error(message);
      }
    } else if (error.request) {
      // Ağ hatası - sunucuya istek ulaşamadı (internet bağlantısı yok, sunucu erişilemez)
      toast.error('Şəbəkə xətası. İnternet bağlantınızı yoxlayın.');
    } else {
      // Beklenmeyen hata - istek hazırlanırken bir sorun oluştu
      toast.error('Gözlənilməz xəta baş verdi.');
    }

    // Hatayı reddet (reject) - çağrı yapan kodu bilgilendir
    return Promise.reject(error);
  }
);

// Axios instance'ını varsayılan export olarak dışa aktar
export default axiosInstance;
