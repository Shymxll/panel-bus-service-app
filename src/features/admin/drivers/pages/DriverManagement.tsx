import { useMemo, useState } from 'react';
import {
  Plus,
  Search,
  RefreshCw,
  Phone,
  Mail,
  ToggleLeft,
  ToggleRight,
  UserCheck,
  UserX,
  UserCircle,
  Clock,
  Pencil,
  Trash2,
} from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Loading } from '@/components/common/Loading';
import { useUsers } from '@/hooks/useUsers';
import { DriverFormModal } from '../components/DriverFormModal';
import { DeleteConfirmModal } from '@/components/common/DeleteConfirmModal';
import { formatDateTime } from '@/utils/format';
import type { User } from '@/types';

type StatusFilter = 'all' | 'active' | 'inactive';
type SortOption = 'name-asc' | 'name-desc' | 'date-desc' | 'date-asc';

// Şoför kadrosunu yönetme, filtreleme ve durum değiştirme ekranı.
export const DriverManagement = () => {
  const {
    drivers,
    isLoading,
    refetch,
    createDriver,
    updateUser,
    deleteUser,
    isCreatingDriver,
    isUpdating,
    isDeleting,
  } = useUsers();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortOption, setSortOption] = useState<SortOption>('name-asc');
  const [selectedDriver, setSelectedDriver] = useState<User | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const stats = useMemo(
    () => ({
      total: drivers.length,
      active: drivers.filter((driver) => driver.isActive).length,
      inactive: drivers.filter((driver) => !driver.isActive).length,
    }),
    [drivers]
  );

  const filteredDrivers = useMemo(() => {
    let result = [...drivers];

    if (searchQuery) {
      // Ad, e-posta veya telefon üzerinden serbest metin araması.
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (driver) =>
          driver.name.toLowerCase().includes(query) ||
          driver.email.toLowerCase().includes(query) ||
          driver.phone?.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter((driver) =>
        statusFilter === 'active' ? driver.isActive : !driver.isActive
      );
    }

    result.sort((a, b) => {
      // Secilen siralama kriterini uygula.
      switch (sortOption) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'date-desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'date-asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        default:
          return 0;
      }
    });

    return result;
  }, [drivers, searchQuery, statusFilter, sortOption]);

  const handleAddDriver = () => {
    setSelectedDriver(null);
    setIsFormModalOpen(true);
  };

  const handleEditDriver = (driver: User) => {
    setSelectedDriver(driver);
    setIsFormModalOpen(true);
  };

  const handleToggleStatus = (driver: User) => {
    updateUser({
      id: driver.id,
      data: { isActive: !driver.isActive },
    });
  };

  const handleDeleteDriver = (driver: User) => {
    setSelectedDriver(driver);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    // Onaylanan silme istegini API'ye ilet.
    if (!selectedDriver) return;
    setDeletingId(selectedDriver.id);
    deleteUser(selectedDriver.id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        setSelectedDriver(null);
        setDeletingId(null);
      },
      onError: () => {
        setDeletingId(null);
      },
    });
  };

  if (isLoading) {
    return <Loading size="lg" text="Yüklənir..." className="py-20" />;
  }

  return (
    <div className="space-y-6">
      {/* Baslik ve hizli aksiyonlar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Şoförlər</h1>
          <p className="mt-1 text-secondary-600">
            Şoför heyətini idarə edin, statuslarını dəyişin və yeni sürücülər əlavə edin
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
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={handleAddDriver}>
            Yeni Şoför
          </Button>
        </div>
      </div>

      {/* Şoför kadrosu özet kartları */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardBody className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Cəmi Şoför</p>
              <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
            </div>
            <div className="rounded-full bg-blue-500 p-3 text-white">
              <UserCircle className="h-6 w-6" />
            </div>
          </CardBody>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardBody className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Aktiv</p>
              <p className="text-3xl font-bold text-green-900">{stats.active}</p>
            </div>
            <div className="rounded-full bg-green-500 p-3 text-white">
              <UserCheck className="h-6 w-6" />
            </div>
          </CardBody>
        </Card>
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardBody className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600">Deaktiv</p>
              <p className="text-3xl font-bold text-red-900">{stats.inactive}</p>
            </div>
            <div className="rounded-full bg-red-500 p-3 text-white">
              <UserX className="h-6 w-6" />
            </div>
          </CardBody>
        </Card>
      </div>

 	    {/* Filtre ve sıralama araçları */}
      <Card>
        <CardBody className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="flex-1">
            <Input
              placeholder="Ad, email və ya telefon ilə axtar..."
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
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
            >
              <option value="name-asc">Ad (A-Z)</option>
              <option value="name-desc">Ad (Z-A)</option>
              <option value="date-desc">Ən yeni</option>
              <option value="date-asc">Ən köhnə</option>
            </select>
          </div>
        </CardBody>
      </Card>

      {/* Şoför tablo görünümü */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Şoförlər ({filteredDrivers.length})</h2>
        </CardHeader>
        <CardBody className="p-0">
          {filteredDrivers.length === 0 ? (
            <div className="text-center py-12 text-secondary-500">
              {drivers.length === 0
                ? 'Hələ ki şoför əlavə edilməyib.'
                : 'Axtarış kriteriyalarına uyğun şoför tapılmadı.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary-50 border-b border-secondary-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-700">
                      Şoför
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-700">
                      Əlaqə
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
                  {filteredDrivers.map((driver) => (
                    <tr key={driver.id} className="hover:bg-secondary-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-semibold">
                            {driver.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-secondary-900">{driver.name}</p>
                            <p className="text-xs text-secondary-500">ID: {driver.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2 text-secondary-700">
                            <Mail className="h-4 w-4 text-secondary-400" />
                            {driver.email}
                          </div>
                          <div className="flex items-center gap-2 text-secondary-500">
                            <Phone className="h-4 w-4 text-secondary-400" />
                            {driver.phone || '-'}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleStatus(driver)}
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all hover:shadow-md ${
                            driver.isActive
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                          title={driver.isActive ? 'Deaktiv etmək üçün klikləyin' : 'Aktiv etmək üçün klikləyin'}
                        >
                          {driver.isActive ? (
                            <ToggleRight className="h-3.5 w-3.5" />
                          ) : (
                            <ToggleLeft className="h-3.5 w-3.5" />
                          )}
                          {driver.isActive ? 'Aktiv' : 'Deaktiv'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-sm text-secondary-600">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-secondary-400" />
                          {formatDateTime(driver.createdAt)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditDriver(driver)}
                            title="Redaktə et"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteDriver(driver)}
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

      {/* Form ve silme onay modalları */}
      <DriverFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        driver={selectedDriver}
        createDriver={createDriver}
        updateDriver={updateUser}
        isCreating={isCreatingDriver}
        isUpdating={isUpdating}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedDriver(null);
          setDeletingId(null);
        }}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting && deletingId === selectedDriver?.id}
        title="Şoförü sil"
        message={
          selectedDriver
            ? `${selectedDriver.name} adlı şoförü silmək istədiyinizə əminsiniz?`
            : ''
        }
      />
    </div>
  );
};

