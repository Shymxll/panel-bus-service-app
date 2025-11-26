import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Clock } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useTrips } from '@/hooks/useTrips';
import type { Trip, Route } from '@/types';

const tripSchema = z.object({
  departureTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Vaxt formatı düzgün deyil (HH:mm)'),
  isActive: z.boolean().default(true),
});

type TripFormData = z.infer<typeof tripSchema>;

interface TripFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  route: Route;
  trip: Trip | null; // null = yeni səfər, Trip = redaktə
}

export const TripFormModal = ({ isOpen, onClose, route, trip }: TripFormModalProps) => {
  const { createTrip, updateTrip, isCreating, isUpdating } = useTrips();
  const isEditing = !!trip;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TripFormData>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      departureTime: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (trip) {
        reset({
          departureTime: trip.departureTime,
          isActive: trip.isActive,
        });
      } else {
        reset({
          departureTime: '',
          isActive: true,
        });
      }
    }
  }, [isOpen, trip, reset]);

  const onSubmit = (data: TripFormData) => {
    if (isEditing && trip) {
      updateTrip(
        {
          id: trip.id,
          data: {
            departureTime: data.departureTime,
            isActive: data.isActive,
          },
        },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    } else {
      createTrip(
        {
          routeId: route.id,
          departureTime: data.departureTime,
          isActive: data.isActive,
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
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative mx-4 w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-secondary-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-secondary-900">
              {isEditing ? 'Səfəri redaktə et' : 'Yeni səfər əlavə et'}
            </h2>
            <p className="text-sm text-secondary-500 mt-1">
              Marşrut: {route.name}
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-secondary-100">
            <X className="h-5 w-5 text-secondary-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-5">
          <Input
            label="Yola çıxma vaxtı"
            type="time"
            placeholder="08:00"
            leftIcon={<Clock className="h-5 w-5" />}
            {...register('departureTime')}
            error={errors.departureTime?.message}
          />

          <label className="inline-flex items-center gap-2 text-sm text-secondary-700">
            <input type="checkbox" {...register('isActive')} className="h-4 w-4" />
            Aktiv səfər
          </label>

          <div className="mt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Ləğv et
            </Button>
            <Button type="submit" isLoading={isCreating || isUpdating}>
              {isEditing ? 'Yenilə' : 'Əlavə et'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

