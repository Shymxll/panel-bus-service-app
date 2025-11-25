import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/common/Button';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  title: string;
  message: string;
}

export const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  title,
  message,
}: DeleteConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-white rounded-xl shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-secondary-200">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-secondary-900">
              {title}
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
        <div className="p-6">
          <p className="text-secondary-600">{message}</p>
          <p className="mt-2 text-sm text-secondary-500">
            Bu əməliyyat geri alına bilməz.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-secondary-200 bg-secondary-50">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Ləğv et
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            Sil
          </Button>
        </div>
      </div>
    </div>
  );
};


