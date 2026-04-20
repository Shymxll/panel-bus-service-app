import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useDailyPlans } from '@/hooks/useDailyPlans';
import { useStudents } from '@/hooks/useStudents';
import { useTrips } from '@/hooks/useTrips';
import { useBuses } from '@/hooks/useBuses';
import { useRoutes } from '@/hooks/useRoutes';
import { useStops } from '@/hooks/useStops';
import { useUsers } from '@/hooks/useUsers';
import type { DailyPlan } from '@/types';

// Günlük plan kayıtları için doğrulama şeması.
const dailyPlanSchema = z.object({
  planDate: z.string().min(1, 'Tarih gereklidir'),
  studentId: z.number().min(1, 'Öğrenci seçilmelidir'),
  tripId: z.number().min(1, 'Sefer seçilmelidir'),
  busId: z.number().min(1, 'Otobüs seçilmelidir'),
  stopId: z.number().optional(),
  isBoarding: z.boolean().default(true),
  notes: z.string().optional(),
});

type DailyPlanFormData = z.infer<typeof dailyPlanSchema>;

interface DailyPlanFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  dailyPlan: DailyPlan | null;
  defaultDate?: string; // Modal açılırken varsayılan tarih
}

// Şagirdlerin günlük minme/düşme planlarını oluşturan modal form.
export const DailyPlanFormModal = ({
  isOpen,
  onClose,
  dailyPlan,
  defaultDate,
}: DailyPlanFormModalProps) => {
  const { createDailyPlan, updateDailyPlan, isCreating, isUpdating } = useDailyPlans();
  const { students } = useStudents();
  const { trips = [], isLoading: isTripsLoading, error: tripsError, refetch: refetchTrips } = useTrips();
  const { buses } = useBuses();
  const { routes } = useRoutes();
  const { stops } = useStops();
  const { users } = useUsers();
  const isEditing = !!dailyPlan;

  // Sürücü bilgilerini ID'ye göre eşleştirmek için map oluştur
  const driverMap = new Map(users.map(user => [user.id, user]));

  // Modal açıldığında en güncel sefer listesini yeniden çek.
  useEffect(() => {
    if (isOpen) {
      console.log('🔄 DailyPlanFormModal - Modal açıldı, trips-i yeniləyirəm...');
      refetchTrips();
    }
  }, [isOpen, refetchTrips]);

  // Debug amaçlı sefer verisini konsola dök (sorunları izlemek için).
  useEffect(() => {
    if (isOpen) {
      console.log('🔍 DailyPlanFormModal - Trips data:', {
        trips,
        tripsCount: trips.length || 0,
        isTripsLoading,
        tripsError,
      });
    }
  }, [isOpen, trips, isTripsLoading, tripsError]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DailyPlanFormData>({
    resolver: zodResolver(dailyPlanSchema),
    defaultValues: {
      planDate: defaultDate || new Date().toISOString().split('T')[0],
      studentId: 0,
      tripId: 0,
      busId: 0,
      stopId: undefined,
      isBoarding: true,
      notes: '',
    },
  });

  const selectedTripId = watch('tripId');
  const selectedTrip = selectedTripId ? trips.find((t) => t.id === selectedTripId) : null;
  const selectedRouteId = selectedTrip?.routeId;
  const selectedRoute = selectedRouteId ? routes.find(r => r.id === selectedRouteId) : null;

  // Seçilen sefere göre bus alanını otomatik doldur.
  useEffect(() => {
    if (selectedRoute?.busId && selectedTripId && !dailyPlan) {
      // Yalnız yeni plan yaradarkən avtomatik seç (redaktə zamanı deyil)
      const currentBusId = watch('busId');
      if (!currentBusId || currentBusId === 0) {
        // Avtobus hələ seçilməyibsə, avtomatik seç
        setValue('busId', selectedRoute.busId);
        console.log('🚌 Avtomatik avtobus seçildi:', selectedRoute.busId);
      }
    }
  }, [selectedRoute?.busId, selectedTripId, dailyPlan, setValue, watch]);

  // Route bilgisi varsa durağa göre filtrelenmiş liste hazırla (şimdilik tüm duraklar).
  const availableStops = selectedRouteId
    ? stops.filter(stop => {
        // Route'un stops'larını kontrol et (basitleştirilmiş - gerçekte route.stops kontrol edilmeli)
        return true; // Şimdilik tüm stops'ları göster
      })
    : stops;

  useEffect(() => {
    // Modal her açıldığında formu seçilen kayda göre başa sar.
    if (isOpen) {
      if (dailyPlan) {
        reset({
          planDate: dailyPlan.planDate,
          studentId: dailyPlan.studentId,
          tripId: dailyPlan.tripId,
          busId: dailyPlan.busId,
          stopId: dailyPlan.stopId || undefined,
          isBoarding: dailyPlan.isBoarding,
          notes: dailyPlan.notes || '',
        });
      } else {
        reset({
          planDate: defaultDate || new Date().toISOString().split('T')[0],
          studentId: 0,
          tripId: 0,
          busId: 0,
          stopId: undefined,
          isBoarding: true,
          notes: '',
        });
      }
    }
  }, [isOpen, dailyPlan, defaultDate, reset]);

  const onSubmit = (data: DailyPlanFormData) => {
    // Güncelleme ve oluşturma senaryolarını tek noktada ele al.
    if (dailyPlan) {
      updateDailyPlan(
        {
          id: dailyPlan.id,
          data: {
            planDate: data.planDate,
            studentId: data.studentId,
            tripId: data.tripId,
            busId: data.busId,
            stopId: data.stopId,
            isBoarding: data.isBoarding,
            notes: data.notes,
          },
        },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    } else {
      createDailyPlan(
        {
          planDate: data.planDate,
          studentId: data.studentId,
          tripId: data.tripId,
          busId: data.busId,
          stopId: data.stopId,
          isBoarding: data.isBoarding,
          notes: data.notes,
        },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    }
  };

  if (!isOpen) return null; // Modal kapalıyken DOM'a render etme.

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Arka plan tıklamasıyla modalı kapat */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal kapsayıcısı */}
      <div className="relative w-full max-w-2xl mx-4 bg-white rounded-xl shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Başlık */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-secondary-200">
          <h2 className="text-xl font-semibold text-secondary-900">
            {isEditing ? 'Planı Düzenle' : 'Yeni Plan Ekle'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-secondary-100 transition-colors"
          >
            <X className="h-5 w-5 text-secondary-500" />
          </button>
        </div>

        {/* Form gövdesi */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex-1 overflow-y-auto">
          <div className="space-y-4">
            {/* Plan tarihi */}
            <Input
              label="Plan Tarihi"
              type="date"
              {...register('planDate')}
              error={errors.planDate?.message}
            />

            {/* Öğrenci seçimi */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Öğrenci <span className="text-red-500">*</span>
              </label>
              <select
                {...register('studentId', { valueAsNumber: true })}
                className={`w-full rounded-lg border ${
                  errors.studentId ? 'border-red-500' : 'border-secondary-300'
                } bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500`}
              >
                <option value={0}>Öğrenci seçin</option>
                {students
                  .filter(s => s.isActive)
                  .map(student => (
                    <option key={student.id} value={student.id}>
                      {student.firstName} {student.lastName} - {student.school} ({student.grade})
                    </option>
                  ))}
              </select>
              {errors.studentId && (
                <p className="mt-1 text-sm text-red-500">{errors.studentId.message}</p>
              )}
            </div>

            {/* Sefere göre rota seçimi */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Sefer <span className="text-red-500">*</span>
              </label>
              <select
                {...register('tripId', { valueAsNumber: true })}
                disabled={isTripsLoading}
                className={`w-full rounded-lg border ${
                  errors.tripId ? 'border-red-500' : 'border-secondary-300'
                } bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:bg-secondary-50 disabled:cursor-not-allowed`}
              >
                <option value={0}>
                  {isTripsLoading
                    ? 'Yükleniyor...'
                    : tripsError
                      ? 'Hata: Seferler yüklenemedi'
                      : trips.length === 0
                        ? 'Sefer bulunamadı (önce sefer oluşturun)'
                        : 'Sefer seçin'}
                </option>
                {trips.map((trip) => {
                  const route = routes.find(r => r.id === trip.routeId);
                  return (
                    <option key={trip.id} value={trip.id}>
                      {route?.name || `Güzergah #${trip.routeId}`} - {trip.departureTime}
                    </option>
                  );
                })}
              </select>
              {errors.tripId && (
                <p className="mt-1 text-sm text-red-500">{errors.tripId.message}</p>
              )}
              {tripsError && (
                <p className="mt-1 text-sm text-red-500">
                  ⚠️ Seferler yüklenemedi: {tripsError instanceof Error ? tripsError.message : 'Bilinmeyen hata'}
                </p>
              )}
              {!isTripsLoading && !tripsError && trips.length === 0 && (
                <p className="mt-1 text-sm text-amber-600">
                  ℹ️ Hiç sefer bulunamadı. Önce güzergah için sefer oluşturmalısınız.
                </p>
              )}
            </div>

            {/* Otobus seçimi */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Otobüs <span className="text-red-500">*</span>
              </label>
              <select
                {...register('busId', { valueAsNumber: true })}
                className={`w-full rounded-lg border ${
                  errors.busId ? 'border-red-500' : 'border-secondary-300'
                } bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500`}
              >
                <option value={0}>Otobüs seçin</option>
                {buses
                  .filter(b => b.isActive)
                  .map(bus => {
                    // Sürücü bilgisini driverId'ye göre bul
                    const driver = bus.driverId ? driverMap.get(bus.driverId) : null;
                    const driverName = driver?.name || 'Sürücü yok';
                    return (
                      <option key={bus.id} value={bus.id}>
                        {bus.plateNumber} - {driverName}
                      </option>
                    );
                  })}
              </select>
              {errors.busId && (
                <p className="mt-1 text-sm text-red-500">{errors.busId.message}</p>
              )}
            </div>

            {/* Durak bilgisi */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Durak <span className="text-secondary-400 text-xs">(isteğe bağlı)</span>
              </label>
              <select
                {...register('stopId', {
                  setValueAs: (v) => {
                    if (v === '' || v === '0' || v === 0) return undefined;
                    const num = Number(v);
                    return isNaN(num) ? undefined : num;
                  },
                })}
                className="w-full rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">Durak seçin (isteğe bağlı)</option>
                {availableStops
                  .filter(s => s.isActive)
                  .map(stop => (
                    <option key={stop.id} value={stop.id}>
                      {stop.name} {stop.address ? `- ${stop.address}` : ''}
                    </option>
                  ))}
              </select>
            </div>

            {/* Minme/dusme kutusu */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('isBoarding')}
                  className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-secondary-700">
                  Biniş planı (işaretlenmezse iniş planı)
                </span>
              </label>
            </div>

            {/* Ilave notlar */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Notlar
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                className="w-full rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="Ek notlar..."
              />
            </div>
          </div>

          {/* Alt aksiyonlar */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-secondary-200">
            <Button variant="secondary" onClick={onClose} type="button">
              İptal
            </Button>
            <Button
              type="submit"
              isLoading={isCreating || isUpdating}
              disabled={isCreating || isUpdating}
            >
              {isEditing ? 'Güncelle' : 'Ekle'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

