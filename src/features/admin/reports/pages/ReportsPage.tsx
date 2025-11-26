import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Download,
  FileText,
  Users,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Search,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { formatDate, formatDateTime } from '@/utils/format';
import { useBoardingRecordsByDate } from '@/hooks/useBoardingRecords';
import { useDisembarkingRecordsByDate } from '@/hooks/useDisembarkingRecords';
import { useDailyPlansByDate } from '@/hooks/useDailyPlans';
import { useStudents } from '@/hooks/useStudents';
import { useBuses } from '@/hooks/useBuses';
import { useTrips } from '@/hooks/useTrips';
import { useRoutes } from '@/hooks/useRoutes';
import { Loading } from '@/components/common/Loading';

export const ReportsPage = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);

  // Data hooks
  const { data: boardingRecords = [], isLoading: isBoardingLoading } =
    useBoardingRecordsByDate(selectedDate);
  const { data: disembarkingRecords = [], isLoading: isDisembarkingLoading } =
    useDisembarkingRecordsByDate(selectedDate);
  const { data: dailyPlans = [], isLoading: isPlansLoading } =
    useDailyPlansByDate(selectedDate);
  const { students, isLoading: isStudentsLoading } = useStudents();
  const { buses, isLoading: isBusesLoading } = useBuses();
  const { trips, isLoading: isTripsLoading } = useTrips();
  const { routes, isLoading: isRoutesLoading } = useRoutes();

  const isLoading =
    isBoardingLoading ||
    isDisembarkingLoading ||
    isPlansLoading ||
    isStudentsLoading ||
    isBusesLoading ||
    isTripsLoading ||
    isRoutesLoading;

  // Maps for quick lookup
  const studentMap = useMemo(() => {
    const map = new Map<number, typeof students[0]>();
    students.forEach(s => map.set(s.id, s));
    return map;
  }, [students]);

  const busMap = useMemo(() => {
    const map = new Map<number, typeof buses[0]>();
    buses.forEach(b => map.set(b.id, b));
    return map;
  }, [buses]);

  const tripMap = useMemo(() => {
    const map = new Map<number, typeof trips[0]>();
    trips.forEach(t => map.set(t.id, t));
    return map;
  }, [trips]);

  const routeMap = useMemo(() => {
    const map = new Map<number, typeof routes[0]>();
    routes.forEach(r => map.set(r.id, r));
    return map;
  }, [routes]);

  // Statistics
  const stats = useMemo(() => {
    const plannedBoarding = dailyPlans.filter(p => p.isBoarding).length;
    const plannedDropoff = dailyPlans.filter(p => !p.isBoarding).length;
    const actualBoarding = boardingRecords.length;
    const actualDropoff = disembarkingRecords.length;
    const plannedBoardingRecords = boardingRecords.filter(r => r.wasPlanned).length;
    const plannedDropoffRecords = disembarkingRecords.filter(r => r.wasPlanned).length;

    return {
      plannedBoarding,
      plannedDropoff,
      actualBoarding,
      actualDropoff,
      plannedBoardingRecords,
      plannedDropoffRecords,
      unplannedBoarding: actualBoarding - plannedBoardingRecords,
      unplannedDropoff: actualDropoff - plannedDropoffRecords,
      missedBoarding: plannedBoarding - actualBoarding,
      missedDropoff: plannedDropoff - actualDropoff,
    };
  }, [dailyPlans, boardingRecords, disembarkingRecords]);

  // Filtered students for search
  const filteredStudents = useMemo(() => {
    if (!studentSearch) return students.slice(0, 10);
    const query = studentSearch.toLowerCase();
    return students.filter(
      s =>
        s.firstName.toLowerCase().includes(query) ||
        s.lastName.toLowerCase().includes(query) ||
        s.school.toLowerCase().includes(query) ||
        s.qrCode.toLowerCase().includes(query)
    );
  }, [students, studentSearch]);

  // Student history (if selected)
  const studentHistory = useMemo(() => {
    if (!selectedStudentId) return null;

    const studentBoarding = boardingRecords.filter(r => r.studentId === selectedStudentId);
    const studentDisembarking = disembarkingRecords.filter(
      r => r.studentId === selectedStudentId
    );

    return {
      student: studentMap.get(selectedStudentId),
      boarding: studentBoarding,
      disembarking: studentDisembarking,
      total: studentBoarding.length + studentDisembarking.length,
    };
  }, [selectedStudentId, boardingRecords, disembarkingRecords, studentMap]);

  // Daily report summary
  const dailyReport = useMemo(() => {
    const uniqueStudents = new Set([
      ...boardingRecords.map(r => r.studentId),
      ...disembarkingRecords.map(r => r.studentId),
    ]).size;

    const uniqueBuses = new Set([
      ...boardingRecords.map(r => r.busId),
      ...disembarkingRecords.map(r => r.busId),
    ]).size;

    return {
      date: selectedDate,
      totalStudents: uniqueStudents,
      totalBuses: uniqueBuses,
      boardingRecords: boardingRecords.length,
      disembarkingRecords: disembarkingRecords.length,
    };
  }, [selectedDate, boardingRecords, disembarkingRecords]);

  const handleExportReport = () => {
    const sanitize = (value: string | number | boolean | undefined | null) => {
      if (value === undefined || value === null) return '';
      const stringValue = String(value).replace(/"/g, '""');
      return `"${stringValue}"`;
    };

    const rows: string[] = [];
    rows.push('Günlük Hesabat');
    rows.push(`Tarix,${sanitize(formatDate(selectedDate))}`);
    rows.push(
      `Planlanmış Minmə,${stats.plannedBoarding},Faktiki Minmə,${stats.actualBoarding}`
    );
    rows.push(
      `Planlanmış Düşmə,${stats.plannedDropoff},Faktiki Düşmə,${stats.actualDropoff}`
    );
    rows.push(
      `İştirak edən şagirdlər,${dailyReport.totalStudents},İstifadə olunan avtobuslar,${dailyReport.totalBuses}`
    );
    rows.push('');
    rows.push('Minmə Qeydləri');
    rows.push('Şagird,Avtobus,Marşrut,Səfər Vaxtı,Qeyd Vaxtı,Planlanmış?');

    boardingRecords.forEach(record => {
      const student = studentMap.get(record.studentId);
      const bus = busMap.get(record.busId);
      const trip = tripMap.get(record.tripId);
      const route = trip ? routeMap.get(trip.routeId) : undefined;

      rows.push(
        [
          sanitize(student ? `${student.firstName} ${student.lastName}` : 'Bilinməyən'),
          sanitize(bus?.plateNumber || '-'),
          sanitize(route?.name || '-'),
          sanitize(trip?.departureTime || '-'),
          sanitize(formatDateTime(record.recordTime)),
          sanitize(record.wasPlanned ? 'Bəli' : 'Xeyr'),
        ].join(',')
      );
    });

    rows.push('');
    rows.push('Düşmə Qeydləri');
    rows.push('Şagird,Avtobus,Marşrut,Səfər Vaxtı,Qeyd Vaxtı,Planlanmış?');

    disembarkingRecords.forEach(record => {
      const student = studentMap.get(record.studentId);
      const bus = busMap.get(record.busId);
      const trip = tripMap.get(record.tripId);
      const route = trip ? routeMap.get(trip.routeId) : undefined;

      rows.push(
        [
          sanitize(student ? `${student.firstName} ${student.lastName}` : 'Bilinməyən'),
          sanitize(bus?.plateNumber || '-'),
          sanitize(route?.name || '-'),
          sanitize(trip?.departureTime || '-'),
          sanitize(formatDateTime(record.recordTime)),
          sanitize(record.wasPlanned ? 'Bəli' : 'Xeyr'),
        ].join(',')
      );
    });

    const csvContent = rows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `hesabat-${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return <Loading size="lg" text="Yüklənir..." className="py-20" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Hesabatlar</h1>
          <p className="mt-1 text-secondary-600">
            Günlük hesabatlar və şagird tarixçəsi
          </p>
        </div>
        <Button
          variant="outline"
          leftIcon={<RefreshCw className="h-4 w-4" />}
          onClick={() => window.location.reload()}
        >
          Yenilə
        </Button>
      </div>

      {/* Date Selector */}
      <Card>
        <CardBody className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-secondary-400" />
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-auto"
              />
            </div>
            <Button
              leftIcon={<Download className="h-4 w-4" />}
              onClick={handleExportReport}
            >
              Hesabatı Yüklə
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Statistics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Planlanmış Minmə</p>
                <p className="mt-1 text-2xl font-bold text-blue-900">
                  {stats.plannedBoarding}
                </p>
              </div>
              <div className="rounded-lg bg-blue-500 p-3">
                <ArrowUp className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Faktiki Minmə</p>
                <p className="mt-1 text-2xl font-bold text-green-900">
                  {stats.actualBoarding}
                </p>
                <p className="text-xs text-green-700 mt-1">
                  {stats.plannedBoardingRecords} planlanmış
                </p>
              </div>
              <div className="rounded-lg bg-green-500 p-3">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Planlanmış Düşmə</p>
                <p className="mt-1 text-2xl font-bold text-orange-900">
                  {stats.plannedDropoff}
                </p>
              </div>
              <div className="rounded-lg bg-orange-500 p-3">
                <ArrowDown className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Faktiki Düşmə</p>
                <p className="mt-1 text-2xl font-bold text-purple-900">
                  {stats.actualDropoff}
                </p>
                <p className="text-xs text-purple-700 mt-1">
                  {stats.plannedDropoffRecords} planlanmış
                </p>
              </div>
              <div className="rounded-lg bg-purple-500 p-3">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Warnings */}
      {(stats.missedBoarding > 0 || stats.missedDropoff > 0) && (
        <Card className="border-red-200 bg-red-50">
          <CardBody className="p-4">
            <div className="flex items-start gap-3">
              <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-red-900">Xəbərdarlıq</p>
                <p className="text-sm text-red-700 mt-1">
                  {stats.missedBoarding > 0 && (
                    <span>{stats.missedBoarding} planlanmış minmə qeydə alınmayıb. </span>
                  )}
                  {stats.missedDropoff > 0 && (
                    <span>{stats.missedDropoff} planlanmış düşmə qeydə alınmayıb.</span>
                  )}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Daily Report Summary */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-secondary-900">
              Günlük Hesabat Özəti
            </h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                <span className="text-sm font-medium text-secondary-700">Tarix</span>
                <span className="text-sm text-secondary-900">
                  {formatDate(selectedDate)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                <span className="text-sm font-medium text-secondary-700">
                  İştirak edən şagirdlər
                </span>
                <span className="text-sm font-bold text-secondary-900">
                  {dailyReport.totalStudents}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                <span className="text-sm font-medium text-secondary-700">
                  İstifadə olunan avtobuslar
                </span>
                <span className="text-sm font-bold text-secondary-900">
                  {dailyReport.totalBuses}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                <span className="text-sm font-medium text-secondary-700">
                  Minmə qeydləri
                </span>
                <span className="text-sm font-bold text-secondary-900">
                  {dailyReport.boardingRecords}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                <span className="text-sm font-medium text-secondary-700">
                  Düşmə qeydləri
                </span>
                <span className="text-sm font-bold text-secondary-900">
                  {dailyReport.disembarkingRecords}
                </span>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Student History Search */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-secondary-900">
              Şagird Tarixçəsi
            </h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <Input
                placeholder="Şagird axtar (ad, soyad, məktəb, QR kod)..."
                leftIcon={<Search className="h-5 w-5" />}
                value={studentSearch}
                onChange={(e) => {
                  setStudentSearch(e.target.value);
                  setSelectedStudentId(null);
                }}
              />

              {studentSearch && filteredStudents.length > 0 && (
                <div className="max-h-48 overflow-y-auto border border-secondary-200 rounded-lg">
                  {filteredStudents.map(student => (
                    <button
                      key={student.id}
                      onClick={() => {
                        setSelectedStudentId(student.id);
                        setStudentSearch(`${student.firstName} ${student.lastName}`);
                      }}
                      className="w-full text-left p-3 hover:bg-secondary-50 transition-colors border-b border-secondary-100 last:border-b-0"
                    >
                      <p className="font-medium text-secondary-900">
                        {student.firstName} {student.lastName}
                      </p>
                      <p className="text-xs text-secondary-500">
                        {student.school} - {student.grade}
                      </p>
                    </button>
                  ))}
                </div>
              )}

              {selectedStudentId && studentHistory && (
                <div className="mt-4 space-y-3">
                  <div className="p-3 bg-primary-50 rounded-lg border border-primary-200">
                    <p className="font-medium text-primary-900">
                      {studentHistory.student?.firstName} {studentHistory.student?.lastName}
                    </p>
                    <p className="text-sm text-primary-700">
                      {studentHistory.student?.school} - {studentHistory.student?.grade}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-green-50 rounded text-center">
                      <p className="text-xs text-green-600">Minmə</p>
                      <p className="text-lg font-bold text-green-900">
                        {studentHistory.boarding.length}
                      </p>
                    </div>
                    <div className="p-2 bg-orange-50 rounded text-center">
                      <p className="text-xs text-orange-600">Düşmə</p>
                      <p className="text-lg font-bold text-orange-900">
                        {studentHistory.disembarking.length}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      // TODO: Navigate to detailed student history page
                      alert('Detallı tarixçə səhifəsi tezliklə əlavə ediləcək');
                    }}
                  >
                    Detallı Tarixçə
                  </Button>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Recent Records */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-secondary-900">
            Son Qeydlər ({formatDate(selectedDate)})
          </h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {/* Boarding Records */}
            <div>
              <h3 className="text-sm font-semibold text-secondary-700 mb-2 flex items-center gap-2">
                <ArrowUp className="h-4 w-4 text-green-600" />
                Minmə Qeydləri ({boardingRecords.length})
              </h3>
              {boardingRecords.length === 0 ? (
                <p className="text-sm text-secondary-500 p-3 bg-secondary-50 rounded">
                  Bu tarix üçün minmə qeydi yoxdur
                </p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {boardingRecords.slice(0, 10).map(record => {
                    const student = studentMap.get(record.studentId);
                    const bus = busMap.get(record.busId);
                    return (
                      <div
                        key={record.id}
                        className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-secondary-900">
                            {student?.firstName} {student?.lastName}
                          </p>
                          <p className="text-xs text-secondary-500">
                            {bus?.plateNumber} • {formatDateTime(record.recordTime)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {record.wasPlanned ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-orange-600" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Disembarking Records */}
            <div>
              <h3 className="text-sm font-semibold text-secondary-700 mb-2 flex items-center gap-2">
                <ArrowDown className="h-4 w-4 text-orange-600" />
                Düşmə Qeydləri ({disembarkingRecords.length})
              </h3>
              {disembarkingRecords.length === 0 ? (
                <p className="text-sm text-secondary-500 p-3 bg-secondary-50 rounded">
                  Bu tarix üçün düşmə qeydi yoxdur
                </p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {disembarkingRecords.slice(0, 10).map(record => {
                    const student = studentMap.get(record.studentId);
                    const bus = busMap.get(record.busId);
                    return (
                      <div
                        key={record.id}
                        className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-secondary-900">
                            {student?.firstName} {student?.lastName}
                          </p>
                          <p className="text-xs text-secondary-500">
                            {bus?.plateNumber} • {formatDateTime(record.recordTime)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {record.wasPlanned ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-orange-600" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
