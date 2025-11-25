import { useRef } from 'react';
import { X, Download, Printer, QrCode } from 'lucide-react';
import { Button } from '@/components/common/Button';
import type { Student } from '@/types';

interface StudentQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
}

export const StudentQrModal = ({ isOpen, onClose, student }: StudentQrModalProps) => {
  const qrRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !student) return null;

  // Simple QR code SVG generator (basic implementation)
  const generateQrSvg = (text: string, size: number = 200) => {
    // This is a placeholder - in production, use a proper QR library like qrcode.react
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`;
    return qrUrl;
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = generateQrSvg(student.qrCode, 400);
    link.download = `${student.firstName}-${student.lastName}-qr.png`;
    link.click();
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>QR Kod - ${student.firstName} ${student.lastName}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
                padding: 20px;
                box-sizing: border-box;
              }
              .card {
                border: 2px solid #e5e7eb;
                border-radius: 12px;
                padding: 24px;
                text-align: center;
                max-width: 300px;
              }
              .qr-code {
                margin: 16px 0;
              }
              .name {
                font-size: 20px;
                font-weight: bold;
                color: #1f2937;
                margin-bottom: 8px;
              }
              .info {
                font-size: 14px;
                color: #6b7280;
                margin: 4px 0;
              }
              .qr-text {
                font-family: monospace;
                font-size: 12px;
                color: #9ca3af;
                margin-top: 12px;
              }
              @media print {
                body { padding: 0; }
              }
            </style>
          </head>
          <body>
            <div class="card">
              <div class="name">${student.firstName} ${student.lastName}</div>
              <div class="info">${student.school}</div>
              <div class="info">Sinif: ${student.grade}</div>
              <div class="qr-code">
                <img src="${generateQrSvg(student.qrCode, 200)}" alt="QR Kod" />
              </div>
              <div class="qr-text">${student.qrCode}</div>
            </div>
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                }
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-sm mx-4 bg-white rounded-xl shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-secondary-200">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
              <QrCode className="h-5 w-5 text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-secondary-900">
              QR Kod
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-secondary-100 transition-colors"
          >
            <X className="h-5 w-5 text-secondary-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6" ref={qrRef}>
          <div className="text-center">
            {/* Student Info */}
            <h3 className="text-xl font-bold text-secondary-900">
              {student.firstName} {student.lastName}
            </h3>
            <p className="text-secondary-600">{student.school}</p>
            <p className="text-sm text-secondary-500">Sinif: {student.grade}</p>

            {/* QR Code */}
            <div className="my-6 flex justify-center">
              <div className="p-4 bg-white border-2 border-secondary-200 rounded-xl">
                <img
                  src={generateQrSvg(student.qrCode, 180)}
                  alt={`QR Kod: ${student.qrCode}`}
                  className="w-44 h-44"
                />
              </div>
            </div>

            {/* QR Code Text */}
            <p className="font-mono text-sm text-secondary-400">
              {student.qrCode}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-3 px-6 py-4 border-t border-secondary-200 bg-secondary-50">
          <Button
            variant="outline"
            leftIcon={<Download className="h-4 w-4" />}
            onClick={handleDownload}
          >
            Yüklə
          </Button>
          <Button
            leftIcon={<Printer className="h-4 w-4" />}
            onClick={handlePrint}
          >
            Çap et
          </Button>
        </div>
      </div>
    </div>
  );
};

