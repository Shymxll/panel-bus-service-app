import { Link } from 'react-router-dom';
import { Bus, Shield, QrCode, BarChart3, ArrowRight, CheckCircle2, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/common/Button';

export const LandingPage = () => {
  const features = [
    {
      icon: QrCode,
      title: 'QR Kod İzləmə',
      description: 'Şagirdlərin minmə və düşmə proseslərini QR kod ilə asanlıqla izləyin',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
    },
    {
      icon: Bus,
      title: 'Avtobus İdarəçiliyi',
      description: 'Bütün avtobusları, şoförləri və marşrutları vahid platformadan idarə edin',
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50',
    },
    {
      icon: Shield,
      title: 'Təhlükəsizlik',
      description: 'JWT autentifikasiya və rol əsaslı giriş ilə məlumatlarınız təhlükəsizdir',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
    },
    {
      icon: BarChart3,
      title: 'Hesabatlar',
      description: 'Günlük və ümumi hesabatlarla məlumatları təhlil edin',
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50',
    },
  ];

  const benefits = [
    'Real vaxtda izləmə',
    'QR kod texnologiyası',
    'Təhlükəsiz məlumat saxlanması',
    'Asan istifadə interfeysi',
    'Mobil uyğunluq',
    'Detallı hesabatlar',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-secondary-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-primary-500/20 blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-primary-400/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative container-custom py-24 sm:py-32 text-center">
          <div className="mx-auto max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 mb-8">
              <Sparkles className="h-4 w-4 text-yellow-300" />
              <span className="text-sm font-medium text-white">2025-ci ilin ən yaxşı həlləri</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
              Məktəb Servisi
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">
                Takip Sistemi
              </span>
            </h1>
            <p className="mt-6 text-xl sm:text-2xl text-primary-100 max-w-2xl mx-auto leading-relaxed">
              QR kod texnologiyası ilə şagirdlərin servis hərəkətlərini{' '}
              <span className="font-semibold text-white">real vaxtda</span> izləyin və idarə edin
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link to="/admin/login">
                <Button
                  size="lg"
                  className="group bg-white text-primary-600 hover:bg-white/90 hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-2xl px-8 py-4 text-lg font-semibold"
                  rightIcon={<ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                >
                  Admin Girişi
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {[
                { label: 'Real vaxt', value: '100%' },
                { label: 'Təhlükəsizlik', value: 'SSL' },
                { label: 'Platforma', value: 'Web' },
                { label: 'Dil', value: 'AZ' },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:bg-white/20 transition-all duration-300"
                >
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-primary-100 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container-custom py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-primary-600 font-semibold mb-4">
            <Zap className="h-5 w-5" />
            <span>Xüsusiyyətlər</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-secondary-900 mb-4">
            Güclü və Modern Həllər
          </h2>
          <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
            Modern texnologiya ilə gücləndirilmiş idarəetmə sistemi
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl border border-secondary-200 bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
              >
                {/* Gradient background on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />
                <div className="relative z-10">
                  <div
                    className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-secondary-900 group-hover:text-secondary-950 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-secondary-600 group-hover:text-secondary-700 transition-colors">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gradient-to-br from-secondary-50 to-white py-24">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-primary-600 font-semibold mb-4">
                <CheckCircle2 className="h-5 w-5" />
                <span>Üstünlüklər</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-secondary-900 mb-6">
                Niyə bizim sistem?
              </h2>
              <p className="text-lg text-secondary-600 mb-8">
                Məktəb servisi idarəetməsini sadələşdirən və təhlükəsizliyi təmin edən həllər
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-3 group">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary-100 flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                      <CheckCircle2 className="h-4 w-4 text-primary-600 group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-secondary-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-3xl bg-gradient-to-br from-primary-500 to-primary-700 p-8 shadow-2xl">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20" />
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Bus className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-bold text-lg">Real vaxtda izləmə</div>
                      <div className="text-primary-100 text-sm">Hər addımı görün</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium">Şagird #{i}</span>
                          <span className="text-primary-100 text-sm">Aktiv</span>
                        </div>
                        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-white rounded-full transition-all duration-1000"
                            style={{ width: `${75 + i * 5}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

