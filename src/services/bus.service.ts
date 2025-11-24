import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/config/api.config';
import type { Bus, CreateBusData, ApiResponse } from '@/types';

class BusService {
  async getAll(): Promise<Bus[]> {
    const response = await axiosInstance.get<ApiResponse<Bus[]>>(
      API_ENDPOINTS.buses.list
    );
    return response.data.data || [];
  }

  async getById(id: number): Promise<Bus> {
    const response = await axiosInstance.get<ApiResponse<Bus>>(
      API_ENDPOINTS.buses.detail(id)
    );
    return response.data.data!;
  }

  async create(data: CreateBusData): Promise<Bus> {
    const response = await axiosInstance.post<ApiResponse<Bus>>(
      API_ENDPOINTS.buses.create,
      data
    );
    return response.data.data!;
  }

  async update(id: number, data: Partial<CreateBusData>): Promise<Bus> {
    const response = await axiosInstance.put<ApiResponse<Bus>>(
      API_ENDPOINTS.buses.update(id),
      data
    );
    return response.data.data!;
  }

  async delete(id: number): Promise<void> {
    await axiosInstance.delete(API_ENDPOINTS.buses.delete(id));
  }
}

export const busService = new BusService();

