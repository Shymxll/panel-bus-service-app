export const API_CONFIG = {
  // In development, use proxy (empty string = relative URL)
  // In production, use full URL
  baseURL: import.meta.env.VITE_API_BASE_URL || 
    (import.meta.env.DEV ? '' : 'http://localhost:3000'),
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10),
  withCredentials: true, // For cookie-based auth (httpOnly cookies)
};

export const API_ENDPOINTS = {
  // Auth
  auth: {
    register: '/api/auth/register',
    login: '/api/auth/login',
    adminLogin: '/api/auth/admin/login',
    logout: '/api/auth/logout',
    me: '/api/auth/me',
    createAdmin: '/api/auth/create-admin',
    createDriver: '/api/auth/create-driver',
  },
  // Users
  users: {
    list: '/api/users',
    detail: (id: number) => `/api/users/${id}`,
    create: '/api/users',
    update: (id: number) => `/api/users/${id}`,
    delete: (id: number) => `/api/users/${id}`,
  },
  // Buses
  buses: {
    list: '/api/buses',
    detail: (id: number) => `/api/buses/${id}`,
    create: '/api/buses',
    update: (id: number) => `/api/buses/${id}`,
    delete: (id: number) => `/api/buses/${id}`,
  },
  // Students (to be implemented)
  students: {
    list: '/api/students',
    detail: (id: number) => `/api/students/${id}`,
    create: '/api/students',
    update: (id: number) => `/api/students/${id}`,
    delete: (id: number) => `/api/students/${id}`,
    generateQR: (id: number) => `/api/students/${id}/qr`,
  },
  // Routes
  routes: {
    list: '/api/routes',
    detail: (id: number) => `/api/routes/${id}`,
    create: '/api/routes',
    update: (id: number) => `/api/routes/${id}`,
    delete: (id: number) => `/api/routes/${id}`,
  },
  // Stops
  stops: {
    list: '/api/stops',
    detail: (id: number) => `/api/stops/${id}`,
    create: '/api/stops',
    update: (id: number) => `/api/stops/${id}`,
    delete: (id: number) => `/api/stops/${id}`,
  },
  // Daily Plans
  dailyPlans: {
    list: '/api/daily-plans',
    detail: (id: number) => `/api/daily-plans/${id}`,
    create: '/api/daily-plans',
    update: (id: number) => `/api/daily-plans/${id}`,
    delete: (id: number) => `/api/daily-plans/${id}`,
    byDate: (date: string) => `/api/daily-plans/date/${date}`,
    byStudent: (studentId: number) => `/api/daily-plans/student/${studentId}`,
  },
  // Trips
  trips: {
    list: '/api/trips',
    detail: (id: number) => `/api/trips/${id}`,
    create: '/api/trips',
    update: (id: number) => `/api/trips/${id}`,
    delete: (id: number) => `/api/trips/${id}`,
    byRoute: (routeId: number) => `/api/trips/route/${routeId}`,
  },
  // Boarding Records
  boardingRecords: {
    list: '/api/boarding-records',
    detail: (id: number) => `/api/boarding-records/${id}`,
    create: '/api/boarding-records',
    update: (id: number) => `/api/boarding-records/${id}`,
    delete: (id: number) => `/api/boarding-records/${id}`,
    byDate: (date: string) => `/api/boarding-records/date/${date}`,
    byStudent: (studentId: number) => `/api/boarding-records/student/${studentId}`,
  },
  // Disembarking Records
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

