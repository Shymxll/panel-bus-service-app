import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { schoolService } from '@/services/school.service';
import { QUERY_KEYS } from '@/config/constants';
import type { CreateSchoolData, UpdateSchoolData } from '@/types';

// Query key - React Query cache yönetimi için
const QUERY_KEY = [QUERY_KEYS.schools];

/**
 * Tüm okulları getiren hook
 * @returns Okullar listesi ve loading/error state'leri
 */
export const useSchools = () => {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => schoolService.getAllSchools(),
  });
};

/**
 * ID'ye göre tek bir okul getiren hook
 * @param id - Okulun ID'si
 * @returns Okul detayı ve loading/error state'leri
 */
export const useSchool = (id: number) => {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => schoolService.getSchoolById(id),
    enabled: !!id, // Sadece ID varsa sorguyu çalıştır
  });
};

/**
 * Okul CRUD işlemleri için hook
 * @returns Okul oluşturma, güncelleme ve silme mutation'ları
 */
export const useSchoolMutations = () => {
  const queryClient = useQueryClient();

  // Yeni okul oluşturma mutation'ı
  const createSchool = useMutation({
    mutationFn: (data: CreateSchoolData) => schoolService.createSchool(data),
    onSuccess: () => {
      // Cache'i invalidate et - liste yeniden yüklenecek
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Məktəb uğurla yaradıldı');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Məktəb yaradılarkən xəta baş verdi');
    },
  });

  // Okul güncelleme mutation'ı
  const updateSchool = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSchoolData }) =>
      schoolService.updateSchool(id, data),
    onSuccess: () => {
      // Cache'i invalidate et
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Məktəb uğurla yeniləndi');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Məktəb yenilənərkən xəta baş verdi');
    },
  });

  // Okul silme mutation'ı
  const deleteSchool = useMutation({
    mutationFn: (id: number) => schoolService.deleteSchool(id),
    onSuccess: () => {
      // Cache'i invalidate et
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Məktəb uğurla silindi');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Məktəb silinərkən xəta baş verdi');
    },
  });

  return {
    createSchool: createSchool.mutate,
    updateSchool: updateSchool.mutate,
    deleteSchool: deleteSchool.mutate,
    isCreating: createSchool.isPending,
    isUpdating: updateSchool.isPending,
    isDeleting: deleteSchool.isPending,
  };
};

