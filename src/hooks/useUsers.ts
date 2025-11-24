import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { userService } from '@/services/user.service';
import { QUERY_KEYS } from '@/config/constants';
import type { User } from '@/types';

export const useUsers = () => {
  const queryClient = useQueryClient();

  // Get all users
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: QUERY_KEYS.users.all,
    queryFn: () => userService.getAll(),
  });

  // Get drivers only
  const drivers = users.filter((user) => user.role === 'driver');

  // Update user mutation
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

  // Delete user mutation
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
    updateUser: updateMutation.mutate,
    deleteUser: deleteMutation.mutate,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

// Get single user by ID
export const useUser = (id: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.users.detail(id),
    queryFn: () => userService.getById(id),
    enabled: !!id,
  });
};

