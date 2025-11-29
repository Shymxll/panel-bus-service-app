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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!qrCode || !parentPhone) {
      toast.error('Bütün sahələri doldurun');
      return;
    }

    setIsLoading(true);

    try {
      // QR kod ilə öğrenciyi bul
      const student = await studentService.getStudentByQrCode(qrCode);

      // Telefon numarasını kontrol et
      if (student.parentPhone !== parentPhone) {
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

      toast.success('Xoş gəlmisiniz!');
      navigate('/parent/dashboard');
    } catch (error) {
      toast.error('Giriş uğursuz oldu. Məlumatları yoxlayın.');
      console.error('Parent login error:', error);
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
                  onChange={(e) => setQrCode(e.target.value)}
                  leftIcon={<User className="h-5 w-5" />}
                  disabled={isLoading}
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
                  onChange={(e) => setParentPhone(e.target.value)}
                  leftIcon={<Lock className="h-5 w-5" />}
                  disabled={isLoading}
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
        <div className="mt-6 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Məlumat:</strong> QR kodu şagirdin kartından tapa bilərsiniz. 
              Telefon nömrəsi qeydiyyat zamanı daxil etdiyiniz nömrə olmalıdır.
            </p>
          </div>
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

