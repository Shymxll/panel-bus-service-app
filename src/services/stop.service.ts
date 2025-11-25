import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/config/api.config';
import type {
  Stop,
  CreateStopData,
  UpdateStopData,
  ApiResponse,
} from '@/types';

class StopService {
  async getAll(): Promise<Stop[]> {
    const response = await axiosInstance.get<ApiResponse<Stop[]>>(
      API_ENDPOINTS.stops?.list || '/api/stops'
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Dayanacaqlar yüklənə bilmədi');
  }

  async getById(id: number): Promise<Stop> {
    const response = await axiosInstance.get<ApiResponse<Stop>>(
      API_ENDPOINTS.stops?.detail?.(id) || `/api/stops/${id}`
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Dayanacaq tapılmadı');
  }

  async create(data: CreateStopData): Promise<Stop> {
    const response = await axiosInstance.post<ApiResponse<Stop>>(
      API_ENDPOINTS.stops?.create || '/api/stops',
      data
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Dayanacaq yaradıla bilmədi');
  }

  async update(id: number, data: UpdateStopData): Promise<Stop> {
    const response = await axiosInstance.put<ApiResponse<Stop>>(
      API_ENDPOINTS.stops?.update?.(id) || `/api/stops/${id}`,
      data
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Dayanacaq yenilənə bilmədi');
  }

  async delete(id: number): Promise<void> {
    const response = await axiosInstance.delete<ApiResponse>(
      API_ENDPOINTS.stops?.delete?.(id) || `/api/stops/${id}`
    );
    if (!response.data.success) {
      throw new Error(response.data.message || 'Dayanacaq silinə bilmədi');
    }
  }
}

export const stopService = new StopService();

