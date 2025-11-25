import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/config/api.config';
import type {
  Route,
  CreateRouteData,
  UpdateRouteData,
  RouteStop,
  CreateRouteStopData,
  UpdateRouteStopData,
  ApiResponse,
} from '@/types';

class RouteService {
  async getAll(): Promise<Route[]> {
    const response = await axiosInstance.get<ApiResponse<Route[]>>(
      API_ENDPOINTS.routes.list
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Marşrutlar yüklənə bilmədi');
  }

  async getById(id: number): Promise<Route> {
    const response = await axiosInstance.get<ApiResponse<Route>>(
      API_ENDPOINTS.routes.detail(id)
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Marşrut tapılmadı');
  }

  async getByBusId(busId: number): Promise<Route[]> {
    const response = await axiosInstance.get<ApiResponse<Route[]>>(
      `/api/routes/bus/${busId}`
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Marşrutlar yüklənə bilmədi');
  }

  async create(data: CreateRouteData): Promise<Route> {
    const response = await axiosInstance.post<ApiResponse<Route>>(
      API_ENDPOINTS.routes.create,
      data
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Marşrut yaradıla bilmədi');
  }

  async update(id: number, data: UpdateRouteData): Promise<Route> {
    const response = await axiosInstance.put<ApiResponse<Route>>(
      API_ENDPOINTS.routes.update(id),
      data
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Marşrut yenilənə bilmədi');
  }

  async delete(id: number): Promise<void> {
    const response = await axiosInstance.delete<ApiResponse>(
      API_ENDPOINTS.routes.delete(id)
    );
    if (!response.data.success) {
      throw new Error(response.data.message || 'Marşrut silinə bilmədi');
    }
  }

  // Route Stops Management
  async getRouteStops(routeId: number): Promise<RouteStop[]> {
    const response = await axiosInstance.get<ApiResponse<RouteStop[]>>(
      `/api/routes/${routeId}/stops`
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Dayanacaqlar yüklənə bilmədi');
  }

  async addRouteStop(data: CreateRouteStopData): Promise<RouteStop> {
    const response = await axiosInstance.post<ApiResponse<RouteStop>>(
      `/api/routes/${data.routeId}/stops`,
      data
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Dayanacaq əlavə edilə bilmədi');
  }

  async updateRouteStop(
    routeStopId: number,
    data: UpdateRouteStopData
  ): Promise<RouteStop> {
    const response = await axiosInstance.put<ApiResponse<RouteStop>>(
      `/api/routes/stops/${routeStopId}`,
      data
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Dayanacaq yenilənə bilmədi');
  }

  async deleteRouteStop(routeStopId: number): Promise<void> {
    const response = await axiosInstance.delete<ApiResponse>(
      `/api/routes/stops/${routeStopId}`
    );
    if (!response.data.success) {
      throw new Error(response.data.message || 'Dayanacaq silinə bilmədi');
    }
  }
}

export const routeService = new RouteService();

