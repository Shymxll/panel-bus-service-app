import { 
  Users, LogIn, LogOut, Bus, Clock, Calendar, 
  TrendingUp, CheckCircle2, AlertCircle, ArrowRight,
  RefreshCw
} from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Link } from 'react-router-dom';
import { useDriverData } from '@/hooks/useDriverData';
import { useAuthStore } from '@/store/auth-store';

/**
 * Sürücü Dashboard Sayfası
 * Günlük aktivite özeti, istatistikler ve hızlı erişim kartlarını gösterir
 */
export const DriverDashboard = () => {
  const { user } = useAuthStore();
  const {
    todayBoardedCount,
    todayDisembarkedCount,
    todayPlannedCount,
    todayBoardingRecords,
    todayDisembarkingRecords,
    pendingBoardingStudents,
    pendingDisembarkingStudents,
    myBus,
    isLoading,
    refetchBoarding,
    refetchDisembarking,
  } = useDriverData();

  // Bugünün tarihi
  const today = new Date();
  const formattedDate = today.toLocaleDateString('az-AZ', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Saate göre selamlama
  const getGreeting = () => {
    const hour = today.getHours();
    if (hour < 12) return 'Sabahınız xeyir';
    if (hour < 18) return 'Günortanız xeyir';
    return 'Axşamınız xeyir';
  };

  // İstatistik kartları
  const stats = [
    {
      title: 'Minən Şagird',
      value: todayBoardedCount,
      icon: LogIn,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      description: 'Bugün minən',
    },
    {
      title: 'Düşən Şagird',
      value: todayDisembarkedCount,
      icon: LogOut,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      description: 'Bugün düşən',
    },
    {
      title: 'Gözlənilən',
      value: pendingBoardingStudents.length,
      icon: Users,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
      description: 'Planlanmış',
    },
    {
      title: 'Avtobusda',
      value: pendingDisembarkingStudents.length,
      icon: Bus,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      description: 'Hələ düşməyib',
    },
  ];

  // Son aktiviteler
  const recentActivities = [
    ...todayBoardingRecords.slice(-3).map((record) => ({
      type: 'boarding' as const,
      studentId: record.studentId,
      time: new Date(record.recordTime).toLocaleTimeString('az-AZ', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      wasPlanned: record.wasPlanned,
    })),
    ...todayDisembarkingRecords.slice(-3).map((record) => ({
      type: 'disembarking' as const,
      studentId: record.studentId,
      time: new Date(record.recordTime).toLocaleTimeString('az-AZ', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      wasPlanned: record.wasPlanned,
    })),
  ].sort((a, b) => b.time.localeCompare(a.time)).slice(0, 5);

  const handleRefresh = () => {
    refetchBoarding();
    refetchDisembarking();
  };

  return (
    <div className="space-y-6">
      {/* Başlık ve karşılama */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-secondary-500 mb-1">
            <Calendar className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-secondary-900">
            {getGreeting()}, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="mt-1 text-secondary-600">
            Bugünkü fəaliyyətinizə baxış
          </p>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          leftIcon={<RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />}
          disabled={isLoading}
        >
          Yenilə
        </Button>
      </div>

      {/* Otobüs bilgisi */}
      {myBus && (
        <Card className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-0">
          <CardBody className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Bus className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-white/80">Sizin Avtobusunuz</p>
                  <p className="text-xl font-bold">{myBus.plateNumber}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-white/80">Tutum</p>
                <p className="text-xl font-bold">{myBus.capacity} nəfər</p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* İstatistik kartları */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="overflow-hidden">
              <CardBody className="p-0">
                <div className="flex items-stretch">
                  <div className={`w-2 bg-gradient-to-b ${stat.color}`} />
                  <div className="flex-1 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-secondary-600">
                          {stat.title}
                        </p>
                        <p className="mt-1 text-3xl font-bold text-secondary-900">
                          {isLoading ? '...' : stat.value}
                        </p>
                        <p className="mt-1 text-xs text-secondary-500">
                          {stat.description}
                        </p>
                      </div>
                      <div className={`${stat.bgColor} rounded-xl p-3`}>
                        <Icon className={`h-6 w-6 ${stat.textColor}`} />
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Hızlı aksiyon kartları */}
      <div className="grid gap-6 md:grid-cols-2">
        <Link to="/driver/boarding">
          <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-2 border-transparent hover:border-emerald-200">
            <CardBody className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <LogIn className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-secondary-900 group-hover:text-emerald-600 transition-colors">
                    Minənlər
                  </h3>
                  <p className="mt-1 text-sm text-secondary-600">
                    QR kod oxuyaraq minmə qeydi yaradın
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-secondary-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
              </div>
            </CardBody>
          </Card>
        </Link>

        <Link to="/driver/alighting">
          <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-2 border-transparent hover:border-blue-200">
            <CardBody className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <LogOut className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-secondary-900 group-hover:text-blue-600 transition-colors">
                    Düşənlər
                  </h3>
                  <p className="mt-1 text-sm text-secondary-600">
                    QR kod oxuyaraq düşmə qeydi yaradın
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-secondary-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
            </CardBody>
          </Card>
        </Link>
      </div>

      {/* Son aktiviteler ve beklenen öğrenciler */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Son aktiviteler */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-secondary-900">
                Son Fəaliyyətlər
              </h2>
              <Clock className="h-5 w-5 text-secondary-400" />
            </div>
          </CardHeader>
          <CardBody>
            {recentActivities.length > 0 ? (
              <div className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary-50"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === 'boarding'
                          ? 'bg-emerald-100 text-emerald-600'
                          : 'bg-blue-100 text-blue-600'
                      }`}
                    >
                      {activity.type === 'boarding' ? (
                        <LogIn className="h-5 w-5" />
                      ) : (
                        <LogOut className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-secondary-900">
                        Şagird #{activity.studentId}
                      </p>
                      <p className="text-sm text-secondary-500">
                        {activity.type === 'boarding' ? 'Mindi' : 'Düşdü'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-secondary-900">
                        {activity.time}
                      </p>
                      {activity.wasPlanned ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                          <CheckCircle2 className="h-3 w-3" />
                          Planlanmış
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                          <AlertCircle className="h-3 w-3" />
                          Plansız
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-secondary-500">
                <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Hələ fəaliyyət yoxdur</p>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Bugün gözlenen öğrenciler */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-secondary-900">
                Gözlənilən Şagirdlər
              </h2>
              <span className="px-2 py-1 text-xs font-medium text-emerald-700 bg-emerald-100 rounded-full">
                {pendingBoardingStudents.length} nəfər
              </span>
            </div>
          </CardHeader>
          <CardBody>
            {pendingBoardingStudents.length > 0 ? (
              <div className="space-y-2">
                {pendingBoardingStudents.slice(0, 5).map((plan, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-amber-50 border border-amber-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center">
                        <Users className="h-4 w-4 text-amber-700" />
                      </div>
                      <div>
                        <p className="font-medium text-secondary-900">
                          Şagird #{plan.studentId}
                        </p>
                        {plan.notes && (
                          <p className="text-xs text-secondary-500">{plan.notes}</p>
                        )}
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium text-amber-700 bg-amber-200 rounded">
                      Gözlənilir
                    </span>
                  </div>
                ))}
                {pendingBoardingStudents.length > 5 && (
                  <p className="text-center text-sm text-secondary-500 pt-2">
                    +{pendingBoardingStudents.length - 5} daha çox
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-secondary-500">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-emerald-500 opacity-50" />
                <p>Bütün planlanmış şagirdlər mindi</p>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Performans özeti */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-semibold text-secondary-900">
              Bugünkü Performans
            </h2>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-600">
                {todayPlannedCount > 0
                  ? Math.round((todayBoardedCount / todayPlannedCount) * 100)
                  : 0}%
              </div>
              <p className="mt-1 text-sm text-secondary-600">
                Plan Tamamlanma
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">
                {todayBoardedCount + todayDisembarkedCount}
              </div>
              <p className="mt-1 text-sm text-secondary-600">
                Ümumi Əməliyyat
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600">
                {pendingDisembarkingStudents.length}
              </div>
              <p className="mt-1 text-sm text-secondary-600">
                Avtobusda Hazırda
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
