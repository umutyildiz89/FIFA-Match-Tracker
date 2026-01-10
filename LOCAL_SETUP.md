# Local Development Setup Guide

## 🚀 Hızlı Başlangıç

### Gereksinimler:
- Node.js (v18+)
- npm veya yarn
- MySQL (local veya PlanetScale) - **Opsiyonel** (test için gerekli değil)

---

## 📋 Adım Adım Kurulum

### 1. Backend Setup

```bash
# Ana dizinde
cd C:\Users\umut\Desktop\TODOGAME

# Bağımlılıkları yükle
npm install

# .env dosyası oluştur (aşağıdaki içeriği kullan)
```

### 2. .env Dosyası Oluştur

Ana dizinde `.env` dosyası oluşturun:

```env
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-in-production-12345
JWT_EXPIRES_IN=7d

# Database (Local MySQL için - opsiyonel)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your-password
DB_NAME=fifa_match_tracker
DB_PORT=3306

# Veya PlanetScale için:
# DB_HOST=your-planetscale-host.psdb.cloud
# DB_USER=your-username
# DB_PASSWORD=your-password
# DB_NAME=your-db-name
# DB_PORT=3306

# Cloudinary (opsiyonel - image upload için)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 3. Database Setup (Opsiyonel)

**Seçenek A: Local MySQL (XAMPP/WAMP)**
```bash
# XAMPP MySQL'i başlat
# phpMyAdmin'de yeni database oluştur: fifa_match_tracker
# Schema'yı uygula:
mysql -u root -p fifa_match_tracker < database/schema.sql
```

**Seçenek B: PlanetScale (Ücretsiz)**
```bash
# PlanetScale'de database oluştur
# Connection string'i .env'e ekle
# Schema'yı PlanetScale console'dan uygula
```

**Seçenek C: Database Olmadan Test (Sadece Frontend)**
- Backend başlar ama API'ler hata verir
- Frontend'de sadece UI test edilebilir

### 4. Backend'i Başlat

```bash
# Development mode (otomatik restart)
npm run dev

# Veya production mode
npm start
```

Backend `http://localhost:3000` adresinde çalışacak.

**Not:** Database bağlantısı yoksa server başlar ama API endpoint'leri hata verecektir.

---

### 5. Frontend Setup

```bash
# Yeni terminal aç
cd C:\Users\umut\Desktop\TODOGAME\frontend

# Bağımlılıklar zaten yüklenmiş olmalı
# Eğer yoksa:
npm install

# .env dosyası oluştur (opsiyonel)
```

**Frontend .env (opsiyonel):**
```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
VITE_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
```

### 6. Frontend'i Başlat

```bash
npm run dev
```

Frontend `http://localhost:5173` adresinde çalışacak.

---

## 🧪 Test Etme

### Backend Test:
```bash
# Health check (database gerektirmez)
curl http://localhost:3000/health

# Beklenen response:
# {"status":"OK","message":"Server is running"}
```

### Frontend Test:
1. Tarayıcıda aç: `http://localhost:5173`
2. Register sayfasında yeni kullanıcı oluştur
3. Login yap
4. Dashboard'u görüntüle

**Not:** Database yoksa register/login çalışmaz, sadece UI test edilebilir.

---

## ⚠️ Sorun Giderme

### Backend başlamıyor:
- `.env` dosyası var mı kontrol et
- Port 3000 kullanımda mı kontrol et
- `npm install` yapıldı mı kontrol et

### Database bağlantı hatası:
- MySQL çalışıyor mu kontrol et (XAMPP/WAMP)
- `.env` dosyasındaki database bilgileri doğru mu kontrol et
- PlanetScale kullanıyorsan connection string doğru mu kontrol et

### Frontend backend'e bağlanamıyor:
- Backend çalışıyor mu kontrol et (`http://localhost:3000/health`)
- CORS hatası varsa backend'de CORS ayarlarını kontrol et
- Frontend .env dosyasında `VITE_API_URL` doğru mu kontrol et

### Socket.IO bağlantı hatası:
- Backend çalışıyor mu kontrol et
- Socket.IO server başladı mı kontrol et (backend console'da log var)
- Frontend .env dosyasında `VITE_SOCKET_URL` doğru mu kontrol et

---

## 🎯 Minimum Çalıştırma (Database Olmadan)

Database olmadan da çalıştırabilirsiniz ama çok sınırlı:

**Yapabilecekleriniz:**
- ✅ Backend server başlar
- ✅ Health check çalışır (`/health`)
- ✅ Frontend UI görüntülenir
- ✅ Routing çalışır
- ✅ Authentication sayfaları görüntülenir

**Yapamayacaklarınız:**
- ❌ Kullanıcı kaydı/girişi (database gerekiyor)
- ❌ API endpoint'leri (database gerekiyor)
- ❌ Chat (database gerekiyor)
- ❌ Match/Draft işlemleri (database gerekiyor)

---

## 💡 Öneriler

1. **Hızlı Test için:** Database olmadan UI'yi test et
2. **Tam Test için:** Local MySQL (XAMPP) veya PlanetScale kullan
3. **Production için:** PlanetScale + Render.com + Netlify kullan

