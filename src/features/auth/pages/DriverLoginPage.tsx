import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Mail, Lock, Bus, Eye, EyeOff, Sparkles } from 'lucide-react';
import { loginSchema, type LoginFormData } from '@/utils/validation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

/**
 * Sürücü Giriş Sayfası (Driver Login Page)
 * Modern ve kullanıcı dostu tasarımla şoförlerin sisteme giriş yapabildiği sayfa
 */
export const DriverLoginPage = () => {
  const { login, isLoggingIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <div className="min-h-screen flex">
      {/* Sol taraf - Görsel ve bilgi alanı */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 overflow-hidden">
        {/* Animasyonlu arka plan desenleri */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-300/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Dekoratif çizgiler */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,50 Q25,30 50,50 T100,50" fill="none" stroke="white" strokeWidth="0.5" />
            <path d="M0,60 Q25,40 50,60 T100,60" fill="none" stroke="white" strokeWidth="0.3" />
            <path d="M0,40 Q25,20 50,40 T100,40" fill="none" stroke="white" strokeWidth="0.3" />
          </svg>
        </div>

        {/* İçerik */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 text-white">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-medium">Sürücü Paneli</span>
            </div>
            
            <h1 className="text-4xl xl:text-5xl font-bold mb-6 leading-tight">
              Məktəb Servisi
              <br />
              <span className="text-emerald-200">İdarəetmə Sistemi</span>
            </h1>
            
            <p className="text-lg text-white/80 leading-relaxed max-w-md">
              QR kod texnologiyası ilə şagirdlərin minmə və düşmə proseslərini 
              asanlıqla qeydə alın və izləyin.
            </p>
          </div>

          {/* Özellikler listesi */}
          <div className="space-y-4 mt-8">
            {[
              'QR kod ilə sürətli şagird tanıma',
              'Real vaxtda minmə/düşmə qeydi',
              'Gündəlik plan görüntüləmə',
              'Offline dəstək',
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3 text-white/90">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* Alt bilgi */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Bus className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold">Panel Bus</p>
                <p className="text-sm text-white/70">Təhlükəsiz və Sürətli</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sağ taraf - Giriş formu */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="w-full max-w-md">
          {/* Mobil logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 shadow-lg mb-4">
              <Bus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Sürücü Girişi</h1>
          </div>

          {/* Desktop başlık */}
          <div className="hidden lg:block mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Xoş gəlmisiniz!</h2>
            <p className="text-gray-600">Hesabınıza daxil olun və işə başlayın</p>
          </div>

          {/* Giriş formu */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="sofor@example.com"
                leftIcon={<Mail className="h-5 w-5" />}
                error={errors.email?.message}
                {...register('email')}
              />

              <div className="relative">
                <Input
                  label="Şifrə"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  leftIcon={<Lock className="h-5 w-5" />}
                  error={errors.password?.message}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              isLoading={isLoggingIn}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isLoggingIn ? 'Daxil olunur...' : 'Daxil ol'}
            </Button>
          </form>

          {/* Ayırıcı */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gradient-to-br from-slate-50 to-gray-100 text-gray-500">
                və ya
              </span>
            </div>
          </div>

          {/* Admin girişi linki */}
          <div className="text-center">
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Admin girişi
            </Link>
          </div>

          {/* Ana sayfaya dönüş */}
          <div className="mt-8 text-center">
            <Link
              to="/"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Ana səhifəyə qayıt
            </Link>
          </div>

          {/* Footer bilgi */}
          <div className="mt-12 pt-6 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-400">
              © 2025 Panel Bus. Bütün hüquqlar qorunur.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
