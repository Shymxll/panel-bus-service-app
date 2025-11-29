import { useState, useMemo } from 'react';
import { Card, CardBody, CardHeader } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Table } from '@/components/common/Table';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Building2,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { useSchools, useSchoolMutations } from '@/hooks/useSchools';
import { SchoolFormModal } from '../components/SchoolFormModal';
import { DeleteConfirmModal } from '@/components/common/DeleteConfirmModal';
import type { School } from '@/types';

export const SchoolManagement = () => {
  const { data: schools = [], isLoading, refetch } = useSchools();
  const { deleteSchool, updateSchool, isDeleting, isUpdating } = useSchoolMutations();
  
  // Arama ve filtre için kullanılan UI durumları
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortField, setSortField] = useState<keyof School>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Modal aç/kapa durumları ve seçili kayıt
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

  // Filtreleme ve sıralama
  const filteredSchools = useMemo(() => {
    let result = [...schools];

    // Metin araması
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(s => 
        s.name.toLowerCase().includes(query) ||
        s.address?.toLowerCase().includes(query) ||
        s.phone?.includes(query) ||
        s.email?.toLowerCase().includes(query)
      );
    }

    // Duruma göre filtreleme
    if (statusFilter !== 'all') {
      result = result.filter(s => 
        statusFilter === 'active' ? s.isActive : !s.isActive
      );
    }

    // Sıralama
    result.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue, 'az')
          : bValue.localeCompare(aValue, 'az');
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [schools, searchQuery, statusFilter, sortField, sortDirection]);

  // Sıralama değiştirme
  const handleSort = (field: keyof School) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Modalları açma fonksiyonları
  const handleAddClick = () => {
    setSelectedSchool(null);
    setIsFormModalOpen(true);
  };

  const handleEditClick = (school: School) => {
    setSelectedSchool(school);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (school: School) => {
    setSelectedSchool(school);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedSchool) {
      deleteSchool(selectedSchool.id, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setSelectedSchool(null);
        },
      });
    }
  };

  // Aktif/Deaktif toggle
  const handleToggleStatus = (school: School) => {
    updateSchool({
      id: school.id,
      data: { isActive: !school.isActive },
    });
  };

  // Filtreleri temizle
  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
  };

  // İstatistikler
  const stats = useMemo(() => ({
    total: schools.length,
    active: schools.filter(s => s.isActive).length,
    inactive: schools.filter(s => !s.isActive).length,
  }), [schools]);

  return (
    <div className="space-y-6">
      {/* Başlık ve İstatistikler */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary-600" />
            Məktəb İdarəçiliyi
          </h1>
          <p className="mt-2 text-secondary-600">
            Məktəbləri idarə edin və yenilərini əlavə edin
          </p>
        </div>
        <Button onClick={handleAddClick} leftIcon={<Plus className="h-5 w-5" />}>
          Yeni Məktəb
        </Button>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Ümumi</p>
                <p className="text-3xl font-bold text-blue-900 mt-2">{stats.total}</p>
              </div>
              <div className="h-12 w-12 bg-blue-200 rounded-xl flex items-center justify-center">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Aktiv</p>
                <p className="text-3xl font-bold text-green-900 mt-2">{stats.active}</p>
              </div>
              <div className="h-12 w-12 bg-green-200 rounded-xl flex items-center justify-center">
                <ToggleRight className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Deaktiv</p>
                <p className="text-3xl font-bold text-red-900 mt-2">{stats.inactive}</p>
              </div>
              <div className="h-12 w-12 bg-red-200 rounded-xl flex items-center justify-center">
                <ToggleLeft className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Filtreler */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Arama */}
            <div className="flex-1">
              <Input
                placeholder="Məktəb adı, ünvan, telefon və ya email ilə axtar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="h-5 w-5" />}
              />
            </div>

            {/* Durum Filtresi */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">Bütün Məktəblər</option>
              <option value="active">Aktiv</option>
              <option value="inactive">Deaktiv</option>
            </select>

            {/* Yenilə Butonu */}
            <Button
              variant="outline"
              onClick={() => refetch()}
              leftIcon={<RefreshCw className="h-5 w-5" />}
            >
              Yenilə
            </Button>

            {/* Filtreleri Temizle */}
            {(searchQuery || statusFilter !== 'all') && (
              <Button variant="ghost" onClick={handleClearFilters}>
                Filtreyi Təmizlə
              </Button>
            )}
          </div>
        </CardHeader>

        <CardBody>
          <Table
            columns={[
              {
                key: 'name',
                label: 'Məktəb Adı',
                sortable: true,
                render: (school: School) => (
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-secondary-900">{school.name}</p>
                      {school.address && (
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3 text-secondary-400" />
                          <p className="text-xs text-secondary-500">{school.address}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ),
              },
              {
                key: 'phone',
                label: 'Əlaqə',
                render: (school: School) => (
                  <div className="space-y-1">
                    {school.phone && (
                      <div className="flex items-center gap-2 text-sm text-secondary-600">
                        <Phone className="h-4 w-4" />
                        {school.phone}
                      </div>
                    )}
                    {school.email && (
                      <div className="flex items-center gap-2 text-sm text-secondary-600">
                        <Mail className="h-4 w-4" />
                        {school.email}
                      </div>
                    )}
                  </div>
                ),
              },
              {
                key: 'isActive',
                label: 'Status',
                render: (school: School) => (
                  <button
                    onClick={() => handleToggleStatus(school)}
                    disabled={isUpdating}
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      school.isActive
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    {school.isActive ? (
                      <ToggleRight className="h-4 w-4" />
                    ) : (
                      <ToggleLeft className="h-4 w-4" />
                    )}
                    {school.isActive ? 'Aktiv' : 'Deaktiv'}
                  </button>
                ),
              },
              {
                key: 'actions',
                label: 'Əməliyyatlar',
                render: (school: School) => (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClick(school)}
                      leftIcon={<Edit2 className="h-4 w-4" />}
                    >
                      Redaktə
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(school)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      leftIcon={<Trash2 className="h-4 w-4" />}
                    >
                      Sil
                    </Button>
                  </div>
                ),
              },
            ]}
            data={filteredSchools}
            isLoading={isLoading}
            emptyMessage="Məktəb tapılmadı"
            onSort={handleSort}
            sortField={sortField}
            sortDirection={sortDirection}
          />
        </CardBody>
      </Card>

      {/* Modallar */}
      <SchoolFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedSchool(null);
        }}
        school={selectedSchool}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedSchool(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Məktəbi Sil"
        message={`"${selectedSchool?.name}" məktəbini silmək istədiyinizə əminsiniz? Bu əməliyyat geri alına bilməz.`}
        isLoading={isDeleting}
      />
    </div>
  );
};

