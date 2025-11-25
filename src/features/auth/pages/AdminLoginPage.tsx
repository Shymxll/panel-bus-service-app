import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Mail, Lock, Shield, UserPlus } from 'lucide-react';
import { loginSchema, type LoginFormData } from '@/utils/validation';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/auth.service';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Card, CardBody } from '@/components/common/Card';
import { toast } from 'sonner';

export const AdminLoginPage = () => {
  const { adminLogin, isLoggingIn } = useAuth();
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    adminLogin(data);
  };

  const handleCreateAdmin = async () => {
    setIsCreatingAdmin(true);
    try {
      const admin = await authService.createAdmin();
      toast.success(`Admin istifadəçi yaradıldı! Email: ${admin.email}`);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error?.message || 'Admin yaratma xətası';
      if (errorMessage.includes('already exists')) {
        toast.info('Admin istifadəçi artıq mövcuddur. Giriş edə bilərsiniz.');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-600">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-secondary-900">Admin Girişi</h1>
          <p className="mt-2 text-sm text-secondary-600">İdarəetmə panelinə daxil olun</p>
          <div className="mt-4 rounded-lg bg-blue-50 p-3 text-left">
            <p className="text-xs text-blue-800">
              <strong>İlk dəfə giriş edirsiniz?</strong>
              <br />
              <span className="mt-1 block text-xs">
                Admin istifadəçi yaratmaq üçün aşağıdakı düyməyə basın.
              </span>
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCreateAdmin}
              isLoading={isCreatingAdmin}
              leftIcon={<UserPlus className="h-4 w-4" />}
              className="mt-2 w-full"
            >
              Admin İstifadəçi Yarat
            </Button>
            <p className="mt-2 text-xs text-blue-700">Default: admin@example.com / admin123</p>
          </div>
        </div>

        {/* Login Form */}
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

            <div className="mt-6 text-center">
              <Link to="/login" className="text-sm text-primary-600 hover:text-primary-700">
                Şoför girişi
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
