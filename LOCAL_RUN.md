# Local Çalıştırma Rehberi

## 🚀 Hızlı Başlatma

### Durum Analizi:
- ✅ Frontend bağımlılıkları yüklü
- ⚠️ Backend bağımlılıkları yükleniyor
- ❌ .env dosyası yok (oluşturulacak)
- ❌ Database bağlantısı yok (opsiyonel)

---

## 📋 Adım 1: Backend Bağımlılıkları

```bash
cd C:\Users\umut\Desktop\TODOGAME
npm install
```

Bu komutu çalıştırdım, bekleyin...

---

## 📋 Adım 2: .env Dosyası Oluştur

**Ana dizinde `.env` dosyası oluşturun:**

```env
PORT=3000
JWT_SECRET=fifa-match-tracker-super-secret-jwt-key-12345
JWT_EXPIRES_IN=7d

# Database (Şimdilik yoruma al, test için gerekli değil)
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=
# DB_NAME=fifa_match_tracker
# DB_PORT=3306

# Cloudinary (Şimdilik yoruma al, image upload için gerekli)
# CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
# CLOUDINARY_API_KEY=your-api-key
# CLOUDINARY_API_SECRET=your-api-secret
```

**Frontend için `.env` (opsiyonel):**

`frontend/.env`:
```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

---

## 📋 Adım 3: Backend'i Başlat (Database Olmadan)

```bash
# Ana dizinde
npm run dev
```

**Beklenen:**
- ✅ Server başlar: `http://localhost:3000`
- ⚠️ Database bağlantı hatası görünebilir (normal, database yok)
- ✅ Health check çalışır: `http://localhost:3000/health`

**Test:**
```bash
curl http://localhost:3000/health
# veya tarayıcıda aç: http://localhost:3000/health
```

---

## 📋 Adım 4: Frontend'i Başlat

**Yeni terminal açın:**
```bash
cd C:\Users\umut\Desktop\TODOGAME\frontend
npm run dev
```

**Beklenen:**
- ✅ Frontend başlar: `http://localhost:5173`
- ✅ Login/Register sayfaları görüntülenir
- ⚠️ API çağrıları hata verecektir (database yok)

---

## 🧪 Test Senaryoları

### Senaryo 1: Database Olmadan (Sadece UI Test)

**Çalışan:**
- ✅ Backend server (`/health` endpoint)
- ✅ Frontend UI (Login, Register, Dashboard sayfaları)
- ✅ Routing ve navigation
- ✅ Responsive design

**Çalışmayan:**
- ❌ Kullanıcı kaydı/girişi (database gerekiyor)
- ❌ API endpoint'leri (database gerekiyor)
- ❌ Chat (database gerekiyor)

### Senaryo 2: Database ile (Tam Test)

**Gereksinimler:**
1. Local MySQL (XAMPP/WAMP) veya PlanetScale
2. Database oluştur ve schema uygula
3. .env dosyasında database bilgilerini ayarla

**Sonra:**
- ✅ Tüm özellikler çalışır
- ✅ Kullanıcı kaydı/girişi
- ✅ Match/Draft işlemleri
- ✅ Chat

---

## 💡 Hızlı Test (Database Olmadan)

**Backend:**
```bash
npm run dev
# http://localhost:3000/health aç - çalışmalı
```

**Frontend:**
```bash
cd frontend
npm run dev
# http://localhost:5173 aç - Login sayfası görünmeli
```

**Sonuç:**
- ✅ UI test edilebilir
- ✅ Routing test edilebilir
- ✅ Responsive design test edilebilir
- ❌ API test edilemez (database gerekiyor)

---

## 🎯 Önerilen Adımlar

1. **Şimdi:** Database olmadan test et (UI ve routing)
2. **Sonra:** Local MySQL kur (XAMPP/WAMP) veya PlanetScale kullan
3. **Sonra:** Database ile tam test et

