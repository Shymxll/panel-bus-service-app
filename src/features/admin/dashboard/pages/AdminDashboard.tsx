import { Users, Bus, Route as RouteIcon, UserCircle } from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/common/Card';
import { Loading } from '@/components/common/Loading';
import { useBuses } from '@/hooks/useBuses';
import { useUsers } from '@/hooks/useUsers';

export const AdminDashboard = () => {
  const { buses, isLoading: isBusesLoading } = useBuses();
  const { users, drivers, isLoading: isUsersLoading } = useUsers();

  const isLoading = isBusesLoading || isUsersLoading;

  const stats = [
    {
      title: 'Cəmi Şagird',
      value: '0', // To be implemented
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Cəmi Şoför',
      value: drivers.length.toString(),
      icon: UserCircle,
      color: 'bg-green-500',
    },
    {
      title: 'Cəmi Avtobus',
      value: buses.length.toString(),
      icon: Bus,
      color: 'bg-purple-500',
    },
    {
      title: 'Aktiv Marşrut',
      value: '0', // To be implemented
      icon: RouteIcon,
      color: 'bg-orange-500',
    },
  ];

  if (isLoading) {
    return <Loading size="lg" text="Yüklənir..." className="py-20" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">İdarə Paneli</h1>
        <p className="mt-1 text-secondary-600">
          Sisteminizin ümumi görünüşü
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary-600">
                      {stat.title}
                    </p>
                    <p className="mt-2 text-3xl font-bold text-secondary-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.color} rounded-full p-3`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-secondary-900">
            Son Fəaliyyətlər
          </h2>
        </CardHeader>
        <CardBody>
          <div className="text-center py-8 text-secondary-500">
            Hələ ki fəaliyyət yoxdur
          </div>
        </CardBody>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-secondary-900">
            Sürətli Əməliyyatlar
          </h2>
        </CardHeader>
        <CardBody>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button className="rounded-lg border border-secondary-300 p-4 text-center transition-colors hover:bg-secondary-50">
              <Users className="mx-auto h-8 w-8 text-primary-600" />
              <p className="mt-2 text-sm font-medium">Şagird əlavə et</p>
            </button>
            <button className="rounded-lg border border-secondary-300 p-4 text-center transition-colors hover:bg-secondary-50">
              <UserCircle className="mx-auto h-8 w-8 text-primary-600" />
              <p className="mt-2 text-sm font-medium">Şoför əlavə et</p>
            </button>
            <button className="rounded-lg border border-secondary-300 p-4 text-center transition-colors hover:bg-secondary-50">
              <Bus className="mx-auto h-8 w-8 text-primary-600" />
              <p className="mt-2 text-sm font-medium">Avtobus əlavə et</p>
            </button>
            <button className="rounded-lg border border-secondary-300 p-4 text-center transition-colors hover:bg-secondary-50">
              <RouteIcon className="mx-auto h-8 w-8 text-primary-600" />
              <p className="mt-2 text-sm font-medium">Marşrut əlavə et</p>
            </button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

