import { useEffect, useRef, useState, useId } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, X, AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface QrCodeScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (error: string) => void;
  onClose?: () => void;
  className?: string;
}

/**
 * QR Kod Tarayıcı Bileşeni
 * html5-qrcode kütüphanesi kullanarak kamera ile QR kod okur
 */
export const QrCodeScanner = ({
  onScanSuccess,
  onScanError,
  onClose,
  className = '',
}: QrCodeScannerProps) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const scanAreaRef = useRef<HTMLDivElement>(null);
  const scanAreaId = useId();
  
  // Son okunan QR kod ve zamanı (aynı QR kodun çok hızlı art arda okunmasını engellemek için)
  const lastScannedCodeRef = useRef<string | null>(null);
  const lastScanTimeRef = useRef<number>(0);

  // Scanner'ı başlat
  const startScanner = async () => {
    if (!scanAreaRef.current) return;

    try {
      const html5QrCode = new Html5Qrcode(scanAreaRef.current.id);
      scannerRef.current = html5QrCode;

      // Kamera izni kontrolü
      const devices = await Html5Qrcode.getCameras();
      if (devices.length === 0) {
        setError('Kamera tapılmadı. Zəhmət olmasa kameranızın işlədiyindən əmin olun.');
        setHasPermission(false);
        return;
      }

      // Arka kamerayı bul - önce facingMode ile dene, sonra etiketlere bak
      let cameraId: string | null = null;
      
      // Önce etiketlere göre arka kamerayı ara
      const backCamera = devices.find((device) => {
        const label = device.label.toLowerCase();
        return (
          label.includes('back') ||
          label.includes('rear') ||
          label.includes('environment') ||
          label.includes('arka') ||
          label.includes('arxa') ||
          label.includes('rear-facing') ||
          label.includes('back-facing')
        );
      });

      if (backCamera) {
        cameraId = backCamera.id;
      } else if (devices.length > 1) {
        // Eğer birden fazla kamera varsa, genellikle arka kamera ikinci sırada olur
        // Önce ön kamerayı (front) bul, sonra diğerini seç
        const frontCamera = devices.find((device) => {
          const label = device.label.toLowerCase();
          return (
            label.includes('front') ||
            label.includes('user') ||
            label.includes('ön') ||
            label.includes('qarşı')
          );
        });
        
        if (frontCamera && devices.length > 1) {
          // Ön kamerayı bulduysak, diğer kamerayı seç (arka kamera olabilir)
          cameraId = devices.find((d) => d.id !== frontCamera.id)?.id || devices[devices.length - 1]!.id;
        } else {
          // Ön kamera bulunamadıysa, son kamerayı seç (genellikle arka kamera)
          cameraId = devices[devices.length - 1]!.id;
        }
      } else {
        // Tek kamera varsa onu kullan
        cameraId = devices[0]!.id;
      }

      await html5QrCode.start(
        cameraId,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          // Aynı QR kodun çok hızlı art arda okunmasını engelle (1 saniye)
          const now = Date.now();
          const isSameCode = decodedText === lastScannedCodeRef.current;
          const timeSinceLastScan = now - lastScanTimeRef.current;
          const DUPLICATE_SCAN_THRESHOLD = 1000; // 1 saniye

          if (isSameCode && timeSinceLastScan < DUPLICATE_SCAN_THRESHOLD) {
            // Aynı QR kod çok kısa süre içinde tekrar okundu, yoksay
            console.log('⚠️ QR Scanner: Aynı kod çok hızlı okundu, yoksayılıyor:', decodedText);
            return;
          }

          // Son okunan kodu ve zamanı kaydet
          lastScannedCodeRef.current = decodedText;
          lastScanTimeRef.current = now;

          // QR kod başarıyla okundu - callback'i çağır
          onScanSuccess(decodedText);
          // stopScanner() çağrısını kaldırdık - kamera açık kalacak
        },
        (errorMessage) => {
          // Hata mesajlarını sessizce yok say (sürekli hata mesajları gelir)
          // Sadece kritik hataları göster
          if (errorMessage.includes('No MultiFormat Readers')) {
            setError('QR kod oxunmur. Zəhmət olmasa QR kodu kameraya düzgün göstərin.');
          }
        }
      );

      setIsScanning(true);
      setHasPermission(true);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Naməlum xəta';
      
      if (errorMessage.includes('Permission denied') || errorMessage.includes('NotAllowedError')) {
        setError('Kamera icazəsi verilməyib. Zəhmət olmasa brauzer ayarlarından kamera icazəsi verin.');
        setHasPermission(false);
      } else if (errorMessage.includes('NotFoundError') || errorMessage.includes('DevicesNotFoundError')) {
        setError('Kamera tapılmadı. Zəhmət olmasa kameranızın işlədiyindən əmin olun.');
        setHasPermission(false);
      } else {
        setError(`Kamera başlatıla bilmədi: ${errorMessage}`);
        setHasPermission(false);
      }
      
      setIsScanning(false);
      if (onScanError) {
        onScanError(errorMessage);
      }
    }
  };

  // Scanner'ı durdur
  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch (err) {
        // Hata yok sayılabilir
      }
      scannerRef.current = null;
      setIsScanning(false);
    }
  };

  // Component mount olduğunda scanner'ı başlat
  useEffect(() => {
    startScanner();

    // Cleanup: Component unmount olduğunda scanner'ı durdur
    return () => {
      stopScanner();
    };
  }, []);

  // Manuel durdurma
  const handleStop = () => {
    stopScanner();
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Tarama alanı */}
      <div
        id={scanAreaId}
        ref={scanAreaRef}
        className="aspect-square rounded-lg overflow-hidden bg-secondary-900"
      />

      {/* Hata mesajı */}
      {error && (
        <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-4">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-800">
              <p className="font-medium">Xəta</p>
              <p className="mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Kontrol butonları */}
      <div className="mt-4 flex gap-2">
        {isScanning && (
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleStop}
            leftIcon={<X className="h-4 w-4" />}
          >
            Dayandır
          </Button>
        )}
        {!isScanning && !error && (
          <Button
            className="flex-1"
            onClick={startScanner}
            leftIcon={<Camera className="h-4 w-4" />}
          >
            Kameranı Başlat
          </Button>
        )}
        {onClose && (
          <Button
            variant="outline"
            onClick={handleStop}
          >
            Bağla
          </Button>
        )}
      </div>

      {/* Tarama durumu */}
      {isScanning && (
        <div className="mt-2 text-center">
          <p className="text-sm text-secondary-600 flex items-center justify-center gap-2">
            <Camera className="h-4 w-4 animate-pulse" />
            QR kodu kameraya göstərin...
          </p>
        </div>
      )}
    </div>
  );
};

