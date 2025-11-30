import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth-store';
import { QUERY_KEYS } from '@/config/constants';
import type { LoginCredentials, RegisterData } from '@/types';

// Giris, cikis ve kimlik sorgularini yoneten merkezi hook.
export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setAuth, clearAuth, user, isAuthenticated } = useAuthStore();

  // Surucu girisi mutasyonu
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      // Token'ı response'dan al (backend artık token'ı response body'de de döndürüyor)
      // Eğer token yoksa cookie-based kullan (geriye dönük uyumluluk)
      const token = data.token || localStorage.getItem('auth_token') || 'cookie-based';
      
      // Token'ı localStorage'a kaydet (axios interceptor için)
      if (token && token !== 'cookie-based') {
        localStorage.setItem('auth_token', token);
      }
      
      if (data.data) {
        setAuth(data.data, token);
        toast.success('Uğurla daxil oldunuz!');
        navigate('/driver/dashboard');
      } else {
        toast.error('Giriş zamanı xəta baş verdi');
      }
    },
    onError: (error: any) => {
      // Get error message from backend response
      console.error('Driver login error:', error);
      console.error('Error response:', error?.response);
      console.error('Error response data:', error?.response?.data);
      console.error('Error response headers:', error?.response?.headers);
      console.error('Error message:', error?.message);
      
      // Response data'yı düzgün parse et
      let errorMessage = 'Email və ya şifrə yanlışdır.';
      
      if (error?.response?.data) {
        const responseData = error.response.data;
        // Obje ise
        if (typeof responseData === 'object' && responseData !== null) {
          errorMessage = (responseData as any)?.message || 
                        (responseData as any)?.error || 
                        errorMessage;
        }
        // String ise
        else if (typeof responseData === 'string') {
          errorMessage = responseData;
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      // Eğer hala varsayılan mesajsa, ek bilgi ekle
      if (errorMessage === 'Email və ya şifrə yanlışdır.') {
        errorMessage += ' Zəhmət olmasa admin panelindən şoför hesabı yaradıldığından əmin olun.';
      }
      
      // Check for database initialization error
      if (errorMessage.includes('Database not initialized') || errorMessage.includes('migrations')) {
        toast.error('Database hazır deyil. Zəhmət olmasa backend-də "npm run db:migrate" komutunu çalıştırın.', {
          duration: 10000,
        });
      } else if (errorMessage.includes('Failed query') || errorMessage.includes('does not exist')) {
        toast.error('Database cədvəlləri yoxdur. Zəhmət olmasa backend-də "npm run db:migrate" komutunu çalıştırın.', {
          duration: 10000,
        });
      } else if (error?.response?.status === 401) {
        toast.error(errorMessage, {
          duration: 8000,
        });
      } else if (error?.response?.status === 403) {
        toast.error('Bu hesab şoför hesabı deyil. Zəhmət olmasa /admin/login istifadə edin.', {
          duration: 8000,
        });
      } else {
        toast.error(errorMessage, {
          duration: 8000,
        });
      }
    },
  });

  // Admin girisi icin ayri mutasyon
  const adminLoginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.adminLogin(credentials),
    onSuccess: (data) => {
      // Token'ı response'dan al (backend artık token'ı response body'de de döndürüyor)
      // Eğer token yoksa cookie-based kullan (geriye dönük uyumluluk)
      const token = data.token || localStorage.getItem('auth_token') || 'cookie-based';
      
      // Token'ı localStorage'a kaydet (axios interceptor için)
      if (token && token !== 'cookie-based') {
        localStorage.setItem('auth_token', token);
      }
      
      // Store user data in localStorage for persistence
      if (data.data) {
        setAuth(data.data, token);
        toast.success('Admin panelə xoş gəlmisiniz!');
        navigate('/admin/dashboard');
      } else {
        toast.error('Giriş zamanı xəta baş verdi');
      }
    },
    onError: (error: any) => {
      // Get error message from backend response
      console.error('Admin login error:', error);
      console.error('Error response:', error?.response);
      console.error('Error response data:', error?.response?.data);
      
      const errorMessage = 
        error?.response?.data?.message || 
        error?.message || 
        'Email və ya şifrə yanlışdır.';
      
      // Check for database initialization error
      if (errorMessage.includes('Database not initialized') || errorMessage.includes('migrations')) {
        toast.error('Database hazır deyil. Zəhmət olmasa backend-də "npm run db:migrate" komutunu çalıştırın.', {
          duration: 10000,
        });
      } else if (errorMessage.includes('Failed query') || errorMessage.includes('does not exist')) {
        toast.error('Database cədvəlləri yoxdur. Zəhmət olmasa backend-də "npm run db:migrate" komutunu çalıştırın.', {
          duration: 10000,
        });
      } else {
        toast.error(errorMessage);
      }
    },
  });

  // Surucu kaydi mutasyonu
  const registerMutation = useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: (data) => {
      const token = localStorage.getItem('auth_token') || 'cookie-based';
      setAuth(data.data, token);
      toast.success('Qeydiyyat uğurla tamamlandı!');
      navigate('/driver/dashboard');
    },
    onError: () => {
      toast.error('Qeydiyyat zamanı xəta baş verdi');
    },
  });

  // Oturumu sonlandirma mutasyonu
  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      toast.success('Çıxış edildi');
      navigate('/login');
    },
  });

  // Mevcut kullaniciyi dogrulayan sorgu
  const { data: currentUser, isLoading: isLoadingUser } = useQuery({
    queryKey: QUERY_KEYS.auth.me,
    queryFn: () => authService.getCurrentUser(),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });

  return {
    user: currentUser || user,
    isAuthenticated,
    isLoadingUser,
    login: loginMutation.mutate,
    adminLogin: adminLoginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending || adminLoginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
};

