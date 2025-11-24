import { useState } from 'react';
import { QrCode, Camera } from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/common/Card';
import { Button } from '@/components/common/Button';

export const AlightingPage = () => {
  const [isScanning, setIsScanning] = useState(false);

  const handleStartScanning = () => {
    setIsScanning(true);
    // QR scanner will be implemented here
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Düşənlər</h1>
        <p className="mt-1 text-secondary-600">
          Şagirdlərin QR kodunu oxuyaraq düşmə qeydi yaradın
        </p>
      </div>

      {/* QR Scanner */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">QR Kod Oxuyucu</h2>
          </CardHeader>
          <CardBody>
            <div className="aspect-square rounded-lg border-2 border-dashed border-secondary-300 bg-secondary-50 flex items-center justify-center">
              {!isScanning ? (
                <div className="text-center">
                  <QrCode className="mx-auto h-16 w-16 text-secondary-400" />
                  <p className="mt-4 text-sm text-secondary-600">
                    QR kod oxumağa başlamaq üçün düyməyə basın
                  </p>
                  <Button
                    className="mt-4"
                    onClick={handleStartScanning}
                    leftIcon={<Camera className="h-4 w-4" />}
                  >
                    Oxumağa Başla
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <Camera className="mx-auto h-16 w-16 animate-pulse text-primary-600" />
                  <p className="mt-4 text-sm text-secondary-600">
                    QR kod axtarılır...
                  </p>
                  <Button
                    className="mt-4"
                    variant="secondary"
                    onClick={() => setIsScanning(false)}
                  >
                    Dayandır
                  </Button>
                </div>
              )}
            </div>
            <div className="mt-4 rounded-lg bg-blue-50 p-4">
              <p className="text-sm text-blue-800">
                <strong>Məlumat:</strong> Şagirdin QR kodunu kameraya göstərin.
                Sistem avtomatik olaraq oxuyacaq və düşmə qeydini yaradacaq.
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Today's Alighted Students */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Bugün Düşən Şagirdlər</h2>
          </CardHeader>
          <CardBody>
            <div className="text-center py-12 text-secondary-500">
              Hələ ki düşmə qeydi yoxdur
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Boarded Students (not yet alighted) */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Avtobusda Olan Şagirdlər</h2>
        </CardHeader>
        <CardBody>
          <div className="text-center py-12 text-secondary-500">
            Avtobusda şagird yoxdur
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

