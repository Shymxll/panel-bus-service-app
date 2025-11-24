import { Users, LogIn, LogOut, Bus } from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Link } from 'react-router-dom';

export const DriverDashboard = () => {
  const todayStats = [
    {
      title: 'Minən Şagird',
      value: '0',
      icon: LogIn,
      color: 'bg-green-500',
    },
    {
      title: 'Düşən Şagird',
      value: '0',
      icon: LogOut,
      color: 'bg-blue-500',
    },
    {
      title: 'Gözlənilən',
      value: '0',
      icon: Users,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">İdarə Paneli</h1>
        <p className="mt-1 text-secondary-600">
          Bugünkü fəaliyyətinizə baxış
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {todayStats.map((stat, index) => {
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

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Link to="/driver/boarding">
          <Card className="cursor-pointer transition-shadow hover:shadow-md">
            <CardBody className="text-center py-12">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <LogIn className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-secondary-900">
                Minənlər
              </h3>
              <p className="mt-2 text-secondary-600">
                Şagirdlərin QR kodunu oxuyaraq minmə qeydi yaradın
              </p>
            </CardBody>
          </Card>
        </Link>

        <Link to="/driver/alighting">
          <Card className="cursor-pointer transition-shadow hover:shadow-md">
            <CardBody className="text-center py-12">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <LogOut className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-secondary-900">
                Düşənlər
              </h3>
              <p className="mt-2 text-secondary-600">
                Şagirdlərin QR kodunu oxuyaraq düşmə qeydi yaradın
              </p>
            </CardBody>
          </Card>
        </Link>
      </div>

      {/* Today's Expected Students */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-secondary-900">
              Bugünkü Gözlənilən Şagirdlər
            </h2>
            <Bus className="h-5 w-5 text-secondary-400" />
          </div>
        </CardHeader>
        <CardBody>
          <div className="text-center py-8 text-secondary-500">
            Bugün üçün plan mövcud deyil
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

