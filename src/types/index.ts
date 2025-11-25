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

// Route types
export interface RouteStop {
  id: number;
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  order: number;
  estimatedArrivalTime?: string;
}

export interface BusRoute {
  id: number;
  name: string;
  description?: string;
  busId?: number;
  stops: RouteStop[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Planning types
export type TripType = 'morning_pickup' | 'afternoon_dropoff' | 'evening_dropoff';

export interface DailyPlan {
  id: number;
  date: string;
  busId: number;
  tripType: TripType;
  expectedStudents: number[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  bus?: Bus;
  students?: Student[];
}

export interface CreatePlanData {
  date: string;
  busId: number;
  tripType: TripType;
  studentIds: number[];
  notes?: string;
}

// Boarding types
export type BoardingAction = 'board' | 'alight';

export interface BoardingRecord {
  id: number;
  studentId: number;
  busId: number;
  driverId: number;
  action: BoardingAction;
  timestamp: string;
  planId?: number;
  isPlanned: boolean;
  student?: Student;
  bus?: Bus;
  driver?: User;
}

export interface CreateBoardingData {
  studentId: number;
  busId: number;
  action: BoardingAction;
  qrCode?: string;
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

