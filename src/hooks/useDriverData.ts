import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { boardingRecordService } from '@/services/boardingRecord.service';
import { disembarkingRecordService } from '@/services/disembarkingRecord.service';
import { dailyPlanService } from '@/services/dailyPlan.service';
import { studentService } from '@/services/student.service';
import { busService } from '@/services/bus.service';
import { tripService } from '@/services/trip.service';
import { useAuthStore } from '@/store/auth-store';
import { QUERY_KEYS } from '@/config/constants';
import type {
  CreateBoardingRecordData,
  CreateDisembarkingRecordData,
  Student,
} from '@/types';

/**
 * Sürücü için özel hook - tüm sürücü işlemlerini yönetir
 * Biniş/iniş kayıtları, günlük planlar, öğrenci araması vb.
 */
export const useDriverData = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  
  // Bugünün tarihi (YYYY-MM-DD formatında)
  const today: string = new Date().toISOString().split('T')[0]!;

  // ============ QUERIES ============

  // Bugünün biniş kayıtları
  const {
    data: todayBoardingRecords = [],
    isLoading: isLoadingBoarding,
    refetch: refetchBoarding,
  } = useQuery({
    queryKey: ['boarding-records', 'date', today],
    queryFn: () => boardingRecordService.getByDate(today),
    staleTime: 1000 * 30, // 30 saniye
  });

  // Bugünün iniş kayıtları
  const {
    data: todayDisembarkingRecords = [],
    isLoading: isLoadingDisembarking,
    refetch: refetchDisembarking,
  } = useQuery({
    queryKey: ['disembarking-records', 'date', today],
    queryFn: () => disembarkingRecordService.getByDate(today),
    staleTime: 1000 * 30, // 30 saniye
  });

  // Bugünün planları
  const {
    data: todayPlans = [],
    isLoading: isLoadingPlans,
  } = useQuery({
    queryKey: ['daily-plans', 'date', today],
    queryFn: () => dailyPlanService.getByDate(today),
    staleTime: 1000 * 60, // 1 dakika
  });

  // Sürücünün otobüsleri
  const {
    data: buses = [],
    isLoading: isLoadingBuses,
  } = useQuery({
    queryKey: QUERY_KEYS.buses.all,
    queryFn: () => busService.getAll(),
    staleTime: 1000 * 60 * 5, // 5 dakika
  });

  // Tüm seferler
  const {
    data: trips = [],
    isLoading: isLoadingTrips,
  } = useQuery({
    queryKey: ['trips'],
    queryFn: () => tripService.getAll(),
    staleTime: 1000 * 60 * 5, // 5 dakika
  });

  // Sürücünün otobüsü (driverId'ye göre filtrele)
  const myBus = buses.find((bus) => bus.driverId === user?.id);

  // ============ MUTATIONS ============

  // QR kod ile öğrenci ara
  const searchStudentByQrMutation = useMutation({
    mutationFn: (qrCode: string) => studentService.getStudentByQrCode(qrCode),
    onError: (error: Error) => {
      toast.error(error.message || 'Şagird tapılmadı');
    },
  });

  // Biniş kaydı oluştur
  const createBoardingMutation = useMutation({
    mutationFn: (data: CreateBoardingRecordData) => boardingRecordService.create(data),
    onSuccess: () => {
      toast.success('Minmə qeydi uğurla yaradıldı!');
      queryClient.invalidateQueries({ queryKey: ['boarding-records'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Minmə qeydi yaradıla bilmədi');
    },
  });

  // İniş kaydı oluştur
  const createDisembarkingMutation = useMutation({
    mutationFn: (data: CreateDisembarkingRecordData) => disembarkingRecordService.create(data),
    onSuccess: () => {
      toast.success('Düşmə qeydi uğurla yaradıldı!');
      queryClient.invalidateQueries({ queryKey: ['disembarking-records'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Düşmə qeydi yaradıla bilmədi');
    },
  });

  // ============ HELPER FUNCTIONS ============

  /**
   * QR kod ile öğrenci ara ve biniş kaydı oluştur
   */
  const handleBoardingByQr = async (qrCode: string, tripId: number, busId: number) => {
    try {
      const student = await searchStudentByQrMutation.mutateAsync(qrCode);
      
      if (!student) {
        throw new Error('Şagird tapılmadı');
      }

      // Bugün bu öğrenci için plan var mı kontrol et
      const studentPlan = todayPlans.find(
        (plan) => plan.studentId === student.id && plan.isBoarding
      );

      // Biniş kaydı oluştur
      await createBoardingMutation.mutateAsync({
        studentId: student.id,
        tripId,
        busId,
        recordDate: today,
        driverId: user?.id || 0,
        wasPlanned: !!studentPlan,
        dailyPlanId: studentPlan?.id,
      });

      return student;
    } catch (error) {
      throw error;
    }
  };

  /**
   * QR kod ile öğrenci ara ve iniş kaydı oluştur
   */
  const handleDisembarkingByQr = async (qrCode: string, tripId: number, busId: number) => {
    try {
      const student = await searchStudentByQrMutation.mutateAsync(qrCode);
      
      if (!student) {
        throw new Error('Şagird tapılmadı');
      }

      // Bugün bu öğrenci için plan var mı kontrol et
      const studentPlan = todayPlans.find(
        (plan) => plan.studentId === student.id && !plan.isBoarding
      );

      // İniş kaydı oluştur
      await createDisembarkingMutation.mutateAsync({
        studentId: student.id,
        tripId,
        busId,
        recordDate: today,
        driverId: user?.id || 0,
        wasPlanned: !!studentPlan,
        dailyPlanId: studentPlan?.id,
      });

      return student;
    } catch (error) {
      throw error;
    }
  };

  // ============ COMPUTED VALUES ============

  // Bugün binen öğrenci sayısı
  const todayBoardedCount = todayBoardingRecords.length;

  // Bugün inen öğrenci sayısı
  const todayDisembarkedCount = todayDisembarkingRecords.length;

  // Bugün planlanmış toplam öğrenci sayısı
  const todayPlannedCount = todayPlans.length;

  // Biniş bekleyen öğrenciler (planlı ama henüz binmemiş)
  const pendingBoardingStudents = todayPlans
    .filter((plan) => plan.isBoarding)
    .filter((plan) => !todayBoardingRecords.some((record) => record.studentId === plan.studentId));

  // İniş bekleyen öğrenciler (binmiş ama henüz inmemiş)
  const pendingDisembarkingStudents = todayBoardingRecords
    .filter((boardingRecord) => 
      !todayDisembarkingRecords.some((disRecord) => disRecord.studentId === boardingRecord.studentId)
    );

  return {
    // Data
    todayBoardingRecords,
    todayDisembarkingRecords,
    todayPlans,
    buses,
    trips,
    myBus,
    
    // Computed
    todayBoardedCount,
    todayDisembarkedCount,
    todayPlannedCount,
    pendingBoardingStudents,
    pendingDisembarkingStudents,
    
    // Loading states
    isLoading: isLoadingBoarding || isLoadingDisembarking || isLoadingPlans || isLoadingBuses || isLoadingTrips,
    isLoadingBoarding,
    isLoadingDisembarking,
    isLoadingPlans,
    isLoadingBuses,
    isLoadingTrips,
    
    // Mutations
    searchStudentByQr: searchStudentByQrMutation.mutateAsync,
    createBoarding: createBoardingMutation.mutateAsync,
    createDisembarking: createDisembarkingMutation.mutateAsync,
    isSearchingStudent: searchStudentByQrMutation.isPending,
    isCreatingBoarding: createBoardingMutation.isPending,
    isCreatingDisembarking: createDisembarkingMutation.isPending,
    
    // Helper functions
    handleBoardingByQr,
    handleDisembarkingByQr,
    
    // Refetch functions
    refetchBoarding,
    refetchDisembarking,
  };
};

