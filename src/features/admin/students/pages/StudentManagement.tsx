import { useState, useMemo } from 'react';
import { Card, CardBody, CardHeader } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  QrCode, 
  Users,
  GraduationCap,
  Phone,
  MapPin,
  RefreshCw,
  Download,
  Filter,
  ChevronDown,
  ChevronUp,
  UserCheck,
  UserX,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { useStudents } from '@/hooks/useStudents';
import { StudentFormModal } from '../components/StudentFormModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { StudentQrModal } from '../components/StudentQrModal';
import type { Student } from '@/types';

// Şagird listesini filtreleme, sıralama ve QR aksiyonlarıyla yöneten sayfa.
export const StudentManagement = () => {
  const { students, isLoading, refetch, deleteStudent, updateStudent, isDeleting, isUpdating } = useStudents();
  
  // Arama, filtre ve sıralama için kullanılan UI durumları.
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [schoolFilter, setSchoolFilter] = useState<string>('all');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof Student>('firstName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Modal aç/kapa durumları ve seçili kayıt.
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Filtrelerde kullanılacak benzersiz okul ve sınıf listeleri.
  const schools = useMemo(() => {
    const uniqueSchools = [...new Set(students.map(s => s.school))];
    return uniqueSchools.sort();
  }, [students]);

  const grades = useMemo(() => {
    const uniqueGrades = [...new Set(students.map(s => s.grade))];
    return uniqueGrades.sort();
  }, [students]);

  // Tüm filtre ve sıralama kurallarını uygulayıp tabloya kaynak olacak listeyi üretir.
  const filteredStudents = useMemo(() => {
    let result = [...students];

    // Metin araması: ad, soyad, QR kodu vb.
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(s => 
        s.firstName.toLowerCase().includes(query) ||
        s.lastName.toLowerCase().includes(query) ||
        s.qrCode.toLowerCase().includes(query) ||
        s.school.toLowerCase().includes(query) ||
        s.parentName?.toLowerCase().includes(query) ||
        s.parentPhone?.includes(query)
      );
    }

    // Duruma göre filtreleme (aktif/deaktif)
    if (statusFilter !== 'all') {
      result = result.filter(s => 
        statusFilter === 'active' ? s.isActive : !s.isActive
      );
    }

    // Okul filtresi
    if (schoolFilter !== 'all') {
      result = result.filter(s => s.school === schoolFilter);
    }

    // Sınıf filtresi
    if (gradeFilter !== 'all') {
      result = result.filter(s => s.grade === gradeFilter);
    }

    // Kolon başlığına göre sıralama
    result.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return sortDirection === 'asc' 
        ? (aValue > bValue ? 1 : -1)
        : (aValue < bValue ? 1 : -1);
    });

    return result;
  }, [students, searchQuery, statusFilter, schoolFilter, gradeFilter, sortField, sortDirection]);

  // Kartlarda gösterilen özet sayılar.
  const stats = useMemo(() => ({
    total: students.length,
    active: students.filter(s => s.isActive).length,
    inactive: students.filter(s => !s.isActive).length,
    schools: new Set(students.map(s => s.school)).size,
  }), [students]);

  // Kullanıcı etkileşimleri: sıralama, düzenleme, silme vb.
  const handleSort = (field: keyof Student) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setIsFormModalOpen(true);
  };

  const handleDelete = (student: Student) => {
    setSelectedStudent(student);
    setIsDeleteModalOpen(true);
  };

  const handleShowQr = (student: Student) => {
    setSelectedStudent(student);
    setIsQrModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedStudent) {
      deleteStudent(selectedStudent.id);
      setIsDeleteModalOpen(false);
      setSelectedStudent(null);
    }
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedStudent(null);
  };

  const handleToggleStatus = (student: Student) => {
    updateStudent({
      id: student.id,
      data: { isActive: !student.isActive }
    });
  };

  const SortIcon = ({ field }: { field: keyof Student }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Sayfa başlığı ve üst aksiyonlar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Şagirdlər</h1>
          <p className="mt-1 text-secondary-600">
            Şagird məlumatlarını idarə edin və QR kodlarını yaradın
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            leftIcon={<RefreshCw className="h-4 w-4" />}
            onClick={() => refetch()}
            disabled={isLoading}
          >
            Yenilə
          </Button>
          <Button 
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => setIsFormModalOpen(true)}
          >
            Yeni Şagird
          </Button>
        </div>
      </div>

      {/* Özet kartlar: toplam, aktif, pasif, okul sayısı */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-500 p-2">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-600">Cəmi</p>
                <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-500 p-2">
                <UserCheck className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-green-600">Aktiv</p>
                <p className="text-2xl font-bold text-green-900">{stats.active}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-red-500 p-2">
                <UserX className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-red-600">Deaktiv</p>
                <p className="text-2xl font-bold text-red-900">{stats.inactive}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-500 p-2">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-purple-600">Məktəblər</p>
                <p className="text-2xl font-bold text-purple-900">{stats.schools}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Arama ve filtre çubuğu */}
      <Card>
        <CardBody className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            {/* Metin bazlı arama alanı */}
            <div className="flex-1">
              <Input
                placeholder="Ad, soyad, QR kod, məktəb və ya telefon ilə axtar..."
                leftIcon={<Search className="h-5 w-5" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Durum, okul ve sınıf seçimleri */}
            <div className="flex flex-wrap gap-2">
              <select
                className="rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
              >
                <option value="all">Bütün statuslar</option>
                <option value="active">Aktiv</option>
                <option value="inactive">Deaktiv</option>
              </select>

              <select
                className="rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                value={schoolFilter}
                onChange={(e) => setSchoolFilter(e.target.value)}
              >
                <option value="all">Bütün məktəblər</option>
                {schools.map(school => (
                  <option key={school} value={school}>{school}</option>
                ))}
              </select>

              <select
                className="rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
              >
                <option value="all">Bütün siniflər</option>
                {grades.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Şagird tablo görünümü */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Şagirdlər ({filteredStudents.length})
          </h2>
        </CardHeader>
        <CardBody className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-primary-500" />
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-12 text-secondary-500">
              {students.length === 0 ? (
                <>
                  <Users className="h-12 w-12 mx-auto mb-4 text-secondary-300" />
                  <p>Hələ ki şagird əlavə edilməyib.</p>
                  <p className="text-sm mt-1">Yeni şagird əlavə etmək üçün yuxarıdakı düyməyə basın.</p>
                </>
              ) : (
                <>
                  <Search className="h-12 w-12 mx-auto mb-4 text-secondary-300" />
                  <p>Axtarış nəticəsi tapılmadı.</p>
                  <p className="text-sm mt-1">Filtirləri dəyişdirməyi yoxlayın.</p>
                </>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary-50 border-b border-secondary-200">
                  <tr>
                    <th 
                      className="px-4 py-3 text-left text-sm font-semibold text-secondary-700 cursor-pointer hover:bg-secondary-100"
                      onClick={() => handleSort('firstName')}
                    >
                      <div className="flex items-center gap-1">
                        Ad Soyad
                        <SortIcon field="firstName" />
                      </div>
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-sm font-semibold text-secondary-700 cursor-pointer hover:bg-secondary-100"
                      onClick={() => handleSort('school')}
                    >
                      <div className="flex items-center gap-1">
                        Məktəb
                        <SortIcon field="school" />
                      </div>
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-sm font-semibold text-secondary-700 cursor-pointer hover:bg-secondary-100"
                      onClick={() => handleSort('grade')}
                    >
                      <div className="flex items-center gap-1">
                        Sinif
                        <SortIcon field="grade" />
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-700">
                      Valideyn
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-secondary-700">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-secondary-700">
                      Əməliyyatlar
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-100">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-secondary-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-semibold">
                            {student.firstName[0]}{student.lastName[0]}
                          </div>
                          <div>
                            <p className="font-medium text-secondary-900">
                              {student.firstName} {student.lastName}
                            </p>
                            <p className="text-xs text-secondary-500 font-mono">
                              {student.qrCode}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 text-secondary-700">
                          <GraduationCap className="h-4 w-4 text-secondary-400" />
                          {student.school}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                          {student.grade}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {student.parentName ? (
                          <div>
                            <p className="text-sm text-secondary-700">{student.parentName}</p>
                            {student.parentPhone && (
                              <p className="text-xs text-secondary-500 flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {student.parentPhone}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-secondary-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleStatus(student)}
                          disabled={isUpdating}
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${
                            student.isActive 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                          title={student.isActive ? 'Deaktiv etmək üçün klikləyin' : 'Aktiv etmək üçün klikləyin'}
                        >
                          {student.isActive ? (
                            <ToggleRight className="h-3.5 w-3.5" />
                          ) : (
                            <ToggleLeft className="h-3.5 w-3.5" />
                          )}
                          {student.isActive ? 'Aktiv' : 'Deaktiv'}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleShowQr(student)}
                            title="QR Kodu göstər"
                          >
                            <QrCode className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(student)}
                            title="Redaktə et"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(student)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Sil"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Form, silme onayı ve QR modal entegrasyonları */}
      <StudentFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        student={selectedStudent}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Şagirdi sil"
        message={selectedStudent ? `${selectedStudent.firstName} ${selectedStudent.lastName} adlı şagirdi silmək istədiyinizə əminsiniz?` : ''}
      />

      <StudentQrModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        student={selectedStudent}
      />
    </div>
  );
};
