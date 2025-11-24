import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/config/api.config';
import type { User, ApiResponse } from '@/types';

class UserService {
  async getAll(): Promise<User[]> {
    const response = await axiosInstance.get<ApiResponse<User[]>>(
      API_ENDPOINTS.users.list
    );
    return response.data.data || [];
  }

  async getById(id: number): Promise<User> {
    const response = await axiosInstance.get<ApiResponse<User>>(
      API_ENDPOINTS.users.detail(id)
    );
    return response.data.data!;
  }

  async create(data: Partial<User>): Promise<User> {
    const response = await axiosInstance.post<ApiResponse<User>>(
      API_ENDPOINTS.users.create,
      data
    );
    return response.data.data!;
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    const response = await axiosInstance.put<ApiResponse<User>>(
      API_ENDPOINTS.users.update(id),
      data
    );
    return response.data.data!;
  }

  async delete(id: number): Promise<void> {
    await axiosInstance.delete(API_ENDPOINTS.users.delete(id));
  }
}

export const userService = new UserService();

