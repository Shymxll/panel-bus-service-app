import { useState } from 'react';
import { Calendar, Download, FileText } from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { formatDate } from '@/utils/format';

export const ReportsPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const reportTypes = [
    {
      title: 'Günlük Hesabat',
      description: 'Seçilmiş günün minmə/düşmə hesabatı',
      icon: FileText,
    },
    {
      title: 'Aylıq Hesabat',
      description: 'Aylıq statistika və məlumatlar',
      icon: Calendar,
    },
    {
      title: 'Şagird Tarixçəsi',
      description: 'Seçilmiş şagirdin bütün hərəkət tarixçəsi',
      icon: FileText,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Hesabatlar</h1>
        <p className="mt-1 text-secondary-600">
          Sistemin hesabatlarını görüntüləyin və yükləyin
        </p>
      </div>

      {/* Date Range */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Tarix Seçin</h2>
        </CardHeader>
        <CardBody>
          <div className="flex flex-wrap gap-4">
            <input
              type="date"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="rounded-lg border border-secondary-300 px-3 py-2"
            />
            <Button variant="primary" leftIcon={<FileText className="h-4 w-4" />}>
              Hesabat Yarad
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Report Types */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reportTypes.map((report, index) => {
          const Icon = report.icon;
          return (
            <Card key={index}>
              <CardBody>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                  <Icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-secondary-900">
                  {report.title}
                </h3>
                <p className="mt-2 text-sm text-secondary-600">
                  {report.description}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 w-full"
                  leftIcon={<Download className="h-4 w-4" />}
                >
                  Yüklə
                </Button>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Son Hesabatlar</h2>
        </CardHeader>
        <CardBody>
          <div className="text-center py-8 text-secondary-500">
            Hələ ki hesabat yaradılmayıb
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

