import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import type { Stop } from '@/types';
import { useStops } from '@/hooks/useStops';

const stopSchema = z.object({
  name: z.string().min(1, 'Ad tələb olunur').max(255, 'Ad maksimum 255 simvol ola bilər'),
  address: z.string().optional(),
  latitude: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^-?\d+\.?\d*$/.test(val),
      'Enlik düzgün formatda olmalıdır (məs: 40.4093)'
    ),
  longitude: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^-?\d+\.?\d*$/.test(val),
      'Uzunluq düzgün formatda olmalıdır (məs: 49.8671)'
    ),
  isActive: z.boolean().default(true),
});

type StopFormData = z.infer<typeof stopSchema>;

interface StopFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  stop: Stop | null;
}

export const StopFormModal = ({ isOpen, onClose, stop }: StopFormModalProps) => {
  const { createStop, updateStop, isCreating, isUpdating } = useStops();
  const isEditing = !!stop;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StopFormData>({
    resolver: zodResolver(stopSchema),
    defaultValues: {
      name: '',
      address: '',
      latitude: '',
      longitude: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (stop) {
        reset({
          name: stop.name,
          address: stop.address || '',
          latitude: stop.latitude || '',
          longitude: stop.longitude || '',
          isActive: stop.isActive,
        });
      } else {
        reset({
          name: '',
          address: '',
          latitude: '',
          longitude: '',
          isActive: true,
        });
      }
    }
  }, [isOpen, stop, reset]);

  const onSubmit = (data: StopFormData) => {
    // Backend-ə göndərməzdən əvvəl boş string-ləri null-a çevir
    const submitData = {
      name: data.name.trim(),
      address: data.address?.trim() || undefined,
      latitude: data.latitude?.trim() || undefined,
      longitude: data.longitude?.trim() || undefined,
      isActive: data.isActive,
    };

    if (isEditing && stop) {
      updateStop(
        {
          id: stop.id,
          data: submitData,
        },
        {
          onSuccess: () => onClose(),
        }
      );
    } else {
      createStop(submitData, {
        onSuccess: () => onClose(),
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative mx-4 w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-secondary-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-secondary-900">
            {isEditing ? 'Dayanacağı redaktə et' : 'Yeni dayanacaq əlavə et'}
          </h2>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-secondary-100">
            <X className="h-5 w-5 text-secondary-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-5">
          <Input
            label="Ad"
            placeholder="Məs: Məktəb qarşısı"
            {...register('name')}
            error={errors.name?.message}
          />
          <Input
            label="Ünvan"
            placeholder="Ünvan daxil edin"
            {...register('address')}
            error={errors.address?.message}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Enlik (latitude)"
              placeholder="Məs: 40.4093"
              {...register('latitude')}
              error={errors.latitude?.message}
            />
            <Input
              label="Uzunluq (longitude)"
              placeholder="Məs: 49.8671"
              {...register('longitude')}
              error={errors.longitude?.message}
            />
          </div>
          <label className="inline-flex items-center gap-2 text-sm text-secondary-700">
            <input type="checkbox" {...register('isActive')} className="h-4 w-4" />
            Aktiv dayanacaq
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
