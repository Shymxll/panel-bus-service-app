import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { X, MapPin, Plus, Trash2, Clock } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useStops } from '@/hooks/useStops';
import { useRoutes } from '@/hooks/useRoutes';
import { routeService } from '@/services/route.service';
import type { Route, RouteStop, Stop } from '@/types';

interface RouteStopsModalProps {
  isOpen: boolean;
  onClose: () => void;
  route: Route | null;
}

// Bir marşrutun durak siralamasini yoneten modal.
export const RouteStopsModal = ({ isOpen, onClose, route }: RouteStopsModalProps) => {
  const { stops, isLoading: isStopsLoading } = useStops();
  const { addRouteStop, deleteRouteStop, isAddingStop, isDeletingStop } = useRoutes();
  
  const [selectedStopId, setSelectedStopId] = useState<number | ''>('');
  const [order, setOrder] = useState<number>(1);
  const [estimatedTime, setEstimatedTime] = useState<string>('');

  // Secilen rotanin duraklarini cek.
  const { data: routeStops = [], isLoading: isRouteStopsLoading, refetch } = useQuery({
    queryKey: ['routes', route?.id, 'stops'],
    queryFn: () => routeService.getRouteStops(route!.id),
    enabled: !!route?.id,
  });

  // Durak detaylarini id uzerinden hizli ulasmak icin map'e cevir.
  const stopMap = new Map<number, Stop>();
  stops.forEach(stop => stopMap.set(stop.id, stop));

  // Rotada olmayan duraklari filtreleyerek kullanilabilir liste olustur.
  const availableStops = stops.filter(
    stop => !routeStops.some(rs => rs.stopId === stop.id)
  );

  // Siparis numarasina gore duraklari sirala.
  const sortedRouteStops = [...routeStops].sort((a, b) => a.order - b.order);

  useEffect(() => {
    // Otomatik olarak bir sonraki sirayi oner.
    if (routeStops.length > 0) {
      const maxOrder = Math.max(...routeStops.map(rs => rs.order));
      setOrder(maxOrder + 1);
    } else {
      setOrder(1);
    }
  }, [routeStops]);

  const handleAddStop = () => {
    if (!selectedStopId || !route) return;

    addRouteStop(
      {
        routeId: route.id,
        stopId: Number(selectedStopId),
        order,
        estimatedArrivalTime: estimatedTime || undefined,
      },
      {
        onSuccess: () => {
          setSelectedStopId('');
          setEstimatedTime('');
          refetch();
        },
      }
    );
  };

  const handleDeleteStop = (routeStopId: number) => {
    if (confirm('Bu dayanacağı marşrutdan silmək istədiyinizdən əminsiniz?')) {
      deleteRouteStop(routeStopId, {
        onSuccess: () => {
          refetch();
        },
      });
    }
  };

  if (!isOpen || !route) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative mx-4 max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-secondary-200 px-6 py-4">
          <div>
            <p className="text-sm text-secondary-500">Marşrut dayanacaqları</p>
            <h2 className="flex items-center gap-2 text-xl font-semibold text-secondary-900">
              <MapPin className="h-5 w-5 text-primary-600" />
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
          {/* Yeni durak ekleme formu */}
          <div className="mb-6 rounded-lg border border-secondary-200 bg-secondary-50 p-4">
            <h3 className="mb-3 text-sm font-semibold text-secondary-700">Yeni dayanacaq əlavə et</h3>
            <div className="grid gap-3 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-secondary-700">
                  Dayanacaq
                </label>
                <select
                  className="w-full rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  value={selectedStopId}
                  onChange={(e) => setSelectedStopId(e.target.value ? Number(e.target.value) : '')}
                  disabled={isStopsLoading || availableStops.length === 0}
                >
                  <option value="">Dayanacaq seçin</option>
                  {availableStops.map((stop) => (
                    <option key={stop.id} value={stop.id}>
                      {stop.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-secondary-700">
                  Sıra
                </label>
                <Input
                  type="number"
                  min={1}
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value) || 1)}
                  placeholder="1"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-secondary-700">
                  Təxmini vaxt
                </label>
                <Input
                  type="time"
                  value={estimatedTime}
                  onChange={(e) => setEstimatedTime(e.target.value)}
                  placeholder="08:00"
                />
              </div>
            </div>
            <Button
              onClick={handleAddStop}
              disabled={!selectedStopId || isAddingStop}
              isLoading={isAddingStop}
              className="mt-3"
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Əlavə et
            </Button>
          </div>

          {/* Mevcut durak listesi */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-secondary-700">
              Marşrut dayanacaqları ({sortedRouteStops.length})
            </h3>
            {isRouteStopsLoading ? (
              <div className="py-8 text-center text-secondary-500">Yüklənir...</div>
            ) : sortedRouteStops.length === 0 ? (
              <div className="py-8 text-center text-secondary-500">
                Hələ ki dayanacaq əlavə edilməyib
              </div>
            ) : (
              <div className="space-y-2">
                {sortedRouteStops.map((routeStop, index) => {
                  const stop = stopMap.get(routeStop.stopId);
                  return (
                    <div
                      key={routeStop.id}
                      className="flex items-center gap-3 rounded-lg border border-secondary-200 bg-white p-3"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
                        {routeStop.order}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-secondary-900">
                          {stop?.name || 'Dayanacaq tapılmadı'}
                        </p>
                        {stop?.address && (
                          <p className="text-xs text-secondary-500">{stop.address}</p>
                        )}
                        {routeStop.estimatedArrivalTime && (
                          <div className="mt-1 flex items-center gap-1 text-xs text-secondary-600">
                            <Clock className="h-3 w-3" />
                            {routeStop.estimatedArrivalTime}
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteStop(routeStop.id)}
                        disabled={isDeletingStop}
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                        title="Sil"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-secondary-200 bg-secondary-50 px-6 py-4">
          <Button variant="outline" onClick={onClose}>
            Bağla
          </Button>
        </div>
      </div>
    </div>
  );
};

