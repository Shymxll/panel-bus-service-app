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
import type { DailyPlan } from '@/types';

const dailyPlanSchema = z.object({
  planDate: z.string().min(1, 'Tarix tələb olunur'),
  studentId: z.number().min(1, 'Şagird seçilməlidir'),
  tripId: z.number().min(1, 'Səfər seçilməlidir'),
  busId: z.number().min(1, 'Avtobus seçilməlidir'),
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

export const DailyPlanFormModal = ({
  isOpen,
  onClose,
  dailyPlan,
  defaultDate,
}: DailyPlanFormModalProps) => {
  const { createDailyPlan, updateDailyPlan, isCreating, isUpdating } = useDailyPlans();
  const { students } = useStudents();
  const { trips } = useTrips();
  const { buses } = useBuses();
  const { routes } = useRoutes();
  const { stops } = useStops();
  const isEditing = !!dailyPlan;

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

  const selectedRouteId = watch('tripId') 
    ? trips.find(t => t.id === watch('tripId'))?.routeId 
    : undefined;

  // Seçilen route'a göre stops'ları filtrele
  const availableStops = selectedRouteId
    ? stops.filter(stop => {
        // Route'un stops'larını kontrol et (basitleştirilmiş - gerçekte route.stops kontrol edilmeli)
        return true; // Şimdilik tüm stops'ları göster
      })
    : stops;

  useEffect(() => {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 bg-white rounded-xl shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-secondary-200">
          <h2 className="text-xl font-semibold text-secondary-900">
            {isEditing ? 'Planı Redaktə Et' : 'Yeni Plan Əlavə Et'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-secondary-100 transition-colors"
          >
            <X className="h-5 w-5 text-secondary-500" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex-1 overflow-y-auto">
          <div className="space-y-4">
            {/* Plan Tarixi */}
            <Input
              label="Plan Tarixi"
              type="date"
              {...register('planDate')}
              error={errors.planDate?.message}
            />

            {/* Şagird */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Şagird <span className="text-red-500">*</span>
              </label>
              <select
                {...register('studentId', { valueAsNumber: true })}
                className={`w-full rounded-lg border ${
                  errors.studentId ? 'border-red-500' : 'border-secondary-300'
                } bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500`}
              >
                <option value={0}>Şagird seçin</option>
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

            {/* Səfər */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Səfər <span className="text-red-500">*</span>
              </label>
              <select
                {...register('tripId', { valueAsNumber: true })}
                className={`w-full rounded-lg border ${
                  errors.tripId ? 'border-red-500' : 'border-secondary-300'
                } bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500`}
              >
                <option value={0}>Səfər seçin</option>
                {(trips || []).map(trip => {
                  const route = routes.find(r => r.id === trip.routeId);
                  return (
                    <option key={trip.id} value={trip.id}>
                      {route?.name || `Marşrut #${trip.routeId}`} - {trip.departureTime}
                    </option>
                  );
                })}
              </select>
              {errors.tripId && (
                <p className="mt-1 text-sm text-red-500">{errors.tripId.message}</p>
              )}
            </div>

            {/* Avtobus */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Avtobus <span className="text-red-500">*</span>
              </label>
              <select
                {...register('busId', { valueAsNumber: true })}
                className={`w-full rounded-lg border ${
                  errors.busId ? 'border-red-500' : 'border-secondary-300'
                } bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500`}
              >
                <option value={0}>Avtobus seçin</option>
                {buses
                  .filter(b => b.isActive)
                  .map(bus => (
                    <option key={bus.id} value={bus.id}>
                      {bus.plateNumber} - {bus.driver?.name || 'Sürücü yoxdur'}
                    </option>
                  ))}
              </select>
              {errors.busId && (
                <p className="mt-1 text-sm text-red-500">{errors.busId.message}</p>
              )}
            </div>

            {/* Dayanacaq */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Dayanacaq
              </label>
              <select
                {...register('stopId', { valueAsNumber: true, setValueAs: (v) => v === '' ? undefined : Number(v) })}
                className="w-full rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">Dayanacaq seçin (istəyə bağlı)</option>
                {availableStops
                  .filter(s => s.isActive)
                  .map(stop => (
                    <option key={stop.id} value={stop.id}>
                      {stop.name} - {stop.address}
                    </option>
                  ))}
              </select>
            </div>

            {/* Minmə/Düşmə */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('isBoarding')}
                  className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-secondary-700">
                  Minmə planı (işarələnməzsə düşmə planı)
                </span>
              </label>
            </div>

            {/* Qeydlər */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Qeydlər
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                className="w-full rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="Əlavə qeydlər..."
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-secondary-200">
            <Button variant="secondary" onClick={onClose} type="button">
              Ləğv et
            </Button>
            <Button
              type="submit"
              isLoading={isCreating || isUpdating}
              disabled={isCreating || isUpdating}
            >
              {isEditing ? 'Yenilə' : 'Əlavə et'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

