/**
 * ============================================================================
 * KULLANICI TİPLERİ (USER TYPES)
 * ============================================================================
 */

/**
 * Kullanıcı Arayüzü (User Interface)
 * Sistemdeki kullanıcıların (admin ve sürücü) bilgilerini tanımlar
 */
export interface User {
  id: number; // Kullanıcının benzersiz ID'si
  name: string; // Kullanıcının tam adı
  email: string; // Kullanıcının e-posta adresi (giriş için kullanılır)
  role: 'admin' | 'driver'; // Kullanıcının rolü (admin veya sürücü)
  phone?: string; // Kullanıcının telefon numarası (isteğe bağlı)
  isActive: boolean; // Kullanıcının aktif olup olmadığı (pasif kullanıcılar giriş yapamaz)
  createdAt: string; // Kullanıcının oluşturulma tarihi (ISO string formatında)
  updatedAt: string; // Kullanıcının son güncellenme tarihi (ISO string formatında)
}

/**
 * ============================================================================
 * KİMLİK DOĞRULAMA TİPLERİ (AUTH TYPES)
 * ============================================================================
 */

/**
 * Giriş Bilgileri Arayüzü (Login Credentials Interface)
 * Kullanıcı girişi için gerekli bilgileri tanımlar
 */
export interface LoginCredentials {
  email: string; // Kullanıcının e-posta adresi
  password: string; // Kullanıcının şifresi
}

/**
 * Kayıt Verisi Arayüzü (Register Data Interface)
 * Yeni kullanıcı kaydı için gerekli bilgileri tanımlar
 */
export interface RegisterData {
  name: string; // Kullanıcının tam adı
  email: string; // Kullanıcının e-posta adresi
  password: string; // Kullanıcının şifresi
  role?: 'admin' | 'driver'; // Kullanıcının rolü (isteğe bağlı, varsayılan backend'de belirlenir)
  phone?: string; // Kullanıcının telefon numarası (isteğe bağlı)
}

/**
 * Kimlik Doğrulama Yanıtı Arayüzü (Auth Response Interface)
 * Giriş veya kayıt işlemlerinden dönen yanıt formatını tanımlar
 */
export interface AuthResponse {
  success: boolean; // İşlemin başarılı olup olmadığı
  message: string; // İşlem hakkında mesaj (başarı veya hata mesajı)
  data: User; // İşlem sonrası kullanıcı bilgileri
  token?: string; // Kimlik doğrulama token'ı (opsiyonel, backend'den dönebilir)
}

/**
 * ============================================================================
 * OKUL TİPLERİ (SCHOOL TYPES)
 * ============================================================================
 */

/**
 * Okul Arayüzü (School Interface)
 * Sistemdeki okulların bilgilerini tanımlar
 */
export interface School {
  id: number; // Okulun benzersiz ID'si
  name: string; // Okulun adı
  address?: string | null; // Okulun adresi (isteğe bağlı)
  phone?: string | null; // Okulun telefon numarası (isteğe bağlı)
  email?: string | null; // Okulun e-posta adresi (isteğe bağlı)
  isActive: boolean; // Okulun aktif olup olmadığı
  createdAt: string; // Okulun oluşturulma tarihi (ISO string formatında)
  updatedAt: string; // Okulun son güncellenme tarihi (ISO string formatında)
}

/**
 * Okul Oluşturma Verisi Arayüzü (Create School Data Interface)
 * Yeni okul oluşturulurken gönderilecek verileri tanımlar
 */
export interface CreateSchoolData {
  name: string; // Okulun adı (zorunlu)
  address?: string; // Okulun adresi (isteğe bağlı)
  phone?: string; // Okulun telefon numarası (isteğe bağlı)
  email?: string; // Okulun e-posta adresi (isteğe bağlı)
  isActive?: boolean; // Okulun aktif olup olmadığı (isteğe bağlı, varsayılan: true)
}

/**
 * Okul Güncelleme Verisi Arayüzü (Update School Data Interface)
 * Mevcut okul bilgilerini güncellerken gönderilecek verileri tanımlar
 * Tüm alanlar isteğe bağlıdır - sadece güncellenecek alanlar gönderilir
 */
export interface UpdateSchoolData {
  name?: string; // Okulun adı (isteğe bağlı)
  address?: string; // Okulun adresi (isteğe bağlı)
  phone?: string; // Okulun telefon numarası (isteğe bağlı)
  email?: string; // Okulun e-posta adresi (isteğe bağlı)
  isActive?: boolean; // Okulun aktif olup olmadığı (isteğe bağlı)
}

/**
 * ============================================================================
 * OTOBÜS TİPLERİ (BUS TYPES)
 * ============================================================================
 */

/**
 * Otobüs Arayüzü (Bus Interface)
 * Sistemdeki otobüslerin bilgilerini tanımlar
 */
export interface Bus {
  id: number; // Otobüsün benzersiz ID'si
  plateNumber: string; // Otobüsün plaka numarası (örn: 34ABC123)
  brand?: string; // Otobüsün markası (isteğe bağlı)
  model?: string; // Otobüsün modeli (isteğe bağlı)
  capacity: number; // Otobüsün yolcu kapasitesi
  driverId?: number; // Otobüse atanmış sürücünün ID'si (isteğe bağlı)
  isActive: boolean; // Otobüsün aktif olup olmadığı
  createdAt: string; // Otobüsün oluşturulma tarihi (ISO string formatında)
  updatedAt: string; // Otobüsün son güncellenme tarihi (ISO string formatında)
  driver?: User; // Otobüse atanmış sürücü bilgileri (ilişkili veri, isteğe bağlı)
}

/**
 * Otobüs Oluşturma Verisi Arayüzü (Create Bus Data Interface)
 * Yeni otobüs oluşturulurken gönderilecek verileri tanımlar
 */
export interface CreateBusData {
  plateNumber: string; // Otobüsün plaka numarası (zorunlu)
  brand?: string; // Otobüsün markası (isteğe bağlı)
  model?: string; // Otobüsün modeli (isteğe bağlı)
  capacity: number; // Otobüsün yolcu kapasitesi (zorunlu)
  driverId?: number; // Otobüse atanacak sürücünün ID'si (isteğe bağlı)
  isActive?: boolean; // Otobüsün aktif olup olmadığı (isteğe bağlı, varsayılan: true)
}

/**
 * ============================================================================
 * ÖĞRENCİ TİPLERİ (STUDENT TYPES)
 * Backend şema yapısı ile uyumlu olacak şekilde tasarlanmıştır
 * ============================================================================
 */

/**
 * Öğrenci Arayüzü (Student Interface)
 * Sistemdeki öğrencilerin bilgilerini tanımlar
 */
export interface Student {
  id: number; // Öğrencinin benzersiz ID'si
  firstName: string; // Öğrencinin adı
  lastName: string; // Öğrencinin soyadı
  qrCode: string; // Öğrencinin QR kod numarası (otobüse biniş/iniş için kullanılır)
  school: string; // Öğrencinin okuduğu okul adı
  grade: string; // Öğrencinin sınıfı (örn: "5A", "6B")
  parentName?: string | null; // Valideynin adı (isteğe bağlı veya null olabilir)
  parentPhone?: string | null; // Valideynin telefon numarası (isteğe bağlı veya null olabilir)
  address?: string | null; // Öğrencinin adresi (isteğe bağlı veya null olabilir)
  isActive: boolean; // Öğrencinin aktif olup olmadığı
  createdAt: string; // Öğrencinin oluşturulma tarihi (ISO string formatında)
  updatedAt: string; // Öğrencinin son güncellenme tarihi (ISO string formatında)
}

/**
 * Öğrenci Oluşturma Verisi Arayüzü (Create Student Data Interface)
 * Yeni öğrenci oluşturulurken gönderilecek verileri tanımlar
 */
export interface CreateStudentData {
  firstName: string; // Öğrencinin adı (zorunlu)
  lastName: string; // Öğrencinin soyadı (zorunlu)
  qrCode: string; // Öğrencinin QR kod numarası (zorunlu)
  schoolId: number; // Öğrencinin okuduğu okulun ID'si (zorunlu)
  grade: string; // Öğrencinin sınıfı (zorunlu)
  parentName?: string; // Valideynin adı (isteğe bağlı)
  parentPhone?: string; // Valideynin telefon numarası (isteğe bağlı)
  address?: string; // Öğrencinin adresi (isteğe bağlı)
  isActive?: boolean; // Öğrencinin aktif olup olmadığı (isteğe bağlı, varsayılan: true)
}

/**
 * Öğrenci Güncelleme Verisi Arayüzü (Update Student Data Interface)
 * Mevcut öğrenci bilgilerini güncellerken gönderilecek verileri tanımlar
 * Tüm alanlar isteğe bağlıdır - sadece güncellenecek alanlar gönderilir
 */
export interface UpdateStudentData {
  firstName?: string; // Öğrencinin adı (isteğe bağlı)
  lastName?: string; // Öğrencinin soyadı (isteğe bağlı)
  qrCode?: string; // Öğrencinin QR kod numarası (isteğe bağlı)
  schoolId?: number; // Öğrencinin okuduğu okulun ID'si (isteğe bağlı)
  grade?: string; // Öğrencinin sınıfı (isteğe bağlı)
  parentName?: string; // Valideynin adı (isteğe bağlı)
  parentPhone?: string; // Valideynin telefon numarası (isteğe bağlı)
  address?: string; // Öğrencinin adresi (isteğe bağlı)
  isActive?: boolean; // Öğrencinin aktif olup olmadığı (isteğe bağlı)
}

/**
 * ============================================================================
 * DURAK TİPLERİ (STOP TYPES)
 * Backend şema yapısı ile uyumlu olacak şekilde tasarlanmıştır
 * ============================================================================
 */

/**
 * Durak Arayüzü (Stop Interface)
 * Sistemdeki otobüs duraklarının bilgilerini tanımlar
 */
export interface Stop {
  id: number; // Durağın benzersiz ID'si
  name: string; // Durağın adı
  address?: string | null; // Durağın adresi (isteğe bağlı veya null olabilir)
  latitude?: string | null; // Durağın enlem (latitude) koordinatı (isteğe bağlı veya null olabilir)
  longitude?: string | null; // Durağın boylam (longitude) koordinatı (isteğe bağlı veya null olabilir)
  isActive: boolean; // Durağın aktif olup olmadığı
  createdAt: string; // Durağın oluşturulma tarihi (ISO string formatında)
  updatedAt: string; // Durağın son güncellenme tarihi (ISO string formatında)
}

/**
 * Durak Oluşturma Verisi Arayüzü (Create Stop Data Interface)
 * Yeni durak oluşturulurken gönderilecek verileri tanımlar
 */
export interface CreateStopData {
  name: string; // Durağın adı (zorunlu)
  address?: string; // Durağın adresi (isteğe bağlı)
  latitude?: string; // Durağın enlem koordinatı (isteğe bağlı)
  longitude?: string; // Durağın boylam koordinatı (isteğe bağlı)
  isActive?: boolean; // Durağın aktif olup olmadığı (isteğe bağlı, varsayılan: true)
}

/**
 * Durak Güncelleme Verisi Arayüzü (Update Stop Data Interface)
 * Mevcut durak bilgilerini güncellerken gönderilecek verileri tanımlar
 * Tüm alanlar isteğe bağlıdır - sadece güncellenecek alanlar gönderilir
 */
export interface UpdateStopData {
  name?: string; // Durağın adı (isteğe bağlı)
  address?: string; // Durağın adresi (isteğe bağlı)
  latitude?: string; // Durağın enlem koordinatı (isteğe bağlı)
  longitude?: string; // Durağın boylam koordinatı (isteğe bağlı)
  isActive?: boolean; // Durağın aktif olup olmadığı (isteğe bağlı)
}

/**
 * ============================================================================
 * ROTA TİPLERİ (ROUTE TYPES)
 * Backend şema yapısı ile uyumlu olacak şekilde tasarlanmıştır
 * ============================================================================
 */

/**
 * Rota Arayüzü (Route Interface)
 * Sistemdeki otobüs rotalarının (güzergahlarının) bilgilerini tanımlar
 */
export interface Route {
  id: number; // Rotanın benzersiz ID'si
  name: string; // Rotanın adı
  description?: string | null; // Rotanın açıklaması (isteğe bağlı veya null olabilir)
  busId?: number | null; // Rotaya atanmış otobüsün ID'si (isteğe bağlı veya null olabilir)
  isActive: boolean; // Rotanın aktif olup olmadığı
  createdAt: string; // Rotanın oluşturulma tarihi (ISO string formatında)
  updatedAt: string; // Rotanın son güncellenme tarihi (ISO string formatında)
  bus?: Bus; // Rotaya atanmış otobüs bilgileri (ilişkili veri, isteğe bağlı)
}

/**
 * Rota Oluşturma Verisi Arayüzü (Create Route Data Interface)
 * Yeni rota oluşturulurken gönderilecek verileri tanımlar
 */
export interface CreateRouteData {
  name: string; // Rotanın adı (zorunlu)
  description?: string; // Rotanın açıklaması (isteğe bağlı)
  busId?: number; // Rotaya atanacak otobüsün ID'si (isteğe bağlı)
  isActive?: boolean; // Rotanın aktif olup olmadığı (isteğe bağlı, varsayılan: true)
}

/**
 * Rota Güncelleme Verisi Arayüzü (Update Route Data Interface)
 * Mevcut rota bilgilerini güncellerken gönderilecek verileri tanımlar
 * Tüm alanlar isteğe bağlıdır - sadece güncellenecek alanlar gönderilir
 */
export interface UpdateRouteData {
  name?: string; // Rotanın adı (isteğe bağlı)
  description?: string; // Rotanın açıklaması (isteğe bağlı)
  busId?: number; // Rotaya atanacak otobüsün ID'si (isteğe bağlı)
  isActive?: boolean; // Rotanın aktif olup olmadığı (isteğe bağlı)
}

/**
 * ============================================================================
 * ROTA DURAĞI TİPLERİ (ROUTE STOP TYPES)
 * Backend şema yapısı ile uyumlu olacak şekilde tasarlanmıştır
 * ============================================================================
 */

/**
 * Rota Durağı Arayüzü (Route Stop Interface)
 * Bir rotada bulunan durakların bilgilerini tanımlar
 * Bu tip, rotanın hangi duraklardan geçtiğini ve sırasını belirtir
 */
export interface RouteStop {
  id: number; // Rota durağının benzersiz ID'si
  routeId: number; // Bu durağın ait olduğu rotanın ID'si
  stopId: number; // Durağın ID'si
  order: number; // Durağın rota içindeki sırası (1, 2, 3, ...)
  estimatedArrivalTime?: string | null; // Durağa tahmini varış süresi (isteğe bağlı veya null olabilir)
  createdAt: string; // Rota durağının oluşturulma tarihi (ISO string formatında)
  updatedAt: string; // Rota durağının son güncellenme tarihi (ISO string formatında)
  stop?: Stop; // Durak bilgileri (ilişkili veri, isteğe bağlı)
}

/**
 * Rota Durağı Oluşturma Verisi Arayüzü (Create Route Stop Data Interface)
 * Bir rotaya yeni durak eklenirken gönderilecek verileri tanımlar
 */
export interface CreateRouteStopData {
  routeId: number; // Durağın ekleneceği rotanın ID'si (zorunlu)
  stopId: number; // Eklenecek durağın ID'si (zorunlu)
  order: number; // Durağın rota içindeki sırası (zorunlu)
  estimatedArrivalTime?: string; // Durağa tahmini varış süresi (isteğe bağlı)
}

/**
 * Rota Durağı Güncelleme Verisi Arayüzü (Update Route Stop Data Interface)
 * Mevcut rota durağı bilgilerini güncellerken gönderilecek verileri tanımlar
 * Tüm alanlar isteğe bağlıdır - sadece güncellenecek alanlar gönderilir
 */
export interface UpdateRouteStopData {
  order?: number; // Durağın rota içindeki sırası (isteğe bağlı)
  estimatedArrivalTime?: string; // Durağa tahmini varış süresi (isteğe bağlı)
}

/**
 * ============================================================================
 * SEFER TİPLERİ (TRIP TYPES)
 * Backend şema yapısı ile uyumlu olacak şekilde tasarlanmıştır
 * ============================================================================
 */

/**
 * Sefer Arayüzü (Trip Interface)
 * Sistemdeki seferlerin (belirli bir rotada belirli bir saatte yapılan seyahatlerin) bilgilerini tanımlar
 */
export interface Trip {
  id: number; // Seferin benzersiz ID'si
  routeId: number; // Seferin ait olduğu rotanın ID'si
  departureTime: string; // Seferin kalkış saati (HH:mm formatında, örn: "08:30", "14:00")
  isActive: boolean; // Seferin aktif olup olmadığı
  createdAt: string; // Seferin oluşturulma tarihi (ISO string formatında)
  updatedAt: string; // Seferin son güncellenme tarihi (ISO string formatında)
  route?: Route; // Seferin ait olduğu rota bilgileri (ilişkili veri, isteğe bağlı)
}

/**
 * Sefer Oluşturma Verisi Arayüzü (Create Trip Data Interface)
 * Yeni sefer oluşturulurken gönderilecek verileri tanımlar
 */
export interface CreateTripData {
  routeId: number; // Seferin ait olacağı rotanın ID'si (zorunlu)
  departureTime: string; // Seferin kalkış saati (HH:mm formatında, zorunlu)
  isActive?: boolean; // Seferin aktif olup olmadığı (isteğe bağlı, varsayılan: true)
}

/**
 * Sefer Güncelleme Verisi Arayüzü (Update Trip Data Interface)
 * Mevcut sefer bilgilerini güncellerken gönderilecek verileri tanımlar
 * Tüm alanlar isteğe bağlıdır - sadece güncellenecek alanlar gönderilir
 */
export interface UpdateTripData {
  routeId?: number; // Seferin ait olacağı rotanın ID'si (isteğe bağlı)
  departureTime?: string; // Seferin kalkış saati (HH:mm formatında, isteğe bağlı)
  isActive?: boolean; // Seferin aktif olup olmadığı (isteğe bağlı)
}

/**
 * ============================================================================
 * GÜNLÜK PLAN TİPLERİ (DAILY PLAN TYPES)
 * Backend şema yapısı ile uyumlu olacak şekilde tasarlanmıştır
 * ============================================================================
 */

/**
 * Günlük Plan Arayüzü (Daily Plan Interface)
 * Bir öğrencinin belirli bir günde hangi otobüs, sefer ve durak ile yolculuk yapacağını planlayan kayıt
 */
export interface DailyPlan {
  id: number; // Günlük planın benzersiz ID'si
  planDate: string; // Planın yapıldığı tarih (YYYY-MM-DD formatında, örn: "2024-01-15")
  studentId: number; // Planlanan öğrencinin ID'si
  tripId: number; // Planlanan seferin ID'si
  busId: number; // Planlanan otobüsün ID'si
  stopId?: number | null; // Planlanan durağın ID'si (isteğe bağlı veya null olabilir)
  isBoarding: boolean; // Biniş mi iniş mi? true = biniş (minmə), false = iniş (düşmə)
  notes?: string | null; // Plan hakkında notlar (isteğe bağlı veya null olabilir)
  createdAt: string; // Günlük planın oluşturulma tarihi (ISO string formatında)
  updatedAt: string; // Günlük planın son güncellenme tarihi (ISO string formatında)
  student?: Student; // Planlanan öğrenci bilgileri (ilişkili veri, isteğe bağlı)
  trip?: Trip; // Planlanan sefer bilgileri (ilişkili veri, isteğe bağlı)
  bus?: Bus; // Planlanan otobüs bilgileri (ilişkili veri, isteğe bağlı)
  stop?: Stop; // Planlanan durak bilgileri (ilişkili veri, isteğe bağlı)
}

/**
 * Günlük Plan Oluşturma Verisi Arayüzü (Create Daily Plan Data Interface)
 * Yeni günlük plan oluşturulurken gönderilecek verileri tanımlar
 */
export interface CreateDailyPlanData {
  planDate: string; // Planın yapıldığı tarih (YYYY-MM-DD formatında, zorunlu)
  studentId: number; // Planlanan öğrencinin ID'si (zorunlu)
  tripId: number; // Planlanan seferin ID'si (zorunlu)
  busId: number; // Planlanan otobüsün ID'si (zorunlu)
  stopId?: number; // Planlanan durağın ID'si (isteğe bağlı)
  isBoarding?: boolean; // Biniş mi iniş mi? true = biniş, false = iniş (isteğe bağlı, varsayılan: true)
  notes?: string; // Plan hakkında notlar (isteğe bağlı)
}

/**
 * Günlük Plan Güncelleme Verisi Arayüzü (Update Daily Plan Data Interface)
 * Mevcut günlük plan bilgilerini güncellerken gönderilecek verileri tanımlar
 * Tüm alanlar isteğe bağlıdır - sadece güncellenecek alanlar gönderilir
 */
export interface UpdateDailyPlanData {
  planDate?: string; // Planın yapıldığı tarih (YYYY-MM-DD formatında, isteğe bağlı)
  studentId?: number; // Planlanan öğrencinin ID'si (isteğe bağlı)
  tripId?: number; // Planlanan seferin ID'si (isteğe bağlı)
  busId?: number; // Planlanan otobüsün ID'si (isteğe bağlı)
  stopId?: number; // Planlanan durağın ID'si (isteğe bağlı)
  isBoarding?: boolean; // Biniş mi iniş mi? (isteğe bağlı)
  notes?: string; // Plan hakkında notlar (isteğe bağlı)
}

/**
 * ============================================================================
 * BİNİŞ KAYDI TİPLERİ (BOARDING RECORD TYPES)
 * Backend şema yapısı ile uyumlu olacak şekilde tasarlanmıştır
 * ============================================================================
 */

/**
 * Biniş Kaydı Arayüzü (Boarding Record Interface)
 * Öğrencinin otobüse biniş işleminin kaydını tutar (sürücü tarafından kaydedilir)
 */
export interface BoardingRecord {
  id: number; // Biniş kaydının benzersiz ID'si
  studentId: number; // Binen öğrencinin ID'si
  tripId: number; // Biniş yapılan seferin ID'si
  busId: number; // Biniş yapılan otobüsün ID'si
  stopId?: number | null; // Biniş yapılan durağın ID'si (isteğe bağlı veya null olabilir)
  recordDate: string; // Kayıt yapılan tarih (YYYY-MM-DD formatında)
  recordTime: string; // Kayıt yapılan tam zaman (ISO timestamp formatında)
  driverId: number; // Kaydı yapan sürücünün ID'si
  wasPlanned: boolean; // Bu biniş işlemi önceden planlanmış mıydı? (günlük plan ile ilişkili mi?)
  dailyPlanId?: number | null; // İlişkili günlük planın ID'si (planlı binişler için, isteğe bağlı veya null)
  createdAt: string; // Biniş kaydının oluşturulma tarihi (ISO string formatında)
  updatedAt: string; // Biniş kaydının son güncellenme tarihi (ISO string formatında)
  student?: Student; // Binen öğrenci bilgileri (ilişkili veri, isteğe bağlı)
  trip?: Trip; // Biniş yapılan sefer bilgileri (ilişkili veri, isteğe bağlı)
  bus?: Bus; // Biniş yapılan otobüs bilgileri (ilişkili veri, isteğe bağlı)
  stop?: Stop; // Biniş yapılan durak bilgileri (ilişkili veri, isteğe bağlı)
  driver?: User; // Kaydı yapan sürücü bilgileri (ilişkili veri, isteğe bağlı)
}

/**
 * Biniş Kaydı Oluşturma Verisi Arayüzü (Create Boarding Record Data Interface)
 * Yeni biniş kaydı oluşturulurken gönderilecek verileri tanımlar
 */
export interface CreateBoardingRecordData {
  studentId: number; // Binen öğrencinin ID'si (zorunlu)
  tripId: number; // Biniş yapılan seferin ID'si (zorunlu)
  busId: number; // Biniş yapılan otobüsün ID'si (zorunlu)
  stopId?: number; // Biniş yapılan durağın ID'si (isteğe bağlı)
  recordDate: string; // Kayıt yapılan tarih (YYYY-MM-DD formatında, zorunlu)
  driverId: number; // Kaydı yapan sürücünün ID'si (zorunlu)
  wasPlanned?: boolean; // Bu biniş işlemi önceden planlanmış mıydı? (isteğe bağlı, varsayılan: false)
  dailyPlanId?: number; // İlişkili günlük planın ID'si (planlı binişler için, isteğe bağlı)
}

/**
 * Biniş Kaydı Güncelleme Verisi Arayüzü (Update Boarding Record Data Interface)
 * Mevcut biniş kaydı bilgilerini güncellerken gönderilecek verileri tanımlar
 * Tüm alanlar isteğe bağlıdır - sadece güncellenecek alanlar gönderilir
 */
export interface UpdateBoardingRecordData {
  studentId?: number; // Binen öğrencinin ID'si (isteğe bağlı)
  tripId?: number; // Biniş yapılan seferin ID'si (isteğe bağlı)
  busId?: number; // Biniş yapılan otobüsün ID'si (isteğe bağlı)
  stopId?: number; // Biniş yapılan durağın ID'si (isteğe bağlı)
  recordDate?: string; // Kayıt yapılan tarih (YYYY-MM-DD formatında, isteğe bağlı)
  driverId?: number; // Kaydı yapan sürücünün ID'si (isteğe bağlı)
  wasPlanned?: boolean; // Bu biniş işlemi önceden planlanmış mıydı? (isteğe bağlı)
  dailyPlanId?: number; // İlişkili günlük planın ID'si (isteğe bağlı)
}

/**
 * ============================================================================
 * İNİŞ KAYDI TİPLERİ (DISEMBARKING RECORD TYPES)
 * Backend şema yapısı ile uyumlu olacak şekilde tasarlanmıştır
 * ============================================================================
 */

/**
 * İniş Kaydı Arayüzü (Disembarking Record Interface)
 * Öğrencinin otobüsten iniş işleminin kaydını tutar (sürücü tarafından kaydedilir)
 */
export interface DisembarkingRecord {
  id: number; // İniş kaydının benzersiz ID'si
  studentId: number; // İnen öğrencinin ID'si
  tripId: number; // İniş yapılan seferin ID'si
  busId: number; // İniş yapılan otobüsün ID'si
  stopId?: number | null; // İniş yapılan durağın ID'si (isteğe bağlı veya null olabilir)
  recordDate: string; // Kayıt yapılan tarih (YYYY-MM-DD formatında)
  recordTime: string; // Kayıt yapılan tam zaman (ISO timestamp formatında)
  driverId: number; // Kaydı yapan sürücünün ID'si
  wasPlanned: boolean; // Bu iniş işlemi önceden planlanmış mıydı? (günlük plan ile ilişkili mi?)
  dailyPlanId?: number | null; // İlişkili günlük planın ID'si (planlı inişler için, isteğe bağlı veya null)
  createdAt: string; // İniş kaydının oluşturulma tarihi (ISO string formatında)
  updatedAt: string; // İniş kaydının son güncellenme tarihi (ISO string formatında)
  student?: Student; // İnen öğrenci bilgileri (ilişkili veri, isteğe bağlı)
  trip?: Trip; // İniş yapılan sefer bilgileri (ilişkili veri, isteğe bağlı)
  bus?: Bus; // İniş yapılan otobüs bilgileri (ilişkili veri, isteğe bağlı)
  stop?: Stop; // İniş yapılan durak bilgileri (ilişkili veri, isteğe bağlı)
  driver?: User; // Kaydı yapan sürücü bilgileri (ilişkili veri, isteğe bağlı)
}

/**
 * İniş Kaydı Oluşturma Verisi Arayüzü (Create Disembarking Record Data Interface)
 * Yeni iniş kaydı oluşturulurken gönderilecek verileri tanımlar
 */
export interface CreateDisembarkingRecordData {
  studentId: number; // İnen öğrencinin ID'si (zorunlu)
  tripId: number; // İniş yapılan seferin ID'si (zorunlu)
  busId: number; // İniş yapılan otobüsün ID'si (zorunlu)
  stopId?: number; // İniş yapılan durağın ID'si (isteğe bağlı)
  recordDate: string; // Kayıt yapılan tarih (YYYY-MM-DD formatında, zorunlu)
  driverId: number; // Kaydı yapan sürücünün ID'si (zorunlu)
  wasPlanned?: boolean; // Bu iniş işlemi önceden planlanmış mıydı? (isteğe bağlı, varsayılan: false)
  dailyPlanId?: number; // İlişkili günlük planın ID'si (planlı inişler için, isteğe bağlı)
}

/**
 * İniş Kaydı Güncelleme Verisi Arayüzü (Update Disembarking Record Data Interface)
 * Mevcut iniş kaydı bilgilerini güncellerken gönderilecek verileri tanımlar
 * Tüm alanlar isteğe bağlıdır - sadece güncellenecek alanlar gönderilir
 */
export interface UpdateDisembarkingRecordData {
  studentId?: number; // İnen öğrencinin ID'si (isteğe bağlı)
  tripId?: number; // İniş yapılan seferin ID'si (isteğe bağlı)
  busId?: number; // İniş yapılan otobüsün ID'si (isteğe bağlı)
  stopId?: number; // İniş yapılan durağın ID'si (isteğe bağlı)
  recordDate?: string; // Kayıt yapılan tarih (YYYY-MM-DD formatında, isteğe bağlı)
  driverId?: number; // Kaydı yapan sürücünün ID'si (isteğe bağlı)
  wasPlanned?: boolean; // Bu iniş işlemi önceden planlanmış mıydı? (isteğe bağlı)
  dailyPlanId?: number; // İlişkili günlük planın ID'si (isteğe bağlı)
}

/**
 * ============================================================================
 * RAPOR TİPLERİ (REPORT TYPES)
 * ============================================================================
 */

/**
 * Günlük Rapor Arayüzü (Daily Report Interface)
 * Belirli bir gün için detaylı rapor verilerini içerir
 */
export interface DailyReport {
  date: string; // Raporun ait olduğu tarih (YYYY-MM-DD formatında)
  totalPlanned: number; // Toplam planlanan öğrenci sayısı
  totalBoarded: number; // Toplam binen öğrenci sayısı
  totalAlighted: number; // Toplam inen öğrenci sayısı
  missedStudents: Student[]; // Planlanmış ama binmemiş öğrenciler listesi
  unplannedBoarded: Student[]; // Planlanmamış ama binmiş öğrenciler listesi
  buses: {
    // Her otobüs için detaylı istatistikler
    bus: Bus; // Otobüs bilgileri
    planned: number; // Bu otobüs için planlanan öğrenci sayısı
    boarded: number; // Bu otobüse binen öğrenci sayısı
    alighted: number; // Bu otobüsten inen öğrenci sayısı
  }[];
}

/**
 * Özet Rapor Arayüzü (Summary Report Interface)
 * Genel sistem istatistiklerini içeren özet rapor
 */
export interface SummaryReport {
  totalStudents: number; // Sistemdeki toplam öğrenci sayısı
  totalBuses: number; // Sistemdeki toplam otobüs sayısı
  totalDrivers: number; // Sistemdeki toplam sürücü sayısı
  activeRoutes: number; // Aktif rota sayısı
  todayBoarding: number; // Bugün binen toplam öğrenci sayısı
  todayAlighting: number; // Bugün inen toplam öğrenci sayısı
}

/**
 * ============================================================================
 * API YANIT TİPLERİ (API RESPONSE TYPES)
 * ============================================================================
 */

/**
 * API Yanıtı Arayüzü (API Response Interface)
 * Backend API'lerinden dönen standart yanıt formatını tanımlar
 *
 * @template T - Yanıtta dönen veri tipi (varsayılan: unknown)
 */
export interface ApiResponse<T = unknown> {
  success: boolean; // İşlemin başarılı olup olmadığı
  message?: string; // İşlem hakkında mesaj (başarı veya hata mesajı)
  data?: T; // İşlem sonucu veri (başarılı ise)
  error?: string; // Hata mesajı (başarısız ise)
}

/**
 * Sayfalanmış Yanıt Arayüzü (Paginated Response Interface)
 * Sayfalanmış (pagination) veri listesi için API yanıt formatını tanımlar
 *
 * @template T - Listedeki her bir öğenin tipi
 */
export interface PaginatedResponse<T> {
  success: boolean; // İşlemin başarılı olup olmadığı
  data: T[]; // Veri listesi
  pagination: {
    // Sayfalama bilgileri
    page: number; // Mevcut sayfa numarası (1'den başlar)
    pageSize: number; // Sayfa başına gösterilecek öğe sayısı
    total: number; // Toplam öğe sayısı
    totalPages: number; // Toplam sayfa sayısı
  };
}

/**
 * ============================================================================
 * ORTAK TİPLER (COMMON TYPES)
 * ============================================================================
 */

/**
 * Seçenek Arayüzü (Select Option Interface)
 * Dropdown, select gibi form elemanlarında kullanılan seçenek formatı
 */
export interface SelectOption {
  value: string | number; // Seçeneğin değeri (form gönderildiğinde kullanılır)
  label: string; // Seçeneğin görüntülenecek metni
}

/**
 * Tablo Sütunu Arayüzü (Table Column Interface)
 * Dinamik tablolarda sütun tanımlamak için kullanılan format
 *
 * @template T - Tablodaki satır verisinin tipi
 */
export interface TableColumn<T> {
  key: keyof T | string; // Sütunun veri anahtarı (key)
  label: string; // Sütun başlığı
  render?: (value: unknown, row: T) => React.ReactNode; // Özel render fonksiyonu (isteğe bağlı)
  sortable?: boolean; // Sütunun sıralanabilir olup olmadığı (isteğe bağlı)
  width?: string; // Sütun genişliği (CSS değeri, örn: "100px", "20%", isteğe bağlı)
}

/**
 * Filtre Seçeneği Arayüzü (Filter Option Interface)
 * Veri listelerinde filtreleme yapmak için kullanılan format
 */
export interface FilterOption {
  field: string; // Filtrelenecek alan adı
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'like' | 'in'; // Filtre operatörü
  // eq: eşittir, ne: eşit değildir, gt: büyüktür, lt: küçüktür
  // gte: büyük veya eşittir, lte: küçük veya eşittir
  // like: içerir (text arama), in: listede var
  value: unknown; // Filtre değeri
}

/**
 * Sıralama Seçeneği Arayüzü (Sort Option Interface)
 * Veri listelerinde sıralama yapmak için kullanılan format
 */
export interface SortOption {
  field: string; // Sıralanacak alan adı
  direction: 'asc' | 'desc'; // Sıralama yönü (asc: artan, desc: azalan)
}
