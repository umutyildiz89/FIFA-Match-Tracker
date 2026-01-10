# 🚀 Hızlı Başlangıç - Local Çalıştırma

## ✅ ŞU ANDA ÇALIŞTIRILABİLİR MI?

**EVET! 🎯** Database olmadan da çalıştırılabilir (sınırlı fonksiyonlarla).

---

## ⚡ Hızlı Başlatma (2 Terminal)

### Terminal 1: Backend

```bash
# Ana dizinde
cd C:\Users\umut\Desktop\TODOGAME

# .env dosyası oluştur (manuel)
# İçeriği:
PORT=3000
JWT_SECRET=fifa-match-tracker-secret-12345
JWT_EXPIRES_IN=7d

# Backend'i başlat
npm run dev
```

**Beklenen:** Server `http://localhost:3000` adresinde başlar

**Test:** Tarayıcıda aç: `http://localhost:3000/health`
- Beklenen: `{"status":"OK","message":"Server is running"}`

---

### Terminal 2: Frontend

```bash
# Frontend dizininde
cd C:\Users\umut\Desktop\TODOGAME\frontend

# Frontend'i başlat
npm run dev
```

**Beklenen:** Frontend `http://localhost:5173` adresinde başlar

**Test:** Tarayıcıda aç: `http://localhost:5173`
- Login sayfası görünmeli

---

## 📝 .env Dosyası Oluşturma (Manuel)

**Ana dizinde `.env` dosyası oluşturun:**

**Minimal (Database Olmadan Test İçin):**
```
PORT=3000
JWT_SECRET=fifa-match-tracker-secret-12345
JWT_EXPIRES_IN=7d
```

**Tam (Database ile):**
```
PORT=3000
JWT_SECRET=fifa-match-tracker-secret-12345
JWT_EXPIRES_IN=7d

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=fifa_match_tracker
DB_PORT=3306
```

**Frontend için (opsiyonel):**
`frontend/.env`:
```
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

---

## ✅ Çalışan Özellikler (Database Olmadan)

1. ✅ **Backend Server** - Başlar ve çalışır
2. ✅ **Health Check** - `/health` endpoint çalışır
3. ✅ **Frontend UI** - Tüm sayfalar görüntülenir
4. ✅ **Routing** - React Router çalışır
5. ✅ **Navigation** - Sayfalar arası geçiş çalışır
6. ✅ **Responsive Design** - Test edilebilir
7. ✅ **Chat Panel UI** - Aç/kapa çalışır (mesaj gönderilemez)

---

## ❌ Çalışmayan Özellikler (Database Gerekiyor)

1. ❌ **Kullanıcı Kaydı/Girişi** - Database gerekiyor
2. ❌ **API Endpoint'leri** - Database gerekiyor
3. ❌ **Chat Mesajlaşma** - Database gerekiyor
4. ❌ **Match/Draft İşlemleri** - Database gerekiyor

---

## 🎯 Şimdi Ne Yapalım?

**1. Hızlı Test (Database Olmadan):**
```bash
# Terminal 1: Backend
npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev

# Tarayıcı: http://localhost:5173
# Test: UI, routing, responsive design
```

**2. Tam Test (Database ile):**
- XAMPP/WAMP MySQL kur
- Database oluştur: `fifa_match_tracker`
- Schema uygula: `mysql -u root -p fifa_match_tracker < database/schema.sql`
- `.env` dosyasında database bilgilerini ayarla
- Tekrar başlat

---

## 🚀 Başlatalım!

**Şimdi test edelim mi?** Backend ve Frontend'i başlatıp ne olduğunu görelim! 🎉

