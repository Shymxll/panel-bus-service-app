import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth-store';

// Layouts
import { PublicLayout } from '@/components/layouts/PublicLayout';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { DriverLayout } from '@/components/layouts/DriverLayout';

// Public pages
import { LandingPage } from '@/features/public/pages/LandingPage';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { AdminLoginPage } from '@/features/auth/pages/AdminLoginPage';

// Admin pages
import { AdminDashboard } from '@/features/admin/dashboard/pages/AdminDashboard';
import { StudentManagement } from '@/features/admin/students/pages/StudentManagement';
import { DriverManagement } from '@/features/admin/drivers/pages/DriverManagement';
import { BusManagement } from '@/features/admin/buses/pages/BusManagement';
import { RouteManagement } from '@/features/admin/routes/pages/RouteManagement';
import { PlanningPage } from '@/features/admin/planning/pages/PlanningPage';
import { ReportsPage } from '@/features/admin/reports/pages/ReportsPage';

// Driver pages
import { DriverDashboard } from '@/features/driver/dashboard/pages/DriverDashboard';
import { BoardingPage } from '@/features/driver/boarding/pages/BoardingPage';
import { AlightingPage } from '@/features/driver/alighting/pages/AlightingPage';

// 404
import { NotFound } from '@/components/common/NotFound';

// Protected Route wrapper
const ProtectedRoute = ({ children, role }: { children: React.ReactNode; role?: 'admin' | 'driver' }) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Public Route wrapper (redirect if authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user) {
    const redirectPath = user.role === 'admin' ? '/admin/dashboard' : '/driver/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/admin/login"
          element={
            <PublicRoute>
              <AdminLoginPage />
            </PublicRoute>
          }
        />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="students" element={<StudentManagement />} />
        <Route path="drivers" element={<DriverManagement />} />
        <Route path="buses" element={<BusManagement />} />
        <Route path="routes" element={<RouteManagement />} />
        <Route path="planning" element={<PlanningPage />} />
        <Route path="reports" element={<ReportsPage />} />
      </Route>

      {/* Driver Routes */}
      <Route
        path="/driver"
        element={
          <ProtectedRoute role="driver">
            <DriverLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/driver/dashboard" replace />} />
        <Route path="dashboard" element={<DriverDashboard />} />
        <Route path="boarding" element={<BoardingPage />} />
        <Route path="alighting" element={<AlightingPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

