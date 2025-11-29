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
  name: z.string().min(2, 'Məktəb adı ən azı 2 simvol olmalıdır'),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Düzgün email daxil edin').optional().or(z.literal('')),
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
      title={isEditing ? 'Məktəbi Redaktə Et' : 'Yeni Məktəb'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Məktəb Adı */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-secondary-700 mb-2">
            Məktəb Adı <span className="text-red-500">*</span>
          </label>
          <Input
            id="name"
            {...register('name')}
            error={errors.name?.message}
            placeholder="Məktəb adını daxil edin"
          />
        </div>

        {/* Ünvan */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-secondary-700 mb-2">
            Ünvan
          </label>
          <Input
            id="address"
            {...register('address')}
            error={errors.address?.message}
            placeholder="Məktəbin ünvanını daxil edin"
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
            placeholder="+994 XX XXX XX XX"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
            Email
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
            Aktiv
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            Ləğv et
          </Button>
          <Button type="submit" isLoading={isCreating || isUpdating}>
            {isEditing ? 'Yenilə' : 'Yarat'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

