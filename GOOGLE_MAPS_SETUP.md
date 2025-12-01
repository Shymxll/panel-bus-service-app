# Google Maps API Kurulum Talimatları

Bu proje, duraklar sayfasında Google Maps entegrasyonu kullanmaktadır. Google Maps'i kullanabilmek için bir API key'e ihtiyacınız var.

## Adım 1: Google Maps API Key Alma

1. [Google Cloud Console](https://console.cloud.google.com/) adresine gidin
2. Yeni bir proje oluşturun veya mevcut bir projeyi seçin
3. Sol menüden **APIs & Services** > **Credentials** sekmesine gidin
4. **+ CREATE CREDENTIALS** butonuna tıklayın
5. **API key** seçeneğini seçin
6. Oluşturulan API key'i kopyalayın

## Adım 2: Gerekli API'leri Aktifleştirme

Google Cloud Console'da aşağıdaki API'leri aktifleştirin:

1. **Maps JavaScript API**
2. **Places API**
3. **Geocoding API** (opsiyonel, ama önerilir)

Aktifleştirmek için:
- [API Library](https://console.cloud.google.com/apis/library) sayfasına gidin
- Yukarıdaki API'leri arayın ve her birini aktifleştirin

## Adım 3: API Key'i Projeye Ekleme

1. Proje kök dizininde bir `.env` dosyası oluşturun (eğer yoksa)
2. Aşağıdaki satırı ekleyin:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_GOOGLE_MAPS_API_KEY=buraya_api_keyinizi_yapistirin
```

3. `buraya_api_keyinizi_yapistirin` yerine Google Cloud Console'dan aldığınız API key'i yapıştırın

## Adım 4: Uygulamayı Yeniden Başlatma

Geliştirme sunucusunu yeniden başlatın:

```bash
npm run dev
```

## Güvenlik Notları

⚠️ **ÖNEMLİ:**

1. `.env` dosyası `.gitignore` dosyasında olmalıdır (zaten olmalı)
2. API key'inizi asla GitHub'a veya başka bir public repository'ye push etmeyin
3. Production için API key'inizi kısıtlayın:
   - Google Cloud Console'da API key ayarlarına gidin
   - **Application restrictions** bölümünden **HTTP referrers** seçin
   - Domain'lerinizi ekleyin (örn: `yourwebsite.com/*`)
   - **API restrictions** bölümünden sadece kullandığınız API'leri seçin

## Test Etme

API key'i ekledikten sonra:

1. Tarayıcıda `http://localhost:5173/admin/stops` adresine gidin
2. Haritanın yüklendiğini göreceksiniz
3. Harita üzerinde arama yapabilirsiniz
4. Haritaya tıklayarak yeni durak ekleyebilirsiniz

## Sorun Giderme

### "Google Maps API Key əlavə edilməlidir" hatası görüyorsanız:

1. `.env` dosyasının proje kök dizininde olduğundan emin olun
2. `VITE_GOOGLE_MAPS_API_KEY` değişken adının doğru yazıldığından emin olun
3. Geliştirme sunucusunu yeniden başlatın

### Harita yüklenmiyor:

1. Tarayıcı konsolunu kontrol edin (F12)
2. Google Cloud Console'da gerekli API'lerin aktif olduğundan emin olun
3. API key'inizin kısıtlamalarını kontrol edin

### "This page can't load Google Maps correctly" hatası:

1. API key'inizin geçerli olduğundan emin olun
2. Billing account'unuzun aktif olduğundan emin olun (Google Maps API kullanımı için gerekli)

## Ücretsiz Kullanım Limitleri

Google Maps API, aylık ücretsiz kullanım kredisi sunar:
- Her ay $200 değerinde ücretsiz kullanım
- Bu yaklaşık 28,000 harita yüklemesine denk gelir
- Küçük ve orta ölçekli projeler için genellikle yeterlidir

Daha fazla bilgi için: [Google Maps Platform Pricing](https://mapsplatform.google.com/pricing/)

## Yardım

Herhangi bir sorunla karşılaşırsanız:
- [Google Maps JavaScript API Documentation](https://developers.google.com/maps/documentation/javascript/overview)
- [Stack Overflow - google-maps tag](https://stackoverflow.com/questions/tagged/google-maps)

