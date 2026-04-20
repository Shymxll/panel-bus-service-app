import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { busService } from '@/services/bus.service';
import { QUERY_KEYS } from '@/config/constants';
import type { CreateBusData } from '@/types';

// Avtobus listesi ve CRUD islemlerini yoneten hook.
export const useBuses = () => {
  const queryClient = useQueryClient();

  // Tum avtobuslari getir
  const {
    data: buses = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEYS.buses.all,
    queryFn: () => busService.getAll(),
  });

  // Avtobus olusturma mutasyonu
  const createMutation = useMutation({
    mutationFn: (data: CreateBusData) => busService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.buses.all });
      toast.success('Otobüs başarıyla eklendi');
    },
    onError: () => {
      toast.error('Otobüs eklenirken hata oluştu');
    },
  });

  // Avtobus guncelleme mutasyonu
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateBusData> }) =>
      busService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.buses.all });
      toast.success('Otobüs bilgileri güncellendi');
    },
    onError: () => {
      toast.error('Güncelleme sırasında hata oluştu');
    },
  });

  // Avtobus silme mutasyonu
  const deleteMutation = useMutation({
    mutationFn: (id: number) => busService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.buses.all });
      toast.success('Otobüs silindi');
    },
    onError: () => {
      toast.error('Silme sırasında hata oluştu');
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

// Tek avtobusu ID ile getir
export const useBus = (id: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.buses.detail(id),
    queryFn: () => busService.getById(id),
    enabled: !!id,
  });
};

