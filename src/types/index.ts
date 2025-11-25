// User types
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'driver';
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'driver';
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: User;
}

// Bus types
export interface Bus {
  id: number;
  plateNumber: string;
  brand?: string;
  model?: string;
  capacity: number;
  driverId?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  driver?: User;
}

export interface CreateBusData {
  plateNumber: string;
  brand?: string;
  model?: string;
  capacity: number;
  driverId?: number;
  isActive?: boolean;
}

// Student types (Backend schema ile uyumlu)
export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  qrCode: string;
  school: string;
  grade: string;
  parentName?: string | null;
  parentPhone?: string | null;
  address?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudentData {
  firstName: string;
  lastName: string;
  qrCode: string;
  school: string;
  grade: string;
  parentName?: string;
  parentPhone?: string;
  address?: string;
  isActive?: boolean;
}

export interface UpdateStudentData {
  firstName?: string;
  lastName?: string;
  qrCode?: string;
  school?: string;
  grade?: string;
  parentName?: string;
  parentPhone?: string;
  address?: string;
  isActive?: boolean;
}

// Stop types (Backend schema ile uyumlu)
export interface Stop {
  id: number;
  name: string;
  address?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStopData {
  name: string;
  address?: string;
  latitude?: string;
  longitude?: string;
  isActive?: boolean;
}

export interface UpdateStopData {
  name?: string;
  address?: string;
  latitude?: string;
  longitude?: string;
  isActive?: boolean;
}

// Route types (Backend schema ile uyumlu)
export interface Route {
  id: number;
  name: string;
  description?: string | null;
  busId?: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  bus?: Bus;
}

export interface CreateRouteData {
  name: string;
  description?: string;
  busId?: number;
  isActive?: boolean;
}

export interface UpdateRouteData {
  name?: string;
  description?: string;
  busId?: number;
  isActive?: boolean;
}

// Route Stop types (Backend schema ile uyumlu)
export interface RouteStop {
  id: number;
  routeId: number;
  stopId: number;
  order: number;
  estimatedArrivalTime?: string | null;
  createdAt: string;
  updatedAt: string;
  stop?: Stop;
}

export interface CreateRouteStopData {
  routeId: number;
  stopId: number;
  order: number;
  estimatedArrivalTime?: string;
}

export interface UpdateRouteStopData {
  order?: number;
  estimatedArrivalTime?: string;
}

// Trip types (Backend schema ile uyumlu)
export interface Trip {
  id: number;
  routeId: number;
  departureTime: string; // HH:mm format
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  route?: Route;
}

export interface CreateTripData {
  routeId: number;
  departureTime: string; // HH:mm format
  isActive?: boolean;
}

export interface UpdateTripData {
  routeId?: number;
  departureTime?: string;
  isActive?: boolean;
}

// DailyPlan types (Backend schema ile uyumlu)
export interface DailyPlan {
  id: number;
  planDate: string; // YYYY-MM-DD format
  studentId: number;
  tripId: number;
  busId: number;
  stopId?: number | null;
  isBoarding: boolean; // true = minmə, false = düşmə
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  student?: Student;
  trip?: Trip;
  bus?: Bus;
  stop?: Stop;
}

export interface CreateDailyPlanData {
  planDate: string; // YYYY-MM-DD format
  studentId: number;
  tripId: number;
  busId: number;
  stopId?: number;
  isBoarding?: boolean; // true = minmə, false = düşmə
  notes?: string;
}

export interface UpdateDailyPlanData {
  planDate?: string;
  studentId?: number;
  tripId?: number;
  busId?: number;
  stopId?: number;
  isBoarding?: boolean;
  notes?: string;
}

// Boarding Record types (Backend schema ile uyumlu)
export interface BoardingRecord {
  id: number;
  studentId: number;
  tripId: number;
  busId: number;
  stopId?: number | null;
  recordDate: string; // YYYY-MM-DD format
  recordTime: string; // ISO timestamp
  driverId: number;
  wasPlanned: boolean;
  dailyPlanId?: number | null;
  createdAt: string;
  updatedAt: string;
  student?: Student;
  trip?: Trip;
  bus?: Bus;
  stop?: Stop;
  driver?: User;
}

export interface CreateBoardingRecordData {
  studentId: number;
  tripId: number;
  busId: number;
  stopId?: number;
  recordDate: string; // YYYY-MM-DD format
  driverId: number;
  wasPlanned?: boolean;
  dailyPlanId?: number;
}

export interface UpdateBoardingRecordData {
  studentId?: number;
  tripId?: number;
  busId?: number;
  stopId?: number;
  recordDate?: string;
  driverId?: number;
  wasPlanned?: boolean;
  dailyPlanId?: number;
}

// Disembarking Record types (Backend schema ile uyumlu)
export interface DisembarkingRecord {
  id: number;
  studentId: number;
  tripId: number;
  busId: number;
  stopId?: number | null;
  recordDate: string; // YYYY-MM-DD format
  recordTime: string; // ISO timestamp
  driverId: number;
  wasPlanned: boolean;
  dailyPlanId?: number | null;
  createdAt: string;
  updatedAt: string;
  student?: Student;
  trip?: Trip;
  bus?: Bus;
  stop?: Stop;
  driver?: User;
}

export interface CreateDisembarkingRecordData {
  studentId: number;
  tripId: number;
  busId: number;
  stopId?: number;
  recordDate: string; // YYYY-MM-DD format
  driverId: number;
  wasPlanned?: boolean;
  dailyPlanId?: number;
}

export interface UpdateDisembarkingRecordData {
  studentId?: number;
  tripId?: number;
  busId?: number;
  stopId?: number;
  recordDate?: string;
  driverId?: number;
  wasPlanned?: boolean;
  dailyPlanId?: number;
}

// Report types
export interface DailyReport {
  date: string;
  totalPlanned: number;
  totalBoarded: number;
  totalAlighted: number;
  missedStudents: Student[];
  unplannedBoarded: Student[];
  buses: {
    bus: Bus;
    planned: number;
    boarded: number;
    alighted: number;
  }[];
}

export interface SummaryReport {
  totalStudents: number;
  totalBuses: number;
  totalDrivers: number;
  activeRoutes: number;
  todayBoarding: number;
  todayAlighting: number;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// Common types
export interface SelectOption {
  value: string | number;
  label: string;
}

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (value: unknown, row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface FilterOption {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'like' | 'in';
  value: unknown;
}

export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}
