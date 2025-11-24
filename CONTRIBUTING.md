# Katkıda Bulunma Rehberi

Bu projeye katkıda bulunmak istediğiniz için teşekkür ederiz! 🎉

## Başlamadan Önce

1. Projeyi fork edin
2. Local ortamınıza klonlayın
3. Bağımlılıkları yükleyin: `npm install`
4. Development server'ı çalıştırın: `npm run dev`

## Geliştirme Süreci

### 1. Branch Oluşturma

```bash
# Feature için
git checkout -b feature/amazing-feature

# Bug fix için
git checkout -b fix/bug-description

# Hotfix için
git checkout -b hotfix/critical-issue
```

### 2. Kod Yazma

#### Standartlar
- TypeScript strict mode
- ESLint kurallarına uyum
- Prettier ile formatlama
- Meaningful isimlendirme

#### Component Örneği
```typescript
import { cn } from '@/utils/cn';

interface MyComponentProps {
  title: string;
  isActive?: boolean;
  onAction?: () => void;
}

export const MyComponent = ({ 
  title, 
  isActive = false, 
  onAction 
}: MyComponentProps) => {
  return (
    <div className={cn('base-class', isActive && 'active-class')}>
      <h2>{title}</h2>
      {onAction && <button onClick={onAction}>Action</button>}
    </div>
  );
};
```

### 3. Testing

```bash
# Unit testler
npm run test

# Linting
npm run lint

# Type checking
npm run type-check
```

### 4. Commit Messages

Conventional Commits formatını kullanıyoruz:

```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Format code
refactor: Refactor code
test: Add tests
chore: Update dependencies
```

Örnekler:
```bash
git commit -m "feat: Add student QR code scanner"
git commit -m "fix: Resolve login redirect issue"
git commit -m "docs: Update API documentation"
```

### 5. Pull Request

1. Push edin: `git push origin feature/amazing-feature`
2. GitHub'da Pull Request açın
3. Template'i doldurun
4. Review bekleyin

## PR Template

```markdown
## Değişiklik Türü
- [ ] Yeni özellik
- [ ] Bug fix
- [ ] Dokümantasyon
- [ ] Refactoring

## Açıklama
Yaptığınız değişiklikleri açıklayın.

## Test Edildi Mi?
- [ ] Evet
- [ ] Hayır

## Ekran Görüntüsü (UI değişikliği ise)
```

## Kod İnceleme Kriterleri

### ✅ İyi Pratikler
- Type safety
- Error handling
- Loading states
- Empty states
- Responsive design
- Accessibility
- Performance

### ❌ Kaçınılması Gerekenler
- `any` kullanımı
- Console.log'lar
- Hardcoded değerler
- Inline styles
- Büyük componentler
- Global state abuse

## Klasör Yapısı

Yeni feature eklerken:

```
src/features/my-feature/
├── components/
│   ├── MyComponent.tsx
│   └── MyComponent.test.tsx
├── hooks/
│   └── useMyFeature.ts
├── pages/
│   └── MyPage.tsx
├── services/
│   └── my.service.ts
└── types/
    └── index.ts
```

## Style Guide

### Isimlendirme
```typescript
// Components: PascalCase
MyComponent

// Hooks: camelCase + use prefix
useMyHook

// Utils: camelCase
formatDate

// Constants: UPPER_SNAKE_CASE
API_BASE_URL

// Types: PascalCase
interface UserData {}
```

### Import Sırası
```typescript
// 1. External
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Internal
import { Button } from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';

// 3. Types
import type { User } from '@/types';
```

## Testing

### Component Test
```typescript
import { render, screen } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

### Hook Test
```typescript
import { renderHook } from '@testing-library/react';
import { useMyHook } from './useMyHook';

describe('useMyHook', () => {
  it('returns initial state', () => {
    const { result } = renderHook(() => useMyHook());
    expect(result.current.data).toBeNull();
  });
});
```

## Dokümantasyon

### Component Dokümantasyonu
```typescript
/**
 * Button component with various styles and sizes
 * 
 * @example
 * <Button variant="primary" size="lg">
 *   Click me
 * </Button>
 */
export const Button = ({ ... }) => { }
```

### Hook Dokümantasyonu
```typescript
/**
 * Custom hook for authentication
 * 
 * @returns {Object} Auth state and actions
 * 
 * @example
 * const { user, login, logout } = useAuth();
 */
export const useAuth = () => { }
```

## Sık Sorulan Sorular

### Q: Path alias'ları nasıl kullanırım?
```typescript
// ✅ Good
import { Button } from '@/components/common/Button';

// ❌ Bad
import { Button } from '../../../components/common/Button';
```

### Q: API çağrısı nasıl yapmalıyım?
```typescript
// 1. Service oluştur
class MyService {
  async getData() {
    return axiosInstance.get('/api/data');
  }
}

// 2. Hook oluştur
export const useMyData = () => {
  return useQuery({
    queryKey: ['my-data'],
    queryFn: () => myService.getData(),
  });
};

// 3. Component'te kullan
const { data, isLoading } = useMyData();
```

### Q: Global state ne zaman kullanmalıyım?
- Authentication state
- User preferences
- App-wide settings

Diğer durumlarda TanStack Query veya local state tercih edin.

## Yardım

Takıldığınız yerler için:
1. Dokümantasyonu kontrol edin
2. Benzer örneklere bakın
3. Issue açın
4. Sorularınızı sorun

## Teşekkürler! 🙏

Katkılarınız için teşekkür ederiz!

