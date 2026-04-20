import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { useSchoolMutations } from '@/hooks/useSchools';
import type { School } from '@/types';

// Form validation şeması
const schoolSchema = z.object({
  name: z.string().min(2, 'Okul adı en az 2 karakter olmalıdır'),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Geçerli bir e-posta girin').optional().or(z.literal('')),
  isActive: z.boolean().default(true),
});

type SchoolFormData = z.infer<typeof schoolSchema>;

interface SchoolFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  school: School | null;
}

export const SchoolFormModal = ({ isOpen, onClose, school }: SchoolFormModalProps) => {
  const { createSchool, updateSchool, isCreating, isUpdating } = useSchoolMutations();
  const isEditing = !!school;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SchoolFormData>({
    resolver: zodResolver(schoolSchema),
    defaultValues: {
      name: '',
      address: '',
      phone: '',
      email: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (school) {
      reset({
        name: school.name,
        address: school.address || '',
        phone: school.phone || '',
        email: school.email || '',
        isActive: school.isActive,
      });
    } else {
      reset({
        name: '',
        address: '',
        phone: '',
        email: '',
        isActive: true,
      });
    }
  }, [school, reset]);

  const onSubmit = (data: SchoolFormData) => {
    if (isEditing && school) {
      updateSchool(
        { id: school.id, data },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    } else {
      createSchool(data, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Okulu Düzenle' : 'Yeni Okul'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Məktəb Adı */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-secondary-700 mb-2">
            Okul Adı <span className="text-red-500">*</span>
          </label>
          <Input
            id="name"
            {...register('name')}
            error={errors.name?.message}
            placeholder="Okul adını girin"
          />
        </div>

        {/* Ünvan */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-secondary-700 mb-2">
            Adres
          </label>
          <Input
            id="address"
            {...register('address')}
            error={errors.address?.message}
            placeholder="Okulun adresini girin"
          />
        </div>

        {/* Telefon */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-secondary-700 mb-2">
            Telefon
          </label>
          <Input
            id="phone"
            type="tel"
            {...register('phone')}
            error={errors.phone?.message}
            placeholder="+90 XXX XXX XX XX"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
            E-posta
          </label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            error={errors.email?.message}
            placeholder="school@example.com"
          />
        </div>

        {/* Status */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isActive"
            {...register('isActive')}
            className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-600"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-secondary-700">
            Aktif
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            İptal
          </Button>
          <Button type="submit" isLoading={isCreating || isUpdating}>
            {isEditing ? 'Güncelle' : 'Oluştur'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

