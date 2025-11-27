import { useState } from 'react';
import { X, Clock, Plus, Edit2, Trash2, Route as RouteIcon } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { useTripsByRoute } from '@/hooks/useTrips';
import { useTrips } from '@/hooks/useTrips';
import { TripFormModal } from './TripFormModal';
import { DeleteConfirmModal } from '@/components/common/DeleteConfirmModal';
import type { Route, Trip } from '@/types';

interface RouteTripsModalProps {
  isOpen: boolean;
  onClose: () => void;
  route: Route | null;
}

// Bir marşruta ait sefeleri listeleyen ve yoneten modal.
export const RouteTripsModal = ({ isOpen, onClose, route }: RouteTripsModalProps) => {
  const { trips: allTrips, deleteTrip } = useTrips();
  const { data: routeTrips = [], isLoading, refetch } = useTripsByRoute(route?.id || 0);
  const [isTripFormOpen, setIsTripFormOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [deleteTripId, setDeleteTripId] = useState<number | null>(null);

  if (!isOpen || !route) return null;

  const handleCreateTrip = () => {
    setSelectedTrip(null);
    setIsTripFormOpen(true);
  };

  const handleEditTrip = (trip: Trip) => {
    setSelectedTrip(trip);
    setIsTripFormOpen(true);
  };

  const handleDeleteTrip = () => {
    // Silme istegini tamamlayip listeyi guncelle.
    if (deleteTripId) {
      deleteTrip(deleteTripId, {
        onSuccess: () => {
          setDeleteTripId(null);
          refetch();
        },
      });
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <div className="relative mx-4 max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-secondary-200 px-6 py-4">
            <div>
              <p className="text-sm text-secondary-500">Marşrut səfərləri</p>
              <h2 className="flex items-center gap-2 text-xl font-semibold text-secondary-900">
                <RouteIcon className="h-5 w-5 text-primary-600" />
                {route.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 transition-colors hover:bg-secondary-100"
            >
              <X className="h-5 w-5 text-secondary-500" />
            </button>
          </div>

          <div className="max-h-[calc(90vh-180px)] overflow-y-auto p-6">
            {/* Yeni sefere gecis butonu */}
            <div className="mb-4">
              <Button
                leftIcon={<Plus className="h-4 w-4" />}
                onClick={handleCreateTrip}
                size="sm"
              >
                Yeni səfər əlavə et
              </Button>
            </div>

            {/* Sefere ait kart listesini goster */}
            {isLoading ? (
              <div className="py-8 text-center text-secondary-500">Yüklənir...</div>
            ) : routeTrips.length === 0 ? (
              <div className="py-8 text-center text-secondary-500">
                <RouteIcon className="h-12 w-12 mx-auto mb-4 text-secondary-300" />
                <p>Hələ ki səfər əlavə edilməyib.</p>
                <p className="text-sm mt-1">Yeni səfər əlavə etmək üçün yuxarıdakı düyməyə basın.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {routeTrips.map((trip) => (
                  <div
                    key={trip.id}
                    className="flex items-center gap-3 rounded-lg border border-secondary-200 bg-white p-3"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
                      <Clock className="h-5 w-5 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-secondary-900">
                        {trip.departureTime}
                      </p>
                      <p className="text-xs text-secondary-500">
                        Səfər ID: {trip.id}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          trip.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-secondary-100 text-secondary-600'
                        }`}
                      >
                        {trip.isActive ? 'Aktiv' : 'Deaktiv'}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditTrip(trip)}
                        title="Redaktə et"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => setDeleteTripId(trip.id)}
                        title="Sil"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-secondary-200 bg-secondary-50 px-6 py-4">
            <Button variant="outline" onClick={onClose}>
              Bağla
            </Button>
          </div>
        </div>
      </div>

      {/* Sefere ait olusturma/düzenleme formu */}
      <TripFormModal
        isOpen={isTripFormOpen}
        onClose={() => {
          setIsTripFormOpen(false);
          setSelectedTrip(null);
          refetch();
        }}
        route={route}
        trip={selectedTrip}
      />

      {/* Silme onay modali */}
      <DeleteConfirmModal
        isOpen={deleteTripId !== null}
        title="Səfəri sil"
        message="Bu səfəri silmək istədiyinizdən əminsiniz? Bu səfər planlarda istifadə olunursa, oradan da çıxarılmalıdır."
        onClose={() => setDeleteTripId(null)}
        onConfirm={handleDeleteTrip}
      />
    </>
  );
};

