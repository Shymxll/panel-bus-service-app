import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { routeService } from '@/services/route.service';
import { QUERY_KEYS } from '@/config/constants';
import type { CreateRouteData, UpdateRouteData, CreateRouteStopData, UpdateRouteStopData } from '@/types';

export const useRoutes = () => {
  const queryClient = useQueryClient();

  // Tüm marşrutları getir
  const {
    data: routes = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEYS.routes.all,
    queryFn: () => routeService.getAll(),
    staleTime: 1000 * 60 * 5, // 5 dakika
  });

  // Marşrut oluştur
  const createMutation = useMutation({
    mutationFn: (data: CreateRouteData) => routeService.create(data),
    onSuccess: (route) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.routes.all });
      toast.success(`${route.name} marşrutu əlavə edildi`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Marşrut əlavə edilə bilmədi');
    },
  });

  // Marşrut güncelle
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateRouteData }) =>
      routeService.update(id, data),
    onSuccess: (route) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.routes.all });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.routes.detail(route.id)] });
      toast.success(`${route.name} marşrutu yeniləndi`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Marşrut yenilənə bilmədi');
    },
  });

  // Marşrut sil
  const deleteMutation = useMutation({
    mutationFn: (id: number) => routeService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.routes.all });
      toast.success('Marşrut silindi');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Marşrut silinə bilmədi');
    },
  });

  // Route Stops Management - use useRouteStops hook instead

  const addRouteStopMutation = useMutation({
    mutationFn: (data: CreateRouteStopData) => routeService.addRouteStop(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.routes.all, variables.routeId, 'stops'] });
      toast.success('Dayanacaq əlavə edildi');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Dayanacaq əlavə edilə bilmədi');
    },
  });

  const updateRouteStopMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateRouteStopData }) =>
      routeService.updateRouteStop(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.routes.all });
      toast.success('Dayanacaq yeniləndi');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Dayanacaq yenilənə bilmədi');
    },
  });

  const deleteRouteStopMutation = useMutation({
    mutationFn: (routeStopId: number) => routeService.deleteRouteStop(routeStopId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.routes.all });
      toast.success('Dayanacaq silindi');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Dayanacaq silinə bilmədi');
    },
  });

  return {
    routes,
    isLoading,
    error,
    refetch,
    createRoute: createMutation.mutate,
    updateRoute: updateMutation.mutate,
    deleteRoute: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    // Route Stops
    addRouteStop: addRouteStopMutation.mutate,
    updateRouteStop: updateRouteStopMutation.mutate,
    deleteRouteStop: deleteRouteStopMutation.mutate,
    isAddingStop: addRouteStopMutation.isPending,
    isUpdatingStop: updateRouteStopMutation.isPending,
    isDeletingStop: deleteRouteStopMutation.isPending,
  };
};

// Tek marşrut getir
export const useRoute = (id: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.routes.detail(id),
    queryFn: () => routeService.getById(id),
    enabled: !!id,
  });
};

// Bus'a göre marşrutlar getir
export const useRoutesByBusId = (busId: number) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.routes.all, 'bus', busId],
    queryFn: () => routeService.getByBusId(busId),
    enabled: !!busId,
  });
};

