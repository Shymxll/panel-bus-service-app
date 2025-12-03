import { useState, useEffect, useRef } from 'react';
import {
  QrCode,
  CheckCircle,
  X,
  User,
  Clock,
  AlertCircle,
  Search,
  RefreshCw,
  Keyboard,
  XCircle,
} from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { QrCodeScanner } from '@/components/common/QrCodeScanner';
import { useDriverData } from '@/hooks/useDriverData';
import { useAuthStore } from '@/store/auth-store';
import type { Student } from '@/types';
import { toast } from 'sonner';

/**
 * Biniş (Boarding) Sayfası
 * Sürücünün QR kod okuyarak öğrenci biniş kaydı oluşturduğu sayfa
 */
export const BoardingPage = () => {
  const { user } = useAuthStore();
  const {
    todayBoardingRecords,
    todayPlans,
    pendingBoardingStudents,
    myBus,
    buses,
    trips,
    searchStudentByQr,
    createBoarding,
    isSearchingStudent,
    isCreatingBoarding,
    refetchBoarding,
    refetchBuses,
    isLoadingBoarding,
    isLoadingBuses,
    isLoadingTrips,
  } = useDriverData();

  const [qrInput, setQrInput] = useState('');
  const [scannedStudent, setScannedStudent] = useState<Student | null>(null);
  const [showManualInput, setShowManualInput] = useState(true);
  const [selectedTripId, setSelectedTripId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // QR kod işleme durumu (aynı anda sadece bir QR kod işlenebilir)
  const isProcessingQrRef = useRef<boolean>(false);
  const currentProcessingQrRef = useRef<string | null>(null);
  
  // Son okutulan QR kodları takip et (tekrar okutmayı engellemek için)
  // Map<qrCode, timestamp> formatında
  const recentScannedQrCodesRef = useRef<Map<string, number>>(new Map());
  
  // İşlenmiş QR kodları takip et (başarıyla boarding kaydı oluşturulan QR kodlar)
  // Bugün için kalıcı olarak işaretlenir
  const processedQrCodesRef = useRef<Set<string>>(new Set());

  // Ses bildirimleri için Audio referansları
  const successSoundRef = useRef<HTMLAudioElement | null>(null);
  const errorSoundRef = useRef<HTMLAudioElement | null>(null);

  const today: string = new Date().toISOString().split('T')[0]!;

  // Gün değiştiğinde işlenmiş QR kodlarını temizle
  useEffect(() => {
    const checkDateChange = () => {
      const currentDate = new Date().toISOString().split('T')[0];
      if (currentDate !== today) {
        // Gün değişti, işlenmiş QR kodlarını temizle
        processedQrCodesRef.current.clear();
      }
    };

    // Her dakika kontrol et
    const interval = setInterval(checkDateChange, 60000);
    return () => clearInterval(interval);
  }, [today]);

  // Ses dosyalarını yükle
  useEffect(() => {
    // Başarı sesi (yüksek pitch beep)
    successSoundRef.current = new Audio(
      'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGWi77OeeSwwMUKfj8LZjHAU7k9nyz3osBSh+zPLaizsKFF+16+uoVRQKRp/g8r5sIQUrgc7y2Yk2CBlou+znm0sMDFCn4/C2YxwFO5PZ8s96LAUofszy2os7ChRftevr'
    );

    // Hata sesi (düşük pitch beep)
    errorSoundRef.current = new Audio(
      'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGWi77OeeSwwMUKfj8LZjHAU7k9nyz3osBSh+zPLaizsKFF+16+uoVRQKRp/g8r5sIQUrgc7y2Yk2CBlou+znm0sMDFCn4/C2YxwFO5PZ8s96LAUofszy2os7ChRftevr'
    );
  }, []);

  // Başarı sesi çal
  const playSuccessSound = () => {
    if (successSoundRef.current) {
      successSoundRef.current.currentTime = 0;
      successSoundRef.current.play().catch(() => {
        // Ses çalma hatası sessizce yoksay
      });
    }
  };

  // Hata sesi çal
  const playErrorSound = () => {
    if (errorSoundRef.current) {
      errorSoundRef.current.currentTime = 0;
      errorSoundRef.current.play().catch(() => {
        // Ses çalma hatası sessizce yoksay
      });
    }
  };

  // İlk sefer'i otomatik seç
  useEffect(() => {
    if (trips.length > 0 && !selectedTripId && trips[0]) {
      setSelectedTripId(trips[0].id);
    }
  }, [trips, selectedTripId]);

  // Sayfa yüklendiğinde veya window focus olduğunda bus verilerini yenile
  useEffect(() => {
    const handleFocus = () => {
      // Sadece veriler yüklenmişse ve myBus yoksa yenile
      if (!isLoadingBuses && !myBus && user?.id) {
        refetchBuses();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [isLoadingBuses, myBus, user?.id, refetchBuses]);

  // Input'a odaklan
  useEffect(() => {
    if (showManualInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showManualInput]);

  // QR kod ile öğrenci ara (öğrenci bilgilerini göster)
  const handleQrSearch = async (qrCode?: string): Promise<Student | null> => {
    const codeToSearch = (qrCode || qrInput.trim()).trim();
    if (!codeToSearch) {
      toast.error('QR kod daxil edin');
      return null;
    }

    // Bu QR kod daha önce başarıyla işlendi mi kontrol et
    if (processedQrCodesRef.current.has(codeToSearch)) {
      toast.error('Bu QR kod artıq bugün işlənib!');
      return null;
    }

    // Aynı QR kodun kısa süre içinde tekrar okutulmasını engelle (3 saniye)
    const now = Date.now();
    const lastScanTime = recentScannedQrCodesRef.current.get(codeToSearch);
    const SCAN_COOLDOWN = 3000; // 3 saniye

    if (lastScanTime && now - lastScanTime < SCAN_COOLDOWN) {
      // Aynı QR kod çok kısa süre önce okutulmuş
      toast.info('Bu QR kod çox qısa müddət əvvəl oxunub. Zəhmət olmasa gözləyin.');
      return null;
    }

    try {
      const student = await searchStudentByQr(codeToSearch);
      if (student) {
        // Başarılı arama sonrası QR kodunu kaydet (tekrar okutmayı engellemek için)
        recentScannedQrCodesRef.current.set(codeToSearch, now);
        
        // Eski kayıtları temizle (5 dakikadan eski kayıtları sil)
        const fiveMinutesAgo = now - 5 * 60 * 1000;
        for (const [code, timestamp] of recentScannedQrCodesRef.current.entries()) {
          if (timestamp < fiveMinutesAgo) {
            recentScannedQrCodesRef.current.delete(code);
          }
        }
      }
      setScannedStudent(student);
      setQrInput('');
      return student;
    } catch (error) {
      setScannedStudent(null);
      return null;
    }
  };

  // QR kod ile öğrenci ara (öğrenci bilgilerini gösterme, sadece döndür)
  const searchStudentWithoutDisplay = async (qrCode: string): Promise<Student | null> => {
    if (!qrCode.trim()) {
      return null;
    }

    try {
      const student = await searchStudentByQr(qrCode);
      return student;
    } catch (error) {
      return null;
    }
  };

  // Manuel buton tıklaması için handler
  const handleManualSearch = () => {
    handleQrSearch();
  };

  // Kamera ile QR kod tarandığında - otomatik onayla (öğrenci bilgilerini gösterme)
  const handleQrScan = async (decodedText: string) => {
    const qrCode = decodedText.trim();
    
    // Boş QR kod kontrolü
    if (!qrCode) {
      return;
    }

    // Şu anda bir QR kod işleniyorsa, yeni QR okutmayı engelle
    if (isProcessingQrRef.current) {
      console.log('⚠️ Başqa QR kod işlənir, gözləyin:', currentProcessingQrRef.current);
      return;
    }

    // Bu QR kod daha önce başarıyla işlendi mi kontrol et
    if (processedQrCodesRef.current.has(qrCode)) {
      // Bu QR kod bugün zaten başarıyla işlenmiş, tekrar okutmayı engelle
      console.log('⚠️ Bu QR kod daha önce işlənib, yoksayılıyor:', qrCode);
      playErrorSound();
      toast.error('Bu QR kod artıq bugün işlənib!');
      return;
    }

    // Aynı QR kodun kısa süre içinde tekrar okutulmasını engelle (3 saniye)
    const now = Date.now();
    const lastScanTime = recentScannedQrCodesRef.current.get(qrCode);
    const SCAN_COOLDOWN = 3000; // 3 saniye

    if (lastScanTime && now - lastScanTime < SCAN_COOLDOWN) {
      // Aynı QR kod çok kısa süre önce okutulmuş, yoksay
      console.log('⚠️ Aynı QR kod çox qısa müddət əvvəl oxundu, yoksayılıyor:', qrCode);
      return;
    }

    // İşleme başlıyoruz - kilidi al
    isProcessingQrRef.current = true;
    currentProcessingQrRef.current = qrCode;

    // Veriler yükleniyor mu kontrol et
    if (isLoadingBuses || isLoadingTrips) {
      playErrorSound();
      toast.error('Məlumatlar hələ yüklənir, zəhmət olmasa gözləyin');
      // Kilidi serbest bırak
      isProcessingQrRef.current = false;
      currentProcessingQrRef.current = null;
      return;
    }

    // Kullanıcı bilgisi yüklendi mi kontrol et
    if (!user?.id) {
      playErrorSound();
      toast.error('Sürücü məlumatı yüklənməyib. Zəhmət olmasa səhifəni yeniləyin');
      // Kilidi serbest bırak
      isProcessingQrRef.current = false;
      currentProcessingQrRef.current = null;
      return;
    }

    // Öğrenciyi ara ama ekranda gösterme
    const student = await searchStudentWithoutDisplay(qrCode);

    // Öğrenci bulunamadıysa hata sesi çal ve işlemi durdur
    if (!student) {
      playErrorSound();
      toast.error('Şagird tapılmadı');
      // Kilidi serbest bırak
      isProcessingQrRef.current = false;
      currentProcessingQrRef.current = null;
      return;
    }

    // Bu öğrenci zaten bugün bindi mi kontrol et (öğrenci bulunduktan hemen sonra)
    const alreadyBoarded = todayBoardingRecords.some((record) => record.studentId === student.id);

    if (alreadyBoarded) {
      // Öğrenci zaten bugün bindi, QR kodunu işaretle ve engelle
      processedQrCodesRef.current.add(qrCode);
      playErrorSound();
      toast.error('Bu şagird artıq bugün minib!');
      // Kilidi serbest bırak
      isProcessingQrRef.current = false;
      currentProcessingQrRef.current = null;
      return;
    }

    // Gerekli kontroller - Detaylı debug
    console.log('🔍 QR Scan Debug:', {
      user: user,
      userId: user?.id,
      userIdType: typeof user?.id,
      busesCount: buses.length,
      buses: buses.map((b) => ({
        id: b.id,
        plateNumber: b.plateNumber,
        driverId: b.driverId,
        driverIdType: typeof b.driverId,
        driverIdString: String(b.driverId),
        driverIdNumber: Number(b.driverId),
      })),
      myBus: myBus,
      myBusDriverId: myBus?.driverId,
      tripsCount: trips.length,
      trips: trips.map((t) => ({ id: t.id, departureTime: t.departureTime })),
      selectedTripId: selectedTripId,
      isLoadingBuses: isLoadingBuses,
      isLoadingTrips: isLoadingTrips,
      // Tip karşılaştırması testi
      comparisonTest: buses.map((b) => ({
        busId: b.id,
        busDriverId: b.driverId,
        userDriverId: user?.id,
        strictEqual: b.driverId === user?.id,
        looseEqual: b.driverId == user?.id,
        numberEqual: Number(b.driverId) === Number(user?.id),
        stringEqual: String(b.driverId) === String(user?.id),
      })),
    });

    // Avtobus kontrolü - daha detaylı hata mesajları
    if (!myBus) {
      playErrorSound();
      let reason = '';

      if (buses.length === 0) {
        reason = 'Heç bir avtobus tapılmadı. Sistemdə avtobus yoxdur.';
      } else {
        // Sürücüye atanmış otobüs var mı kontrol et
        const assignedBuses = buses.filter((b) => b.driverId);
        if (assignedBuses.length === 0) {
          reason = 'Heç bir avtobusa sürücü təyin edilməyib. Admin paneldən sürücü təyin edin.';
        } else {
          // Tip güvenli karşılaştırma yap
          const userId = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
          const myBusCandidate = buses.find((b) => {
            if (!b.driverId) return false;
            const busDriverId = typeof b.driverId === 'string' ? parseInt(b.driverId, 10) : b.driverId;
            if (isNaN(userId) || isNaN(busDriverId)) return false;
            return userId === busDriverId;
          });
          
          if (!myBusCandidate) {
            const assignedDriverIds = assignedBuses
              .map((b) => b.driverId)
              .filter((id) => id != null)
              .join(', ');
            reason = `Sizə avtobus təyin edilməyib. Sürücü ID: ${user.id} (tip: ${typeof user.id}). Təyin edilmiş sürücü ID-ləri: ${assignedDriverIds}. Admin paneldən sürücü təyin edin.`;
          } else {
            reason = 'Avtobus məlumatı tapılmadı. Zəhmət olmasa səhifəni yeniləyin.';
          }
        }
      }

      toast.error(`Avtobus seçilməyib: ${reason}`, {
        duration: 8000,
      });
      // Kilidi serbest bırak
      isProcessingQrRef.current = false;
      currentProcessingQrRef.current = null;
      return;
    }

    if (!selectedTripId) {
      playErrorSound();
      const reason = trips.length === 0 ? 'Heç bir sefer tapılmadı' : 'Sefer seçilməyib';
      toast.error(`Sefer seçilməyib: ${reason}`);
      // Kilidi serbest bırak
      isProcessingQrRef.current = false;
      currentProcessingQrRef.current = null;
      return;
    }

    // Planlanmış mı kontrol et
    const studentPlan = todayPlans.find((plan) => plan.studentId === student.id && plan.isBoarding);

    // ÖNEMLİ: Boarding kaydı oluşturulmaya başlamadan ÖNCE QR kodunu işaretle
    // Böylece aynı anda birden fazla istek gönderilmesini engelle
    processedQrCodesRef.current.add(qrCode);
    recentScannedQrCodesRef.current.set(qrCode, now);

    // Otomatik olarak biniş kaydı oluştur
    try {
      await createBoarding({
        studentId: student.id,
        tripId: selectedTripId,
        busId: myBus.id,
        recordDate: today,
        driverId: user?.id || 0,
        wasPlanned: !!studentPlan,
        dailyPlanId: studentPlan?.id,
      });

      // Başarı sesi çal
      playSuccessSound();
      toast.success(`${student.firstName} ${student.lastName} uğurla minmə qeydində qeyd edildi`);
      
      // QR kod zaten işaretlenmiş (boarding kaydı oluşturulmadan önce işaretlendi)
      // Eski kayıtları temizle (5 dakikadan eski kayıtları sil)
      const fiveMinutesAgo = now - 5 * 60 * 1000;
      for (const [code, timestamp] of recentScannedQrCodesRef.current.entries()) {
        if (timestamp < fiveMinutesAgo) {
          recentScannedQrCodesRef.current.delete(code);
        }
      }
      
      refetchBoarding();
    } catch (error) {
      // Hata durumunda QR kodunu işaretten kaldır, böylece tekrar deneyebilir
      processedQrCodesRef.current.delete(qrCode);
      recentScannedQrCodesRef.current.delete(qrCode);
      
      // Hata sesi çal
      playErrorSound();
      // Hata zaten hook içinde gösteriliyor
    } finally {
      // Her durumda kilidi serbest bırak
      isProcessingQrRef.current = false;
      currentProcessingQrRef.current = null;
    }
  };

  // Enter tuşu ile arama
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleQrSearch();
    }
  };

  // Biniş kaydı oluştur
  const handleCreateBoarding = async () => {
    if (!scannedStudent || !selectedTripId || !myBus) {
      toast.error('Şagird, sefer və ya avtobus seçilməyib');
      return;
    }

    // Bu öğrenci zaten bugün bindi mi kontrol et
    const alreadyBoarded = todayBoardingRecords.some(
      (record) => record.studentId === scannedStudent.id
    );

    if (alreadyBoarded) {
      // Öğrenci zaten bugün bindi, QR kodunu işaretle ve engelle
      if (scannedStudent.qrCode) {
        processedQrCodesRef.current.add(scannedStudent.qrCode);
      }
      toast.error('Bu şagird artıq bugün minib!');
      setScannedStudent(null);
      return;
    }

    // Planlanmış mı kontrol et
    const studentPlan = todayPlans.find(
      (plan) => plan.studentId === scannedStudent.id && plan.isBoarding
    );

    // ÖNEMLİ: Boarding kaydı oluşturulmaya başlamadan ÖNCE QR kodunu işaretle
    const now = Date.now();
    if (scannedStudent.qrCode) {
      processedQrCodesRef.current.add(scannedStudent.qrCode);
      recentScannedQrCodesRef.current.set(scannedStudent.qrCode, now);
    }

    try {
      await createBoarding({
        studentId: scannedStudent.id,
        tripId: selectedTripId,
        busId: myBus.id,
        recordDate: today,
        driverId: user?.id || 0,
        wasPlanned: !!studentPlan,
        dailyPlanId: studentPlan?.id,
      });

      // QR kod zaten işaretlenmiş (boarding kaydı oluşturulmadan önce işaretlendi)
      // Eski kayıtları temizle (5 dakikadan eski kayıtları sil)
      const fiveMinutesAgo = now - 5 * 60 * 1000;
      for (const [code, timestamp] of recentScannedQrCodesRef.current.entries()) {
        if (timestamp < fiveMinutesAgo) {
          recentScannedQrCodesRef.current.delete(code);
        }
      }

      setScannedStudent(null);
      refetchBoarding();
    } catch (error) {
      // Hata durumunda QR kodunu işaretten kaldır, böylece tekrar deneyebilir
      if (scannedStudent.qrCode) {
        processedQrCodesRef.current.delete(scannedStudent.qrCode);
        recentScannedQrCodesRef.current.delete(scannedStudent.qrCode);
      }
      // Hata zaten hook içinde gösteriliyor
    }
  };

  // Taranan öğrenciyi iptal et
  const handleCancelScan = () => {
    setScannedStudent(null);
    setQrInput('');
  };

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 sm:text-3xl">Minənlər</h1>
          <p className="mt-1 text-secondary-600">
            QR kod oxuyaraq şagirdlərin minmə qeydini yaradın
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              refetchBoarding();
              refetchBuses();
            }}
            leftIcon={
              <RefreshCw
                className={`h-4 w-4 ${
                  isLoadingBoarding || isLoadingBuses ? 'animate-spin' : ''
                }`}
              />
            }
            disabled={isLoadingBoarding || isLoadingBuses}
          >
            Yenilə
          </Button>
        </div>
      </div>

      {/* Uyarı: Veriler yükleniyor */}
      {(isLoadingBuses || isLoadingTrips) && (
        <Card>
          <CardBody className="py-3">
            <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
              <RefreshCw className="h-5 w-5 animate-spin text-amber-600" />
              <p className="text-sm font-medium text-amber-800">
                Məlumatlar yüklənir, zəhmət olmasa gözləyin...
              </p>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Uyarı: Avtobus təyin edilməyib */}
      {!isLoadingBuses && !isLoadingTrips && !myBus && user?.id && (
        <Card>
          <CardBody className="py-3">
            <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">Avtobus seçilməyib</p>
                <p className="mt-1 text-xs text-red-700">
                  {buses.length === 0
                    ? 'Sistemdə heç bir avtobus yoxdur. Admin paneldən avtobus əlavə edin.'
                    : 'Sizə avtobus təyin edilməyib. Admin paneldən sürücü təyin edin.'}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Sefer seçimi */}
      {trips.length > 0 && (
        <Card>
          <CardBody className="py-3">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-sm font-medium text-secondary-700">Səfər:</span>
              <div className="flex flex-wrap gap-2">
                {trips.map((trip) => (
                  <button
                    key={trip.id}
                    onClick={() => setSelectedTripId(trip.id)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                      selectedTripId === trip.id
                        ? 'bg-emerald-600 text-white shadow-lg'
                        : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                    }`}
                  >
                    <Clock className="mr-1 inline-block h-4 w-4" />
                    {trip.departureTime}
                  </button>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Ana içerik */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* QR Kod Tarama/Giriş Alanı */}
        <Card className="lg:row-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">QR Kod Oxuyucu</h2>
              <button
                onClick={() => setShowManualInput(!showManualInput)}
                className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
              >
                <Keyboard className="h-4 w-4" />
                {showManualInput ? 'Kamera' : 'Manual'}
              </button>
            </div>
          </CardHeader>
          <CardBody>
            {showManualInput && !scannedStudent ? (
              <div className="space-y-4">
                {/* Manuel QR kod girişi */}
                <div className="space-y-4">
                  <div className="flex aspect-square max-h-64 items-center justify-center rounded-lg border-2 border-dashed border-secondary-300 bg-gradient-to-br from-emerald-50 to-teal-50">
                    <div className="p-6 text-center">
                      <QrCode className="mx-auto h-16 w-16 text-emerald-500" />
                      <p className="mt-4 text-sm text-secondary-600">QR kodu daxil edin</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Input
                      ref={inputRef}
                      placeholder="QR kod daxil edin..."
                      value={qrInput}
                      onChange={(e) => setQrInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      leftIcon={<Search className="h-5 w-5" />}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleManualSearch}
                      isLoading={isSearchingStudent}
                      disabled={!qrInput.trim()}
                    >
                      Axtar
                    </Button>
                  </div>
                </div>

                {/* Bilgi kutusu */}
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
                    <div className="text-sm text-emerald-800">
                      <p className="font-medium">Məlumat</p>
                      <p className="mt-1">
                        Şagirdin QR kodunu daxil edin. Sistem avtomatik olaraq şagirdi tanıyacaq.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : !showManualInput ? (
              // Kamera modu - öğrenci bilgilerini gösterme
              <div className="space-y-4">
                <QrCodeScanner
                  onScanSuccess={handleQrScan}
                  onScanError={(error) => {
                    console.error('QR scan error:', error);
                  }}
                  className="w-full"
                />

                {/* Bilgi kutusu */}
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
                    <div className="text-sm text-emerald-800">
                      <p className="font-medium">Məlumat</p>
                      <p className="mt-1">
                        Şagirdin QR kodunu kameraya göstərin. Sistem avtomatik olaraq minməni
                        təsdiqləyəcək.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Taranan öğrenci bilgisi (sadece manuel giriş için)
              scannedStudent && (
                <div className="space-y-4">
                  <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 p-6 text-white">
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                        <User className="h-8 w-8" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold">
                          {scannedStudent.firstName} {scannedStudent.lastName}
                        </h3>
                        <p className="text-emerald-100">
                          {scannedStudent.school} - {scannedStudent.grade}
                        </p>
                      </div>
                      <button
                        onClick={handleCancelScan}
                        className="rounded-full bg-white/20 p-2 transition-colors hover:bg-white/30"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-secondary-50 p-3">
                      <p className="text-xs text-secondary-500">QR Kod</p>
                      <p className="font-medium text-secondary-900">{scannedStudent.qrCode}</p>
                    </div>
                    <div className="rounded-lg bg-secondary-50 p-3">
                      <p className="text-xs text-secondary-500">Əlaqə Şəxsi</p>
                      <p className="font-medium text-secondary-900">
                        {scannedStudent.parentName || '-'}
                      </p>
                    </div>
                  </div>

                  {/* Plan durumu */}
                  {todayPlans.some((p) => p.studentId === scannedStudent.id && p.isBoarding) ? (
                    <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                      <span className="text-sm font-medium text-emerald-800">
                        Bu şagird bugünkü planda var
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                      <span className="text-sm font-medium text-amber-800">
                        Bu şagird bugünkü planda yoxdur
                      </span>
                    </div>
                  )}

                  {/* Zaten bindi mi kontrolü */}
                  {todayBoardingRecords.some((r) => r.studentId === scannedStudent.id) && (
                    <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
                      <XCircle className="h-5 w-5 text-red-600" />
                      <span className="text-sm font-medium text-red-800">
                        Bu şagird artıq bugün minib!
                      </span>
                    </div>
                  )}

                  {/* Aksiyon butonları */}
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={handleCancelScan}>
                      Ləğv et
                    </Button>
                    <Button
                      className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                      onClick={handleCreateBoarding}
                      isLoading={isCreatingBoarding}
                      disabled={todayBoardingRecords.some((r) => r.studentId === scannedStudent.id)}
                      leftIcon={<CheckCircle className="h-5 w-5" />}
                    >
                      Minməni Təsdiqlə
                    </Button>
                  </div>
                </div>
              )
            )}
          </CardBody>
        </Card>

        {/* Bugün binen öğrenciler */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Bugün Minən Şagirdlər</h2>
              <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
                {todayBoardingRecords.length} nəfər
              </span>
            </div>
          </CardHeader>
          <CardBody>
            {todayBoardingRecords.length > 0 ? (
              <div className="max-h-64 space-y-2 overflow-y-auto">
                {todayBoardingRecords.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between rounded-lg bg-emerald-50 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-200">
                        <CheckCircle className="h-4 w-4 text-emerald-700" />
                      </div>
                      <div>
                        <p className="font-medium text-secondary-900">Şagird #{record.studentId}</p>
                        <p className="text-xs text-secondary-500">
                          {new Date(record.recordTime).toLocaleTimeString('az-AZ', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                    {record.wasPlanned ? (
                      <span className="text-xs font-medium text-emerald-600">Planlanmış</span>
                    ) : (
                      <span className="text-xs font-medium text-amber-600">Plansız</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-secondary-500">
                <QrCode className="mx-auto mb-3 h-12 w-12 opacity-50" />
                <p>Hələ ki minmə qeydi yoxdur</p>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Gözlenen öğrenciler */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Gözlənilən Şagirdlər</h2>
              <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">
                {pendingBoardingStudents.length} nəfər
              </span>
            </div>
          </CardHeader>
          <CardBody>
            {pendingBoardingStudents.length > 0 ? (
              <div className="max-h-64 space-y-2 overflow-y-auto">
                {pendingBoardingStudents.map((plan) => (
                  <div
                    key={plan.id}
                    className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-200">
                        <Clock className="h-4 w-4 text-amber-700" />
                      </div>
                      <div>
                        <p className="font-medium text-secondary-900">Şagird #{plan.studentId}</p>
                        {plan.notes && <p className="text-xs text-secondary-500">{plan.notes}</p>}
                      </div>
                    </div>
                    <span className="text-xs font-medium text-amber-700">Gözlənilir</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-secondary-500">
                <CheckCircle className="mx-auto mb-3 h-12 w-12 text-emerald-500 opacity-50" />
                <p>Bütün planlanmış şagirdlər mindi</p>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
