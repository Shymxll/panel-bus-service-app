import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { studentService } from '@/services/student.service';
import type { CreateStudentData, UpdateStudentData } from '@/types';

const QUERY_KEY = ['students'];

// Şagird CRUD işlemlerini yöneten merkezi hook.
export const useStudents = () => {
  const queryClient = useQueryClient();

  // Tüm şagirdleri getir
  const {
    data: students = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => studentService.getAllStudents(),
    staleTime: 1000 * 60 * 5, // 5 dakika
  });

  // Şagird oluştur
  const createMutation = useMutation({
    mutationFn: (data: CreateStudentData) => studentService.createStudent(data),
    onSuccess: (student) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success(`${student.firstName} ${student.lastName} əlavə edildi`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Şagird əlavə edilə bilmədi');
    },
  });

  // Şagird güncelle
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateStudentData }) =>
      studentService.updateStudent(id, data),
    onSuccess: (student) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success(`${student.firstName} ${student.lastName} yeniləndi`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Şagird yenilənə bilmədi');
    },
  });

  // Şagird sil
  const deleteMutation = useMutation({
    mutationFn: (id: number) => studentService.deleteStudent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success('Şagird silindi');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Şagird silinə bilmədi');
    },
  });

  return {
    students,
    isLoading,
    error,
    refetch,
    createStudent: createMutation.mutate,
    updateStudent: updateMutation.mutate,
    deleteStudent: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

// Tek şagird getir
export const useStudent = (id: number) => {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => studentService.getStudentById(id),
    enabled: !!id,
  });
};

// QR kod ile şagird getir
export const useStudentByQrCode = (qrCode: string) => {
  return useQuery({
    queryKey: [...QUERY_KEY, 'qr', qrCode],
    queryFn: () => studentService.getStudentByQrCode(qrCode),
    enabled: !!qrCode,
  });
};

