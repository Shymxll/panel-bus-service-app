import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from '@/config/api.config';
import { toast } from 'sonner';

// Create axios instance
export const axiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  withCredentials: API_CONFIG.withCredentials,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage
    const token = localStorage.getItem('auth_token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<{ message?: string; error?: string }>) => {
    // Handle common errors
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.response.data?.error || 'Bir xəta baş verdi';

      switch (status) {
        case 401:
          // Unauthorized - clear auth and redirect to login
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
          if (!window.location.pathname.includes('/login')) {
            toast.error('Sessiya bitdi. Yenidən daxil olun.');
            window.location.href = '/login';
          }
          break;
        case 403:
          toast.error('Bu əməliyyat üçün icazəniz yoxdur.');
          break;
        case 404:
          toast.error('Məlumat tapılmadı.');
          break;
        case 409:
          toast.error(message);
          break;
        case 500:
          toast.error('Server xətası. Zəhmət olmasa sonra yenidən cəhd edin.');
          break;
        default:
          toast.error(message);
      }
    } else if (error.request) {
      // Network error
      toast.error('Şəbəkə xətası. İnternet bağlantınızı yoxlayın.');
    } else {
      toast.error('Gözlənilməz xəta baş verdi.');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

