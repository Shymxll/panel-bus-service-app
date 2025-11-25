import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/config/api.config';
import type {
  Student,
  CreateStudentData,
  UpdateStudentData,
  ApiResponse,
} from '@/types';

class StudentService {
  async getAllStudents(): Promise<Student[]> {
    const response = await axiosInstance.get<ApiResponse<Student[]>>(
      API_ENDPOINTS.students.list
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Şagirdlər yüklənə bilmədi');
  }

  async getStudentById(id: number): Promise<Student> {
    const response = await axiosInstance.get<ApiResponse<Student>>(
      API_ENDPOINTS.students.detail(id)
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Şagird tapılmadı');
  }

  async getStudentByQrCode(qrCode: string): Promise<Student> {
    const response = await axiosInstance.get<ApiResponse<Student>>(
      `/api/students/qr/${qrCode}`
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Şagird tapılmadı');
  }

  async createStudent(data: CreateStudentData): Promise<Student> {
    const response = await axiosInstance.post<ApiResponse<Student>>(
      API_ENDPOINTS.students.create,
      data
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Şagird yaradıla bilmədi');
  }

  async updateStudent(id: number, data: UpdateStudentData): Promise<Student> {
    const response = await axiosInstance.put<ApiResponse<Student>>(
      API_ENDPOINTS.students.update(id),
      data
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Şagird yenilənə bilmədi');
  }

  async deleteStudent(id: number): Promise<void> {
    const response = await axiosInstance.delete<ApiResponse>(
      API_ENDPOINTS.students.delete(id)
    );
    if (!response.data.success) {
      throw new Error(response.data.message || 'Şagird silinə bilmədi');
    }
  }

  // QR kod yaratma (frontend-də)
  generateQrCode(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `STU-${timestamp}-${random}`.toUpperCase();
  }
}

export const studentService = new StudentService();

