// React Router DOM'dan route yönetimi için gerekli bileşenleri import ediyoruz
import { Routes, Route, Navigate } from 'react-router-dom';
// Kimlik doğrulama durumunu kontrol etmek için auth store'u import ediyoruz
import { useAuthStore } from '@/store/auth-store';

// Layout bileşenleri - sayfa düzenleri için
import { PublicLayout } from '@/components/layouts/PublicLayout'; // Genel/public sayfalar için layout
import { AdminLayout } from '@/components/layouts/AdminLayout'; // Admin paneli sayfaları için layout
import { DriverLayout } from '@/components/layouts/DriverLayout'; // Sürücü paneli sayfaları için layout
import { ParentLayout } from '@/components/layouts/ParentLayout'; // Valideyin paneli sayfaları için layout

// Genel erişime açık sayfalar
import { LandingPage } from '@/features/public/pages/LandingPage'; // Ana sayfa (landing page)
import { AdminLoginPage } from '@/features/auth/pages/AdminLoginPage'; // Admin giriş sayfası
import { DriverLoginPage } from '@/features/auth/pages/DriverLoginPage'; // Şoför giriş sayfası
import { ParentLoginPage } from '@/features/auth/pages/ParentLoginPage'; // Valideyin giriş sayfası

// Admin paneli sayfaları
import { AdminDashboard } from '@/features/admin/dashboard/pages/AdminDashboard'; // Admin ana kontrol paneli
import { StudentManagement } from '@/features/admin/students/pages/StudentManagement'; // Öğrenci yönetimi sayfası
import { DriverManagement } from '@/features/admin/drivers/pages/DriverManagement'; // Sürücü yönetimi sayfası
import { BusManagement } from '@/features/admin/buses/pages/BusManagement'; // Otobüs yönetimi sayfası
import { RouteManagement } from '@/features/admin/routes/pages/RouteManagement'; // Rota yönetimi sayfası
import { StopManagement } from '@/features/admin/stops/pages/StopManagement'; // Durak yönetimi sayfası
import { PlanningPage } from '@/features/admin/planning/pages/PlanningPage'; // Planlama sayfası
import { ReportsPage } from '@/features/admin/reports/pages/ReportsPage'; // Raporlar sayfası

// Sürücü paneli sayfaları
import { DriverDashboard } from '@/features/driver/dashboard/pages/DriverDashboard'; // Sürücü ana kontrol paneli
import { BoardingPage } from '@/features/driver/boarding/pages/BoardingPage'; // Biniş işlemleri sayfası
import { AlightingPage } from '@/features/driver/alighting/pages/AlightingPage'; // İniş işlemleri sayfası

// Valideyin paneli sayfaları
import { ParentDashboard } from '@/features/parent/dashboard/pages/ParentDashboard'; // Valideyin ana kontrol paneli
import { ParentHistoryPage } from '@/features/parent/history/pages/ParentHistoryPage'; // Valideyin tarixçə sayfası
import { ParentQrCodePage } from '@/features/parent/qr-code/pages/ParentQrCodePage'; // Valideyin QR kod sayfası

// Hata sayfası bileşeni
import { NotFound } from '@/components/common/NotFound'; // 404 - Sayfa bulunamadı sayfası

/**
 * Korumalı Route (Protected Route) Bileşeni
 * Bu bileşen, sadece kimlik doğrulaması yapılmış kullanıcıların erişebileceği sayfaları korur
 * 
 * @param children - Korumak istediğimiz sayfa bileşeni
 * @param role - İsteğe bağlı: Belirli bir rol gerektiriyorsa ('admin' veya 'driver')
 * 
 * Çalışma mantığı:
 * 1. Kullanıcı giriş yapmamışsa -> login sayfasına yönlendir
 * 2. Rol belirtilmişse ve kullanıcının rolü uyuşmuyorsa -> ana sayfaya yönlendir
 * 3. Tüm kontroller geçildiyse -> sayfayı göster
 */
const ProtectedRoute = ({ children, role }: { children: React.ReactNode; role?: 'admin' | 'driver' }) => {
  // Auth store'dan kullanıcı bilgilerini ve kimlik doğrulama durumunu al
  const { user, isAuthenticated } = useAuthStore();

  // Eğer kullanıcı giriş yapmamışsa veya kullanıcı bilgisi yoksa
  if (!isAuthenticated || !user) {
    // Rol bazlı login sayfasına yönlendir (replace: tarayıcı geçmişine ekleme)
    const loginPath = role === 'driver' ? '/driver/login' : '/admin/login';
    return <Navigate to={loginPath} replace />;
  }

  // Eğer belirli bir rol gerekiyorsa ve kullanıcının rolü uyuşmuyorsa
  if (role && user.role !== role) {
    // Ana sayfaya yönlendir (yetkisiz erişim denemesi)
    return <Navigate to="/" replace />;
  }

  // Tüm kontroller geçildi, sayfayı render et
  return <>{children}</>;
};

/**
 * Genel Erişimli Route (Public Route) Bileşeni
 * Bu bileşen, zaten giriş yapmış kullanıcıları uygun panele yönlendirir
 * Örneğin: Giriş yapmış bir admin, login sayfasına gitmeye çalışırsa dashboard'a yönlendirilir
 * 
 * @param children - Gösterilecek sayfa bileşeni
 * 
 * Çalışma mantığı:
 * 1. Kullanıcı zaten giriş yapmışsa -> rolüne göre dashboard'a yönlendir
 * 2. Giriş yapmamışsa -> sayfayı göster (login sayfası vb.)
 */
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  // Auth store'dan kimlik doğrulama durumunu ve kullanıcı bilgilerini al
  const { isAuthenticated, user } = useAuthStore();

  // Eğer kullanıcı zaten giriş yapmışsa
  if (isAuthenticated && user) {
    // Kullanıcının rolüne göre yönlendirme yapılacak yolu belirle
    const redirectPath = user.role === 'admin' ? '/admin/dashboard' : '/driver/dashboard';
    // Uygun dashboard'a yönlendir
    return <Navigate to={redirectPath} replace />;
  }

  // Kullanıcı giriş yapmamış, sayfayı göster
  return <>{children}</>;
};

/**
 * Ana Route Yapılandırması Bileşeni
 * Bu bileşen, uygulamanın tüm route'larını tanımlar ve yönetir
 * React Router v6 yapısını kullanarak nested routes ve layout sistemini organize eder
 * 
 * Route yapısı:
 * 1. Public Routes (Genel Erişim) - Login gerektirmez
 * 2. Admin Routes (Admin Paneli) - Admin rolü gerekir
 * 3. Driver Routes (Sürücü Paneli) - Driver rolü gerekir
 * 4. 404 Route - Bulunamayan sayfalar için
 */
export const AppRoutes = () => {
  return (
    <Routes>
      {/* 
        Genel Erişimli Route'lar (Public Routes)
        Bu route'lar herkes tarafından erişilebilir, kimlik doğrulaması gerektirmez
        PublicLayout ile sarılmıştır (navbar, footer gibi genel bileşenler içerir)
      */}
      <Route element={<PublicLayout />}>
        {/* Ana sayfa - Landing page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* 
          /login rotası için yönlendirme
          Eski login URL'lerini /admin/login'e yönlendirir (geriye dönük uyumluluk)
        */}
        <Route
          path="/login"
          element={<Navigate to="/admin/login" replace />}
        />
        
        {/* 
          Admin giriş sayfası
          PublicRoute ile sarılmıştır - zaten giriş yapmış kullanıcılar dashboard'a yönlendirilir
        */}
        <Route
          path="/admin/login"
          element={
            <PublicRoute>
              <AdminLoginPage />
            </PublicRoute>
          }
        />
        
        {/* 
          Şoför giriş sayfası
          PublicRoute ile sarılmıştır - zaten giriş yapmış kullanıcılar dashboard'a yönlendirilir
        */}
        <Route
          path="/driver/login"
          element={
            <PublicRoute>
              <DriverLoginPage />
            </PublicRoute>
          }
        />

        {/* 
          Valideyin giriş sayfası
          Valideyin paneline giriş için QR kod ve telefon nömrəsi ilə giriş
        */}
        <Route
          path="/parent/login"
          element={<ParentLoginPage />}
        />
      </Route>

      {/* 
        Admin Paneli Route'ları
        Bu route'lar sadece 'admin' rolüne sahip kullanıcılar tarafından erişilebilir
        ProtectedRoute ile korunur ve AdminLayout ile sarılmıştır
        Tüm alt route'lar /admin/ prefix'i ile başlar
      */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* /admin rotasına gidildiğinde dashboard'a yönlendir */}
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        
        {/* Admin ana kontrol paneli - istatistikler, özet bilgiler */}
        <Route path="dashboard" element={<AdminDashboard />} />
        
        {/* Öğrenci yönetimi - öğrenci ekleme, düzenleme, silme, listeleme */}
        <Route path="students" element={<StudentManagement />} />
        
        {/* Sürücü yönetimi - sürücü ekleme, düzenleme, silme, listeleme */}
        <Route path="drivers" element={<DriverManagement />} />
        
        {/* Otobüs yönetimi - otobüs ekleme, düzenleme, silme, listeleme */}
        <Route path="buses" element={<BusManagement />} />
        
        {/* Rota yönetimi - güzergah ekleme, düzenleme, silme, listeleme */}
        <Route path="routes" element={<RouteManagement />} />
        
        {/* Durak yönetimi - durak ekleme, düzenleme, silme, listeleme */}
        <Route path="stops" element={<StopManagement />} />
        
        {/* Planlama - otobüs-öğrenci eşleştirmeleri, rota planlaması */}
        <Route path="planning" element={<PlanningPage />} />
        
        {/* Raporlar - istatistiksel raporlar, analizler */}
        <Route path="reports" element={<ReportsPage />} />
      </Route>

      {/* 
        Sürücü Paneli Route'ları
        Bu route'lar sadece 'driver' rolüne sahip kullanıcılar tarafından erişilebilir
        ProtectedRoute ile korunur ve DriverLayout ile sarılmıştır
        Tüm alt route'lar /driver/ prefix'i ile başlar
      */}
      <Route
        path="/driver"
        element={
          <ProtectedRoute role="driver">
            <DriverLayout />
          </ProtectedRoute>
        }
      >
        {/* /driver rotasına gidildiğinde dashboard'a yönlendir */}
        <Route index element={<Navigate to="/driver/dashboard" replace />} />
        
        {/* Sürücü ana kontrol paneli - görevler, duyurular, özet bilgiler */}
        <Route path="dashboard" element={<DriverDashboard />} />
        
        {/* Biniş işlemleri - öğrencilerin otobüse biniş işlemlerini kaydetme */}
        <Route path="boarding" element={<BoardingPage />} />
        
        {/* İniş işlemleri - öğrencilerin otobüsten iniş işlemlerini kaydetme */}
        <Route path="alighting" element={<AlightingPage />} />
      </Route>

      {/* 
        Valideyin Paneli Route'ları
        Bu route'lar öğrenci valideyinləri için özel olarak tasarlanmıştır
        QR kod ve telefon nömrəsi ilə basit giriş sistemi vardır
        Tüm alt route'lar /parent/ prefix'i ile başlar
      */}
      <Route path="/parent" element={<ParentLayout />}>
        {/* /parent rotasına gidildiğinde dashboard'a yönlendir */}
        <Route index element={<Navigate to="/parent/dashboard" replace />} />
        
        {/* Valideyin ana kontrol paneli - uşağın günlük aktivitələri */}
        <Route path="dashboard" element={<ParentDashboard />} />
        
        {/* Tarixçə - minmə/düşmə tarixçəsi */}
        <Route path="history" element={<ParentHistoryPage />} />
        
        {/* QR Kod - uşağın QR kodunu görüntülə və paylaş */}
        <Route path="qr-code" element={<ParentQrCodePage />} />
      </Route>

      {/* 
        404 - Sayfa Bulunamadı
        Yukarıdaki hiçbir route ile eşleşmeyen tüm URL'ler için
        (* wildcard pattern - tüm eşleşmeyen path'ler için)
      */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

