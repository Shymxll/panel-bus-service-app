import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/config/api.config';
import type {
  Trip,
  CreateTripData,
  UpdateTripData,
  ApiResponse,
} from '@/types';

class TripService {
  async getAll(): Promise<Trip[]> {
    const response = await axiosInstance.get<ApiResponse<Trip[]>>(
      API_ENDPOINTS.trips.list
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Səfərlər yüklənə bilmədi');
  }

  async getById(id: number): Promise<Trip> {
    const response = await axiosInstance.get<ApiResponse<Trip>>(
      API_ENDPOINTS.trips.detail(id)
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Səfər tapılmadı');
  }

  async getByRouteId(routeId: number): Promise<Trip[]> {
    const response = await axiosInstance.get<ApiResponse<Trip[]>>(
      API_ENDPOINTS.trips.byRoute(routeId)
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Səfərlər yüklənə bilmədi');
  }

  async create(data: CreateTripData): Promise<Trip> {
    const response = await axiosInstance.post<ApiResponse<Trip>>(
      API_ENDPOINTS.trips.create,
      data
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Səfər yaradıla bilmədi');
  }

  async update(id: number, data: UpdateTripData): Promise<Trip> {
    const response = await axiosInstance.put<ApiResponse<Trip>>(
      API_ENDPOINTS.trips.update(id),
      data
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Səfər yenilənə bilmədi');
  }

  async delete(id: number): Promise<void> {
    const response = await axiosInstance.delete<ApiResponse>(
      API_ENDPOINTS.trips.delete(id)
    );
    if (!response.data.success) {
      throw new Error(response.data.message || 'Səfər silinə bilmədi');
    }
  }
}

export const tripService = new TripService();

