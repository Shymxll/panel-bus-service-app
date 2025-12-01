import { useEffect, useState } from 'react';
import { X, MapPin } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { LeafletMap } from '@/components/common/LeafletMap';
import type { Stop } from '@/types';
import { useStops } from '@/hooks/useStops';

// Dayanacak formu icin dogrulama kurallari.
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

// Durak ekleme/düzenleme modalı - Leaflet harita seçimi ile.
export const StopFormModal = ({ isOpen, onClose, stop }: StopFormModalProps) => {
  const { createStop, updateStop, isCreating, isUpdating } = useStops();
  const isEditing = !!stop && stop.id !== 0;
  const [mapCenter, setMapCenter] = useState<[number, number]>([40.4093, 49.8671]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
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

  const latitude = watch('latitude');
  const longitude = watch('longitude');

  useEffect(() => {
    // Modal acildiginda mevcut verileri form alanlarina dagit.
    if (isOpen) {
      if (stop) {
        reset({
          name: stop.name,
          address: stop.address || '',
          latitude: stop.latitude || '',
          longitude: stop.longitude || '',
          isActive: stop.isActive,
        });

        // Eğer koordinatlar varsa harita merkezini ayarla
        if (stop.latitude && stop.longitude) {
          setMapCenter([parseFloat(stop.latitude), parseFloat(stop.longitude)]);
        } else {
          setMapCenter([40.4093, 49.8671]);
        }
      } else {
        reset({
          name: '',
          address: '',
          latitude: '',
          longitude: '',
          isActive: true,
        });
        setMapCenter([40.4093, 49.8671]);
      }
    }
  }, [isOpen, stop, reset]);

  const handleMapClick = (lat: number, lng: number) => {
    // Haritadan seçilen koordinatları forma yaz
    setValue('latitude', lat.toFixed(6));
    setValue('longitude', lng.toFixed(6));
    setMapCenter([lat, lng]);
  };

  const handlePlaceSelect = (place: {
    address: string;
    name: string;
    lat: number;
    lng: number;
  }) => {
    // Haritadan seçilen yer bilgilerini forma yaz
    setValue('address', place.address);
    setValue('latitude', place.lat.toFixed(6));
    setValue('longitude', place.lng.toFixed(6));

    // Eğer ad boşsa, yer adını kullan
    if (!watch('name')?.trim()) {
      setValue('name', place.name);
    }

    setMapCenter([place.lat, place.lng]);
  };

  const onSubmit = (data: StopFormData) => {
    // Backend'e gondermeden once bos stringleri undefined yap.
    const submitData = {
      name: data.name.trim(),
      address: data.address?.trim() || undefined,
      latitude: data.latitude?.trim() || undefined,
      longitude: data.longitude?.trim() || undefined,
      isActive: data.isActive,
    };

    if (isEditing && stop && stop.id !== 0) {
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

  // Koordinatları haritada göster
  const currentMarkers =
    latitude && longitude
      ? [
          {
            id: 1,
            position: [parseFloat(latitude), parseFloat(longitude)] as [number, number],
            title: 'Seçilmiş yer',
            isSelected: true,
          },
        ]
      : [];

  if (!isOpen) return null; // Modal kapaliysa gostermeyelim.

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-xl bg-white shadow-xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between border-b border-secondary-200 px-6 py-4 flex-shrink-0">
          <h2 className="text-lg font-semibold text-secondary-900">
            {isEditing ? 'Dayanacağı redaktə et' : 'Yeni dayanacaq əlavə et'}
          </h2>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-secondary-100">
            <X className="h-5 w-5 text-secondary-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            {/* Sol taraf - Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

              <div className="space-y-2">
                <label className="text-sm font-medium text-secondary-700">Koordinatlar</label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    label="Enlik (latitude)"
                    placeholder="40.4093"
                    {...register('latitude')}
                    error={errors.latitude?.message}
                  />
                  <Input
                    label="Uzunluq (longitude)"
                    placeholder="49.8671"
                    {...register('longitude')}
                    error={errors.longitude?.message}
                  />
                </div>
                <p className="text-xs text-secondary-500 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  Haritadan seçim yapın veya manuel girin
                </p>
              </div>

              <label className="inline-flex items-center gap-2 text-sm text-secondary-700">
                <input type="checkbox" {...register('isActive')} className="h-4 w-4" />
                Aktiv dayanacaq
              </label>
            </form>

            {/* Sağ taraf - Harita */}
            <div className="lg:block">
              <div className="sticky top-0">
                <div className="rounded-lg overflow-hidden border border-secondary-200">
                  <LeafletMap
                    center={mapCenter}
                    zoom={latitude && longitude ? 15 : 12}
                    markers={currentMarkers}
                    onMapClick={handleMapClick}
                    onPlaceSelect={handlePlaceSelect}
                    height="450px"
                    showSearch={true}
                    enableClickToAdd={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alt aksiyonlar */}
        <div className="border-t border-secondary-200 px-6 py-4 flex justify-end gap-3 flex-shrink-0">
          <Button type="button" variant="outline" onClick={onClose}>
            Ləğv et
          </Button>
          <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            isLoading={isCreating || isUpdating}
          >
            {isEditing ? 'Yenilə' : 'Əlavə et'}
          </Button>
        </div>
      </div>
    </div>
  );
};
