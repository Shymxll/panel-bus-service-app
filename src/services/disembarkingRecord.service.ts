import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/config/api.config';
import type {
  DisembarkingRecord,
  CreateDisembarkingRecordData,
  UpdateDisembarkingRecordData,
  ApiResponse,
} from '@/types';

class DisembarkingRecordService {
  async getAll(): Promise<DisembarkingRecord[]> {
    const response = await axiosInstance.get<ApiResponse<DisembarkingRecord[]>>(
      API_ENDPOINTS.disembarkingRecords.list
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Düşmə qeydləri yüklənə bilmədi');
  }

  async getById(id: number): Promise<DisembarkingRecord> {
    const response = await axiosInstance.get<ApiResponse<DisembarkingRecord>>(
      API_ENDPOINTS.disembarkingRecords.detail(id)
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Düşmə qeydi tapılmadı');
  }

  async getByDate(date: string): Promise<DisembarkingRecord[]> {
    const response = await axiosInstance.get<ApiResponse<DisembarkingRecord[]>>(
      API_ENDPOINTS.disembarkingRecords.byDate(date)
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Düşmə qeydləri yüklənə bilmədi');
  }

  async getByStudentId(studentId: number): Promise<DisembarkingRecord[]> {
    const response = await axiosInstance.get<ApiResponse<DisembarkingRecord[]>>(
      API_ENDPOINTS.disembarkingRecords.byStudent(studentId)
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Düşmə qeydləri yüklənə bilmədi');
  }

  async create(data: CreateDisembarkingRecordData): Promise<DisembarkingRecord> {
    const response = await axiosInstance.post<ApiResponse<DisembarkingRecord>>(
      API_ENDPOINTS.disembarkingRecords.create,
      data
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Düşmə qeydi yaradıla bilmədi');
  }

  async update(id: number, data: UpdateDisembarkingRecordData): Promise<DisembarkingRecord> {
    const response = await axiosInstance.put<ApiResponse<DisembarkingRecord>>(
      API_ENDPOINTS.disembarkingRecords.update(id),
      data
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Düşmə qeydi yenilənə bilmədi');
  }

  async delete(id: number): Promise<void> {
    const response = await axiosInstance.delete<ApiResponse>(
      API_ENDPOINTS.disembarkingRecords.delete(id)
    );
    if (!response.data.success) {
      throw new Error(response.data.message || 'Düşmə qeydi silinə bilmədi');
    }
  }
}

export const disembarkingRecordService = new DisembarkingRecordService();

