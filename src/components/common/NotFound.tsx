import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Button } from './Button';

export const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary-50">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-600">404</h1>
        <h2 className="mt-4 text-3xl font-semibold text-secondary-900">
          Səhifə tapılmadı
        </h2>
        <p className="mt-2 text-secondary-600">
          Axtardığınız səhifə mövcud deyil və ya silinib.
        </p>
        <div className="mt-8">
          <Link to="/">
            <Button leftIcon={<Home className="h-4 w-4" />}>
              Ana səhifəyə qayıt
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

