import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Phone, Mail, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import type { User, RegisterData } from '@/types';
import type { UseMutateFunction } from '@tanstack/react-query';

// Şoför formu için geçerli alanları tanımlar.
const driverSchema = z.object({
  name: z.string().min(2, 'Ad ən az 2 simvol olmalıdır'),
  email: z.string().email('Düzgün email daxil edin'),
  phone: z.string().optional(),
  password: z.string().optional(),
  isActive: z.boolean().default(true),
});

type DriverFormData = z.infer<typeof driverSchema>;

interface DriverFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  driver: User | null;
  createDriver: UseMutateFunction<User, unknown, RegisterData, unknown>;
  updateDriver: UseMutateFunction<
    User,
    unknown,
    { id: number; data: Partial<User> },
    unknown
  >;
  isCreating: boolean;
  isUpdating: boolean;
}

// Şoför ekleme/düzenleme işlemlerini yöneten modal.
export const DriverFormModal = ({
  isOpen,
  onClose,
  driver,
  createDriver,
  updateDriver,
  isCreating,
  isUpdating,
}: DriverFormModalProps) => {
  const isEditing = !!driver; // Şifre alanının gösterimi ve mutasyon türü buradan belirlenir.

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<DriverFormData>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      isActive: true,
    },
  });

  useEffect(() => {
    // Duzenleme modunda mevcut bilgileri yükle, yeni kayıtta varsayılanları kur.
    if (driver) {
      reset({
        name: driver.name,
        email: driver.email,
        phone: driver.phone || '',
        password: '',
        isActive: driver.isActive,
      });
    } else {
      reset({
        name: '',
        email: '',
        phone: '',
        password: '',
        isActive: true,
      });
    }
  }, [driver, reset]);

  const isSubmitting = isEditing ? isUpdating : isCreating;

  const onSubmit = (data: DriverFormData) => {
    // Yeni kayıt için şifre zorunlu, düzenlemede isteğe bağlı.
    if (!isEditing && !data.password) {
      setError('password', {
        type: 'required',
        message: 'Şifrə tələb olunur',
      });
      return;
    }

    if (isEditing && driver) {
      updateDriver(
        {
          id: driver.id,
          data: {
            name: data.name,
            email: data.email,
            phone: data.phone,
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
      createDriver(
        {
          name: data.name,
          email: data.email,
          password: data.password!,
          phone: data.phone,
          role: 'driver',
        },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    }
  };

  if (!isOpen) return null; // Modal kapalıysa hicbir şey render etme.

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl mx-4 bg-white rounded-xl shadow-xl max-h-[90vh] overflow-hidden">
        {/* Baslik ve kapatma alani */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-secondary-200">
          <div>
            <p className="text-sm text-secondary-500">
              {isEditing ? 'Şoför məlumatlarını yenilə' : 'Yeni şoför əlavə et'}
            </p>
            <h2 className="text-xl font-semibold text-secondary-900">
              {isEditing ? driver?.name : 'Şoför formu'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-secondary-100 transition-colors"
          >
            <X className="h-5 w-5 text-secondary-500" />
          </button>
        </div>

        {/* Form kontrolleri */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]"
        >
          <Input
            label="Ad Soyad"
            placeholder="Şoförün tam adı"
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Email"
            placeholder="driver@example.com"
            leftIcon={<Mail className="h-5 w-5" />}
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Telefon"
            placeholder="+994 XX XXX XX XX"
            leftIcon={<Phone className="h-5 w-5" />}
            error={errors.phone?.message}
            {...register('phone')}
          />

          {!isEditing && (
            <Input
              label="Şifrə"
              type="password"
              placeholder="Ən azı 6 simvol"
              error={errors.password?.message}
              {...register('password')}
            />
          )}

          <div className="flex items-center gap-3 rounded-lg border border-secondary-200 px-4 py-3">
            <input
              type="checkbox"
              id="driver-is-active"
              className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
              {...register('isActive')}
            />
            <label
              htmlFor="driver-is-active"
              className="text-sm text-secondary-700 flex items-center gap-2"
            >
              <ShieldCheck className="h-4 w-4 text-secondary-400" />
              Aktiv şoför
            </label>
          </div>
        </form>

        {/* Alt aksiyon butonlari */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-secondary-200 bg-secondary-50">
          <Button variant="outline" onClick={onClose}>
            Ləğv et
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            isLoading={isSubmitting}
          >
            {isEditing ? 'Yadda saxla' : 'Əlavə et'}
          </Button>
        </div>
      </div>
    </div>
  );
};


