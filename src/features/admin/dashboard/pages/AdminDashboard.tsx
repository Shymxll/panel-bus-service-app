import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Bus,
  Route as RouteIcon,
  UserCircle,
  Calendar,
  MapPin,
  Clock,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Loading } from '@/components/common/Loading';
import { useBuses } from '@/hooks/useBuses';
import { useUsers } from '@/hooks/useUsers';
import { useStudents } from '@/hooks/useStudents';
import { useRoutes } from '@/hooks/useRoutes';
import { useStops } from '@/hooks/useStops';
import { useTrips } from '@/hooks/useTrips';
import { useDailyPlansByDate } from '@/hooks/useDailyPlans';
import { formatDate } from '@/utils/format';

// Admin ana ekraninda anlik istatistikleri, son hareketleri ve hizli aksiyonlari topluca gosterir.
export const AdminDashboard = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0]!;

  // Istatistikleri besleyen sorgular: sayaclar ve grafikler icin kaynak veriler.
  const { buses, isLoading: isBusesLoading } = useBuses();
  const { users, drivers, isLoading: isUsersLoading } = useUsers();
  const { students, isLoading: isStudentsLoading } = useStudents();
  const { routes, isLoading: isRoutesLoading } = useRoutes();
  const { stops, isLoading: isStopsLoading } = useStops();
  const { trips = [], isLoading: isTripsLoading } = useTrips();
  const { data: todayPlans = [], isLoading: isPlansLoading } = useDailyPlansByDate(today);

  const isLoading =
    isBusesLoading ||
    isUsersLoading ||
    isStudentsLoading ||
    isRoutesLoading ||
    isStopsLoading ||
    isTripsLoading ||
    isPlansLoading;

  // Sistem genelinde aktif/pasif sayaclarini hesaplar.
  const stats = useMemo(() => {
    const activeStudents = students.filter(s => s.isActive).length;
    const activeDrivers = drivers.filter(d => d.isActive).length;
    const activeBuses = buses.filter(b => b.isActive).length;
    const activeRoutes = routes.filter(r => r.isActive).length;
    const activeTrips = trips.filter(t => t.isActive).length;
    const activeStops = stops.filter(s => s.isActive).length;

    return {
      totalStudents: students.length,
      activeStudents,
      totalDrivers: drivers.length,
      activeDrivers,
      totalBuses: buses.length,
      activeBuses,
      totalRoutes: routes.length,
      activeRoutes,
      totalTrips: trips.length,
      activeTrips,
      totalStops: stops.length,
      activeStops,
      todayPlans: todayPlans.length,
      todayBoarding: todayPlans.filter(p => p.isBoarding).length,
      todayDropoff: todayPlans.filter(p => !p.isBoarding).length,
    };
  }, [students, drivers, buses, routes, trips, stops, todayPlans]);

  // En son olusturulan kayitlari tek listede toplar.
  const recentItems = useMemo(() => {
    const items: Array<{
      type: string;
      title: string;
      subtitle: string;
      icon: typeof Users;
      color: string;
      link: string;
      date: string;
    }> = [];

    // Son eklenen ogrencileri zaman damgasina gore sirala.
    students
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3)
      .forEach(student => {
        items.push({
          type: 'Şagird',
          title: `${student.firstName} ${student.lastName}`,
          subtitle: student.school,
          icon: Users,
          color: 'text-blue-600',
          link: '/admin/students',
          date: student.createdAt,
        });
      });

    // Son eklenen soforleri ayir ve tarihine gore listeye ekle.
    drivers
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 2)
      .forEach(driver => {
        items.push({
          type: 'Şoför',
          title: driver.name,
          subtitle: driver.email,
          icon: UserCircle,
          color: 'text-green-600',
          link: '/admin/drivers',
          date: driver.createdAt,
        });
      });

    return items
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [students, drivers]);

  // Bugune ait planlardan benzersiz ogrenci, otobus ve rota sayisini cikartir.
  const todayPlansSummary = useMemo(() => {
    const uniqueStudents = new Set(todayPlans.map(p => p.studentId)).size;
    const uniqueBuses = new Set(todayPlans.map(p => p.busId)).size;
    const uniqueRoutes = new Set(
      todayPlans
        .map(p => {
          const trip = trips.find(t => t.id === p.tripId);
          return trip?.routeId;
        })
        .filter(Boolean)
    ).size;

    return {
      uniqueStudents,
      uniqueBuses,
      uniqueRoutes,
    };
  }, [todayPlans, trips]);

  if (isLoading) {
    // Tum sorgular tamamlanana kadar merkezi yukleme gostergesi cikar.
    return <Loading size="lg" text="Yüklənir..." className="py-20" />;
  }

  return (
    <div className="space-y-6">
      {/* Sayfa basligi ve manuel yenileme butonu */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">İdarə Paneli</h1>
          <p className="mt-1 text-secondary-600">
            Sisteminizin ümumi görünüşü və statistikaları
          </p>
        </div>
        <Button
          variant="outline"
          leftIcon={<RefreshCw className="h-4 w-4" />}
          onClick={() => window.location.reload()}
        >
          Yenilə
        </Button>
      </div>

      {/* Temel sayaclar: ogrenci, sofor, otobus, rota dagilimi */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Cəmi Şagird</p>
                <p className="mt-1 text-2xl font-bold text-blue-900">
                  {stats.totalStudents}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  {stats.activeStudents} aktiv
                </p>
              </div>
              <div className="rounded-lg bg-blue-500 p-3">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Cəmi Şoför</p>
                <p className="mt-1 text-2xl font-bold text-green-900">
                  {stats.totalDrivers}
                </p>
                <p className="text-xs text-green-700 mt-1">
                  {stats.activeDrivers} aktiv
                </p>
              </div>
              <div className="rounded-lg bg-green-500 p-3">
                <UserCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Cəmi Avtobus</p>
                <p className="mt-1 text-2xl font-bold text-purple-900">
                  {stats.totalBuses}
                </p>
                <p className="text-xs text-purple-700 mt-1">
                  {stats.activeBuses} aktiv
                </p>
              </div>
              <div className="rounded-lg bg-purple-500 p-3">
                <Bus className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Aktiv Marşrut</p>
                <p className="mt-1 text-2xl font-bold text-orange-900">
                  {stats.activeRoutes}
                </p>
                <p className="text-xs text-orange-700 mt-1">
                  {stats.totalRoutes} cəmi
                </p>
              </div>
              <div className="rounded-lg bg-orange-500 p-3">
                <RouteIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Yardimci sayaclar: sefer, durak, bugunku plan ve otobus dagilimi */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Səfərlər</p>
                <p className="mt-1 text-xl font-bold text-secondary-900">
                  {stats.activeTrips}
                </p>
                <p className="text-xs text-secondary-500 mt-1">Aktiv səfərlər</p>
              </div>
              <div className="rounded-lg bg-secondary-100 p-3">
                <Clock className="h-5 w-5 text-secondary-600" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Dayanacaqlar</p>
                <p className="mt-1 text-xl font-bold text-secondary-900">
                  {stats.activeStops}
                </p>
                <p className="text-xs text-secondary-500 mt-1">Aktiv dayanacaqlar</p>
              </div>
              <div className="rounded-lg bg-secondary-100 p-3">
                <MapPin className="h-5 w-5 text-secondary-600" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-600">Bugünkü Planlar</p>
                <p className="mt-1 text-xl font-bold text-indigo-900">
                  {stats.todayPlans}
                </p>
                <p className="text-xs text-indigo-700 mt-1">
                  {stats.todayBoarding} minmə, {stats.todayDropoff} düşmə
                </p>
              </div>
              <div className="rounded-lg bg-indigo-500 p-3">
                <Calendar className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Bugünkü Avtobuslar</p>
                <p className="mt-1 text-xl font-bold text-secondary-900">
                  {todayPlansSummary.uniqueBuses}
                </p>
                <p className="text-xs text-secondary-500 mt-1">
                  {todayPlansSummary.uniqueRoutes} marşrut
                </p>
              </div>
              <div className="rounded-lg bg-secondary-100 p-3">
                <Bus className="h-5 w-5 text-secondary-600" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Bugune ait planlar varsa minme/dusme detayli ozet goster */}
      {stats.todayPlans > 0 && (
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary-600" />
              <h2 className="text-lg font-semibold text-secondary-900">
                Bugünkü Planlar ({formatDate(new Date())})
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin/planning')}
            >
              Hamısını gör
            </Button>
          </CardHeader>
          <CardBody>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <div className="rounded-full bg-green-500 p-2">
                  <ArrowUp className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-700">Minmə Planları</p>
                  <p className="text-lg font-bold text-green-900">
                    {stats.todayBoarding}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <div className="rounded-full bg-orange-500 p-2">
                  <ArrowDown className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-orange-700">Düşmə Planları</p>
                  <p className="text-lg font-bold text-orange-900">
                    {stats.todayDropoff}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="rounded-full bg-blue-500 p-2">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-700">Şagirdlər</p>
                  <p className="text-lg font-bold text-blue-900">
                    {todayPlansSummary.uniqueStudents}
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Son eklenen kayitlarin hizli listesi */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-secondary-900">
              Son Əlavə Edilənlər
            </h2>
          </CardHeader>
          <CardBody>
            {recentItems.length === 0 ? (
              <div className="text-center py-8 text-secondary-500">
                Hələ ki əlavə edilən yoxdur
              </div>
            ) : (
              <div className="space-y-3">
                {recentItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => navigate(item.link)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg border border-secondary-200 hover:bg-secondary-50 transition-colors text-left"
                    >
                      <div className={`rounded-full bg-secondary-100 p-2 ${item.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-secondary-900 truncate">
                          {item.title}
                        </p>
                        <p className="text-xs text-secondary-500 truncate">
                          {item.subtitle}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-secondary-600">
                          {item.type}
                        </p>
                        <p className="text-xs text-secondary-400">
                          {formatDate(new Date(item.date))}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Yoneticinin en sik kullandigi sayfalara kisa yol kutucuklari */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-secondary-900">
              Sürətli Əməliyyatlar
            </h2>
          </CardHeader>
          <CardBody>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => navigate('/admin/students')}
                className="flex flex-col items-center gap-2 rounded-lg border border-secondary-300 p-4 text-center transition-colors hover:bg-secondary-50 hover:border-primary-500"
              >
                <div className="rounded-full bg-blue-100 p-3">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-secondary-900">Şagirdlər</p>
                <p className="text-xs text-secondary-500">İdarə et</p>
              </button>
              <button
                onClick={() => navigate('/admin/drivers')}
                className="flex flex-col items-center gap-2 rounded-lg border border-secondary-300 p-4 text-center transition-colors hover:bg-secondary-50 hover:border-primary-500"
              >
                <div className="rounded-full bg-green-100 p-3">
                  <UserCircle className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-sm font-medium text-secondary-900">Şoförlər</p>
                <p className="text-xs text-secondary-500">İdarə et</p>
              </button>
              <button
                onClick={() => navigate('/admin/buses')}
                className="flex flex-col items-center gap-2 rounded-lg border border-secondary-300 p-4 text-center transition-colors hover:bg-secondary-50 hover:border-primary-500"
              >
                <div className="rounded-full bg-purple-100 p-3">
                  <Bus className="h-6 w-6 text-purple-600" />
                </div>
                <p className="text-sm font-medium text-secondary-900">Avtobuslar</p>
                <p className="text-xs text-secondary-500">İdarə et</p>
              </button>
              <button
                onClick={() => navigate('/admin/routes')}
                className="flex flex-col items-center gap-2 rounded-lg border border-secondary-300 p-4 text-center transition-colors hover:bg-secondary-50 hover:border-primary-500"
              >
                <div className="rounded-full bg-orange-100 p-3">
                  <RouteIcon className="h-6 w-6 text-orange-600" />
                </div>
                <p className="text-sm font-medium text-secondary-900">Marşrutlar</p>
                <p className="text-xs text-secondary-500">İdarə et</p>
              </button>
              <button
                onClick={() => navigate('/admin/planning')}
                className="flex flex-col items-center gap-2 rounded-lg border border-secondary-300 p-4 text-center transition-colors hover:bg-secondary-50 hover:border-primary-500"
              >
                <div className="rounded-full bg-indigo-100 p-3">
                  <Calendar className="h-6 w-6 text-indigo-600" />
                </div>
                <p className="text-sm font-medium text-secondary-900">Planlama</p>
                <p className="text-xs text-secondary-500">Günlük planlar</p>
              </button>
              <button
                onClick={() => navigate('/admin/planning')}
                className="flex flex-col items-center gap-2 rounded-lg border-2 border-dashed border-primary-300 p-4 text-center transition-colors hover:bg-primary-50 hover:border-primary-500"
              >
                <div className="rounded-full bg-primary-100 p-3">
                  <Plus className="h-6 w-6 text-primary-600" />
                </div>
                <p className="text-sm font-medium text-primary-900">Yeni Plan</p>
                <p className="text-xs text-primary-600">Əlavə et</p>
              </button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
