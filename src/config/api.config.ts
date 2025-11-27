// Tum HTTP istemcilerinin uymasi gereken temel ayarlar: base URL, zaman asimi, cookie ile kimlik dogrulama.
export const API_CONFIG = {
  // Gelistirmede proxy kullanildigi icin bos string tarayicinin ayni hostuna isaret eder; prod'da tam URL gerekir.
  baseURL:
    import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? '' : 'http://localhost:3000'),
  // Ortam degiskeni yoksa 30 sn'lik zaman asimi kullanilir.
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10),
  withCredentials: true, // httpOnly cookie tabanli oturum icin gerekli bayrak.
};

// Backend'in tum REST sonuclarini tek noktadan yonetilen fonksiyonlarla tanimlar.
export const API_ENDPOINTS = {
  // Kimlik islemleri ve rol bazli girisler.
  auth: {
    register: '/api/auth/register',
    login: '/api/auth/login',
    adminLogin: '/api/auth/admin/login',
    logout: '/api/auth/logout',
    me: '/api/auth/me',
    createAdmin: '/api/auth/create-admin',
    createDriver: '/api/auth/create-driver',
  },
  // Sistem kullanicilari (admin, veli vb.) uzerindeki CRUD islemleri.
  users: {
    list: '/api/users',
    detail: (id: number) => `/api/users/${id}`,
    create: '/api/users',
    update: (id: number) => `/api/users/${id}`,
    delete: (id: number) => `/api/users/${id}`,
  },
  // Fiziksel arac kayitlarinin yonetimi.
  buses: {
    list: '/api/buses',
    detail: (id: number) => `/api/buses/${id}`,
    create: '/api/buses',
    update: (id: number) => `/api/buses/${id}`,
    delete: (id: number) => `/api/buses/${id}`,
  },
  // Ogrenci kartlari ve QR kod uretimi.
  students: {
    list: '/api/students',
    detail: (id: number) => `/api/students/${id}`,
    create: '/api/students',
    update: (id: number) => `/api/students/${id}`,
    delete: (id: number) => `/api/students/${id}`,
    generateQR: (id: number) => `/api/students/${id}/qr`,
  },
  // Servis guzergah planlari.
  routes: {
    list: '/api/routes',
    detail: (id: number) => `/api/routes/${id}`,
    create: '/api/routes',
    update: (id: number) => `/api/routes/${id}`,
    delete: (id: number) => `/api/routes/${id}`,
  },
  // Durak bilgileri.
  stops: {
    list: '/api/stops',
    detail: (id: number) => `/api/stops/${id}`,
    create: '/api/stops',
    update: (id: number) => `/api/stops/${id}`,
    delete: (id: number) => `/api/stops/${id}`,
  },
  // Gunluk servis planlari ve filtreleme yardimcilari.
  dailyPlans: {
    list: '/api/daily-plans',
    detail: (id: number) => `/api/daily-plans/${id}`,
    create: '/api/daily-plans',
    update: (id: number) => `/api/daily-plans/${id}`,
    delete: (id: number) => `/api/daily-plans/${id}`,
    byDate: (date: string) => `/api/daily-plans/date/${date}`,
    byStudent: (studentId: number) => `/api/daily-plans/student/${studentId}`,
  },
  // Gun icinde calisilan seferler.
  trips: {
    list: '/api/trips',
    detail: (id: number) => `/api/trips/${id}`,
    create: '/api/trips',
    update: (id: number) => `/api/trips/${id}`,
    delete: (id: number) => `/api/trips/${id}`,
    byRoute: (routeId: number) => `/api/trips/route/${routeId}`,
  },
  // Araca binis kayitlari ve raporlama endpointleri.
  boardingRecords: {
    list: '/api/boarding-records',
    detail: (id: number) => `/api/boarding-records/${id}`,
    create: '/api/boarding-records',
    update: (id: number) => `/api/boarding-records/${id}`,
    delete: (id: number) => `/api/boarding-records/${id}`,
    byDate: (date: string) => `/api/boarding-records/date/${date}`,
    byStudent: (studentId: number) => `/api/boarding-records/student/${studentId}`,
  },
  // Aractan inis kayitlari.
  disembarkingRecords: {
    list: '/api/disembarking-records',
    detail: (id: number) => `/api/disembarking-records/${id}`,
    create: '/api/disembarking-records',
    update: (id: number) => `/api/disembarking-records/${id}`,
    delete: (id: number) => `/api/disembarking-records/${id}`,
    byDate: (date: string) => `/api/disembarking-records/date/${date}`,
    byStudent: (studentId: number) => `/api/disembarking-records/student/${studentId}`,
  },
};
