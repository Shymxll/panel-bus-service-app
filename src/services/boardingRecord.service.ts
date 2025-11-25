import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/config/api.config';
import type {
  BoardingRecord,
  CreateBoardingRecordData,
  UpdateBoardingRecordData,
  ApiResponse,
} from '@/types';

class BoardingRecordService {
  async getAll(): Promise<BoardingRecord[]> {
    const response = await axiosInstance.get<ApiResponse<BoardingRecord[]>>(
      API_ENDPOINTS.boardingRecords.list
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Minmə qeydləri yüklənə bilmədi');
  }

  async getById(id: number): Promise<BoardingRecord> {
    const response = await axiosInstance.get<ApiResponse<BoardingRecord>>(
      API_ENDPOINTS.boardingRecords.detail(id)
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Minmə qeydi tapılmadı');
  }

  async getByDate(date: string): Promise<BoardingRecord[]> {
    const response = await axiosInstance.get<ApiResponse<BoardingRecord[]>>(
      API_ENDPOINTS.boardingRecords.byDate(date)
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Minmə qeydləri yüklənə bilmədi');
  }

  async getByStudentId(studentId: number): Promise<BoardingRecord[]> {
    const response = await axiosInstance.get<ApiResponse<BoardingRecord[]>>(
      API_ENDPOINTS.boardingRecords.byStudent(studentId)
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Minmə qeydləri yüklənə bilmədi');
  }

  async create(data: CreateBoardingRecordData): Promise<BoardingRecord> {
    const response = await axiosInstance.post<ApiResponse<BoardingRecord>>(
      API_ENDPOINTS.boardingRecords.create,
      data
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Minmə qeydi yaradıla bilmədi');
  }

  async update(id: number, data: UpdateBoardingRecordData): Promise<BoardingRecord> {
    const response = await axiosInstance.put<ApiResponse<BoardingRecord>>(
      API_ENDPOINTS.boardingRecords.update(id),
      data
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Minmə qeydi yenilənə bilmədi');
  }

  async delete(id: number): Promise<void> {
    const response = await axiosInstance.delete<ApiResponse>(
      API_ENDPOINTS.boardingRecords.delete(id)
    );
    if (!response.data.success) {
      throw new Error(response.data.message || 'Minmə qeydi silinə bilmədi');
    }
  }
}

export const boardingRecordService = new BoardingRecordService();

