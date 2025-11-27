import { Outlet } from 'react-router-dom';

// Misafir kullanici ekranlarini yalın bir arka planla sarmalar.
export const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Alt sayfalar Outlet uzerinden yerlestirilir */}
      <Outlet />
    </div>
  );
};

