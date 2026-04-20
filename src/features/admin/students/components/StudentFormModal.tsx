import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, QrCode, RefreshCw, Building2 } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useStudents } from '@/hooks/useStudents';
import { useSchools } from '@/hooks/useSchools';
import { studentService } from '@/services/student.service';
import type { Student } from '@/types';

// Form validasyonunu merkezileştiren Zod şeması.
const studentSchema = z.object({
  firstName: z.string().min(2, 'Ad en az 2 karakter olmalıdır'),
  lastName: z.string().min(2, 'Soyad en az 2 karakter olmalıdır'),
  qrCode: z.string().min(5, 'QR kod en az 5 karakter olmalıdır'),
  schoolId: z.coerce.number().min(1, 'Okul seçilmelidir'),
  grade: z.string().min(1, 'Sınıf gereklidir'),
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

// Yeni şagird oluşturma veya mevcut kaydı güncelleme modalı.
export const StudentFormModal = ({ isOpen, onClose, student }: StudentFormModalProps) => {
  const { createStudent, updateStudent, isCreating, isUpdating } = useStudents();
  const { data: schools = [], isLoading: isSchoolsLoading } = useSchools();
  const isEditing = !!student; // Modal başlığı ve submit aksiyonunu belirler.

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
      schoolId: 0,
      grade: '',
      parentName: '',
      parentPhone: '',
      address: '',
      isActive: true,
    },
  });

  const qrCode = watch('qrCode');

  useEffect(() => {
    // Gelen öğrenci varsa formu doldur, yoksa varsayılan değerler ve QR üret.
    if (student) {
      // Öğrencinin okul adına göre okul ID'sini bul
      const studentSchool = schools.find((s) => s.name === student.school);
      reset({
        firstName: student.firstName,
        lastName: student.lastName,
        qrCode: student.qrCode,
        schoolId: studentSchool ? studentSchool.id : 0,
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
        schoolId: 0,
        grade: '',
        parentName: '',
        parentPhone: '',
        address: '',
        isActive: true,
      });
    }
  }, [student, reset, schools]);

  const handleGenerateQrCode = () => {
    // Kullanıcı tek tıkla benzersiz QR kodu oluşturabilsin.
    setValue('qrCode', studentService.generateQrCode());
  };

  const onSubmit = (data: StudentFormData) => {
    // Backend'e gönderilecek veriyi hazırla
    const submitData = {
      firstName: data.firstName,
      lastName: data.lastName,
      qrCode: data.qrCode,
      schoolId: data.schoolId,
      grade: data.grade,
      parentName: data.parentName || undefined,
      parentPhone: data.parentPhone || undefined,
      address: data.address || undefined,
      isActive: data.isActive,
    };

    // Düzenleme ve oluşturma akışlarını tek noktada ayrıştır.
    if (isEditing && student) {
      updateStudent(
        { id: student.id, data: submitData },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    } else {
      createStudent(submitData, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  if (!isOpen) return null; // Modal kapalıyken DOM'a hiçbir şey render etme.

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop: kullanıcı modal dışına tıkladığında kapanması için */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 bg-white rounded-xl shadow-xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-secondary-200">
          <h2 className="text-xl font-semibold text-secondary-900">
            {isEditing ? 'Öğrenciyi düzenle' : 'Yeni öğrenci ekle'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-secondary-100 transition-colors"
          >
            <X className="h-5 w-5 text-secondary-500" />
          </button>
        </div>

        {/* Form kontrolleri kaydırılabilir gövde içinde */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* İsim/Soyisim alanları yan yana */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Ad"
              placeholder="Öğrencinin adı"
              error={errors.firstName?.message}
              {...register('firstName')}
            />
            <Input
              label="Soyad"
              placeholder="Öğrencinin soyadı"
              error={errors.lastName?.message}
              {...register('lastName')}
            />
          </div>

          {/* QR kodu alanı ve tek tuşla üretme butonu */}
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
                title="Yeni QR kod oluştur"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Okul ve sınıf detayları */}
          <div className="grid grid-cols-2 gap-4">
            {/* Okul Seçimi - Dropdown */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Okul <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400 pointer-events-none" />
                <select
                  {...register('schoolId')}
                  disabled={isSchoolsLoading}
                  className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                    errors.schoolId
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-secondary-300 focus:border-primary-500 focus:ring-primary-500'
                  } text-sm focus:outline-none focus:ring-1 disabled:bg-secondary-50 disabled:text-secondary-500`}
                >
                  <option value="">Okul seçin...</option>
                  {schools
                    .filter(school => school.isActive)
                    .sort((a, b) => a.name.localeCompare(b.name, 'tr'))
                    .map((school) => (
                      <option key={school.id} value={school.id}>
                        {school.name}
                      </option>
                    ))}
                </select>
              </div>
              {errors.schoolId && (
                <p className="mt-1 text-xs text-red-600">{errors.schoolId.message}</p>
              )}
              {isSchoolsLoading && (
                <p className="mt-1 text-xs text-secondary-500">Okullar yükleniyor...</p>
              )}
            </div>
            
            <Input
              label="Sınıf"
              placeholder="Sınıf (örn: 5-A)"
              error={errors.grade?.message}
              {...register('grade')}
            />
          </div>

          {/* Velilere ait isteğe bağlı bilgiler */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Veli adı"
              placeholder="Velinin adı (isteğe bağlı)"
              error={errors.parentName?.message}
              {...register('parentName')}
            />
            <Input
              label="Veli telefonu"
              placeholder="+90 XXX XXX XX XX"
              error={errors.parentPhone?.message}
              {...register('parentPhone')}
            />
          </div>

          {/* Adres açıklaması */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Adres
            </label>
            <textarea
              className="w-full rounded-lg border border-secondary-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none"
              rows={2}
              placeholder="Öğrencinin adresi (isteğe bağlı)"
              {...register('address')}
            />
          </div>

          {/* Öğrencinin aktiflik durumu */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
              {...register('isActive')}
            />
            <label htmlFor="isActive" className="text-sm text-secondary-700">
              Aktif öğrenci
            </label>
          </div>
        </form>

        {/* Footer: kaydet veya vazgeç aksiyonları */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-secondary-200 bg-secondary-50">
          <Button variant="outline" onClick={onClose}>
            İptal
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            isLoading={isCreating || isUpdating}
          >
            {isEditing ? 'Kaydet' : 'Ekle'}
          </Button>
        </div>
      </div>
    </div>
  );
};

