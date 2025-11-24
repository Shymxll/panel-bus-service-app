import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Loading } from '@/components/common/Loading';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@/components/common/Table';
import { useBuses } from '@/hooks/useBuses';
import { formatDateTime } from '@/utils/format';

export const BusManagement = () => {
  const { buses, isLoading, deleteBus, isDeleting } = useBuses();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    if (confirm('Bu avtobusu silmək istədiyinizdən əminsiniz?')) {
      setDeletingId(id);
      deleteBus(id);
    }
  };

  if (isLoading) {
    return <Loading size="lg" text="Yüklənir..." className="py-20" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Avtobuslar</h1>
          <p className="mt-1 text-secondary-600">
            Avtobus məlumatlarını idarə edin
          </p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />}>
          Yeni Avtobus
        </Button>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Bütün Avtobuslar</h2>
        </CardHeader>
        <CardBody className="p-0">
          {buses.length === 0 ? (
            <div className="text-center py-12 text-secondary-500">
              Hələ ki avtobus əlavə edilməyib.
            </div>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell header>ID</TableCell>
                  <TableCell header>Plaka</TableCell>
                  <TableCell header>Marka</TableCell>
                  <TableCell header>Model</TableCell>
                  <TableCell header>Tutum</TableCell>
                  <TableCell header>Status</TableCell>
                  <TableCell header>Əlavə tarixi</TableCell>
                  <TableCell header>Əməliyyatlar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {buses.map((bus) => (
                  <TableRow key={bus.id}>
                    <TableCell>{bus.id}</TableCell>
                    <TableCell className="font-medium">{bus.plateNumber}</TableCell>
                    <TableCell>{bus.brand || '-'}</TableCell>
                    <TableCell>{bus.model || '-'}</TableCell>
                    <TableCell>{bus.capacity}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          bus.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {bus.isActive ? 'Aktiv' : 'Deaktiv'}
                      </span>
                    </TableCell>
                    <TableCell>{formatDateTime(bus.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          leftIcon={<Edit className="h-4 w-4" />}
                        >
                          Düzəliş
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          leftIcon={<Trash2 className="h-4 w-4" />}
                          onClick={() => handleDelete(bus.id)}
                          isLoading={isDeleting && deletingId === bus.id}
                        >
                          Sil
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

