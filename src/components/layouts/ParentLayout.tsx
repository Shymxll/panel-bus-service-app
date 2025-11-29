import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  LogOut as LogOutIcon,
  Menu,
  X,
  User,
  History,
  QrCode,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/common/Button';
import { toast } from 'sonner';

interface ParentAuth {
  studentId: number;
  studentName: string;
  parentName: string;
  qrCode: string;
  loginTime: string;
}

const navigation = [
  { name: 'Ana Səhifə', href: '/parent/dashboard', icon: LayoutDashboard },
  { name: 'Tarixçə', href: '/parent/history', icon: History },
  { name: 'QR Kod', href: '/parent/qr-code', icon: QrCode },
];

export const ParentLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [parentAuth, setParentAuth] = useState<ParentAuth | null>(null);

  useEffect(() => {
    const authData = localStorage.getItem('parentAuth');
    if (authData) {
      setParentAuth(JSON.parse(authData));
    } else {
      navigate('/parent/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('parentAuth');
    toast.success('Çıxış edildi');
    navigate('/parent/login');
  };

  if (!parentAuth) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/30 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 w-64 transform bg-white transition-transform duration-200 lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-6 border-b">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-gray-900">Valideyin Paneli</h1>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 hover:bg-gray-100 rounded-md"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-6">
            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* User Info & Logout */}
          <div className="border-t p-4">
            <div className="flex items-center gap-3 mb-3 px-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm">
                {parentAuth.parentName?.charAt(0).toUpperCase() || 'V'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {parentAuth.parentName || 'Valideyin'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {parentAuth.studentName}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              leftIcon={<LogOutIcon className="h-4 w-4" />}
              className="w-full"
            >
              Çıxış
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between bg-white border-b px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1" />
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

