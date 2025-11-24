import { useState } from 'react';
import { Calendar, Plus } from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { formatDate } from '@/utils/format';

export const PlanningPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Günlük Planlama</h1>
          <p className="mt-1 text-secondary-600">
            Növbəti gün üçün servis planı yaradın
          </p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />}>
          Yeni Plan
        </Button>
      </div>

      {/* Date Selector */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Tarix Seçin</h2>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-secondary-400" />
              <span className="text-sm font-medium">
                {formatDate(selectedDate)}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <div className="flex gap-2">
            <input
              type="date"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="rounded-lg border border-secondary-300 px-3 py-2"
            />
          </div>
        </CardBody>
      </Card>

      {/* Planning Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Morning Pickup */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-secondary-900">Səhər Gediş</h3>
          </CardHeader>
          <CardBody>
            <div className="text-center py-8 text-secondary-500">
              Plan əlavə edilməyib
            </div>
          </CardBody>
        </Card>

        {/* Afternoon Dropoff */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-secondary-900">Günorta Dönüş</h3>
          </CardHeader>
          <CardBody>
            <div className="text-center py-8 text-secondary-500">
              Plan əlavə edilməyib
            </div>
          </CardBody>
        </Card>

        {/* Evening Dropoff */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-secondary-900">Axşam Dönüş</h3>
          </CardHeader>
          <CardBody>
            <div className="text-center py-8 text-secondary-500">
              Plan əlavə edilməyib
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

