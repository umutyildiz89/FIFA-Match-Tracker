# 🚀 Local'de Çalıştırma Rehberi

## ✅ ŞU ANDA ÇALIŞTIRILABILIR MI?

**Kısa Cevap: EVET, ama sınırlı! 🎯**

---

## 🎯 Hızlı Başlangıç (Database Olmadan - Sadece UI Test)

### 1. Backend'i Başlat

**Terminal 1:**
```bash
cd C:\Users\umut\Desktop\TODOGAME

# .env dosyası oluştur (manuel olarak)
# İçeriği: PORT=3000
#          JWT_SECRET=fifa-match-tracker-secret-12345

npm run dev
```

**Beklenen:**
- ✅ Server başlar: `http://localhost:3000`
- ⚠️ Database bağlantı hatası görünebilir (normal, database yok)
- ✅ Health check çalışır: `http://localhost:3000/health`

**Test:**
- Tarayıcıda aç: `http://localhost:3000/health`
- Beklenen: `{"status":"OK","message":"Server is running"}`

---

### 2. Frontend'i Başlat

**Terminal 2:**
```bash
cd C:\Users\umut\Desktop\TODOGAME\frontend

npm run dev
```

**Beklenen:**
- ✅ Frontend başlar: `http://localhost:5173`
- ✅ Login sayfası görüntülenir
- ✅ Register sayfası çalışır
- ⚠️ Kullanıcı kaydı/girişi çalışmaz (database gerekiyor)

**Test:**
- Tarayıcıda aç: `http://localhost:5173`
- Login/Register sayfalarını görüntüle
- Routing test et (sayfalar arası geçiş)

---

## ✅ ŞU ANDA ÇALIŞANLAR (Database Olmadan)

1. ✅ **Backend Server** - Başlar ve çalışır
2. ✅ **Health Check Endpoint** - `/health` çalışır
3. ✅ **Frontend UI** - Tüm sayfalar görüntülenir
4. ✅ **Routing** - React Router çalışır
5. ✅ **Navigation** - Sayfalar arası geçiş çalışır
6. ✅ **Responsive Design** - Mobile/tablet/desktop görünümü test edilebilir
7. ✅ **Socket.IO Server** - Backend'de başlar (database olmadan çalışır ama mesaj saklanamaz)

---

## ❌ ŞU ANDA ÇALIŞMAYANLAR (Database Gerekiyor)

1. ❌ **Kullanıcı Kaydı/Girişi** - Database gerekiyor
2. ❌ **API Endpoint'leri** - Database gerekiyor (register, login, matches, drafts, friends)
3. ❌ **Chat Mesajlaşma** - Database gerekiyor (mesajlar saklanamaz)
4. ❌ **Match/Draft İşlemleri** - Database gerekiyor
5. ❌ **Friends Sistemi** - Database gerekiyor

---

## 🎯 Test Senaryoları

### Senaryo 1: Sadece UI Test (Database Olmadan)

**Yapabilecekleriniz:**
```bash
# 1. Backend başlat
npm run dev

# 2. Frontend başlat (yeni terminal)
cd frontend
npm run dev

# 3. Tarayıcıda aç: http://localhost:5173

# Test Edilebilir:
- ✅ Login sayfası görünümü
- ✅ Register sayfası görünümü
- ✅ Dashboard layout
- ✅ Routing (sayfalar arası geçiş)
- ✅ Responsive design (tarayıcıyı küçült)
- ✅ Navigation (menü geçişleri)
- ✅ Chat panel aç/kapa (UI test)
```

**Yapamayacaklarınız:**
- ❌ Gerçek kullanıcı kaydı/girişi
- ❌ API çağrıları (database gerekiyor)
- ❌ Veri görüntüleme (database gerekiyor)

---

### Senaryo 2: Tam Test (Database ile)

**Gereksinimler:**
1. Local MySQL (XAMPP/WAMP) veya PlanetScale hesabı
2. Database oluştur
3. Schema uygula: `mysql -u root -p fifa_match_tracker < database/schema.sql`
4. `.env` dosyasında database bilgilerini ayarla

**Sonra:**
- ✅ Tüm özellikler çalışır
- ✅ Kullanıcı kaydı/girişi
- ✅ Match/Draft işlemleri
- ✅ Chat
- ✅ Friends sistemi

---

## 📝 .env Dosyası Oluşturma (Manuel)

Ana dizinde `.env` dosyası oluşturun:

**Minimal .env (Database Olmadan Test İçin):**
```env
PORT=3000
JWT_SECRET=fifa-match-tracker-super-secret-jwt-key-12345
JWT_EXPIRES_IN=7d
```

**Tam .env (Database ile):**
```env
PORT=3000
JWT_SECRET=fifa-match-tracker-super-secret-jwt-key-12345
JWT_EXPIRES_IN=7d

# Local MySQL için:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=fifa_match_tracker
DB_PORT=3306

# Veya PlanetScale için:
# DB_HOST=your-host.psdb.cloud
# DB_USER=your-username
# DB_PASSWORD=your-password
# DB_NAME=your-db-name
# DB_PORT=3306

# Cloudinary (opsiyonel):
# CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
# CLOUDINARY_API_KEY=your-api-key
# CLOUDINARY_API_SECRET=your-api-secret
```

**Frontend .env (opsiyonel):**
`frontend/.env`:
```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

---

## 🚀 Hızlı Test Komutları

### Backend Test:
```bash
# Ana dizinde
npm run dev

# Başka terminal'de test:
curl http://localhost:3000/health
# veya tarayıcıda: http://localhost:3000/health
```

### Frontend Test:
```bash
# frontend dizinde
npm run dev

# Tarayıcıda: http://localhost:5173
```

---

## 💡 Önerim

**Şimdi Yapılacaklar:**

1. ✅ **Backend bağımlılıkları yüklendi** - Hazır
2. ⚠️ **.env dosyası oluştur** - Manuel oluşturmalısın (`.env.local` dosyasını referans al)
3. ✅ **Backend'i başlat** - `npm run dev`
4. ✅ **Frontend'i başlat** - `cd frontend && npm run dev`
5. ✅ **UI test et** - Tarayıcıda görüntüle

**Sonra:**
- Database kur (XAMPP veya PlanetScale)
- Schema uygula
- Tam test yap

---

## ❓ Sorun Olursa

### Backend başlamıyor:
- `.env` dosyası var mı kontrol et
- Port 3000 kullanımda mı kontrol et
- `npm install` yapıldı mı kontrol et

### Frontend başlamıyor:
- `cd frontend` yaptın mı kontrol et
- `npm install` yapıldı mı kontrol et
- Port 5173 kullanımda mı kontrol et

### API hata veriyor:
- Normal! Database yok, API'ler çalışmaz
- Sadece `/health` endpoint çalışır
- UI test edebilirsin

---

## 🎉 Sonuç

**EVET, local'de çalıştırılabilir! 🚀**

**Şu anda:**
- ✅ Backend server başlar (database olmadan)
- ✅ Frontend UI görüntülenir
- ✅ Routing ve navigation çalışır
- ⚠️ API'ler çalışmaz (database gerekiyor)

**Test için:**
1. Backend: `npm run dev`
2. Frontend: `cd frontend && npm run dev`
3. Tarayıcı: `http://localhost:5173`

**Tam fonksiyon için:**
- Database kur ve configure et
- `.env` dosyasında database bilgilerini ayarla
- Tam test yap

