import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Bus, Hash, UserCircle2, Gauge } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import type { Bus as BusType, CreateBusData, User } from '@/types';
import type { UseMutateFunction } from '@tanstack/react-query';

const busSchema = z.object({
  plateNumber: z.string().min(3, 'Plaka ən azı 3 simvol olmalıdır'),
  brand: z.string().optional(),
  model: z.string().optional(),
  capacity: z.coerce.number().min(1, 'Tutum 1-dən böyük olmalıdır').max(100, 'Tutum çox böyükdür'),
  driverId: z.union([z.coerce.number(), z.nan()]).optional(),
  isActive: z.boolean().default(true),
});

type BusFormData = z.infer<typeof busSchema>;

interface BusFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  bus: BusType | null;
  drivers: User[];
  createBus: UseMutateFunction<BusType, unknown, CreateBusData, unknown>;
  updateBus: UseMutateFunction<
    BusType,
    unknown,
    { id: number; data: Partial<CreateBusData> },
    unknown
  >;
  isCreating: boolean;
  isUpdating: boolean;
}

export const BusFormModal = ({
  isOpen,
  onClose,
  bus,
  drivers,
  createBus,
  updateBus,
  isCreating,
  isUpdating,
}: BusFormModalProps) => {
  const isEditing = !!bus;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
    setValue,
  } = useForm<BusFormData>({
    resolver: zodResolver(busSchema),
    defaultValues: {
      plateNumber: '',
      brand: '',
      model: '',
      capacity: 20,
      driverId: undefined,
      isActive: true,
    },
  });

  const selectedDriverId = watch('driverId');

  useEffect(() => {
    if (bus) {
      reset({
        plateNumber: bus.plateNumber,
        brand: bus.brand ?? '',
        model: bus.model ?? '',
        capacity: bus.capacity,
        driverId: bus.driverId ?? undefined,
        isActive: bus.isActive,
      });
    } else {
      reset({
        plateNumber: '',
        brand: '',
        model: '',
        capacity: 20,
        driverId: undefined,
        isActive: true,
      });
    }
  }, [bus, reset]);

  const onSubmit = (data: BusFormData) => {
    const payload: CreateBusData = {
      plateNumber: data.plateNumber.trim().toUpperCase(),
      brand: data.brand?.trim() || undefined,
      model: data.model?.trim() || undefined,
      capacity: data.capacity,
      driverId: Number.isNaN(data.driverId) ? undefined : data.driverId,
      isActive: data.isActive,
    };

    if (isEditing && bus) {
      updateBus(
        { id: bus.id, data: payload },
        {
          onSuccess: () => onClose(),
        }
      );
    } else {
      createBus(payload, {
        onSuccess: () => onClose(),
      });
    }
  };

  const handleDriverChange = (value: string) => {
    if (!value) {
      setValue('driverId', undefined);
    } else {
      setValue('driverId', Number(value));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative mx-4 max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-secondary-200 px-6 py-4">
          <div>
            <p className="text-sm text-secondary-500">
              {isEditing ? 'Avtobus məlumatlarını yenilə' : 'Yeni avtobus əlavə et'}
            </p>
            <h2 className="flex items-center gap-2 text-xl font-semibold text-secondary-900">
              <Bus className="h-5 w-5 text-primary-600" />
              {isEditing ? bus?.plateNumber : 'Avtobus formu'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 transition-colors hover:bg-secondary-100"
          >
            <X className="h-5 w-5 text-secondary-500" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-h-[calc(90vh-140px)] space-y-4 overflow-y-auto p-6"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Plaka"
              placeholder="99-XX-999"
              leftIcon={<Hash className="h-5 w-5" />}
              error={errors.plateNumber?.message}
              {...register('plateNumber')}
            />
            <Input
              label="Tutum"
              type="number"
              min={1}
              placeholder="20"
              leftIcon={<Gauge className="h-5 w-5" />}
              error={errors.capacity?.message}
              {...register('capacity', { valueAsNumber: true })}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Marka"
              placeholder="Mercedes"
              error={errors.brand?.message}
              {...register('brand')}
            />
            <Input
              label="Model"
              placeholder="Sprinter"
              error={errors.model?.message}
              {...register('model')}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-secondary-700">Şoför</label>
            <div className="relative">
              <select
                className="w-full rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                value={selectedDriverId ?? ''}
                onChange={(e) => handleDriverChange(e.target.value)}
              >
                <option value="">Şoför seçilməyib</option>
                {drivers.map((driver) => (
                  <option key={driver.id} value={driver.id}>
                    {driver.name} ({driver.email})
                  </option>
                ))}
              </select>
              <UserCircle2 className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-secondary-200 px-4 py-3">
            <input
              type="checkbox"
              id="bus-is-active"
              className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
              {...register('isActive')}
            />
            <label htmlFor="bus-is-active" className="text-sm text-secondary-700">
              Aktiv avtobus
            </label>
          </div>
        </form>

        <div className="flex items-center justify-end gap-3 border-t border-secondary-200 bg-secondary-50 px-6 py-4">
          <Button variant="outline" onClick={onClose}>
            Ləğv et
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            isLoading={isEditing ? isUpdating : isCreating}
          >
            {isEditing ? 'Yadda saxla' : 'Əlavə et'}
          </Button>
        </div>
      </div>
    </div>
  );
};
