import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { dailyPlanService } from '@/services/dailyPlan.service';
import { QUERY_KEYS } from '@/config/constants';
import type { CreateDailyPlanData, UpdateDailyPlanData } from '@/types';

// Gunluk plan CRUD akislari icin hook.
export const useDailyPlans = () => {
  const queryClient = useQueryClient();

  // Tüm planları getir
  const {
    data: dailyPlans = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEYS.dailyPlans.all,
    queryFn: () => dailyPlanService.getAll(),
    staleTime: 1000 * 60 * 5, // 5 dakika
  });

  // Plan oluştur
  const createMutation = useMutation({
    mutationFn: (data: CreateDailyPlanData) => dailyPlanService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dailyPlans.all });
      toast.success('Plan əlavə edildi');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Plan əlavə edilə bilmədi');
    },
  });

  // Plan güncelle
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateDailyPlanData }) =>
      dailyPlanService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dailyPlans.all });
      toast.success('Plan yeniləndi');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Plan yenilənə bilmədi');
    },
  });

  // Plan sil
  const deleteMutation = useMutation({
    mutationFn: (id: number) => dailyPlanService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dailyPlans.all });
      toast.success('Plan silindi');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Plan silinə bilmədi');
    },
  });

  return {
    dailyPlans,
    isLoading,
    error,
    refetch,
    createDailyPlan: createMutation.mutate,
    updateDailyPlan: updateMutation.mutate,
    deleteDailyPlan: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

// Tarihe göre planlar getir
export const useDailyPlansByDate = (date: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.dailyPlans.byDate(date),
    queryFn: () => dailyPlanService.getByDate(date),
    enabled: !!date,
    staleTime: 1000 * 60 * 5,
  });
};

// Öğrenciye göre planlar getir
export const useDailyPlansByStudent = (studentId: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.dailyPlans.byStudent(studentId),
    queryFn: () => dailyPlanService.getByStudentId(studentId),
    enabled: !!studentId,
    staleTime: 1000 * 60 * 5,
  });
};

// Tek plan getir
export const useDailyPlan = (id: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.dailyPlans.detail(id),
    queryFn: () => dailyPlanService.getById(id),
    enabled: !!id,
  });
};

