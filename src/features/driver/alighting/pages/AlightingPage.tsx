import { useState, useEffect, useRef } from 'react';
import { 
  QrCode, Camera, CheckCircle, X, User, Clock, 
  AlertCircle, Search, RefreshCw, Keyboard, XCircle, Bus
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
 * Düşmə (Alighting/Disembarking) Sayfası
 * Şoförün QR kod okuyarak öğrenci iniş kaydı oluşturduğu sayfa
 */
export const AlightingPage = () => {
  const { user } = useAuthStore();
  const {
    todayDisembarkingRecords,
    todayBoardingRecords,
    todayPlans,
    pendingDisembarkingStudents,
    myBus,
    trips,
    searchStudentByQr,
    createDisembarking,
    isSearchingStudent,
    isCreatingDisembarking,
    refetchDisembarking,
    isLoadingDisembarking,
  } = useDriverData();

  const [qrInput, setQrInput] = useState('');
  const [scannedStudent, setScannedStudent] = useState<Student | null>(null);
  const [showManualInput, setShowManualInput] = useState(true);
  const [selectedTripId, setSelectedTripId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const today: string = new Date().toISOString().split('T')[0]!;

  // İlk sefer'i otomatik seç
  useEffect(() => {
    if (trips.length > 0 && !selectedTripId && trips[0]) {
      setSelectedTripId(trips[0].id);
    }
  }, [trips, selectedTripId]);

  // Input'a odaklan
  useEffect(() => {
    if (showManualInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showManualInput]);

  // QR kod ile öğrenci ara
  const handleQrSearch = async (qrCode?: string) => {
    const codeToSearch = qrCode || qrInput.trim();
    if (!codeToSearch) {
      toast.error('QR kod daxil edin');
      return;
    }

    try {
      const student = await searchStudentByQr(codeToSearch);
      setScannedStudent(student);
      setQrInput('');
    } catch (error) {
      setScannedStudent(null);
    }
  };

  // Manuel buton tıklaması için handler
  const handleManualSearch = () => {
    handleQrSearch();
  };

  // Kamera ile QR kod tarandığında
  const handleQrScan = async (decodedText: string) => {
    await handleQrSearch(decodedText);
  };

  // Enter tuşu ile arama
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleQrSearch();
    }
  };

  // İniş kaydı oluştur
  const handleCreateDisembarking = async () => {
    if (!scannedStudent || !selectedTripId || !myBus) {
      toast.error('Şagird, sefer və ya avtobus seçilməyib');
      return;
    }

    // Bu öğrenci zaten bugün indi mi kontrol et
    const alreadyDisembarked = todayDisembarkingRecords.some(
      (record) => record.studentId === scannedStudent.id
    );

    if (alreadyDisembarked) {
      toast.error('Bu şagird artıq bugün düşüb!');
      setScannedStudent(null);
      return;
    }

    // Öğrenci bugün bindi mi kontrol et
    const hasBoarded = todayBoardingRecords.some(
      (record) => record.studentId === scannedStudent.id
    );

    if (!hasBoarded) {
      toast.warning('Diqqət: Bu şagird bugün minməyib!');
    }

    // Planlanmış mı kontrol et
    const studentPlan = todayPlans.find(
      (plan) => plan.studentId === scannedStudent.id && !plan.isBoarding
    );

    try {
      await createDisembarking({
        studentId: scannedStudent.id,
        tripId: selectedTripId,
        busId: myBus.id,
        recordDate: today,
        driverId: user?.id || 0,
        wasPlanned: !!studentPlan,
        dailyPlanId: studentPlan?.id,
      });
      
      setScannedStudent(null);
      refetchDisembarking();
    } catch (error) {
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-secondary-900">
            Düşənlər
          </h1>
          <p className="mt-1 text-secondary-600">
            QR kod oxuyaraq şagirdlərin düşmə qeydini yaradın
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchDisembarking()}
            leftIcon={<RefreshCw className={`h-4 w-4 ${isLoadingDisembarking ? 'animate-spin' : ''}`} />}
            disabled={isLoadingDisembarking}
          >
            Yenilə
          </Button>
        </div>
      </div>

      {/* Sefer seçimi */}
      {trips.length > 0 && (
        <Card>
          <CardBody className="py-3">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-sm font-medium text-secondary-700">Səfər:</span>
              <div className="flex gap-2 flex-wrap">
                {trips.map((trip) => (
                  <button
                    key={trip.id}
                    onClick={() => setSelectedTripId(trip.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedTripId === trip.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                    }`}
                  >
                    <Clock className="inline-block h-4 w-4 mr-1" />
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
                className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                <Keyboard className="h-4 w-4" />
                {showManualInput ? 'Kamera' : 'Manual'}
              </button>
            </div>
          </CardHeader>
          <CardBody>
            {!scannedStudent ? (
              <div className="space-y-4">
                {showManualInput ? (
                  // Manuel QR kod girişi
                  <div className="space-y-4">
                    <div className="aspect-square max-h-64 rounded-lg border-2 border-dashed border-secondary-300 bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
                      <div className="text-center p-6">
                        <QrCode className="mx-auto h-16 w-16 text-blue-500" />
                        <p className="mt-4 text-sm text-secondary-600">
                          QR kodu daxil edin
                        </p>
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
                ) : (
                  // Kamera modu
                  <QrCodeScanner
                    onScanSuccess={handleQrScan}
                    onScanError={(error) => {
                      console.error('QR scan error:', error);
                    }}
                    className="w-full"
                  />
                )}

                {/* Bilgi kutusu */}
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium">Məlumat</p>
                      <p className="mt-1">
                        Şagirdin QR kodunu daxil edin və ya kameraya göstərin.
                        Sistem avtomatik olaraq şagirdi tanıyacaq.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Taranan öğrenci bilgisi
              <div className="space-y-4">
                <div className="rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 p-6 text-white">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <User className="h-8 w-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold">
                        {scannedStudent.firstName} {scannedStudent.lastName}
                      </h3>
                      <p className="text-blue-100">
                        {scannedStudent.school} - {scannedStudent.grade}
                      </p>
                    </div>
                    <button
                      onClick={handleCancelScan}
                      className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-secondary-50">
                    <p className="text-xs text-secondary-500">QR Kod</p>
                    <p className="font-medium text-secondary-900">{scannedStudent.qrCode}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary-50">
                    <p className="text-xs text-secondary-500">Valideyin</p>
                    <p className="font-medium text-secondary-900">
                      {scannedStudent.parentName || '-'}
                    </p>
                  </div>
                </div>

                {/* Biniş durumu kontrolü */}
                {todayBoardingRecords.some((r) => r.studentId === scannedStudent.id) ? (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm text-emerald-800 font-medium">
                      Bu şagird bugün mindiydi
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                    <span className="text-sm text-amber-800 font-medium">
                      Diqqət: Bu şagird bugün minməyib!
                    </span>
                  </div>
                )}

                {/* Zaten indi mi kontrolü */}
                {todayDisembarkingRecords.some((r) => r.studentId === scannedStudent.id) && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
                    <XCircle className="h-5 w-5 text-red-600" />
                    <span className="text-sm text-red-800 font-medium">
                      Bu şagird artıq bugün düşüb!
                    </span>
                  </div>
                )}

                {/* Aksiyon butonları */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleCancelScan}
                  >
                    Ləğv et
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    onClick={handleCreateDisembarking}
                    isLoading={isCreatingDisembarking}
                    disabled={todayDisembarkingRecords.some((r) => r.studentId === scannedStudent.id)}
                    leftIcon={<CheckCircle className="h-5 w-5" />}
                  >
                    Düşməni Təsdiqlə
                  </Button>
                </div>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Bugün inen öğrenciler */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Bugün Düşən Şagirdlər</h2>
              <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                {todayDisembarkingRecords.length} nəfər
              </span>
            </div>
          </CardHeader>
          <CardBody>
            {todayDisembarkingRecords.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {todayDisembarkingRecords.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-blue-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-blue-700" />
                      </div>
                      <div>
                        <p className="font-medium text-secondary-900">
                          Şagird #{record.studentId}
                        </p>
                        <p className="text-xs text-secondary-500">
                          {new Date(record.recordTime).toLocaleTimeString('az-AZ', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                    {record.wasPlanned ? (
                      <span className="text-xs text-blue-600 font-medium">Planlanmış</span>
                    ) : (
                      <span className="text-xs text-amber-600 font-medium">Plansız</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-secondary-500">
                <QrCode className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Hələ ki düşmə qeydi yoxdur</p>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Otobüste olan öğrenciler */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Avtobusda Olan Şagirdlər</h2>
              <span className="px-2 py-1 text-xs font-medium text-purple-700 bg-purple-100 rounded-full">
                {pendingDisembarkingStudents.length} nəfər
              </span>
            </div>
          </CardHeader>
          <CardBody>
            {pendingDisembarkingStudents.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {pendingDisembarkingStudents.map((record, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-purple-50 border border-purple-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center">
                        <Bus className="h-4 w-4 text-purple-700" />
                      </div>
                      <div>
                        <p className="font-medium text-secondary-900">
                          Şagird #{record.studentId}
                        </p>
                        <p className="text-xs text-secondary-500">
                          Mindi: {new Date(record.recordTime).toLocaleTimeString('az-AZ', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-purple-700 font-medium">Avtobusda</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-secondary-500">
                <CheckCircle className="h-12 w-12 mx-auto mb-3 text-blue-500 opacity-50" />
                <p>Avtobusda şagird yoxdur</p>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
