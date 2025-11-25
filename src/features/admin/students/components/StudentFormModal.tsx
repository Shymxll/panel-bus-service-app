import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, QrCode, RefreshCw } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useStudents } from '@/hooks/useStudents';
import { studentService } from '@/services/student.service';
import type { Student } from '@/types';

const studentSchema = z.object({
  firstName: z.string().min(2, 'Ad ən az 2 simvol olmalıdır'),
  lastName: z.string().min(2, 'Soyad ən az 2 simvol olmalıdır'),
  qrCode: z.string().min(5, 'QR kod ən az 5 simvol olmalıdır'),
  school: z.string().min(2, 'Məktəb adı tələb olunur'),
  grade: z.string().min(1, 'Sinif tələb olunur'),
  parentName: z.string().optional(),
  parentPhone: z.string().optional(),
  address: z.string().optional(),
  isActive: z.boolean().default(true),
});

type StudentFormData = z.infer<typeof studentSchema>;

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
}

export const StudentFormModal = ({ isOpen, onClose, student }: StudentFormModalProps) => {
  const { createStudent, updateStudent, isCreating, isUpdating } = useStudents();
  const isEditing = !!student;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      qrCode: '',
      school: '',
      grade: '',
      parentName: '',
      parentPhone: '',
      address: '',
      isActive: true,
    },
  });

  const qrCode = watch('qrCode');

  useEffect(() => {
    if (student) {
      reset({
        firstName: student.firstName,
        lastName: student.lastName,
        qrCode: student.qrCode,
        school: student.school,
        grade: student.grade,
        parentName: student.parentName || '',
        parentPhone: student.parentPhone || '',
        address: student.address || '',
        isActive: student.isActive,
      });
    } else {
      reset({
        firstName: '',
        lastName: '',
        qrCode: studentService.generateQrCode(),
        school: '',
        grade: '',
        parentName: '',
        parentPhone: '',
        address: '',
        isActive: true,
      });
    }
  }, [student, reset]);

  const handleGenerateQrCode = () => {
    setValue('qrCode', studentService.generateQrCode());
  };

  const onSubmit = (data: StudentFormData) => {
    if (isEditing && student) {
      updateStudent(
        { id: student.id, data },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    } else {
      createStudent(data, {
        onSuccess: () => {
          onClose();
        },
      });
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
      <div className="relative w-full max-w-lg mx-4 bg-white rounded-xl shadow-xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-secondary-200">
          <h2 className="text-xl font-semibold text-secondary-900">
            {isEditing ? 'Şagirdi redaktə et' : 'Yeni şagird əlavə et'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-secondary-100 transition-colors"
          >
            <X className="h-5 w-5 text-secondary-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Name fields */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Ad"
              placeholder="Şagirdin adı"
              error={errors.firstName?.message}
              {...register('firstName')}
            />
            <Input
              label="Soyad"
              placeholder="Şagirdin soyadı"
              error={errors.lastName?.message}
              {...register('lastName')}
            />
          </div>

          {/* QR Code */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              QR Kod
            </label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="QR kod"
                  leftIcon={<QrCode className="h-5 w-5" />}
                  error={errors.qrCode?.message}
                  {...register('qrCode')}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleGenerateQrCode}
                title="Yeni QR kod yarat"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* School and Grade */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Məktəb"
              placeholder="Məktəb adı"
              error={errors.school?.message}
              {...register('school')}
            />
            <Input
              label="Sinif"
              placeholder="Sinif (məs: 5-A)"
              error={errors.grade?.message}
              {...register('grade')}
            />
          </div>

          {/* Parent Info */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Valideyn adı"
              placeholder="Valideynin adı (ixtiyari)"
              error={errors.parentName?.message}
              {...register('parentName')}
            />
            <Input
              label="Valideyn telefonu"
              placeholder="+994 XX XXX XX XX"
              error={errors.parentPhone?.message}
              {...register('parentPhone')}
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Ünvan
            </label>
            <textarea
              className="w-full rounded-lg border border-secondary-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none"
              rows={2}
              placeholder="Şagirdin ünvanı (ixtiyari)"
              {...register('address')}
            />
          </div>

          {/* Status */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
              {...register('isActive')}
            />
            <label htmlFor="isActive" className="text-sm text-secondary-700">
              Aktiv şagird
            </label>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-secondary-200 bg-secondary-50">
          <Button variant="outline" onClick={onClose}>
            Ləğv et
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            isLoading={isCreating || isUpdating}
          >
            {isEditing ? 'Yadda saxla' : 'Əlavə et'}
          </Button>
        </div>
      </div>
    </div>
  );
};

