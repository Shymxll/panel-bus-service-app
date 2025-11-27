import { useState, useMemo } from 'react';
import { MapPin, Plus, Search, ToggleLeft, ToggleRight, Trash2, Edit, Map } from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useStops } from '@/hooks/useStops';
import { StopFormModal } from '../components/StopFormModal';
import { DeleteConfirmModal } from '@/components/common/DeleteConfirmModal';
import { Loading } from '@/components/common/Loading';
import type { Stop } from '@/types';

// Tum durak kayitlarini filtreleyip yoneten sayfa.
export const StopManagement = () => {
  const { stops, isLoading, deleteStop, updateStop } = useStops();
  const [search, setSearch] = useState('');
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const stats = useMemo(() => {
    const total = stops.length;
    const active = stops.filter(s => s.isActive).length;
    const inactive = total - active;
    return { total, active, inactive };
  }, [stops]);

  const filteredStops = useMemo(() => {
    const q = search.toLowerCase();
    return stops.filter((s) => {
      if (showOnlyActive && !s.isActive) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        (s.address || '').toLowerCase().includes(q) ||
        (s.latitude || '').toLowerCase().includes(q) ||
        (s.longitude || '').toLowerCase().includes(q)
      );
    });
  }, [stops, search, showOnlyActive]);

  const handleToggleActive = (stop: Stop) => {
    updateStop({ id: stop.id, data: { isActive: !stop.isActive } });
  };

  const handleEdit = (stop: Stop) => {
    setSelectedStop(stop);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedStop(null);
    setIsFormOpen(true);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteStop(deleteId);
    setDeleteId(null);
  };

  if (isLoading) {
    return <Loading size="lg" text="Dayanacaqlar yüklənir..." className="py-20" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Dayanacaqlar</h1>
          <p className="mt-1 text-secondary-600">
            Marşrutlarda istifadə olunan bütün dayanacaqları idarə edin
          </p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={handleCreate}>
          Yeni dayanacaq
        </Button>
      </div>

      {/* Durum ozet kartlari */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Ümumi Dayanacaqlar</p>
                <p className="mt-1 text-2xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <div className="rounded-lg bg-blue-500 p-3">
                <MapPin className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Aktiv Dayanacaqlar</p>
                <p className="mt-1 text-2xl font-bold text-green-900">{stats.active}</p>
              </div>
              <div className="rounded-lg bg-green-500 p-3">
                <Map className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Deaktiv Dayanacaqlar</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{stats.inactive}</p>
              </div>
              <div className="rounded-lg bg-gray-500 p-3">
                <MapPin className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardBody className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Input
              placeholder="Dayanacaq axtar (ad, ünvan, koordinat)..."
              leftIcon={<Search className="h-4 w-4" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="sm:max-w-xs"
            />
            <button
              type="button"
              onClick={() => setShowOnlyActive((v) => !v)}
              className="inline-flex items-center gap-2 text-sm text-secondary-700"
            >
              {showOnlyActive ? (
                <ToggleRight className="h-5 w-5 text-primary-600" />
              ) : (
                <ToggleLeft className="h-5 w-5 text-secondary-400" />
              )}
              Yalnız aktiv dayanacaqlar
            </button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-secondary-200">
            <table className="min-w-full divide-y divide-secondary-200 text-sm">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-secondary-700">Ad</th>
                  <th className="px-4 py-2 text-left font-medium text-secondary-700">Ünvan</th>
                  <th className="px-4 py-2 text-left font-medium text-secondary-700">Koordinat</th>
                  <th className="px-4 py-2 text-left font-medium text-secondary-700">Status</th>
                  <th className="px-4 py-2 text-right font-medium text-secondary-700">Əməliyyatlar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-100 bg-white">
                {filteredStops.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-secondary-500">
                      Heç bir dayanacaq tapılmadı
                    </td>
                  </tr>
                ) : (
                  filteredStops.map((stop) => (
                    <tr key={stop.id}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50">
                            <MapPin className="h-4 w-4 text-primary-600" />
                          </span>
                          <div>
                            <p className="font-medium text-secondary-900">{stop.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="max-w-xs truncate text-secondary-700">
                          {stop.address || '-'}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        {stop.latitude && stop.longitude ? (
                          <p className="text-xs text-secondary-600 font-mono">
                            {stop.latitude}, {stop.longitude}
                          </p>
                        ) : (
                          <p className="text-xs text-secondary-400">-</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(stop)}
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${stop.isActive
                              ? 'bg-green-50 text-green-700'
                              : 'bg-secondary-100 text-secondary-600'
                            }`}
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${stop.isActive ? 'bg-green-500' : 'bg-secondary-400'
                              }`}
                          />
                          {stop.isActive ? 'Aktiv' : 'Deaktiv'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(stop)}
                            leftIcon={<Edit className="h-4 w-4" />}
                          >
                            Redaktə et
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                            leftIcon={<Trash2 className="h-4 w-4" />}
                            onClick={() => setDeleteId(stop.id)}
                          >
                            Sil
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      <StopFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        stop={selectedStop}
      />

      <DeleteConfirmModal
        isOpen={deleteId !== null}
        title="Dayanacağı sil"
        message="Bu dayanacağı silmək istədiyinizdən əminsiniz? Bu dayanacaq marşrutlarda istifadə olunursa, oradan da çıxarılmalıdır."
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};


