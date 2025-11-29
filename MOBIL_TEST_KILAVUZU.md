# 📱 Mobil Test Kılavuzu - Valideyin Girişi

## 🔍 Sorun Tespiti ve Çözümler

### ❌ Sorun: Mobilde Giriş Yapamıyorum

**Olası Nedenler ve Çözümler:**

---

## 1. 🔌 Backend Bağlantı Sorunu

### Problem
Mobil cihazdan `localhost:3001` adresine erişilemez.

### Çözüm

#### Seçenek A: Network IP Kullanma (Aynı WiFi)

1. **Bilgisayarınızın IP adresini bulun:**
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   ```

2. **Backend'i network IP ile başlatın:**
   ```bash
   # Backend klasöründe
   # .env dosyasına ekleyin veya direkt çalıştırın:
   HOST=0.0.0.0 npm run dev
   ```

3. **Frontend'de environment variable ayarlayın:**
   ```bash
   # .env dosyası oluşturun (proje root'unda)
   VITE_API_BASE_URL=http://192.168.1.100:3001
   ```
   > `192.168.1.100` yerine kendi IP adresinizi yazın

4. **Frontend'i yeniden başlatın:**
   ```bash
   npm run dev
   ```

#### Seçenek B: Ngrok Kullanma (Public URL)

1. **Ngrok'u indirin ve kurun:**
   ```bash
   # https://ngrok.com/download
   ```

2. **Backend'i expose edin:**
   ```bash
   ngrok http 3001
   ```

3. **Oluşan URL'yi kullanın:**
   ```bash
   # .env dosyasına
   VITE_API_BASE_URL=https://xxxx-xx-xx-xx-xx.ngrok.io
   ```

---

## 2. 📱 QR Kod Formatı Sorunu

### Problem
QR kod boşluk veya özel karakterler içeriyor.

### Çözüm

✅ **Yapılan İyileştirmeler:**
- QR kod otomatik olarak büyük harfe çevriliyor
- Boşluklar temizleniyor
- URL encoding yapılıyor

**Kontrol Listesi:**
- [ ] QR kodu tam olarak karttaki gibi girin
- [ ] Boşluk olmadan girin
- [ ] Büyük/küçük harf fark etmez (otomatik düzeltiliyor)

---

## 3. 📞 Telefon Numarası Formatı Sorunu

### Problem
Telefon numarası formatı eşleşmiyor.

### Çözüm

✅ **Yapılan İyileştirmeler:**
- Telefon numarası normalize ediliyor
- Boşluk, tire, parantez temizleniyor
- Sadece rakam ve + karakteri kalıyor

**Örnek Formatlar (Hepsi Çalışır):**
```
+994501234567
+994 50 123 45 67
+994-50-123-45-67
(994) 50 123 45 67
```

**Kontrol:**
- [ ] Telefon numarası veritabanında kayıtlı mı?
- [ ] Format doğru mu? (Azerbaycan: +994 ile başlamalı)

---

## 4. 🐛 Debug ve Test

### Console'da Kontrol Edin

Mobil tarayıcıda Developer Tools açın:

1. **Chrome Mobile:**
   - `chrome://inspect` (bilgisayarda)
   - Mobil cihazı USB ile bağlayın
   - "Remote devices" seçin

2. **Safari Mobile (iOS):**
   - Mac'te Safari → Develop → [Cihazınız]
   - Web Inspector'ı açın

3. **Console'da Görecekleriniz:**
   ```
   🔍 Giriş denemesi: { qrCode: "...", phone: "..." }
   ✅ Öğrenci bulundu: { id: 1, name: "...", ... }
   ❌ Parent login error: { ... }
   ```

### Network Tab'ında Kontrol

1. **Network sekmesini açın**
2. **Giriş butonuna tıklayın**
3. **İstekleri kontrol edin:**
   - `/api/students/qr/...` isteği var mı?
   - Status code nedir? (200, 404, 500?)
   - Response ne döndürüyor?

---

## 5. ✅ Test Senaryoları

### Senaryo 1: Başarılı Giriş

```
QR Kod: STU-MIEAPZPA-CABCMH
Telefon: +994555555555

Beklenen:
✅ Öğrenci bulundu
✅ Telefon eşleşti
✅ Dashboard'a yönlendirildi
```

### Senaryo 2: Yanlış QR Kod

```
QR Kod: YANLIS-KOD
Telefon: +994555555555

Beklenen:
❌ "QR kod tapılmadı" hatası
```

### Senaryo 3: Yanlış Telefon

```
QR Kod: STU-MIEAPZPA-CABCMH
Telefon: +994999999999

Beklenen:
❌ "QR kod və ya telefon nömrəsi yanlışdır" hatası
```

### Senaryo 4: Backend Erişilemiyor

```
Beklenen:
❌ "Backend serverə qoşula bilmədi" hatası
```

---

## 6. 🔧 Hızlı Düzeltmeler

### QR Kod Bulunamıyor

**Kontrol:**
1. Backend çalışıyor mu? (`http://localhost:3001/api/health`)
2. Öğrenci veritabanında var mı?
3. QR kod doğru mu?

**Test:**
```bash
# Backend'de test edin
curl http://localhost:3001/api/students/qr/STU-MIEAPZPA-CABCMH
```

### Telefon Eşleşmiyor

**Kontrol:**
1. Veritabanında telefon numarası var mı?
2. Format doğru mu?

**SQL Kontrol:**
```sql
SELECT id, first_name, last_name, qr_code, parent_phone 
FROM students 
WHERE qr_code = 'STU-MIEAPZPA-CABCMH';
```

### Network Hatası

**Kontrol:**
1. Mobil cihaz aynı WiFi'de mi?
2. Firewall backend'i engelliyor mu?
3. VITE_API_BASE_URL doğru mu?

---

## 7. 📋 Checklist

Giriş yapmadan önce kontrol edin:

- [ ] Backend çalışıyor (`http://localhost:3001`)
- [ ] Frontend çalışıyor (`http://localhost:5173`)
- [ ] Mobil cihaz aynı WiFi'de
- [ ] VITE_API_BASE_URL ayarlı (mobil için)
- [ ] Öğrenci veritabanında var
- [ ] QR kod doğru format
- [ ] Telefon numarası kayıtlı
- [ ] Console'da hata yok

---

## 8. 🎯 Yapılan İyileştirmeler

### ✅ Telefon Normalizasyonu
```typescript
// Artık tüm formatlar çalışıyor:
"+994501234567" === "+994 50 123 45 67"  // true
```

### ✅ QR Kod Temizleme
```typescript
// Otomatik büyük harf ve trim
"stu-abc" → "STU-ABC"
```

### ✅ Detaylı Hata Mesajları
- 404: "QR kod tapılmadı"
- 500: "Server xətası"
- Network: "Backend serverə qoşula bilmədi"

### ✅ Debug Bilgileri
- Console'da detaylı loglar
- Development modunda API URL gösterimi

### ✅ Mobil Optimizasyon
- `inputMode="tel"` (mobilde sayısal klavye)
- `autoComplete` desteği
- `autoCapitalize` (QR kod için)

---

## 9. 🚀 Production Deployment

### Environment Variables

```env
# .env.production
VITE_API_BASE_URL=https://api.panelbus.az
```

### CORS Ayarları

Backend'de CORS ayarlarını kontrol edin:

```typescript
// Backend CORS config
cors({
  origin: ['https://panelbus.az', 'https://www.panelbus.az'],
  credentials: true,
})
```

---

## 10. 📞 Yardım

### Hala Çalışmıyorsa

1. **Console loglarını kontrol edin**
2. **Network tab'ında istekleri inceleyin**
3. **Backend loglarını kontrol edin**
4. **Veritabanında veri var mı kontrol edin**

### Debug Modu

Development modunda ekstra bilgiler gösterilir:
- API Base URL
- QR kod formatı ipuçları
- Detaylı console logları

---

**Son Güncelleme:** 29 Kasım 2025
**Versiyon:** 1.0.0

