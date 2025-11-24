import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Loading } from '@/components/common/Loading';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@/components/common/Table';
import { useUsers } from '@/hooks/useUsers';
import { formatDateTime } from '@/utils/format';

export const DriverManagement = () => {
  const { drivers, isLoading, deleteUser, isDeleting } = useUsers();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    if (confirm('Bu şoförü silmək istədiyinizdən əminsiniz?')) {
      setDeletingId(id);
      deleteUser(id);
    }
  };

  if (isLoading) {
    return <Loading size="lg" text="Yüklənir..." className="py-20" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Şoförlər</h1>
          <p className="mt-1 text-secondary-600">
            Şoför məlumatlarını idarə edin
          </p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />}>
          Yeni Şoför
        </Button>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Bütün Şoförlər</h2>
        </CardHeader>
        <CardBody className="p-0">
          {drivers.length === 0 ? (
            <div className="text-center py-12 text-secondary-500">
              Hələ ki şoför əlavə edilməyib.
            </div>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell header>ID</TableCell>
                  <TableCell header>Ad</TableCell>
                  <TableCell header>Email</TableCell>
                  <TableCell header>Telefon</TableCell>
                  <TableCell header>Status</TableCell>
                  <TableCell header>Əlavə tarixi</TableCell>
                  <TableCell header>Əməliyyatlar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {drivers.map((driver) => (
                  <TableRow key={driver.id}>
                    <TableCell>{driver.id}</TableCell>
                    <TableCell className="font-medium">{driver.name}</TableCell>
                    <TableCell>{driver.email}</TableCell>
                    <TableCell>{driver.phone || '-'}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          driver.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {driver.isActive ? 'Aktiv' : 'Deaktiv'}
                      </span>
                    </TableCell>
                    <TableCell>{formatDateTime(driver.createdAt)}</TableCell>
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
                          onClick={() => handleDelete(driver.id)}
                          isLoading={isDeleting && deletingId === driver.id}
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

