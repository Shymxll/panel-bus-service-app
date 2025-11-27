# 🚌 Məktəb Servisi Şagird İzləmə Sistemi - Frontend

Modern React + TypeScript əsaslı okul servis takip sistemi frontend uygulaması.

## 📋 İçindekiler

- [Özellikler](#özellikler)
- [Teknoloji Stack](#teknoloji-stack)
- [Kurulum](#kurulum)
- [Proje Yapısı](#proje-yapısı)
- [Kullanım](#kullanım)
- [Geliştirme](#geliştirme)

## ✨ Özellikler

### Admin Paneli

- 📊 Dashboard - Sistem genel görünümü
- 👥 Öğrenci Yönetimi - QR kod oluşturma ile
- 👨‍✈️ Şoför Yönetimi
- 🚌 Otobüs Yönetimi
- 🗺️ Rota ve Durak Yönetimi
- 📅 Günlük Servis Planlaması
- 📈 Raporlama Sistemi

### Şoför Paneli

- 📱 Mobil-uyumlu arayüz
- 📸 QR kod okuyucu (kamera erişimi)
- ✅ Öğrenci binme kaydı
- ✅ Öğrenci inme kaydı
- 📋 Günlük planlanan öğrenci listesi
- 📊 Günlük istatistikler

## 🛠 Teknoloji Stack

### Core

- **React 18.3** - UI kütüphanesi
- **TypeScript 5.4** - Type safety
- **Vite 5.2** - Build tool ve dev server

### State Management & Data Fetching

- **Zustand 4.5** - Global state management
- **TanStack Query 5.32** - Server state management
- **React Router 6.23** - Routing

### Styling & UI

- **TailwindCSS 3.4** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Sonner** - Toast notifications

### Forms & Validation

- **React Hook Form 7.51** - Form management
- **Zod 3.23** - Schema validation
- **@hookform/resolvers** - Form validation integration

### HTTP & API

- **Axios 1.6** - HTTP client

### QR Code

- **html5-qrcode 2.3** - QR kod okuma
- **@zxing/library 0.21** - QR/Barcode library

### Development Tools

- **ESLint 8.57** - Code linting
- **Prettier 3.2** - Code formatting
- **Vitest 1.5** - Unit testing
- **Testing Library** - Component testing
- **MSW 2.2** - API mocking

## 📦 Kurulum

### Gereksinimler

- Node.js 18+
- npm veya yarn
- Backend API (http://localhost:3001)

### Adımlar

1. **Repoyu klonlayın**

```bash
git clone <repo-url>
cd panel-bus-service-app
```

2. **Bağımlılıkları yükleyin**

```bash
npm install
```

3. **Environment dosyasını oluşturun**

```bash
cp .env.example .env
```

4. **.env dosyasını düzenleyin**

```env
VITE_API_BASE_URL=http://localhost:3001
VITE_API_TIMEOUT=30000
VITE_APP_ENV=development
VITE_ENABLE_DEVTOOLS=true
```

5. **Development server'ı başlatın**

```bash
npm run dev
```

Uygulama http://localhost:5173 adresinde çalışacaktır.

## 📁 Proje Yapısı

```
panel-bus-service-app/
├── src/
│   ├── assets/              # Statik dosyalar (resim, font vb.)
│   ├── components/          # Reusable componentler
│   │   ├── common/         # Genel componentler (Button, Input vb.)
│   │   └── layouts/        # Layout componentleri
│   ├── config/             # Konfigürasyon dosyaları
│   │   ├── api.config.ts   # API endpoint ve ayarları
│   │   └── constants.ts    # Sabitler
│   ├── features/           # Feature-based modüller
│   │   ├── auth/           # Authentication
│   │   ├── admin/          # Admin paneli
│   │   │   ├── dashboard/
│   │   │   ├── students/
│   │   │   ├── drivers/
│   │   │   ├── buses/
│   │   │   ├── routes/
│   │   │   ├── planning/
│   │   │   └── reports/
│   │   ├── driver/         # Şoför paneli
│   │   │   ├── dashboard/
│   │   │   ├── boarding/
│   │   │   └── alighting/
│   │   └── public/         # Public sayfalar
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Third-party library wrappers
│   │   └── axios.ts        # Axios instance
│   ├── routes/             # Route tanımları
│   ├── services/           # API service katmanı
│   │   ├── auth.service.ts
│   │   ├── bus.service.ts
│   │   └── user.service.ts
│   ├── store/              # Zustand store
│   │   └── auth-store.ts
│   ├── types/              # TypeScript type tanımları
│   ├── utils/              # Utility fonksiyonlar
│   │   ├── cn.ts           # Class name merger
│   │   ├── format.ts       # Format fonksiyonları
│   │   └── validation.ts   # Validation schemas
│   ├── App.tsx             # Root component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── public/                 # Public assets
├── .env                    # Environment variables
├── .env.example           # Environment template
├── index.html             # HTML template
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── vite.config.ts         # Vite config
├── tailwind.config.js     # TailwindCSS config
└── README.md              # Bu dosya
```

### Klasör Yapısı Prensipleri

1. **Feature-based Architecture**: Her özellik kendi klasöründe
2. **Separation of Concerns**: İş mantığı, UI ve state ayrı
3. **Reusability**: Ortak componentler merkezi yerde
4. **Type Safety**: Her dosya için TypeScript tipleri
5. **Colocation**: İlgili dosyalar bir arada

## 🚀 Kullanım

### Geliştirme Komutları

```bash
# Development server
npm run dev

# Production build
npm run build

# Build preview
npm run preview

# Linting
npm run lint
npm run lint:fix

# Formatting
npm run format

# Type checking
npm run type-check

# Testing
npm run test
npm run test:ui
npm run test:coverage
```

### Giriş Bilgileri

**Admin Paneli:**

- URL: http://localhost:5173/admin/login
- Email: admin@example.com
- Password: admin123

**Şoför Paneli:**

- URL: http://localhost:5173/login
- Email: (backend'den oluşturulacak)
- Password: (backend'den oluşturulacak)

## 🔧 Geliştirme

### Yeni Component Ekleme

```typescript
// src/components/common/MyComponent.tsx
import { cn } from '@/utils/cn';

interface MyComponentProps {
  className?: string;
  children: React.ReactNode;
}

export const MyComponent = ({ className, children }: MyComponentProps) => {
  return (
    <div className={cn('base-styles', className)}>
      {children}
    </div>
  );
};
```

### Yeni Feature Ekleme

```bash
src/features/my-feature/
├── components/        # Feature-specific componentler
├── hooks/            # Feature-specific hooks
├── pages/            # Feature sayfaları
├── services/         # Feature API servisleri
└── types/            # Feature type tanımları
```

### API Service Ekleme

```typescript
// src/services/my.service.ts
import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/config/api.config';

class MyService {
  async getAll() {
    const response = await axiosInstance.get(API_ENDPOINTS.my.list);
    return response.data.data;
  }
}

export const myService = new MyService();
```

### Custom Hook Ekleme

```typescript
// src/hooks/useMyHook.ts
import { useQuery } from '@tanstack/react-query';
import { myService } from '@/services/my.service';

export const useMyData = () => {
  return useQuery({
    queryKey: ['my-data'],
    queryFn: () => myService.getAll(),
  });
};
```

## 📝 Kod Standartları

### TypeScript

- Strict mode aktif
- Her prop ve state tip tanımlı
- `any` kullanımı yasak
- Explicit return types tercih edilir

### Component Yapısı

```typescript
// 1. Imports
import { useState } from 'react';
import { Button } from '@/components/common/Button';

// 2. Types
interface Props {
  title: string;
}

// 3. Component
export const MyComponent = ({ title }: Props) => {
  // 4. Hooks
  const [state, setState] = useState();

  // 5. Handlers
  const handleClick = () => {};

  // 6. Effects
  useEffect(() => {}, []);

  // 7. Render
  return <div>{title}</div>;
};
```

### Naming Conventions

- **Components**: PascalCase (Button, UserCard)
- **Hooks**: camelCase with "use" prefix (useAuth, useUsers)
- **Utils**: camelCase (formatDate, cn)
- **Constants**: UPPER_SNAKE_CASE (API_BASE_URL)
- **Types/Interfaces**: PascalCase (User, ApiResponse)

## 🧪 Testing

```bash
# Unit testler
npm run test

# UI ile test
npm run test:ui

# Coverage raporu
npm run test:coverage
```

Test dosyaları component'lerin yanında:

```
Button.tsx
Button.test.tsx
```

## 🚢 Production Build

```bash
# Build
npm run build

# Build preview
npm run preview
```

Build dosyaları `dist/` klasörüne oluşturulur.

### Deployment

**Vercel/Netlify:**

- Otomatik deployment
- Environment variables panel üzerinden

**Custom Server:**

```bash
npm run build
# dist/ klasörünü static server ile serve edin
```

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing`)
3. Commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Push edin (`git push origin feature/amazing`)
5. Pull Request açın

## 📄 Lisans

Bu proje özel kullanım içindir.

## 👥 Geliştirici

2025 © Məktəb Servisi Takip Sistemi

---

## 🔗 İlgili Projeler

- Backend API: [bus-service-app-backend](../bus-service-app-backend)

## 📞 Destek

Sorularınız için issue açabilir veya dokümanları inceleyebilirsiniz.
