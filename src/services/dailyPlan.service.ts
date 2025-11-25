import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/config/api.config';
import type {
  DailyPlan,
  CreateDailyPlanData,
  UpdateDailyPlanData,
  ApiResponse,
} from '@/types';

class DailyPlanService {
  async getAll(): Promise<DailyPlan[]> {
    const response = await axiosInstance.get<ApiResponse<DailyPlan[]>>(
      API_ENDPOINTS.dailyPlans.list
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Planlar yüklənə bilmədi');
  }

  async getById(id: number): Promise<DailyPlan> {
    const response = await axiosInstance.get<ApiResponse<DailyPlan>>(
      API_ENDPOINTS.dailyPlans.detail(id)
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Plan tapılmadı');
  }

  async getByDate(date: string): Promise<DailyPlan[]> {
    const response = await axiosInstance.get<ApiResponse<DailyPlan[]>>(
      API_ENDPOINTS.dailyPlans.byDate(date)
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Planlar yüklənə bilmədi');
  }

  async getByStudentId(studentId: number): Promise<DailyPlan[]> {
    const response = await axiosInstance.get<ApiResponse<DailyPlan[]>>(
      API_ENDPOINTS.dailyPlans.byStudent(studentId)
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Planlar yüklənə bilmədi');
  }

  async create(data: CreateDailyPlanData): Promise<DailyPlan> {
    const response = await axiosInstance.post<ApiResponse<DailyPlan>>(
      API_ENDPOINTS.dailyPlans.create,
      data
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Plan yaradıla bilmədi');
  }

  async update(id: number, data: UpdateDailyPlanData): Promise<DailyPlan> {
    const response = await axiosInstance.put<ApiResponse<DailyPlan>>(
      API_ENDPOINTS.dailyPlans.update(id),
      data
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Plan yenilənə bilmədi');
  }

  async delete(id: number): Promise<void> {
    const response = await axiosInstance.delete<ApiResponse>(
      API_ENDPOINTS.dailyPlans.delete(id)
    );
    if (!response.data.success) {
      throw new Error(response.data.message || 'Plan silinə bilmədi');
    }
  }
}

export const dailyPlanService = new DailyPlanService();

