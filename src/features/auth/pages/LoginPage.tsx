import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Mail, Lock, Bus } from 'lucide-react';
import { loginSchema, type LoginFormData } from '@/utils/validation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Card, CardBody } from '@/components/common/Card';

export const LoginPage = () => {
  const { login, isLoggingIn } = useAuth();
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
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-600">
            <Bus className="h-8 w-8 text-white" />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-secondary-900">Şoför Girişi</h1>
          <p className="mt-2 text-sm text-secondary-600">
            Hesabınıza daxil olun və şagirdləri izləyin
          </p>
        </div>

        {/* Login Form */}
        <Card>
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="sofor@example.com"
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

            <div className="mt-6 text-center">
              <Link
                to="/admin/login"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Admin girişi
              </Link>
            </div>
          </CardBody>
        </Card>

        {/* Back to home */}
        <div className="mt-4 text-center">
          <Link to="/" className="text-sm text-secondary-600 hover:text-secondary-900">
            ← Ana səhifəyə qayıt
          </Link>
        </div>
      </div>
    </div>
  );
};

