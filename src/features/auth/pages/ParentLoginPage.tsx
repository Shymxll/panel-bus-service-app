import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { User, Lock, Bus } from 'lucide-react';
import { toast } from 'sonner';
import { studentService } from '@/services/student.service';

/**
 * Valideyin Giriş Səhifəsi
 * Şagird QR kodu və valideyin telefonu ilə giriş
 */
export const ParentLoginPage = () => {
  const navigate = useNavigate();
  const [qrCode, setQrCode] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Telefon numarasını normalize et (boşluk, tire, parantez temizle)
  const normalizePhone = (phone: string): string => {
    return phone.replace(/[\s\-\(\)]/g, '').trim();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!qrCode || !parentPhone) {
      toast.error('Bütün sahələri doldurun');
      return;
    }

    setIsLoading(true);

    try {
      // QR kod'u temizle
      const cleanQrCode = qrCode.trim();
      
      // Telefon numarasını normalize et
      const normalizedInputPhone = normalizePhone(parentPhone);
      
      console.log('🔍 Giriş denemesi:', {
        qrCode: cleanQrCode,
        phone: normalizedInputPhone,
      });

      // QR kod ilə öğrenciyi bul (public endpoint - authentication gerektirmez)
      const student = await studentService.getStudentByQrCode(cleanQrCode);
      
      console.log('✅ Öğrenci bulundu:', {
        id: student.id,
        name: `${student.firstName} ${student.lastName}`,
        qrCode: student.qrCode,
        parentPhone: student.parentPhone,
      });

      // Telefon numarasını kontrol et (normalize edilmiş)
      const normalizedStudentPhone = student.parentPhone 
        ? normalizePhone(student.parentPhone) 
        : null;

      if (!normalizedStudentPhone) {
        toast.error('Bu şagird üçün valideyin telefon nömrəsi qeydiyyatda yoxdur');
        setIsLoading(false);
        return;
      }

      if (normalizedStudentPhone !== normalizedInputPhone) {
        console.error('❌ Telefon uyumsuzluğu:', {
          girilen: normalizedInputPhone,
          kayitli: normalizedStudentPhone,
        });
        toast.error('QR kod və ya telefon nömrəsi yanlışdır');
        setIsLoading(false);
        return;
      }

      // Öğrenci bilgilerini localStorage'a kaydet
      localStorage.setItem('parentAuth', JSON.stringify({
        studentId: student.id,
        studentName: `${student.firstName} ${student.lastName}`,
        parentName: student.parentName,
        qrCode: student.qrCode,
        loginTime: new Date().toISOString(),
      }));

      console.log('✅ Giriş başarılı, localStorage kaydedildi');
      toast.success('Xoş gəlmisiniz!');
      navigate('/parent/dashboard');
    } catch (error: any) {
      console.error('❌ Parent login error:', {
        error,
        message: error?.message,
        response: error?.response,
        status: error?.response?.status,
        data: error?.response?.data,
      });
      
      // Daha detaylı hata mesajları
      if (error?.response?.status === 404) {
        toast.error('QR kod tapılmadı. QR kodu düzgün daxil etdiyinizə əmin olun.');
      } else if (error?.response?.status === 500) {
        toast.error('Server xətası. Zəhmət olmasa bir az sonra yenidən cəhd edin.');
      } else if (error?.request && !error?.response) {
        // Network hatası - backend'e ulaşılamıyor
        toast.error('Backend serverə qoşula bilmədi. Serverin işlədiyinə əmin olun.');
        console.error('Network error - Backend erişilemiyor:', error.request);
      } else if (error?.message?.includes('tapılmadı') || error?.message?.includes('not found')) {
        toast.error('QR kod tapılmadı. QR kodu düzgün daxil etdiyinizə əmin olun.');
      } else {
        const errorMessage = error?.response?.data?.message || error?.message || 'Giriş uğursuz oldu';
        toast.error(`${errorMessage}. Məlumatları yoxlayın.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 mb-4">
            <Bus className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Valideyin Portalı
          </h1>
          <p className="text-gray-600">
            Uşağınızın servis məlumatlarına baxın
          </p>
        </div>

        {/* Login Form */}
        <Card>
          <CardBody className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Şagird QR Kodu
                </label>
                <Input
                  type="text"
                  placeholder="QR kodu daxil edin"
                  value={qrCode}
                  onChange={(e) => setQrCode(e.target.value.toUpperCase().trim())}
                  leftIcon={<User className="h-5 w-5" />}
                  disabled={isLoading}
                  autoComplete="off"
                  autoCapitalize="characters"
                  autoCorrect="off"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valideyin Telefon Nömrəsi
                </label>
                <Input
                  type="tel"
                  placeholder="+994501234567"
                  value={parentPhone}
                  onChange={(e) => {
                    // Sadece rakam, + ve boşluk karakterlerine izin ver
                    const value = e.target.value.replace(/[^\d+\s\-\(\)]/g, '');
                    setParentPhone(value);
                  }}
                  leftIcon={<Lock className="h-5 w-5" />}
                  disabled={isLoading}
                  autoComplete="tel"
                  inputMode="tel"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                isLoading={isLoading}
              >
                Daxil ol
              </Button>
            </form>
          </CardBody>
        </Card>

        {/* Info */}
        <div className="mt-6 space-y-3">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Məlumat:</strong> QR kodu şagirdin kartından tapa bilərsiniz. 
              Telefon nömrəsi qeydiyyat zamanı daxil etdiyiniz nömrə olmalıdır.
            </p>
          </div>
          
          {/* Debug Info - Sadece development'ta göster */}
          {import.meta.env.DEV && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-1">
                <strong>Debug:</strong> API Base URL: {import.meta.env.VITE_API_BASE_URL || 'localhost:3001 (proxy)'}
              </p>
              <p className="text-xs text-gray-600">
                QR kod formatı: Boşluq olmadan, tam olaraq kartdakı kimi
              </p>
            </div>
          )}
        </div>

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Ana səhifəyə qayıt
          </button>
        </div>
      </div>
    </div>
  );
};

