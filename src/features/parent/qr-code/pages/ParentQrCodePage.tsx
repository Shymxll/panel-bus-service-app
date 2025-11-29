import { useState, useEffect } from 'react';
import { QrCode as QrCodeIcon, User, School, Download, Share2 } from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { studentService } from '@/services/student.service';
import type { Student } from '@/types';
import { toast } from 'sonner';
import QRCode from 'qrcode';

/**
 * Valideyin QR Kod Səhifəsi
 * Uşağın QR kodunu göstərir və paylaşma seçənəkləri sunar
 */
export const ParentQrCodePage = () => {
  const [student, setStudent] = useState<Student | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const authData = localStorage.getItem('parentAuth');
      if (!authData) return;

      const { studentId } = JSON.parse(authData);

      // Öğrenci bilgilerini al
      const studentData = await studentService.getStudentById(studentId);
      setStudent(studentData);

      // QR kod oluştur
      const qrDataUrl = await QRCode.toDataURL(studentData.qrCode, {
        width: 300,
        margin: 2,
        color: {
          dark: '#1e40af', // blue-800
          light: '#ffffff',
        },
      });
      setQrCodeDataUrl(qrDataUrl);
    } catch (error) {
      console.error('Error loading QR code:', error);
      toast.error('QR kod yüklənə bilmədi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!qrCodeDataUrl || !student) return;

    const link = document.createElement('a');
    link.download = `${student.firstName}_${student.lastName}_QR.png`;
    link.href = qrCodeDataUrl;
    link.click();

    toast.success('QR kod endirildi');
  };

  const handleShare = async () => {
    if (!qrCodeDataUrl || !student) return;

    try {
      // Web Share API destekleniyorsa
      if (navigator.share) {
        // Data URL'i blob'a çevir
        const blob = await (await fetch(qrCodeDataUrl)).blob();
        const file = new File([blob], `${student.firstName}_${student.lastName}_QR.png`, {
          type: 'image/png',
        });

        await navigator.share({
          title: 'Şagird QR Kodu',
          text: `${student.firstName} ${student.lastName} - Servis QR Kodu`,
          files: [file],
        });
      } else {
        // Web Share API desteklenmiyorsa, kopyala
        await navigator.clipboard.writeText(student.qrCode);
        toast.success('QR kod məlumatı kopyalandı');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Paylaşma uğursuz oldu');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yüklənir...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-12">
        <QrCodeIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-600">QR kod tapılmadı</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Başlık */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-secondary-900">
          QR Kod
        </h1>
        <p className="mt-1 text-secondary-600">
          Uşağınızın servis QR kodu
        </p>
      </div>

      {/* Öğrenci Bilgisi */}
      <Card>
        <CardBody className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white">
              <User className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-secondary-900">
                {student.firstName} {student.lastName}
              </h2>
              <div className="flex items-center gap-2 mt-1 text-sm text-secondary-600">
                <School className="h-4 w-4" />
                <span>{student.school} - {student.grade}</span>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* QR Kod Kartı */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <QrCodeIcon className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-secondary-900">
              Şagird QR Kodu
            </h3>
          </div>
        </CardHeader>
        <CardBody>
          {/* QR Kod */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 text-center">
            {qrCodeDataUrl && (
              <img
                src={qrCodeDataUrl}
                alt="Student QR Code"
                className="mx-auto mb-4 rounded-lg shadow-lg"
              />
            )}
            <div className="bg-white rounded-lg py-3 px-4 inline-block">
              <p className="text-xs text-secondary-500 mb-1">QR Kod</p>
              <p className="text-lg font-mono font-bold text-secondary-900">
                {student.qrCode}
              </p>
            </div>
          </div>

          {/* Aksiyon Butonları */}
          <div className="grid gap-3 sm:grid-cols-2 mt-6">
            <Button
              onClick={handleDownload}
              leftIcon={<Download className="h-5 w-5" />}
              className="w-full"
            >
              Endir
            </Button>
            <Button
              variant="outline"
              onClick={handleShare}
              leftIcon={<Share2 className="h-5 w-5" />}
              className="w-full"
            >
              Paylaş
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Kullanım Bilgisi */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <QrCodeIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">İstifadə qaydası</p>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>Bu QR kodu uşağınız servislə gəlir-gedər zamanı istifadə edir</li>
              <li>Şoför QR kodu oxuyaraq uşağın minmə/düşmə qeydini yaradır</li>
              <li>QR kodu çap edib uşağın çantasına qoya bilərsiniz</li>
              <li>QR kodu itirməyin, yeganə identifikasiya vasitəsidir</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

