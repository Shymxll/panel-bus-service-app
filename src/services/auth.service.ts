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
    const response = await axiosInstance.post<ApiResponse<User>>(
      API_ENDPOINTS.auth.register,
      data
    );
    // Backend returns: { success: true, message: "...", data: user }
    if (response.data.success && response.data.data) {
      return {
        success: true,
        message: response.data.message || 'Registration successful',
        data: response.data.data,
      };
    }
    throw new Error(response.data.message || 'Registration failed');
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axiosInstance.post<ApiResponse<User>>(
      API_ENDPOINTS.auth.login,
      credentials
    );
    // Backend returns: { success: true, message: "...", data: user }
    if (response.data.success && response.data.data) {
      return {
        success: true,
        message: response.data.message || 'Login successful',
        data: response.data.data,
      };
    }
    throw new Error(response.data.message || 'Login failed');
  }

  async adminLogin(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('Admin login attempt:', { email: credentials.email });
      const response = await axiosInstance.post<ApiResponse<User>>(
        API_ENDPOINTS.auth.adminLogin,
        credentials
      );
      console.log('Admin login response:', response.data);
      
      // Backend returns: { success: true, message: "...", data: user }
      if (response.data.success && response.data.data) {
        return {
          success: true,
          message: response.data.message || 'Admin login successful',
          data: response.data.data,
        };
      }
      throw new Error(response.data.message || 'Admin login failed');
    } catch (error: any) {
      // Handle 401 and other errors
      console.error('Admin login error details:', {
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message,
      });
      
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Email və ya şifrə yanlışdır. Zəhmət olmasa əvvəlcə "Admin İstifadəçi Yarat" düyməsinə basın.';
      throw new Error(errorMessage);
    }
  }

  async logout(): Promise<ApiResponse> {
    const response = await axiosInstance.post<ApiResponse>(API_ENDPOINTS.auth.logout);
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await axiosInstance.get<ApiResponse<User>>(API_ENDPOINTS.auth.me);
    return response.data.data!;
  }

  async createAdmin(): Promise<User> {
    try {
      console.log('Creating admin user...');
      const response = await axiosInstance.get<ApiResponse<User>>(
        API_ENDPOINTS.auth.createAdmin
      );
      console.log('Create admin response:', response.data);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Admin creation failed');
    } catch (error: any) {
      console.error('Create admin error:', {
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message,
      });
      throw error;
    }
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

