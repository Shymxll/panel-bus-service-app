// date-fns kütüphanesinden tarih formatlama fonksiyonlarını import ediyoruz
// format: Tarih objesini belirli bir formata dönüştürür
// parseISO: ISO 8601 formatındaki string'i Date objesine çevirir
import { format as dateFnsFormat, parseISO } from 'date-fns';
// Tarih format sabitlerini içeren yapılandırmayı import ediyoruz
import { DATE_FORMATS } from '@/config/constants';

/**
 * Tarih Formatlama Fonksiyonu
 * Bir tarihi belirli bir formata göre string'e dönüştürür
 * 
 * @param date - Formatlanacak tarih (ISO string veya Date objesi)
 * @param formatStr - Tarih formatı (varsayılan: DATE_FORMATS.display)
 * @returns Formatlanmış tarih string'i (hata durumunda boş string)
 * 
 * Örnek kullanım:
 * formatDate('2024-01-15', 'dd/MM/yyyy') -> '15/01/2024'
 */
export const formatDate = (date: string | Date, formatStr: string = DATE_FORMATS.display): string => {
  try {
    // Eğer string ise ISO formatından Date objesine çevir, değilse doğrudan kullan
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    // Tarihi belirtilen formata göre formatla
    return dateFnsFormat(dateObj, formatStr);
  } catch {
    // Parse veya format hatası durumunda boş string döndür
    return '';
  }
};

/**
 * Tarih ve Saat Formatlama Fonksiyonu
 * Bir tarihi hem tarih hem de saat bilgisiyle birlikte formatlar
 * 
 * @param date - Formatlanacak tarih (ISO string veya Date objesi)
 * @returns Tarih ve saat bilgisini içeren formatlanmış string
 * 
 * Örnek kullanım:
 * formatDateTime('2024-01-15T14:30:00Z') -> '15/01/2024 14:30'
 */
export const formatDateTime = (date: string | Date): string => {
  // Tarih ve saat formatını kullanarak formatla
  return formatDate(date, DATE_FORMATS.displayWithTime);
};

/**
 * API için Tarih Formatlama Fonksiyonu
 * Bir Date objesini API'ye gönderilecek formata (genellikle ISO 8601) dönüştürür
 * 
 * @param date - Formatlanacak Date objesi
 * @returns API formatına uygun tarih string'i (genellikle YYYY-MM-DD)
 * 
 * Örnek kullanım:
 * formatDateForAPI(new Date()) -> '2024-01-15'
 */
export const formatDateForAPI = (date: Date): string => {
  // API formatını kullanarak formatla
  return dateFnsFormat(date, DATE_FORMATS.api);
};

/**
 * Telefon Numarası Formatlama Fonksiyonu
 * Telefon numarasını Azerbaycan formatına (+994 XX XXX XX XX) göre formatlar
 * 
 * @param phone - Formatlanacak telefon numarası string'i
 * @returns Formatlanmış telefon numarası (format uygulanamazsa orijinal değer)
 * 
 * Örnek kullanım:
 * formatPhoneNumber('994501234567') -> '+994 50 123 45 67'
 * formatPhoneNumber('0501234567') -> '0501234567' (başında 994 yoksa formatlanmaz)
 */
export const formatPhoneNumber = (phone: string): string => {
  // Tüm rakam olmayan karakterleri kaldır (boşluk, tire, parantez vb.)
  const cleaned = phone.replace(/\D/g, '');
  
  // Azerbaycan telefon numarası formatı: +994 XX XXX XX XX
  // Eğer numara 994 ile başlıyorsa formatla
  if (cleaned.startsWith('994')) {
    // Regex ile numarayı gruplara ayır: 994 + 2 haneli alan kodu + 9 haneli numara
    const match = cleaned.match(/^994(\d{2})(\d{3})(\d{2})(\d{2})$/);
    if (match) {
      // Formatlanmış numarayı döndür: +994 XX XXX XX XX
      return `+994 ${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
    }
  }
  
  // Format uygulanamazsa orijinal değeri döndür
  return phone;
};

/**
 * Metin Kısaltma Fonksiyonu
 * Bir metni belirli bir uzunluğa kısaltır ve sonuna üç nokta (...) ekler
 * 
 * @param text - Kısaltılacak metin
 * @param maxLength - Maksimum karakter uzunluğu
 * @returns Kısaltılmış metin (uzunluktan fazlaysa) veya orijinal metin
 * 
 * Örnek kullanım:
 * truncate('Çok uzun bir metin', 10) -> 'Çok uzun ...'
 * truncate('Kısa', 10) -> 'Kısa'
 */
export const truncate = (text: string, maxLength: number): string => {
  // Metin zaten maksimum uzunluktan kısaysa olduğu gibi döndür
  if (text.length <= maxLength) return text;
  // Metni kısalt ve sonuna üç nokta ekle
  return text.slice(0, maxLength) + '...';
};

/**
 * İlk Harfi Büyütme Fonksiyonu
 * Bir string'in ilk harfini büyük, geri kalanını küçük harfe çevirir
 * 
 * @param text - İşlenecek metin
 * @returns İlk harfi büyük, geri kalanı küçük harfli metin
 * 
 * Örnek kullanım:
 * capitalize('hello world') -> 'Hello world'
 * capitalize('HELLO') -> 'Hello'
 */
export const capitalize = (text: string): string => {
  // İlk karakteri büyük harfe çevir, geri kalanını küçük harfe çevir
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Dosya Boyutu Formatlama Fonksiyonu
 * Byte cinsinden dosya boyutunu okunabilir formata (Bytes, KB, MB, GB) dönüştürür
 * 
 * @param bytes - Dosya boyutu (byte cinsinden)
 * @returns Formatlanmış dosya boyutu string'i (örn: "1.5 MB")
 * 
 * Örnek kullanım:
 * formatFileSize(1024) -> '1 KB'
 * formatFileSize(1572864) -> '1.5 MB'
 * formatFileSize(0) -> '0 Bytes'
 */
export const formatFileSize = (bytes: number): string => {
  // Eğer boyut 0 ise direkt döndür
  if (bytes === 0) return '0 Bytes';
  
  // 1024 tabanlı dönüşüm (binary sistem)
  const k = 1024;
  // Boyut birimleri dizisi
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  // Hangi birimin kullanılacağını hesapla (logaritmik hesaplama)
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  // Boyutu uygun birime dönüştür ve yuvarla (2 ondalık basamak)
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

