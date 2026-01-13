# 🗄️ LOCAL DATABASE SETUP

## 📋 DURUM

Uygulama PostgreSQL kullanıyor. Local'de database ile çalışmak için 2 seçenek var:

---

## 🔧 SEÇENEK 1: RAILWAY DATABASE'İNİ LOCAL'DEN KULLAN (ÖNERİLEN)

**Avantaj:** Hızlı, ekstra kurulum gerekmez, production database ile senkron.

### Adımlar:

1. **Railway Dashboard'dan DATABASE_URL al:**
   - Railway.app → PostgreSQL service → "Variables"
   - `DATABASE_URL` variable'ını kopyala
   - Format: `postgresql://user:password@host:port/database`

2. **Local .env dosyası oluştur:**
   ```
   PORT=3000
   JWT_SECRET=your-super-secret-jwt-key-change-in-production-12345
   JWT_EXPIRES_IN=7d
   
   # Railway Database (Production database kullan)
   DATABASE_URL=postgresql://postgres:password@host:port/database
   
   # Cloudinary (opsiyonel)
   CLOUDINARY_CLOUD_NAME=dnc27blds
   CLOUDINARY_API_KEY=374854593451582
   CLOUDINARY_API_SECRET=8CixQiMxLSY2tR9phDN8bwcniDo
   ```

3. **Backend'i başlat:**
   ```bash
   npm run dev
   ```

**Not:** Production database kullanıyorsun, dikkatli ol! ✅

---

## 🔧 SEÇENEK 2: LOCAL POSTGRESQL KUR (AYRI DATABASE)

**Avantaj:** Production database'den bağımsız test.

**Dezavantaj:** PostgreSQL kurulumu gerekiyor.

### Adımlar:

1. **PostgreSQL kur:**
   - Windows: https://www.postgresql.org/download/windows/
   - veya XAMPP/WAMP (MySQL ile birlikte gelir, ama PostgreSQL ayrı kurulmalı)

2. **Database oluştur:**
   ```sql
   CREATE DATABASE fifa_match_tracker;
   ```

3. **Schema uygula:**
   - `database/schema_postgresql.sql` dosyasını PostgreSQL'de çalıştır

4. **Local .env dosyası oluştur:**
   ```
   PORT=3000
   JWT_SECRET=your-super-secret-jwt-key-change-in-production-12345
   JWT_EXPIRES_IN=7d
   
   # Local PostgreSQL
   DB_HOST=localhost
   DB_USER=postgres
   DB_PASSWORD=your-password
   DB_NAME=fifa_match_tracker
   DB_PORT=5432
   DB_SSL=false
   
   # Cloudinary (opsiyonel)
   CLOUDINARY_CLOUD_NAME=dnc27blds
   CLOUDINARY_API_KEY=374854593451582
   CLOUDINARY_API_SECRET=8CixQiMxLSY2tR9phDN8bwcniDo
   ```

5. **Backend'i başlat:**
   ```bash
   npm run dev
   ```

---

## ✅ ÖNERİLEN: SEÇENEK 1

**Neden?**
- Hızlı kurulum
- Production database ile senkron
- Ekstra PostgreSQL kurulumu gerekmez

**Not:** Production database kullanıyorsun, test verileri production'a gider!

---

## 🔍 DATABASE URL NASIL ALINIR?

### Railway Dashboard:

1. **Railway.app** → **PostgreSQL service** → **"Variables"** sekmesi
2. **`DATABASE_URL`** variable'ını bul
3. **Value'yu kopyala**

Örnek format:
```
postgresql://postgres:password@host.railway.internal:5432/railway
```

**Not:** Railway internal URL local'den çalışmaz! Public URL kullanmalısın.

### Railway Public URL:

1. **PostgreSQL service** → **"Connect"** sekmesi
2. **"Public Network"** sekmesine git
3. **Connection URL'i kopyala**

Örnek:
```
postgresql://postgres:password@metro.proxy.rlwy.net:31387/railway
```

---

## 📝 .ENV DOSYASI ÖRNEĞİ

```env
# Server
PORT=3000

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production-12345
JWT_EXPIRES_IN=7d

# Database (Seçenek 1: Railway Database)
DATABASE_URL=postgresql://postgres:password@metro.proxy.rlwy.net:31387/railway

# Veya (Seçenek 2: Local PostgreSQL)
# DB_HOST=localhost
# DB_USER=postgres
# DB_PASSWORD=your-password
# DB_NAME=fifa_match_tracker
# DB_PORT=5432
# DB_SSL=false

# Cloudinary
CLOUDINARY_CLOUD_NAME=dnc27blds
CLOUDINARY_API_KEY=374854593451582
CLOUDINARY_API_SECRET=8CixQiMxLSY2tR9phDN8bwcniDo
```

---

## 🚀 TEST

1. **Backend'i başlat:**
   ```bash
   npm run dev
   ```

2. **Log'ları kontrol et:**
   - `✅ PostgreSQL Database connected successfully` görünmeli

3. **API test:**
   - `http://localhost:3000/api/auth/login` test et

---

**Hangi seçeneği kullanmak istiyorsun? Railway database mi yoksa local PostgreSQL mi? 🤔**

