import { useQuery } from '@tanstack/react-query';
import { boardingRecordService } from '@/services/boardingRecord.service';
import { QUERY_KEYS } from '@/config/constants';

export const useBoardingRecords = () => {
  const {
    data: boardingRecords = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEYS.boardingRecords.all,
    queryFn: () => boardingRecordService.getAll(),
    staleTime: 1000 * 60 * 5, // 5 dakika
  });

  return {
    boardingRecords,
    isLoading,
    error,
    refetch,
  };
};

// Tarihe göre minmə qeydləri getir
export const useBoardingRecordsByDate = (date: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.boardingRecords.byDate(date),
    queryFn: () => boardingRecordService.getByDate(date),
    enabled: !!date,
    staleTime: 1000 * 60 * 5,
  });
};

// Şagirdə göre minmə qeydləri getir
export const useBoardingRecordsByStudent = (studentId: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.boardingRecords.byStudent(studentId),
    queryFn: () => boardingRecordService.getByStudentId(studentId),
    enabled: !!studentId,
    staleTime: 1000 * 60 * 5,
  });
};

