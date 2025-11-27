// React Router DOM'dan BrowserRouter bileşenini import ediyoruz
// BrowserRouter, uygulamaya routing (yönlendirme) özelliği ekler
import { BrowserRouter } from 'react-router-dom';
// Uygulama route'larını içeren AppRoutes bileşenini import ediyoruz
import { AppRoutes } from './routes';
// Kimlik doğrulama store'unu import ediyoruz (localStorage'dan veri yüklemek için)
import { useAuthStore } from './store/auth-store';
// React'ten useEffect hook'unu import ediyoruz (yan etkiler için)
import { useEffect } from 'react';

/**
 * Ana Uygulama Bileşeni (Main App Component)
 * 
 * Bu bileşen, uygulamanın ana root bileşenidir ve şu işlemleri yapar:
 * 1. Sayfa yüklendiğinde localStorage'dan kullanıcı bilgilerini yükler
 * 2. React Router ile routing (yönlendirme) yapısını sağlar
 * 3. Tüm route'ları render eder
 */
function App() {
  // Auth store'dan initializeAuth fonksiyonunu al
  // Bu fonksiyon, localStorage'dan kullanıcı bilgilerini yükler
  const { initializeAuth } = useAuthStore();

  // Component mount olduğunda (sayfa yüklendiğinde) çalışacak yan etki
  useEffect(() => {
    // localStorage'dan kullanıcı bilgilerini yükle
    // Bu sayede sayfa yenilendiğinde kullanıcı oturum açmış olarak kalır
    initializeAuth();
  }, [initializeAuth]); // initializeAuth değiştiğinde tekrar çalışır (nadir durum)

  return (
    // BrowserRouter ile uygulamayı sarmala - routing yapısını etkinleştirir
    <BrowserRouter>
      {/* Tüm route'ları içeren AppRoutes bileşenini render et */}
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;

