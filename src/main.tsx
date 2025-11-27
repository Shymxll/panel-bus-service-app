// React kütüphanesini import ediyoruz (StrictMode için)
import React from 'react';
// React DOM Client API'sini import ediyoruz (React 18+ için)
import ReactDOM from 'react-dom/client';
// TanStack Query (React Query) kütüphanesini import ediyoruz
// Server state yönetimi ve cache için kullanılır
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// React Query DevTools bileşenini import ediyoruz (geliştirme için)
// Bu, React Query cache'ini ve sorgularını görselleştirmek için kullanılır
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
// Sonner toast notification kütüphanesini import ediyoruz
// Kullanıcıya bildirimler göstermek için kullanılır
import { Toaster } from 'sonner';
// Ana uygulama bileşenini import ediyoruz
import App from './App';
// Global CSS stillerini import ediyoruz
import './index.css';

/**
 * React Query Client Oluşturma
 *
 * QueryClient, React Query'nin temel yapılandırmasıdır ve şu ayarları içerir:
 * - staleTime: Verilerin ne kadar süre taze (fresh) kalacağını belirler
 * - refetchOnWindowFocus: Pencere odağa geldiğinde otomatik yenileme
 * - retry: Başarısız isteklerin kaç kez tekrar deneneceği
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Veriler 5 dakika boyunca taze kabul edilir (5 dakika içinde tekrar istek atılmaz)
      staleTime: 1000 * 60 * 5, // 5 dakika (milisaniye cinsinden)
      // Pencere odağa geldiğinde otomatik olarak veri yenileme yapma
      refetchOnWindowFocus: false,
      // Başarısız isteklerde sadece 1 kez daha deneme yap
      retry: 1,
    },
  },
});

/**
 * Uygulama Giriş Noktası (Application Entry Point)
 *
 * Bu dosya, React uygulamasının başlangıç noktasıdır ve şu işlemleri yapar:
 * 1. HTML'deki root element'ine React uygulamasını render eder
 * 2. React StrictMode ile geliştirme modunda ek kontroller sağlar
 * 3. QueryClientProvider ile tüm uygulamaya React Query desteği ekler
 * 4. Toaster bileşeni ile global bildirim sistemi kurar
 * 5. React Query DevTools ile geliştirme araçlarını ekler
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  // React StrictMode - geliştirme modunda ek kontroller ve uyarılar sağlar
  <React.StrictMode>
    {/* QueryClientProvider - tüm uygulamaya React Query context'ini sağlar */}
    <QueryClientProvider client={queryClient}>
      {/* Ana uygulama bileşeni */}
      <App />

      {/* Toast notification sistemi - kullanıcı bildirimleri için */}
      {/* position: Bildirimlerin ekranda nerede görüneceği */}
      {/* richColors: Renkli ve zengin bildirimler */}
      {/* closeButton: Bildirimlerde kapatma butonu göster */}
      <Toaster position="top-right" richColors closeButton />

      {/* React Query DevTools - sadece geliştirme modunda görünür */}
      {/* initialIsOpen: Başlangıçta kapalı mı açık mı olacağı */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
