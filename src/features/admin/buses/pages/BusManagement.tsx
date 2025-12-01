import { useMemo, useState } from 'react';
import {
  Plus,
  Search,
  RefreshCw,
  BusFront,
  Users,
  UserMinus,
  ToggleLeft,
  ToggleRight,
  Gauge,
  GaugeCircle,
  Mail,
  Phone,
  Clock,
  Pencil,
  Trash2,
} from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Loading } from '@/components/common/Loading';
import { useBuses } from '@/hooks/useBuses';
import { useUsers } from '@/hooks/useUsers';
import { formatDateTime } from '@/utils/format';
import { BusFormModal } from '../components/BusFormModal';
import { DeleteConfirmModal } from '@/components/common/DeleteConfirmModal';
import type { Bus, User } from '@/types';

type StatusFilter = 'all' | 'active' | 'inactive';
type DriverFilter = 'all' | 'assigned' | 'unassigned' | number;
type SortOption = 'plate-asc' | 'plate-desc' | 'capacity-desc' | 'capacity-asc';

// Avtobus envanterini filtreleyip sofor atamalariyla birlikte yoneten sayfa.
export const BusManagement = () => {
  const {
    buses,
    isLoading,
    refetch,
    createBus,
    updateBus,
    deleteBus,
    isCreating,
    isUpdating,
    isDeleting,
  } = useBuses();
  const { drivers, isLoading: isDriversLoading } = useUsers();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [driverFilter, setDriverFilter] = useState<DriverFilter>('all');
  const [sortOption, setSortOption] = useState<SortOption>('plate-asc');
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const driverMap = useMemo(() => {
    // Sürücü bilgilerini hızlı erişim için id -> driver map'ine çevir.
    const map = new Map<number, User>();
    drivers.forEach((driver) => map.set(driver.id, driver));
    return map;
  }, [drivers]);

  const stats = useMemo(
    () => ({
      total: buses.length,
      active: buses.filter((bus) => bus.isActive).length,
      assigned: buses.filter((bus) => bus.driverId).length,
      unassigned: buses.filter((bus) => !bus.driverId).length,
    }),
    [buses]
  );

  const filteredBuses = useMemo(() => {
    let result = [...buses];
    const query = searchQuery.toLowerCase();

    if (query) {
      // Plaka/marka/model aramasını uygula.
      result = result.filter(
        (bus) =>
          bus.plateNumber.toLowerCase().includes(query) ||
          bus.brand?.toLowerCase().includes(query) ||
          bus.model?.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== 'all') {
      // Aktif/deaktif filtrelemesi.
      result = result.filter((bus) => (statusFilter === 'active' ? bus.isActive : !bus.isActive));
    }

    if (driverFilter !== 'all') {
      if (driverFilter === 'assigned') {
        result = result.filter((bus) => !!bus.driverId);
      } else if (driverFilter === 'unassigned') {
        result = result.filter((bus) => !bus.driverId);
      } else {
        result = result.filter((bus) => bus.driverId === driverFilter);
      }
    }

    result.sort((a, b) => {
      // Secilen kritere gore siralama yap.
      switch (sortOption) {
        case 'plate-asc':
          return a.plateNumber.localeCompare(b.plateNumber);
        case 'plate-desc':
          return b.plateNumber.localeCompare(a.plateNumber);
        case 'capacity-desc':
          return b.capacity - a.capacity;
        case 'capacity-asc':
          return a.capacity - b.capacity;
        default:
          return 0;
      }
    });

    return result;
  }, [buses, searchQuery, statusFilter, driverFilter, sortOption]);

  const handleAddBus = () => {
    setSelectedBus(null);
    setIsFormModalOpen(true);
  };

  const handleEditBus = (bus: Bus) => {
    setSelectedBus(bus);
    setIsFormModalOpen(true);
  };

  const handleToggleStatus = (bus: Bus) => {
    updateBus({
      id: bus.id,
      data: { isActive: !bus.isActive },
    });
  };

  const handleDeleteBus = (bus: Bus) => {
    setSelectedBus(bus);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    // Silme onayi geldikten sonra API'ye istegi gonder.
    if (!selectedBus) return;
    setDeletingId(selectedBus.id);
    deleteBus(selectedBus.id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        setSelectedBus(null);
        setDeletingId(null);
      },
      onError: () => setDeletingId(null),
    });
  };

  if (isLoading || isDriversLoading) {
    return <Loading size="lg" text="Yüklənir..." className="py-20" />;
  }

  return (
    <div className="space-y-6">
      {/* Baslik ve ana aksiyon butonlari */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Avtobuslar</h1>
          <p className="mt-1 text-secondary-600">
            Avtobus parkınızı idarə edin, tutumları izləyin və şoför təyinatlarını qurun
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            leftIcon={<RefreshCw className="h-4 w-4" />}
            onClick={() => refetch()}
          >
            Yenilə
          </Button>
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={handleAddBus}>
            Yeni Avtobus
          </Button>
        </div>
      </div>

      {/* Envanter ozet kartlari */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardBody className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Cəmi</p>
              <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
            </div>
            <div className="rounded-full bg-blue-500 p-3 text-white">
              <BusFront className="h-6 w-6" />
            </div>
          </CardBody>
        </Card>
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardBody className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Aktiv</p>
              <p className="text-3xl font-bold text-green-900">{stats.active}</p>
            </div>
            <div className="rounded-full bg-green-500 p-3 text-white">
              <Gauge className="h-6 w-6" />
            </div>
          </CardBody>
        </Card>
        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardBody className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600">Sürücü təyin edilmiş</p>
              <p className="text-3xl font-bold text-purple-900">{stats.assigned}</p>
            </div>
            <div className="rounded-full bg-purple-500 p-3 text-white">
              <Users className="h-6 w-6" />
            </div>
          </CardBody>
        </Card>
        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
          <CardBody className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600">Boş avtobus</p>
              <p className="text-3xl font-bold text-orange-900">{stats.unassigned}</p>
            </div>
            <div className="rounded-full bg-orange-500 p-3 text-white">
              <UserMinus className="h-6 w-6" />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Arama ve filtre kontrolleri */}
      <Card>
        <CardBody className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="flex-1">
            <Input
              placeholder="Plaka, marka və ya model ilə axtar..."
              leftIcon={<Search className="h-5 w-5" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              className="rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            >
              <option value="all">Bütün statuslar</option>
              <option value="active">Aktiv</option>
              <option value="inactive">Deaktiv</option>
            </select>
            <select
              className="rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              value={driverFilter}
              onChange={(e) =>
                setDriverFilter(
                  e.target.value === 'assigned'
                    ? 'assigned'
                    : e.target.value === 'unassigned'
                      ? 'unassigned'
                      : e.target.value === 'all'
                        ? 'all'
                        : Number(e.target.value)
                )
              }
            >
              <option value="all">Bütün sürücülər</option>
              <option value="assigned">Sürücü təyin edilmiş</option>
              <option value="unassigned">Sürücü təyin edilməmiş</option>
              {drivers.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.name}
                </option>
              ))}
            </select>
            <select
              className="rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
            >
              <option value="plate-asc">Plaka (A-Z)</option>
              <option value="plate-desc">Plaka (Z-A)</option>
              <option value="capacity-desc">Tutum (Çoxdan aza)</option>
              <option value="capacity-asc">Tutum (Azdan çoxa)</option>
            </select>
          </div>
        </CardBody>
      </Card>

      {/* Detay tablo gorunumu */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Avtobuslar ({filteredBuses.length})</h2>
        </CardHeader>
        <CardBody className="p-0">
          {filteredBuses.length === 0 ? (
            <div className="py-12 text-center text-secondary-500">
              {buses.length === 0
                ? 'Hələ ki avtobus əlavə edilməyib.'
                : 'Axtarış kriteriyalarına uyğun avtobus tapılmadı.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-secondary-200 bg-secondary-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-700">
                      Avtobus
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-700">
                      Tutum
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-700">
                      Sürücü
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-700">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-700">
                      Qeyd tarixi
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-secondary-700">
                      Əməliyyatlar
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-100">
                  {filteredBuses.map((bus) => (
                    <tr key={bus.id} className="transition-colors hover:bg-secondary-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 font-semibold text-primary-700">
                            {bus.plateNumber.slice(0, 3).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-secondary-900">{bus.plateNumber}</p>
                            <p className="text-xs text-secondary-500">
                              {bus.brand || 'Marka yoxdur'} • {bus.model || 'Model yoxdur'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                          <GaugeCircle className="h-3.5 w-3.5" />
                          {bus.capacity} nəfər
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {bus.driverId ? (
                          <div className="space-y-1 text-sm">
                            <p className="font-medium text-secondary-900">
                              {driverMap.get(bus.driverId)?.name || 'Sürücü tapılmadı'}
                            </p>
                            {driverMap.get(bus.driverId)?.email && (
                              <div className="flex items-center gap-2 text-xs text-secondary-600">
                                <Mail className="h-3.5 w-3.5" />
                                {driverMap.get(bus.driverId)?.email}
                              </div>
                            )}
                            {driverMap.get(bus.driverId)?.phone && (
                              <div className="flex items-center gap-2 text-xs text-secondary-500">
                                <Phone className="h-3.5 w-3.5" />
                                {driverMap.get(bus.driverId)?.phone}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-secondary-400">Sürücü təyin edilməyib</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleStatus(bus)}
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all hover:shadow-md ${
                            bus.isActive
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                          title={
                            bus.isActive
                              ? 'Deaktiv etmək üçün klikləyin'
                              : 'Aktiv etmək üçün klikləyin'
                          }
                        >
                          {bus.isActive ? (
                            <ToggleRight className="h-3.5 w-3.5" />
                          ) : (
                            <ToggleLeft className="h-3.5 w-3.5" />
                          )}
                          {bus.isActive ? 'Aktiv' : 'Deaktiv'}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 text-sm text-secondary-600">
                          <Clock className="h-4 w-4 text-secondary-400" />
                          {formatDateTime(bus.createdAt)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditBus(bus)}
                            title="Redaktə et"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleDeleteBus(bus)}
                            title="Sil"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Form ve silme onay modal kaliplari */}
      <BusFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        bus={selectedBus}
        drivers={drivers}
        createBus={createBus}
        updateBus={updateBus}
        isCreating={isCreating}
        isUpdating={isUpdating}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedBus(null);
          setDeletingId(null);
        }}
        onConfirm={confirmDelete}
        isLoading={isDeleting && deletingId === selectedBus?.id}
        title="Avtobusu sil"
        message={
          selectedBus
            ? `${selectedBus.plateNumber} plakalı avtobusu silmək istədiyinizə əminsiniz?`
            : ''
        }
      />
    </div>
  );
};
