export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10),
  withCredentials: true, // For cookie-based auth
};

export const API_ENDPOINTS = {
  // Auth
  auth: {
    register: '/api/auth/register',
    login: '/api/auth/login',
    adminLogin: '/api/auth/admin/login',
    logout: '/api/auth/logout',
    me: '/api/auth/me',
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
  // Routes (to be implemented)
  routes: {
    list: '/api/routes',
    detail: (id: number) => `/api/routes/${id}`,
    create: '/api/routes',
    update: (id: number) => `/api/routes/${id}`,
    delete: (id: number) => `/api/routes/${id}`,
  },
  // Planning (to be implemented)
  planning: {
    list: '/api/planning',
    detail: (id: number) => `/api/planning/${id}`,
    create: '/api/planning',
    update: (id: number) => `/api/planning/${id}`,
    delete: (id: number) => `/api/planning/${id}`,
    byDate: (date: string) => `/api/planning/date/${date}`,
  },
  // Boarding (to be implemented)
  boarding: {
    board: '/api/boarding/board',
    alight: '/api/boarding/alight',
    list: '/api/boarding',
    byDate: (date: string) => `/api/boarding/date/${date}`,
  },
  // Reports (to be implemented)
  reports: {
    daily: '/api/reports/daily',
    summary: '/api/reports/summary',
    studentHistory: (studentId: number) => `/api/reports/student/${studentId}`,
  },
};

