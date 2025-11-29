import { useState, useEffect } from 'react';
import { Calendar, Clock, LogIn, LogOut, Filter } from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/common/Card';
import { boardingRecordService } from '@/services/boardingRecord.service';
import { disembarkingRecordService } from '@/services/disembarkingRecord.service';
import type { BoardingRecord, DisembarkingRecord } from '@/types';

/**
 * Valideyin Tarixçə Səhifəsi
 * Uşağın minmə/düşmə tarixçəsini göstərir
 */
export const ParentHistoryPage = () => {
  const [boardingRecords, setBoardingRecords] = useState<BoardingRecord[]>([]);
  const [disembarkingRecords, setDisembarkingRecords] = useState<DisembarkingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'boarding' | 'disembarking'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const authData = localStorage.getItem('parentAuth');
      if (!authData) return;

      const { studentId } = JSON.parse(authData);

      // Tüm kayıtları al
      const [allBoardingRecords, allDisembarkingRecords] = await Promise.all([
        boardingRecordService.getAll(),
        disembarkingRecordService.getAll(),
      ]);

      // Sadece bu öğrenciye ait kayıtları filtrele
      setBoardingRecords(
        allBoardingRecords
          .filter((r: BoardingRecord) => r.studentId === studentId)
          .sort((a: BoardingRecord, b: BoardingRecord) => new Date(b.recordTime).getTime() - new Date(a.recordTime).getTime())
      );
      setDisembarkingRecords(
        allDisembarkingRecords
          .filter((r: DisembarkingRecord) => r.studentId === studentId)
          .sort((a: DisembarkingRecord, b: DisembarkingRecord) => new Date(b.recordTime).getTime() - new Date(a.recordTime).getTime())
      );
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Tüm kayıtları birleştir ve sırala
  const allRecords = [
    ...boardingRecords.map((r) => ({ ...r, type: 'boarding' as const })),
    ...disembarkingRecords.map((r) => ({ ...r, type: 'disembarking' as const })),
  ].sort((a, b) => new Date(b.recordTime).getTime() - new Date(a.recordTime).getTime());

  // Filtreleme
  const filteredRecords = allRecords.filter((record) => {
    if (filter === 'all') return true;
    return record.type === filter;
  });

  // Tarihe göre gruplama
  const groupedRecords = filteredRecords.reduce((acc, record) => {
    const date = new Date(record.recordDate).toLocaleDateString('az-AZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(record);
    return acc;
  }, {} as Record<string, typeof filteredRecords>);

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

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-secondary-900">
          Tarixçə
        </h1>
        <p className="mt-1 text-secondary-600">
          Uşağınızın servis tarixçəsi
        </p>
      </div>

      {/* Filtreler */}
      <Card>
        <CardBody className="py-3">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-secondary-500" />
              <span className="text-sm font-medium text-secondary-700">Filter:</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                }`}
              >
                Hamısı
              </button>
              <button
                onClick={() => setFilter('boarding')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === 'boarding'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                }`}
              >
                <LogIn className="inline-block h-4 w-4 mr-1" />
                Minənlər
              </button>
              <button
                onClick={() => setFilter('disembarking')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === 'disembarking'
                    ? 'bg-blue-600 text-white'
                    : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                }`}
              >
                <LogOut className="inline-block h-4 w-4 mr-1" />
                Düşənlər
              </button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* İstatistikler */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600 mb-1">Ümumi</p>
                <p className="text-2xl font-bold text-secondary-900">
                  {allRecords.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600 mb-1">Minmələr</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {boardingRecords.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center">
                <LogIn className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600 mb-1">Düşmələr</p>
                <p className="text-2xl font-bold text-blue-600">
                  {disembarkingRecords.length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                <LogOut className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Kayıtlar */}
      {Object.keys(groupedRecords).length > 0 ? (
        <div className="space-y-4">
          {Object.entries(groupedRecords).map(([date, records]) => (
            <Card key={date}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-secondary-500" />
                  <h3 className="text-lg font-semibold text-secondary-900">
                    {date}
                  </h3>
                  <span className="ml-auto px-2 py-1 text-xs font-medium text-secondary-600 bg-secondary-100 rounded-full">
                    {records.length} qeyd
                  </span>
                </div>
              </CardHeader>
              <CardBody>
                <div className="space-y-2">
                  {records.map((record) => (
                    <div
                      key={`${record.type}-${record.id}`}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        record.type === 'boarding'
                          ? 'bg-emerald-50'
                          : 'bg-blue-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            record.type === 'boarding'
                              ? 'bg-emerald-100 text-emerald-600'
                              : 'bg-blue-100 text-blue-600'
                          }`}
                        >
                          {record.type === 'boarding' ? (
                            <LogIn className="h-5 w-5" />
                          ) : (
                            <LogOut className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <p
                            className={`font-medium ${
                              record.type === 'boarding'
                                ? 'text-emerald-900'
                                : 'text-blue-900'
                            }`}
                          >
                            {record.type === 'boarding' ? 'Mindi' : 'Düşdü'}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-secondary-500">
                            <Clock className="h-3 w-3" />
                            <span>
                              {new Date(record.recordTime).toLocaleTimeString('az-AZ', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      {record.wasPlanned && (
                        <span className="px-2 py-1 text-xs font-medium text-emerald-700 bg-emerald-100 rounded">
                          Planlanmış
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardBody className="py-12 text-center text-secondary-500">
            <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Hələ ki qeyd yoxdur</p>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

