import { Link } from 'react-router-dom';
import { Bus, Shield, QrCode, BarChart3 } from 'lucide-react';
import { Button } from '@/components/common/Button';

export const LandingPage = () => {
  const features = [
    {
      icon: QrCode,
      title: 'QR Kod İzləmə',
      description: 'Şagirdlərin minmə və düşmə proseslərini QR kod ilə asanlıqla izləyin',
    },
    {
      icon: Bus,
      title: 'Avtobus İdarəçiliyi',
      description: 'Bütün avtobusları, şoförləri və marşrutları vahid platformadan idarə edin',
    },
    {
      icon: Shield,
      title: 'Təhlükəsizlik',
      description: 'JWT autentifikasiya və rol əsaslı giriş ilə məlumatlarınız təhlükəsizdir',
    },
    {
      icon: BarChart3,
      title: 'Hesabatlar',
      description: 'Günlük və ümumi hesabatlarla məlumatları təhlil edin',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="container-custom py-20 text-center">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-5xl font-bold text-white sm:text-6xl">
              Məktəb Servisi Takip Sistemi
            </h1>
            <p className="mt-6 text-xl text-primary-100">
              QR kod texnologiyası ilə şagirdlərin servis hərəkətlərini real vaxtda izləyin və
              idarə edin
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link to="/admin/login">
                <Button size="lg" variant="secondary" className="bg-white text-primary-600 hover:bg-white/90">
                  Admin Girişi
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container-custom py-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-secondary-900">Xüsusiyyətlər</h2>
          <p className="mt-4 text-lg text-secondary-600">
            Modern texnologiya ilə gücləndirilmiş idarəetmə sistemi
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="rounded-xl border border-secondary-200 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                  <Icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-secondary-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-secondary-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-secondary-200 bg-white py-8">
        <div className="container-custom text-center text-sm text-secondary-600">
          <p>© 2025 Servis Takip Sistemi. Bütün hüquqlar qorunur.</p>
        </div>
      </footer>
    </div>
  );
};

