import { Card, CardBody, CardHeader } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Plus } from 'lucide-react';

export const StudentManagement = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Şagirdlər</h1>
          <p className="mt-1 text-secondary-600">
            Şagird məlumatlarını idarə edin
          </p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />}>
          Yeni Şagird
        </Button>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Bütün Şagirdlər</h2>
        </CardHeader>
        <CardBody>
          <div className="text-center py-12 text-secondary-500">
            Hələ ki şagird əlavə edilməyib.
            <br />
            Yeni şagird əlavə etmək üçün yuxarıdakı düyməyə basın.
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

