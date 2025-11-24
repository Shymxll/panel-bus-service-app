import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth-store';
import { QUERY_KEYS } from '@/config/constants';
import type { LoginCredentials, RegisterData } from '@/types';

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setAuth, clearAuth, user, isAuthenticated } = useAuthStore();

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      // Extract token from cookie or response
      const token = localStorage.getItem('auth_token') || 'cookie-based';
      setAuth(data.data, token);
      toast.success('Uğurla daxil oldunuz!');
      navigate('/driver/dashboard');
    },
    onError: () => {
      toast.error('Email və ya şifrə yanlışdır');
    },
  });

  // Admin login mutation
  const adminLoginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.adminLogin(credentials),
    onSuccess: (data) => {
      const token = localStorage.getItem('auth_token') || 'cookie-based';
      setAuth(data.data, token);
      toast.success('Admin panelə xoş gəlmisiniz!');
      navigate('/admin/dashboard');
    },
    onError: () => {
      toast.error('Email və ya şifrə yanlışdır');
    },
  });

  // Register mutation
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

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      toast.success('Çıxış edildi');
      navigate('/login');
    },
  });

  // Get current user query
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

