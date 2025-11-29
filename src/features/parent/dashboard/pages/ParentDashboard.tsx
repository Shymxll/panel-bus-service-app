import { useState, useEffect } from 'react';
import { 
  User, Bus, Calendar, MapPin, Clock, 
  CheckCircle, AlertCircle, School
} from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/common/Card';
import { studentService } from '@/services/student.service';
import { boardingRecordService } from '@/services/boardingRecord.service';
import { disembarkingRecordService } from '@/services/disembarkingRecord.service';
import type { Student, BoardingRecord, DisembarkingRecord } from '@/types';

/**
 * Valideyin Dashboard Səhifəsi
 * Uşağın günlük aktivitələrini göstərir
 */
export const ParentDashboard = () => {
  const [student, setStudent] = useState<Student | null>(null);
  const [todayBoardingRecords, setTodayBoardingRecords] = useState<BoardingRecord[]>([]);
  const [todayDisembarkingRecords, setTodayDisembarkingRecords] = useState<DisembarkingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const authData = localStorage.getItem('parentAuth');
      if (!authData) return;

      const { studentId } = JSON.parse(authData);
      const today = new Date().toISOString().split('T')[0] as string;

      // Öğrenci bilgilerini al
      const studentData = await studentService.getStudentById(studentId);
      setStudent(studentData);

      // Bugünün kayıtlarını al
      const [boardingRecords, disembarkingRecords] = await Promise.all([
        boardingRecordService.getByDate(today),
        disembarkingRecordService.getByDate(today),
      ]);

      // Sadece bu öğrenciye ait kayıtları filtrele
      setTodayBoardingRecords(
        boardingRecords.filter((r: BoardingRecord) => r.studentId === studentId)
      );
      setTodayDisembarkingRecords(
        disembarkingRecords.filter((r: DisembarkingRecord) => r.studentId === studentId)
      );
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const today = new Date();
  const formattedDate = today.toLocaleDateString('az-AZ', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const getGreeting = () => {
    const hour = today.getHours();
    if (hour < 12) return 'Sabahınız xeyir';
    if (hour < 18) return 'Günortanız xeyir';
    return 'Axşamınız xeyir';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yüklənir...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-600">Şagird məlumatları tapılmadı</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div>
        <div className="flex items-center gap-2 text-sm text-secondary-500 mb-1">
          <Calendar className="h-4 w-4" />
          <span>{formattedDate}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-secondary-900">
          {getGreeting()}!
        </h1>
        <p className="mt-1 text-secondary-600">
          {student.firstName} {student.lastName} haqqında məlumat
        </p>
      </div>

      {/* Öğrenci Bilgileri */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center">
            <User className="h-8 w-8" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">
              {student.firstName} {student.lastName}
            </h2>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <div className="flex items-center gap-1">
                <School className="h-4 w-4" />
                <span>{student.school}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{student.grade}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bugünkü Durum */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Minmə Durumu */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-secondary-900">
                Minmə Statusu
              </h3>
              {todayBoardingRecords.length > 0 ? (
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              ) : (
                <Clock className="h-6 w-6 text-amber-600" />
              )}
            </div>
          </CardHeader>
          <CardBody>
            {todayBoardingRecords.length > 0 ? (
              <div className="space-y-3">
                {todayBoardingRecords.map((record) => (
                  <div
                    key={record.id}
                    className="bg-emerald-50 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-2 text-emerald-700 mb-2">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Mindi</span>
                    </div>
                    <p className="text-sm text-secondary-600">
                      Vaxt: {new Date(record.recordTime).toLocaleTimeString('az-AZ', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-secondary-500">
                <Clock className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Hələ minməyib</p>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Düşmə Durumu */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-secondary-900">
                Düşmə Statusu
              </h3>
              {todayDisembarkingRecords.length > 0 ? (
                <CheckCircle className="h-6 w-6 text-blue-600" />
              ) : todayBoardingRecords.length > 0 ? (
                <Bus className="h-6 w-6 text-purple-600" />
              ) : (
                <Clock className="h-6 w-6 text-gray-400" />
              )}
            </div>
          </CardHeader>
          <CardBody>
            {todayDisembarkingRecords.length > 0 ? (
              <div className="space-y-3">
                {todayDisembarkingRecords.map((record) => (
                  <div
                    key={record.id}
                    className="bg-blue-50 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-2 text-blue-700 mb-2">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Düşdü</span>
                    </div>
                    <p className="text-sm text-secondary-600">
                      Vaxt: {new Date(record.recordTime).toLocaleTimeString('az-AZ', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                ))}
              </div>
            ) : todayBoardingRecords.length > 0 ? (
              <div className="text-center py-6 text-purple-600">
                <Bus className="h-10 w-10 mx-auto mb-2" />
                <p className="text-sm font-medium">Avtobusda</p>
              </div>
            ) : (
              <div className="text-center py-6 text-secondary-500">
                <Clock className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">-</p>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* İletişim Bilgileri */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-secondary-900">
            Əlaqə Məlumatları
          </h3>
        </CardHeader>
        <CardBody>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-secondary-500 mb-1">Valideyin Adı</p>
              <p className="font-medium text-secondary-900">
                {student.parentName || '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-secondary-500 mb-1">Telefon</p>
              <p className="font-medium text-secondary-900">
                {student.parentPhone || '-'}
              </p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-sm text-secondary-500 mb-1">Ünvan</p>
              <p className="font-medium text-secondary-900">
                {student.address || '-'}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Bilgilendirme */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">Bildiriş</p>
            <p className="mt-1">
              Uşağınızın servis məlumatları real vaxt rejimində yenilənir. 
              Hər hansı bir problem yaranarsa, məktəb idarəsi ilə əlaqə saxlayın.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

