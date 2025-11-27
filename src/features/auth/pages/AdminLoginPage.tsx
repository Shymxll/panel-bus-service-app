import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Mail, Lock, Shield } from 'lucide-react';
import { loginSchema, type LoginFormData } from '@/utils/validation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Card, CardBody } from '@/components/common/Card';

// Admin paneline giris ekranini saglar.
export const AdminLoginPage = () => {
  const { adminLogin, isLoggingIn } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    // Admin yetkisini dogrulamak icin özel login aksiyonunu kullan.
    adminLogin(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Baslik ve logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-600">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-secondary-900">Admin Girişi</h1>
          <p className="mt-2 text-sm text-secondary-600">İdarəetmə panelinə daxil olun</p>
        </div>

        {/* Giris formu */}
        <Card>
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="admin@example.com"
                leftIcon={<Mail className="h-5 w-5" />}
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                label="Şifrə"
                type="password"
                placeholder="••••••••"
                leftIcon={<Lock className="h-5 w-5" />}
                error={errors.password?.message}
                {...register('password')}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoggingIn}
                className="w-full"
              >
                Daxil ol
              </Button>
            </form>

          </CardBody>
        </Card>

        {/* Ana sayfaya donus baglantisi */}
        <div className="mt-4 text-center">
          <Link to="/" className="text-sm text-secondary-600 hover:text-secondary-900">
            ← Ana səhifəyə qayıt
          </Link>
        </div>
      </div>
    </div>
  );
};
