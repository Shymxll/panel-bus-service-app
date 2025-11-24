export const APP_NAME = 'Servis Takip Sistemi';
export const APP_DESCRIPTION = 'Məktəb Servisi Şagird İzləmə Sistemi';

export const ROLES = {
  ADMIN: 'admin',
  DRIVER: 'driver',
} as const;

export const TOKEN_KEY = 'auth_token';
export const USER_KEY = 'user_data';

export const QUERY_KEYS = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  users: {
    all: ['users'] as const,
    detail: (id: number) => ['users', id] as const,
  },
  buses: {
    all: ['buses'] as const,
    detail: (id: number) => ['buses', id] as const,
  },
  students: {
    all: ['students'] as const,
    detail: (id: number) => ['students', id] as const,
  },
  routes: {
    all: ['routes'] as const,
    detail: (id: number) => ['routes', id] as const,
  },
  planning: {
    all: ['planning'] as const,
    detail: (id: number) => ['planning', id] as const,
    byDate: (date: string) => ['planning', 'date', date] as const,
  },
  boarding: {
    all: ['boarding'] as const,
    byDate: (date: string) => ['boarding', 'date', date] as const,
  },
  reports: {
    daily: (date: string) => ['reports', 'daily', date] as const,
    summary: ['reports', 'summary'] as const,
    studentHistory: (id: number) => ['reports', 'student', id] as const,
  },
} as const;

export const DATE_FORMATS = {
  display: 'dd.MM.yyyy',
  displayWithTime: 'dd.MM.yyyy HH:mm',
  api: 'yyyy-MM-dd',
  apiWithTime: "yyyy-MM-dd'T'HH:mm:ss",
} as const;

export const PAGINATION = {
  defaultPageSize: 10,
  pageSizeOptions: [10, 20, 50, 100],
} as const;

