// Testing Library Jest DOM matcher'larını import ediyoruz
// Bu, DOM elementlerini test ederken kullanabileceğimiz ek assertion metodları sağlar
// Örnek: expect(element).toBeInTheDocument(), expect(element).toHaveClass(), vb.
import '@testing-library/jest-dom';

// Vitest test framework'ünden afterEach hook'unu import ediyoruz
// Bu hook, her test sonrasında çalışacak temizleme işlemleri için kullanılır
import { afterEach } from 'vitest';

// React Testing Library'den cleanup fonksiyonunu import ediyoruz
// Bu fonksiyon, React component'lerinin test sonrasında düzgün şekilde temizlenmesini sağlar
import { cleanup } from '@testing-library/react';

/**
 * Test Sonrası Temizleme (Cleanup After Each Test)
 * 
 * Bu setup dosyası, tüm testlerin çalışmasından önce yapılması gereken
 * global yapılandırmaları içerir. Vitest, bu dosyayı otomatik olarak
 * testlerin başında çalıştırır (vitest.config.ts'de belirtilir).
 * 
 * afterEach hook'u kullanarak her test sonrasında cleanup() fonksiyonunu çağırıyoruz.
 * Bu, testler arasında DOM'un ve React component'lerinin düzgün şekilde
 * temizlenmesini sağlar ve testlerin birbirini etkilemesini önler.
 */
afterEach(() => {
  // Her test sonrasında React component'lerini ve DOM'u temizle
  // Bu, bir testteki component'lerin bir sonraki testi etkilememesini garanti eder
  // Memory leak'leri ve test izolasyonu sorunlarını önler
  cleanup();
});

