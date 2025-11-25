import { useState, useMemo } from 'react';
import { Calendar, Plus, Edit2, Trash2, RefreshCw, Search, ArrowUp, ArrowDown } from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useDailyPlansByDate } from '@/hooks/useDailyPlans';
import { useStudents } from '@/hooks/useStudents';
import { useTrips } from '@/hooks/useTrips';
import { useBuses } from '@/hooks/useBuses';
import { useRoutes } from '@/hooks/useRoutes';
import { DailyPlanFormModal } from '../components/DailyPlanFormModal';
import { DeleteConfirmModal } from '@/components/common/DeleteConfirmModal';
import { useDailyPlans } from '@/hooks/useDailyPlans';
import type { DailyPlan } from '@/types';
import { formatDate } from '@/utils/format';

export const PlanningPage = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'boarding' | 'dropoff'>('all');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<DailyPlan | null>(null);

  const { data: dailyPlans = [], isLoading, refetch } = useDailyPlansByDate(selectedDate);
  const { students } = useStudents();
  const { trips } = useTrips();
  const { buses } = useBuses();
  const { routes } = useRoutes();
  const { deleteDailyPlan, isDeleting } = useDailyPlans();

  // Maps for quick lookup
  const studentMap = useMemo(() => {
    const map = new Map<number, typeof students[0]>();
    students.forEach(s => map.set(s.id, s));
    return map;
  }, [students]);

  const tripMap = useMemo(() => {
    const map = new Map<number, typeof trips[0]>();
    trips.forEach(t => map.set(t.id, t));
    return map;
  }, [trips]);

  const busMap = useMemo(() => {
    const map = new Map<number, typeof buses[0]>();
    buses.forEach(b => map.set(b.id, b));
    return map;
  }, [buses]);

  const routeMap = useMemo(() => {
    const map = new Map<number, typeof routes[0]>();
    routes.forEach(r => map.set(r.id, r));
    return map;
  }, [routes]);

  // Filtered plans
  const filteredPlans = useMemo(() => {
    let result = [...dailyPlans];

    // Type filter
    if (typeFilter !== 'all') {
      result = result.filter(p => 
        typeFilter === 'boarding' ? p.isBoarding : !p.isBoarding
      );
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => {
        const student = studentMap.get(p.studentId);
        const bus = busMap.get(p.busId);
        const trip = tripMap.get(p.tripId);
        const route = trip ? routeMap.get(trip.routeId) : undefined;

        return (
          student?.firstName.toLowerCase().includes(query) ||
          student?.lastName.toLowerCase().includes(query) ||
          student?.school.toLowerCase().includes(query) ||
          bus?.plateNumber.toLowerCase().includes(query) ||
          route?.name.toLowerCase().includes(query) ||
          trip?.departureTime.includes(query)
        );
      });
    }

    // Sort by trip departure time
    result.sort((a, b) => {
      const tripA = tripMap.get(a.tripId);
      const tripB = tripMap.get(b.tripId);
      if (!tripA || !tripB) return 0;
      return tripA.departureTime.localeCompare(tripB.departureTime);
    });

    return result;
  }, [dailyPlans, typeFilter, searchQuery, studentMap, busMap, tripMap, routeMap]);

  // Group plans by type
  const boardingPlans = filteredPlans.filter(p => p.isBoarding);
  const dropoffPlans = filteredPlans.filter(p => !p.isBoarding);

  // Statistics
  const stats = useMemo(() => ({
    total: dailyPlans.length,
    boarding: dailyPlans.filter(p => p.isBoarding).length,
    dropoff: dailyPlans.filter(p => !p.isBoarding).length,
    students: new Set(dailyPlans.map(p => p.studentId)).size,
    buses: new Set(dailyPlans.map(p => p.busId)).size,
  }), [dailyPlans]);

  const handleEdit = (plan: DailyPlan) => {
    setSelectedPlan(plan);
    setIsFormModalOpen(true);
  };

  const handleDelete = (plan: DailyPlan) => {
    setSelectedPlan(plan);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedPlan) {
      deleteDailyPlan(selectedPlan.id, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setSelectedPlan(null);
        },
      });
    }
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedPlan(null);
  };

  const getStudentName = (studentId: number) => {
    const student = studentMap.get(studentId);
    return student ? `${student.firstName} ${student.lastName}` : 'Bilinməyən';
  };

  const getBusPlate = (busId: number) => {
    return busMap.get(busId)?.plateNumber || 'Bilinməyən';
  };

  const getTripInfo = (tripId: number) => {
    const trip = tripMap.get(tripId);
    if (!trip) return 'Bilinməyən';
    const route = routeMap.get(trip.routeId);
    return `${route?.name || `Marşrut #${trip.routeId}`} - ${trip.departureTime}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Günlük Planlama</h1>
          <p className="mt-1 text-secondary-600">
            Növbəti gün üçün servis planı yaradın və idarə edin
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
            Yeni Plan
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-500 p-2">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-600">Cəmi Planlar</p>
                <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-500 p-2">
                <ArrowUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-green-600">Minmə</p>
                <p className="text-2xl font-bold text-green-900">{stats.boarding}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-orange-500 p-2">
                <ArrowDown className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-orange-600">Düşmə</p>
                <p className="text-2xl font-bold text-orange-900">{stats.dropoff}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-500 p-2">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-purple-600">Şagirdlər</p>
                <p className="text-2xl font-bold text-purple-900">{stats.students}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-indigo-500 p-2">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-indigo-600">Avtobuslar</p>
                <p className="text-2xl font-bold text-indigo-900">{stats.buses}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Date Selector and Filters */}
      <Card>
        <CardBody className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            {/* Date Selector */}
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-secondary-400" />
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-auto"
              />
            </div>

            {/* Search */}
            <div className="flex-1">
              <Input
                placeholder="Şagird, avtobus, marşrut və ya vaxt ilə axtar..."
                leftIcon={<Search className="h-5 w-5" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Type Filter */}
            <div className="flex gap-2">
              <select
                className="rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as 'all' | 'boarding' | 'dropoff')}
              >
                <option value="all">Bütün planlar</option>
                <option value="boarding">Minmə planları</option>
                <option value="dropoff">Düşmə planları</option>
              </select>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Plans List */}
      {isLoading ? (
        <Card>
          <CardBody className="p-12">
            <div className="flex items-center justify-center">
              <RefreshCw className="h-8 w-8 animate-spin text-primary-500" />
            </div>
          </CardBody>
        </Card>
      ) : filteredPlans.length === 0 ? (
        <Card>
          <CardBody className="p-12">
            <div className="text-center text-secondary-500">
              {dailyPlans.length === 0 ? (
                <>
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-secondary-300" />
                  <p>Bu tarix üçün plan yoxdur.</p>
                  <p className="text-sm mt-1">Yeni plan əlavə etmək üçün yuxarıdakı düyməyə basın.</p>
                </>
              ) : (
                <>
                  <Search className="h-12 w-12 mx-auto mb-4 text-secondary-300" />
                  <p>Axtarış nəticəsi tapılmadı.</p>
                  <p className="text-sm mt-1">Filtirləri dəyişdirməyi yoxlayın.</p>
                </>
              )}
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Minmə Planları */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowUp className="h-5 w-5 text-green-600" />
                <h2 className="text-lg font-semibold text-secondary-900">
                  Minmə Planları ({boardingPlans.length})
                </h2>
              </div>
            </CardHeader>
            <CardBody className="p-0">
              {boardingPlans.length === 0 ? (
                <div className="text-center py-8 text-secondary-500">
                  Minmə planı yoxdur
                </div>
              ) : (
                <div className="divide-y divide-secondary-100">
                  {boardingPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className="p-4 hover:bg-secondary-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-secondary-900">
                            {getStudentName(plan.studentId)}
                          </p>
                          <p className="text-sm text-secondary-600 mt-1">
                            {getTripInfo(plan.tripId)}
                          </p>
                          <p className="text-xs text-secondary-500 mt-1">
                            Avtobus: {getBusPlate(plan.busId)}
                          </p>
                          {plan.notes && (
                            <p className="text-xs text-secondary-400 mt-1 italic">
                              {plan.notes}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-1 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(plan)}
                            title="Redaktə et"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(plan)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Sil"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Düşmə Planları */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowDown className="h-5 w-5 text-orange-600" />
                <h2 className="text-lg font-semibold text-secondary-900">
                  Düşmə Planları ({dropoffPlans.length})
                </h2>
              </div>
            </CardHeader>
            <CardBody className="p-0">
              {dropoffPlans.length === 0 ? (
                <div className="text-center py-8 text-secondary-500">
                  Düşmə planı yoxdur
                </div>
              ) : (
                <div className="divide-y divide-secondary-100">
                  {dropoffPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className="p-4 hover:bg-secondary-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-secondary-900">
                            {getStudentName(plan.studentId)}
                          </p>
                          <p className="text-sm text-secondary-600 mt-1">
                            {getTripInfo(plan.tripId)}
                          </p>
                          <p className="text-xs text-secondary-500 mt-1">
                            Avtobus: {getBusPlate(plan.busId)}
                          </p>
                          {plan.notes && (
                            <p className="text-xs text-secondary-400 mt-1 italic">
                              {plan.notes}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-1 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(plan)}
                            title="Redaktə et"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(plan)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Sil"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      )}

      {/* Modals */}
      <DailyPlanFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        dailyPlan={selectedPlan}
        defaultDate={selectedDate}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Planı sil"
        message={
          selectedPlan
            ? `${getStudentName(selectedPlan.studentId)} üçün planı silmək istədiyinizə əminsiniz?`
            : ''
        }
      />
    </div>
  );
};
