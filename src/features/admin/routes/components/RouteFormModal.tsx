import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Route as RouteIcon, Bus, FileText } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import type { Route, CreateRouteData, Bus as BusType } from '@/types';
import type { UseMutateFunction } from '@tanstack/react-query';

const routeSchema = z.object({
  name: z.string().min(2, 'Marşrut adı ən az 2 simvol olmalıdır'),
  description: z.string().optional(),
  busId: z.union([z.coerce.number(), z.nan()]).optional(),
  isActive: z.boolean().default(true),
});

type RouteFormData = z.infer<typeof routeSchema>;

interface RouteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  route: Route | null;
  buses: BusType[];
  createRoute: UseMutateFunction<Route, unknown, CreateRouteData, unknown>;
  updateRoute: UseMutateFunction<
    Route,
    unknown,
    { id: number; data: Partial<CreateRouteData> },
    unknown
  >;
  isCreating: boolean;
  isUpdating: boolean;
}

export const RouteFormModal = ({
  isOpen,
  onClose,
  route,
  buses,
  createRoute,
  updateRoute,
  isCreating,
  isUpdating,
}: RouteFormModalProps) => {
  const isEditing = !!route;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
    setValue,
  } = useForm<RouteFormData>({
    resolver: zodResolver(routeSchema),
    defaultValues: {
      name: '',
      description: '',
      busId: undefined,
      isActive: true,
    },
  });

  const selectedBusId = watch('busId');

  useEffect(() => {
    if (route) {
      reset({
        name: route.name,
        description: route.description ?? '',
        busId: route.busId ?? undefined,
        isActive: route.isActive,
      });
    } else {
      reset({
        name: '',
        description: '',
        busId: undefined,
        isActive: true,
      });
    }
  }, [route, reset]);

  const onSubmit = (data: RouteFormData) => {
    const payload: CreateRouteData = {
      name: data.name.trim(),
      description: data.description?.trim() || undefined,
      busId: Number.isNaN(data.busId) ? undefined : data.busId,
      isActive: data.isActive,
    };

    if (isEditing && route) {
      updateRoute(
        { id: route.id, data: payload },
        {
          onSuccess: () => onClose(),
        }
      );
    } else {
      createRoute(payload, {
        onSuccess: () => onClose(),
      });
    }
  };

  const handleBusChange = (value: string) => {
    if (!value) {
      setValue('busId', undefined);
    } else {
      setValue('busId', Number(value));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative mx-4 max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-secondary-200 px-6 py-4">
          <div>
            <p className="text-sm text-secondary-500">
              {isEditing ? 'Marşrut məlumatlarını yenilə' : 'Yeni marşrut əlavə et'}
            </p>
            <h2 className="flex items-center gap-2 text-xl font-semibold text-secondary-900">
              <RouteIcon className="h-5 w-5 text-primary-600" />
              {isEditing ? route?.name : 'Marşrut formu'}
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
          <Input
            label="Marşrut adı"
            placeholder="Məs: Məktəb - Mərkəz"
            leftIcon={<RouteIcon className="h-5 w-5" />}
            error={errors.name?.message}
            {...register('name')}
          />

          <div>
            <label className="mb-1 block text-sm font-medium text-secondary-700">
              Təsvir
            </label>
            <textarea
              className="w-full rounded-lg border border-secondary-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none"
              rows={3}
              placeholder="Marşrut haqqında əlavə məlumat (ixtiyari)"
              {...register('description')}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-secondary-700">
              Avtobus
            </label>
            <div className="relative">
              <select
                className="w-full rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                value={selectedBusId ?? ''}
                onChange={(e) => handleBusChange(e.target.value)}
              >
                <option value="">Avtobus seçilməyib</option>
                {buses.map((bus) => (
                  <option key={bus.id} value={bus.id}>
                    {bus.plateNumber} {bus.brand && bus.model ? `(${bus.brand} ${bus.model})` : ''}
                  </option>
                ))}
              </select>
              <Bus className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-secondary-200 px-4 py-3">
            <input
              type="checkbox"
              id="route-is-active"
              className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
              {...register('isActive')}
            />
            <label htmlFor="route-is-active" className="text-sm text-secondary-700">
              Aktiv marşrut
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

