import { useState, useMemo } from 'react';
import { Card, CardBody, CardHeader } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  MapPin,
  Route as RouteIcon,
  Bus,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ToggleLeft,
  ToggleRight,
  Settings,
} from 'lucide-react';
import { useRoutes } from '@/hooks/useRoutes';
import { useBuses } from '@/hooks/useBuses';
import { RouteFormModal } from '../components/RouteFormModal';
import { RouteStopsModal } from '../components/RouteStopsModal';
import { DeleteConfirmModal } from '@/components/common/DeleteConfirmModal';
import type { Route } from '@/types';

export const RouteManagement = () => {
  const {
    routes,
    isLoading,
    refetch,
    deleteRoute,
    updateRoute,
    isDeleting,
    isUpdating,
    createRoute,
    updateRoute: updateRouteFn,
    isCreating,
    isUpdating: isUpdatingRoute,
  } = useRoutes();
  const { buses } = useBuses();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [busFilter, setBusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof Route>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStopsModalOpen, setIsStopsModalOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);

  // Bus map for quick lookup
  const busMap = useMemo(() => {
    const map = new Map<number, typeof buses[0]>();
    buses.forEach(bus => map.set(bus.id, bus));
    return map;
  }, [buses]);

  // Filtered and sorted routes
  const filteredRoutes = useMemo(() => {
    let result = [...routes];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(r =>
        r.name.toLowerCase().includes(query) ||
        r.description?.toLowerCase().includes(query) ||
        (r.busId && busMap.get(r.busId)?.plateNumber.toLowerCase().includes(query))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(r =>
        statusFilter === 'active' ? r.isActive : !r.isActive
      );
    }

    // Bus filter
    if (busFilter !== 'all') {
      if (busFilter === 'unassigned') {
        result = result.filter(r => !r.busId);
      } else if (busFilter === 'assigned') {
        result = result.filter(r => !!r.busId);
      } else {
        result = result.filter(r => r.busId === Number(busFilter));
      }
    }

    // Sort
    result.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortDirection === 'asc'
        ? (aValue > bValue ? 1 : -1)
        : (aValue < bValue ? 1 : -1);
    });

    return result;
  }, [routes, searchQuery, statusFilter, busFilter, sortField, sortDirection, busMap]);

  // Statistics
  const stats = useMemo(() => ({
    total: routes.length,
    active: routes.filter(r => r.isActive).length,
    inactive: routes.filter(r => !r.isActive).length,
    assigned: routes.filter(r => !!r.busId).length,
  }), [routes]);

  // Handlers
  const handleSort = (field: keyof Route) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleEdit = (route: Route) => {
    setSelectedRoute(route);
    setIsFormModalOpen(true);
  };

  const handleDelete = (route: Route) => {
    setSelectedRoute(route);
    setIsDeleteModalOpen(true);
  };

  const handleManageStops = (route: Route) => {
    setSelectedRoute(route);
    setIsStopsModalOpen(true);
  };

  const handleToggleStatus = (route: Route) => {
    updateRoute({
      id: route.id,
      data: { isActive: !route.isActive }
    });
  };

  const handleConfirmDelete = () => {
    if (selectedRoute) {
      deleteRoute(selectedRoute.id);
      setIsDeleteModalOpen(false);
      setSelectedRoute(null);
    }
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedRoute(null);
  };

  const SortIcon = ({ field }: { field: keyof Route }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Marşrutlar</h1>
          <p className="mt-1 text-secondary-600">
            Marşrut və dayanacaqları idarə edin
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            leftIcon={<RefreshCw className="h-4 w-4" />}
            onClick={() => refetch()}
            disabled={isLoading}
          >
            Yenilə
          </Button>
          <Button
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => setIsFormModalOpen(true)}
          >
            Yeni Marşrut
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-500 p-2">
                <RouteIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-600">Cəmi</p>
                <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-500 p-2">
                <RouteIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-green-600">Aktiv</p>
                <p className="text-2xl font-bold text-green-900">{stats.active}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="border-red-200 bg-gradient-to-br from-red-50 to-red-100">
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-red-500 p-2">
                <RouteIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-red-600">Deaktiv</p>
                <p className="text-2xl font-bold text-red-900">{stats.inactive}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-500 p-2">
                <Bus className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-purple-600">Təyin edilmiş</p>
                <p className="text-2xl font-bold text-purple-900">{stats.assigned}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardBody className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            {/* Search */}
            <div className="flex-1">
              <Input
                placeholder="Marşrut adı, təsvir və ya plaka ilə axtar..."
                leftIcon={<Search className="h-5 w-5" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <select
                className="rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
              >
                <option value="all">Bütün statuslar</option>
                <option value="active">Aktiv</option>
                <option value="inactive">Deaktiv</option>
              </select>

              <select
                className="rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                value={busFilter}
                onChange={(e) => setBusFilter(e.target.value)}
              >
                <option value="all">Bütün avtobuslar</option>
                <option value="assigned">Təyin edilmiş</option>
                <option value="unassigned">Təyin edilməmiş</option>
                {buses.map(bus => (
                  <option key={bus.id} value={bus.id}>
                    {bus.plateNumber}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Routes Table */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Marşrutlar ({filteredRoutes.length})
          </h2>
        </CardHeader>
        <CardBody className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-primary-500" />
            </div>
          ) : filteredRoutes.length === 0 ? (
            <div className="py-12 text-center text-secondary-500">
              {routes.length === 0 ? (
                <>
                  <RouteIcon className="h-12 w-12 mx-auto mb-4 text-secondary-300" />
                  <p>Hələ ki marşrut əlavə edilməyib.</p>
                  <p className="text-sm mt-1">Yeni marşrut əlavə etmək üçün yuxarıdakı düyməyə basın.</p>
                </>
              ) : (
                <>
                  <Search className="h-12 w-12 mx-auto mb-4 text-secondary-300" />
                  <p>Axtarış nəticəsi tapılmadı.</p>
                  <p className="text-sm mt-1">Filtirləri dəyişdirməyi yoxlayın.</p>
                </>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-secondary-200 bg-secondary-50">
                  <tr>
                    <th
                      className="cursor-pointer px-4 py-3 text-left text-sm font-semibold text-secondary-700 hover:bg-secondary-100"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-1">
                        Marşrut adı
                        <SortIcon field="name" />
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-700">
                      Təsvir
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-700">
                      Avtobus
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-700">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-secondary-700">
                      Əməliyyatlar
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-100">
                  {filteredRoutes.map((route) => (
                    <tr key={route.id} className="transition-colors hover:bg-secondary-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 font-semibold text-primary-700">
                            <RouteIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium text-secondary-900">{route.name}</p>
                            <p className="text-xs text-secondary-500">
                              ID: {route.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-secondary-700">
                          {route.description || <span className="text-secondary-400">-</span>}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        {route.busId ? (
                          <div className="flex items-center gap-2 text-sm text-secondary-700">
                            <Bus className="h-4 w-4 text-secondary-400" />
                            {busMap.get(route.busId)?.plateNumber || 'Avtobus tapılmadı'}
                          </div>
                        ) : (
                          <span className="text-sm text-secondary-400">Təyin edilməyib</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleStatus(route)}
                          disabled={isUpdating}
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${
                            route.isActive
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                          title={
                            route.isActive
                              ? 'Deaktiv etmək üçün klikləyin'
                              : 'Aktiv etmək üçün klikləyin'
                          }
                        >
                          {route.isActive ? (
                            <ToggleRight className="h-3.5 w-3.5" />
                          ) : (
                            <ToggleLeft className="h-3.5 w-3.5" />
                          )}
                          {route.isActive ? 'Aktiv' : 'Deaktiv'}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleManageStops(route)}
                            title="Dayanacaqları idarə et"
                          >
                            <MapPin className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(route)}
                            title="Redaktə et"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleDelete(route)}
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

      {/* Modals */}
      <RouteFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        route={selectedRoute}
        buses={buses}
        createRoute={createRoute}
        updateRoute={updateRouteFn}
        isCreating={isCreating}
        isUpdating={isUpdatingRoute}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Marşrutu sil"
        message={selectedRoute ? `${selectedRoute.name} adlı marşrutu silmək istədiyinizə əminsiniz?` : ''}
      />

      <RouteStopsModal
        isOpen={isStopsModalOpen}
        onClose={() => {
          setIsStopsModalOpen(false);
          setSelectedRoute(null);
        }}
        route={selectedRoute}
      />
    </div>
  );
};
