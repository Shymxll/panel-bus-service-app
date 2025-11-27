import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { tripService } from '@/services/trip.service';
import { QUERY_KEYS } from '@/config/constants';
import type { CreateTripData, UpdateTripData, Trip } from '@/types';

// Sefere ait sorgular ve mutasyonlar icin hook.
export const useTrips = () => {
  const queryClient = useQueryClient();

  // Tüm səfərləri getir
  const {
    data: trips = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Trip[]>({
    queryKey: QUERY_KEYS.trips.all,
    queryFn: async () => {
      console.log('🔄 useTrips - Fetching trips...');
      try {
        const data = await tripService.getAll();
        console.log('✅ useTrips - Fetched trips:', data);
        return data;
      } catch (err) {
        console.error('❌ useTrips - Error fetching trips:', err);
        throw err;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 dakika
    retry: 2, // 2 dəfə yenidən cəhd et
  });

  // Error handling useEffect ilə
  useEffect(() => {
    if (error) {
      console.error('❌ useTrips - Query error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Səfərlər yüklənə bilmədi';
      toast.error(`Səfərlər yüklənə bilmədi: ${errorMessage}`);
    }
  }, [error]);

  // Səfər oluştur
  const createMutation = useMutation({
    mutationFn: (data: CreateTripData) => tripService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.trips.all });
      toast.success('Səfər əlavə edildi');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Səfər əlavə edilə bilmədi');
    },
  });

  // Səfər güncelle
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTripData }) =>
      tripService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.trips.all });
      toast.success('Səfər yeniləndi');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Səfər yenilənə bilmədi');
    },
  });

  // Səfər sil
  const deleteMutation = useMutation({
    mutationFn: (id: number) => tripService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.trips.all });
      toast.success('Səfər silindi');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Səfər silinə bilmədi');
    },
  });

  return {
    trips,
    isLoading,
    error,
    refetch,
    createTrip: createMutation.mutate,
    updateTrip: updateMutation.mutate,
    deleteTrip: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

// Marşruta göre səfərlər getir
export const useTripsByRoute = (routeId: number) => {
  return useQuery<Trip[]>({
    queryKey: QUERY_KEYS.trips.byRoute(routeId),
    queryFn: () => tripService.getByRouteId(routeId),
    enabled: !!routeId,
    staleTime: 1000 * 60 * 5,
  });
};

// Tek səfər getir
export const useTrip = (id: number) => {
  return useQuery<Trip>({
    queryKey: QUERY_KEYS.trips.detail(id),
    queryFn: () => tripService.getById(id),
    enabled: !!id,
  });
};

