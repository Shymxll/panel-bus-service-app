import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/config/api.config';
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
  ApiResponse,
} from '@/types';

class AuthService {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>(
      API_ENDPOINTS.auth.register,
      data
    );
    return response.data;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>(
      API_ENDPOINTS.auth.login,
      credentials
    );
    return response.data;
  }

  async adminLogin(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>(
      API_ENDPOINTS.auth.adminLogin,
      credentials
    );
    return response.data;
  }

  async logout(): Promise<ApiResponse> {
    const response = await axiosInstance.post<ApiResponse>(API_ENDPOINTS.auth.logout);
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await axiosInstance.get<ApiResponse<User>>(API_ENDPOINTS.auth.me);
    return response.data.data!;
  }

  async createDriver(data: RegisterData): Promise<User> {
    const response = await axiosInstance.post<ApiResponse<User>>(
      API_ENDPOINTS.auth.createDriver,
      data
    );
    return response.data.data!;
  }
}

export const authService = new AuthService();

