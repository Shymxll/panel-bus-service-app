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
  stops: {
    all: ['stops'] as const,
    detail: (id: number) => ['stops', id] as const,
  },
  trips: {
    all: ['trips'] as const,
    detail: (id: number) => ['trips', id] as const,
    byRoute: (routeId: number) => ['trips', 'route', routeId] as const,
  },
  dailyPlans: {
    all: ['dailyPlans'] as const,
    detail: (id: number) => ['dailyPlans', id] as const,
    byDate: (date: string) => ['dailyPlans', 'date', date] as const,
    byStudent: (studentId: number) => ['dailyPlans', 'student', studentId] as const,
  },
  boardingRecords: {
    all: ['boardingRecords'] as const,
    detail: (id: number) => ['boardingRecords', id] as const,
    byDate: (date: string) => ['boardingRecords', 'date', date] as const,
    byStudent: (studentId: number) => ['boardingRecords', 'student', studentId] as const,
  },
  disembarkingRecords: {
    all: ['disembarkingRecords'] as const,
    detail: (id: number) => ['disembarkingRecords', id] as const,
    byDate: (date: string) => ['disembarkingRecords', 'date', date] as const,
    byStudent: (studentId: number) => ['disembarkingRecords', 'student', studentId] as const,
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

