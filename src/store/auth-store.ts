// Zustand state yönetimi kütüphanesinden create fonksiyonunu import ediyoruz
import { create } from 'zustand';
// Zustand'ın persist middleware'ini import ediyoruz (localStorage'a otomatik kaydetme için)
import { persist } from 'zustand/middleware';
// TypeScript tip tanımlarını import ediyoruz
import type { User } from '@/types';

/**
 * Kimlik Doğrulama State Arayüzü (Auth State Interface)
 * Bu arayüz, auth store'un sahip olacağı state ve metodları tanımlar
 */
interface AuthState {
  // Mevcut kullanıcı bilgileri (giriş yapılmamışsa null)
  user: User | null;
  // Kimlik doğrulama token'ı (giriş yapılmamışsa null)
  token: string | null;
  // Kullanıcının giriş yapıp yapmadığını belirten boolean değer
  isAuthenticated: boolean;
  // Kullanıcı giriş yaptığında state'i güncelleyen metod
  setAuth: (user: User, token: string) => void;
  // Kullanıcı çıkış yaptığında state'i temizleyen metod
  clearAuth: () => void;
  // Kullanıcı bilgilerini kısmen güncelleyen metod
  updateUser: (user: Partial<User>) => void;
  // Sayfa yenilendiğinde localStorage'dan verileri yükleyen metod
  initializeAuth: () => void;
}

/**
 * Kimlik Doğrulama Store (Authentication Store)
 * Bu store, uygulama genelinde kullanıcı kimlik doğrulama durumunu yönetir
 * Zustand kullanarak global state yönetimi sağlar ve persist middleware ile
 * localStorage'a otomatik olarak kaydedilir (sayfa yenilendiğinde veriler korunur)
 */
export const useAuthStore = create<AuthState>()(
  // persist middleware'i ile store'u sarmalıyoruz (localStorage'a kaydetmek için)
  persist(
    // Store'un state ve metodlarını tanımlayan fonksiyon
    (set) => ({
      // Başlangıç state değerleri
      user: null, // Başlangıçta kullanıcı yok
      token: null, // Başlangıçta token yok
      isAuthenticated: false, // Başlangıçta giriş yapılmamış

      /**
       * Kimlik Doğrulama Ayarla (Set Authentication)
       * Kullanıcı giriş yaptığında çağrılır ve hem state'i hem de localStorage'ı günceller
       * 
       * @param user - Giriş yapan kullanıcının bilgileri
       * @param token - Backend'den gelen kimlik doğrulama token'ı
       */
      setAuth: (user, token) => {
        // Token'ı localStorage'a kaydet (geriye dönük uyumluluk için)
        localStorage.setItem('auth_token', token);
        // Kullanıcı bilgilerini JSON formatında localStorage'a kaydet
        localStorage.setItem('user_data', JSON.stringify(user));
        // Store state'ini güncelle - kullanıcı, token ve isAuthenticated değerlerini ayarla
        set({ user, token, isAuthenticated: true });
      },

      /**
       * Kimlik Doğrulama Temizle (Clear Authentication)
       * Kullanıcı çıkış yaptığında çağrılır ve hem state'i hem de localStorage'ı temizler
       */
      clearAuth: () => {
        // localStorage'dan token'ı sil
        localStorage.removeItem('auth_token');
        // localStorage'dan kullanıcı verilerini sil
        localStorage.removeItem('user_data');
        // Store state'ini temizle - tüm değerleri başlangıç durumuna getir
        set({ user: null, token: null, isAuthenticated: false });
      },

      /**
       * Kullanıcı Bilgilerini Güncelle (Update User)
       * Mevcut kullanıcı bilgilerinin bir kısmını günceller (ör: profil fotoğrafı, ad vb.)
       * 
       * @param userData - Güncellenecek kullanıcı bilgileri (Partial<User> - tüm alanlar zorunlu değil)
       */
      updateUser: (userData) =>
        // Store state'ini güncelle
        set((state) => ({
          // Eğer mevcut kullanıcı varsa, yeni verilerle birleştir, yoksa null bırak
          user: state.user ? { ...state.user, ...userData } : null,
        })),

      /**
       * Kimlik Doğrulama Başlat (Initialize Authentication)
       * Sayfa yenilendiğinde veya uygulama açıldığında çağrılır
       * localStorage'dan kayıtlı kullanıcı ve token bilgilerini yükler
       * Böylece kullanıcı oturum açmış olarak kalır (sayfa yenilense bile)
       */
      initializeAuth: () => {
        // localStorage'dan token'ı al
        const token = localStorage.getItem('auth_token');
        // localStorage'dan kullanıcı verilerini JSON string olarak al
        const userStr = localStorage.getItem('user_data');
        
        // Eğer hem token hem de kullanıcı verisi varsa
        if (token && userStr) {
          try {
            // JSON string'i User objesine çevir
            const user = JSON.parse(userStr) as User;
            // Store state'ini localStorage'dan gelen verilerle güncelle
            set({ user, token, isAuthenticated: true });
          } catch {
            // JSON parse hatası - geçersiz veri demektir
            // localStorage'daki bozuk verileri temizle
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
          }
        }
      },
    }),
    // persist middleware yapılandırması
    {
      // localStorage'da kullanılacak key adı (bu isimle kaydedilir)
      name: 'auth-storage',
      // Hangi state alanlarının localStorage'a kaydedileceğini belirler
      // Bu sayede sadece belirli alanlar kalıcı hale gelir
      partialize: (state) => ({
        user: state.user, // Kullanıcı bilgilerini kaydet
        token: state.token, // Token'ı kaydet
        isAuthenticated: state.isAuthenticated, // Giriş durumunu kaydet
      }),
    }
  )
);

