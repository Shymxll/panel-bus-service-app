# 📂 Proje Klasör Yapısı

## Tam Klasör Ağacı

```
panel-bus-service-app/
│
├── 📁 public/                          # Static assets
│   └── bus-icon.svg                    # App icon
│
├── 📁 src/                             # Source code
│   │
│   ├── 📁 assets/                      # Images, fonts, etc.
│   │
│   ├── 📁 components/                  # Reusable components
│   │   ├── 📁 common/                  # Generic UI components
│   │   │   ├── Button.tsx              # Button component
│   │   │   ├── Input.tsx               # Input component
│   │   │   ├── Card.tsx                # Card component
│   │   │   ├── Loading.tsx             # Loading spinner
│   │   │   ├── Modal.tsx               # Modal component
│   │   │   ├── NotFound.tsx            # 404 page
│   │   │   └── Table.tsx               # Table components
│   │   │
│   │   └── 📁 layouts/                 # Layout components
│   │       ├── PublicLayout.tsx        # Public pages layout
│   │       ├── AdminLayout.tsx         # Admin panel layout
│   │       └── DriverLayout.tsx        # Driver panel layout
│   │
│   ├── 📁 config/                      # Configuration files
│   │   ├── api.config.ts               # API endpoints & config
│   │   └── constants.ts                # App constants
│   │
│   ├── 📁 features/                    # Feature-based modules
│   │   │
│   │   ├── 📁 public/                  # Public pages
│   │   │   └── 📁 pages/
│   │   │       └── LandingPage.tsx     # Landing page
│   │   │
│   │   ├── 📁 auth/                    # Authentication
│   │   │   └── 📁 pages/
│   │   │       ├── LoginPage.tsx       # Driver login
│   │   │       └── AdminLoginPage.tsx  # Admin login
│   │   │
│   │   ├── 📁 admin/                   # Admin panel features
│   │   │   ├── 📁 dashboard/
│   │   │   │   └── 📁 pages/
│   │   │   │       └── AdminDashboard.tsx
│   │   │   │
│   │   │   ├── 📁 students/            # Student management
│   │   │   │   └── 📁 pages/
│   │   │   │       └── StudentManagement.tsx
│   │   │   │
│   │   │   ├── 📁 drivers/             # Driver management
│   │   │   │   └── 📁 pages/
│   │   │   │       └── DriverManagement.tsx
│   │   │   │
│   │   │   ├── 📁 buses/               # Bus management
│   │   │   │   └── 📁 pages/
│   │   │   │       └── BusManagement.tsx
│   │   │   │
│   │   │   ├── 📁 routes/              # Route management
│   │   │   │   └── 📁 pages/
│   │   │   │       └── RouteManagement.tsx
│   │   │   │
│   │   │   ├── 📁 planning/            # Daily planning
│   │   │   │   └── 📁 pages/
│   │   │   │       └── PlanningPage.tsx
│   │   │   │
│   │   │   └── 📁 reports/             # Reports
│   │   │       └── 📁 pages/
│   │   │           └── ReportsPage.tsx
│   │   │
│   │   └── 📁 driver/                  # Driver panel features
│   │       ├── 📁 dashboard/
│   │       │   └── 📁 pages/
│   │       │       └── DriverDashboard.tsx
│   │       │
│   │       ├── 📁 boarding/            # Student boarding
│   │       │   └── 📁 pages/
│   │       │       └── BoardingPage.tsx
│   │       │
│   │       └── 📁 alighting/           # Student alighting
│   │           └── 📁 pages/
│   │               └── AlightingPage.tsx
│   │
│   ├── 📁 hooks/                       # Custom React hooks
│   │   ├── useAuth.ts                  # Authentication hook
│   │   ├── useBuses.ts                 # Bus management hook
│   │   └── useUsers.ts                 # User management hook
│   │
│   ├── 📁 lib/                         # Third-party wrappers
│   │   └── axios.ts                    # Axios instance & interceptors
│   │
│   ├── 📁 routes/                      # Route definitions
│   │   └── index.tsx                   # App routes
│   │
│   ├── 📁 services/                    # API services
│   │   ├── auth.service.ts             # Auth API calls
│   │   ├── bus.service.ts              # Bus API calls
│   │   └── user.service.ts             # User API calls
│   │
│   ├── 📁 store/                       # Global state (Zustand)
│   │   └── auth-store.ts               # Auth state
│   │
│   ├── 📁 tests/                       # Test configuration
│   │   └── setup.ts                    # Test setup
│   │
│   ├── 📁 types/                       # TypeScript types
│   │   └── index.ts                    # Global type definitions
│   │
│   ├── 📁 utils/                       # Utility functions
│   │   ├── cn.ts                       # Class name merger
│   │   ├── format.ts                   # Formatting functions
│   │   └── validation.ts               # Zod schemas
│   │
│   ├── App.tsx                         # Root component
│   ├── main.tsx                        # Entry point
│   └── index.css                       # Global styles
│
├── 📁 .vscode/                         # VS Code settings
│   ├── settings.json                   # Editor settings
│   └── extensions.json                 # Recommended extensions
│
├── 📄 .env                             # Environment variables
├── 📄 .env.example                     # Environment template
├── 📄 .eslintrc.cjs                    # ESLint configuration
├── 📄 .gitignore                       # Git ignore rules
├── 📄 .prettierrc                      # Prettier configuration
├── 📄 index.html                       # HTML template
├── 📄 package.json                     # Dependencies
├── 📄 postcss.config.js                # PostCSS configuration
├── 📄 tailwind.config.js               # TailwindCSS configuration
├── 📄 tsconfig.json                    # TypeScript configuration
├── 📄 tsconfig.node.json               # TypeScript Node configuration
├── 📄 vite.config.ts                   # Vite configuration
├── 📄 vitest.config.ts                 # Vitest configuration
│
├── 📄 README.md                        # Project documentation
├── 📄 ARCHITECTURE.md                  # Architecture documentation
├── 📄 CONTRIBUTING.md                  # Contributing guide
└── 📄 PROJECT_STRUCTURE.md             # This file
```

## Dosya Açıklamaları

### Konfigürasyon Dosyaları

| Dosya | Açıklama |
|-------|----------|
| `package.json` | NPM bağımlılıkları ve scriptler |
| `tsconfig.json` | TypeScript derleyici ayarları |
| `vite.config.ts` | Vite build tool ayarları |
| `tailwind.config.js` | TailwindCSS tema ayarları |
| `.eslintrc.cjs` | Code linting kuralları |
| `.prettierrc` | Code formatting kuralları |
| `vitest.config.ts` | Test framework ayarları |

### Ana Klasörler

#### `/src/components`
**Amaç:** Reusable UI bileşenleri
- `common/` - Proje geneli kullanılabilir componentler
- `layouts/` - Sayfa layout şablonları

#### `/src/features`
**Amaç:** Feature-based modüller
- Her özellik bağımsız klasörde
- Kendi components, hooks, pages içerir
- Bakımı ve ölçeklenmesi kolay

#### `/src/hooks`
**Amaç:** Custom React hooks
- Data fetching
- Business logic
- Reusable state logic

#### `/src/services`
**Amaç:** API iletişim katmanı
- HTTP request'leri
- Response handling
- Error handling

#### `/src/store`
**Amaç:** Global state management
- Zustand store'ları
- App-wide state

#### `/src/types`
**Amaç:** TypeScript type definitions
- Interface'ler
- Type aliases
- API response types

#### `/src/utils`
**Amaç:** Yardımcı fonksiyonlar
- Formatters
- Validators
- Helpers

## Dosya İsimlendirme Kuralları

### Components
```
PascalCase.tsx
Button.tsx
StudentCard.tsx
```

### Hooks
```
camelCase.ts
useAuth.ts
useStudents.ts
```

### Services
```
camelCase.service.ts
auth.service.ts
student.service.ts
```

### Utils
```
camelCase.ts
format.ts
validation.ts
```

### Types
```
camelCase.ts OR index.ts
user.types.ts
index.ts
```

## Import Path Aliases

```typescript
@/*              => src/*
@/components/*   => src/components/*
@/features/*     => src/features/*
@/hooks/*        => src/hooks/*
@/services/*     => src/services/*
@/store/*        => src/store/*
@/types/*        => src/types/*
@/utils/*        => src/utils/*
@/config/*       => src/config/*
@/lib/*          => src/lib/*
@/assets/*       => src/assets/*
```

### Kullanım Örneği
```typescript
// ❌ Bad - Relative paths
import { Button } from '../../../components/common/Button';

// ✅ Good - Alias paths
import { Button } from '@/components/common/Button';
```

## Kod Organizasyonu

### Component Dosyası
```typescript
// 1. External imports
import { useState } from 'react';

// 2. Internal imports
import { Button } from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';

// 3. Types
import type { User } from '@/types';

// 4. Component
export const MyComponent = () => {
  // ...
};
```

### Feature Modülü
```
feature-name/
├── components/     # Feature-specific components
├── hooks/         # Feature-specific hooks
├── pages/         # Route pages
├── services/      # API services
└── types/         # Type definitions
```

## Environment Variables

```env
# .env dosyası
VITE_API_BASE_URL=http://localhost:3001
VITE_API_TIMEOUT=30000
VITE_APP_ENV=development
VITE_ENABLE_DEVTOOLS=true
```

**Not:** Vite'da environment variable'lar `VITE_` prefix ile başlamalı.

## Build Output

```
dist/
├── assets/           # Compiled CSS, JS
├── index.html        # Entry HTML
└── ...
```

## Yeni Feature Ekleme

1. Feature klasörü oluştur:
```bash
src/features/my-feature/
├── components/
├── hooks/
├── pages/
├── services/
└── types/
```

2. Route ekle (`src/routes/index.tsx`)
3. Navigation ekle (layout'a)
4. Service oluştur
5. Hook oluştur
6. Page oluştur

## Sonuç

Bu klasör yapısı:
- ✅ Ölçeklenebilir
- ✅ Bakımı kolay
- ✅ Test edilebilir
- ✅ Anlaşılır
- ✅ Modern standartlara uygun

Feature-based architecture sayesinde her modül bağımsız çalışabilir ve büyük ekiplerde bile verimli geliştirme sağlanır.

