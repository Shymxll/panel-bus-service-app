import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Bus,
  Route as RouteIcon,
  UserCircle,
  Calendar,
  BarChart3,
  LogOut,
  Menu,
  X,
  MapPin,
  Building2,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/utils/cn';
import { Button } from '@/components/common/Button';

// Panel menusu icin baslik, rota ve ikon bilgisini tek noktada tutar.
const navigation = [
  { name: 'İdarə Paneli', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Məktəblər', href: '/admin/schools', icon: Building2 },
  { name: 'Şagirdlər', href: '/admin/students', icon: Users },
  { name: 'Şoförlər', href: '/admin/drivers', icon: UserCircle },
  { name: 'Avtobuslar', href: '/admin/buses', icon: Bus },
  { name: 'Marşrutlar', href: '/admin/routes', icon: RouteIcon },
  { name: 'Dayanacaqlar', href: '/admin/stops', icon: MapPin },
  { name: 'Planlaşdırma', href: '/admin/planning', icon: Calendar },
  { name: 'Hesabatlar', href: '/admin/reports', icon: BarChart3 },
];

// Tum yonetici ekranlarini yan menu, ust bar ve icerik alanina oturtur.
export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobil yan menu acik mi
  const location = useLocation(); // Route bilgisini aktif linkler icin kullan
  const { user, logout } = useAuth(); // Kimlik ve cikis islemleri

  return (
    <div className="flex h-screen bg-secondary-50">
      {/* Mobilde acilan yan menunun arkaplanini kilitler */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Yoneticinin tum sayfalari erisecegi sabit menu */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-lg transition-transform duration-300 lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo ve mobil kapama tusu */}
          <div className="flex h-16 items-center justify-between border-b border-secondary-200 px-6">
            <h1 className="text-xl font-bold text-primary-600">
              Admin Panel
            </h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Sol menude aktif rotayi vurgulayan navigasyon listesi */}
          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-secondary-700 hover:bg-secondary-100'
                  )}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Aktif kullanici ve guvenli cikis butonu */}
          <div className="border-t border-secondary-200 p-4">
            <div className="mb-3">
              <p className="text-sm font-medium text-secondary-900">
                {user?.name}
              </p>
              <p className="text-xs text-secondary-500">{user?.email}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => logout()}
              leftIcon={<LogOut className="h-4 w-4" />}
              className="w-full"
            >
              Çıxış
            </Button>
          </div>
        </div>
      </aside>

      {/* Sag taraftaki tum icerik alanini olusturur */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Tarih gostergeli ust bar ve mobil menu tetikleyicisi */}
        <header className="flex h-16 items-center justify-between border-b border-secondary-200 bg-white px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-secondary-600 hover:bg-secondary-100 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 lg:hidden" />
          <div className="text-sm text-secondary-600">
            {new Date().toLocaleDateString('az-AZ', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </header>

        {/* Sayfalara gore degisen dinamik icerik */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

