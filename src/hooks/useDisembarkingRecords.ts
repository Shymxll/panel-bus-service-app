import { useQuery } from '@tanstack/react-query';
import { disembarkingRecordService } from '@/services/disembarkingRecord.service';
import { QUERY_KEYS } from '@/config/constants';

// Dusme kayitlarini sorgulayan hook.
export const useDisembarkingRecords = () => {
  const {
    data: disembarkingRecords = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEYS.disembarkingRecords.all,
    queryFn: () => disembarkingRecordService.getAll(),
    staleTime: 1000 * 60 * 5, // 5 dakika
  });

  return {
    disembarkingRecords,
    isLoading,
    error,
    refetch,
  };
};

// Tarihe göre düşmə qeydləri getir
export const useDisembarkingRecordsByDate = (date: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.disembarkingRecords.byDate(date),
    queryFn: () => disembarkingRecordService.getByDate(date),
    enabled: !!date,
    staleTime: 1000 * 60 * 5,
  });
};

// Şagirdə göre düşmə qeydləri getir
export const useDisembarkingRecordsByStudent = (studentId: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.disembarkingRecords.byStudent(studentId),
    queryFn: () => disembarkingRecordService.getByStudentId(studentId),
    enabled: !!studentId,
    staleTime: 1000 * 60 * 5,
  });
};

