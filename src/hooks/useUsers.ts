import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { userService } from '@/services/user.service';
import { authService } from '@/services/auth.service';
import { QUERY_KEYS } from '@/config/constants';
import type { User, RegisterData } from '@/types';

// TUM kullanici CRUD islemlerini yoneten hook.
export const useUsers = () => {
  const queryClient = useQueryClient();

  // Tum kullanicilari getir
  const {
    data: users = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEYS.users.all,
    queryFn: () => userService.getAll(),
  });

  // Sadece suruculeri filtrele
  const drivers = users.filter((user) => user.role === 'driver');

  // Profil guncelleme mutasyonu
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<User> }) =>
      userService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.all });
      toast.success('İstifadəçi məlumatları yeniləndi');
    },
    onError: () => {
      toast.error('Yeniləmə zamanı xəta baş verdi');
    },
  });

  // Yeni sofor olusturmak icin auth servisinden yararlan.
  const createDriverMutation = useMutation({
    mutationFn: (data: RegisterData) =>
      authService.createDriver({
        ...data,
        role: 'driver',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.all });
      toast.success('Sürücü əlavə edildi');
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Sürücü əlavə edilərkən xəta baş verdi';
      toast.error(message);
    },
  });

  // Kullanici silme mutasyonu
  const deleteMutation = useMutation({
    mutationFn: (id: number) => userService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.all });
      toast.success('İstifadəçi silindi');
    },
    onError: () => {
      toast.error('Silinmə zamanı xəta baş verdi');
    },
  });

  return {
    users,
    drivers,
    isLoading,
    error,
    refetch,
    updateUser: updateMutation.mutate,
    deleteUser: deleteMutation.mutate,
    createDriver: createDriverMutation.mutate,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isCreatingDriver: createDriverMutation.isPending,
  };
};

// ID'ye gore tek kullanici sorgusu
export const useUser = (id: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.users.detail(id),
    queryFn: () => userService.getById(id),
    enabled: !!id,
  });
};

