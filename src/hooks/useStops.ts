import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { stopService } from '@/services/stop.service';
import type { CreateStopData, UpdateStopData } from '@/types';

const QUERY_KEY = ['stops'];

export const useStops = () => {
  const queryClient = useQueryClient();

  // Tüm dayanacaqları getir
  const {
    data: stops = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => stopService.getAll(),
    staleTime: 1000 * 60 * 5, // 5 dakika
  });

  // Dayanacaq oluştur
  const createMutation = useMutation({
    mutationFn: (data: CreateStopData) => stopService.create(data),
    onSuccess: (stop) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success(`${stop.name} dayanacağı əlavə edildi`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Dayanacaq əlavə edilə bilmədi');
    },
  });

  // Dayanacaq güncelle
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateStopData }) =>
      stopService.update(id, data),
    onSuccess: (stop) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success(`${stop.name} dayanacağı yeniləndi`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Dayanacaq yenilənə bilmədi');
    },
  });

  // Dayanacaq sil
  const deleteMutation = useMutation({
    mutationFn: (id: number) => stopService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Dayanacaq silindi');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Dayanacaq silinə bilmədi');
    },
  });

  return {
    stops,
    isLoading,
    error,
    refetch,
    createStop: createMutation.mutate,
    updateStop: updateMutation.mutate,
    deleteStop: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

// Tek dayanacaq getir
export const useStop = (id: number) => {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => stopService.getById(id),
    enabled: !!id,
  });
};

