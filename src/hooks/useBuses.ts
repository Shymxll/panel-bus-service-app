import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { busService } from '@/services/bus.service';
import { QUERY_KEYS } from '@/config/constants';
import type { CreateBusData } from '@/types';

export const useBuses = () => {
  const queryClient = useQueryClient();

  // Get all buses
  const {
    data: buses = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEYS.buses.all,
    queryFn: () => busService.getAll(),
  });

  // Create bus mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateBusData) => busService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.buses.all });
      toast.success('Avtobus uğurla əlavə edildi');
    },
    onError: () => {
      toast.error('Avtobus əlavə edilərkən xəta baş verdi');
    },
  });

  // Update bus mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateBusData> }) =>
      busService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.buses.all });
      toast.success('Avtobus məlumatları yeniləndi');
    },
    onError: () => {
      toast.error('Yeniləmə zamanı xəta baş verdi');
    },
  });

  // Delete bus mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => busService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.buses.all });
      toast.success('Avtobus silindi');
    },
    onError: () => {
      toast.error('Silinmə zamanı xəta baş verdi');
    },
  });

  return {
    buses,
    isLoading,
    error,
    refetch,
    createBus: createMutation.mutate,
    updateBus: updateMutation.mutate,
    deleteBus: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

// Get single bus by ID
export const useBus = (id: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.buses.detail(id),
    queryFn: () => busService.getById(id),
    enabled: !!id,
  });
};

