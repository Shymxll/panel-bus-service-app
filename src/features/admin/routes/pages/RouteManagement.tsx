import { Card, CardBody, CardHeader } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Plus } from 'lucide-react';

export const RouteManagement = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Marşrutlar</h1>
          <p className="mt-1 text-secondary-600">
            Marşrut və dayanacaqları idarə edin
          </p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />}>
          Yeni Marşrut
        </Button>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Bütün Marşrutlar</h2>
        </CardHeader>
        <CardBody>
          <div className="text-center py-12 text-secondary-500">
            Hələ ki marşrut əlavə edilməyib.
            <br />
            Yeni marşrut əlavə etmək üçün yuxarıdakı düyməyə basın.
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

