# 🚀 DEPLOYMENT REHBERİ

## 📋 ÖZET

Bu rehber ile projeyi canlıya alacağız:
1. **PlanetScale** - MySQL database (hosting)
2. **Render.com** - Backend API (Node.js/Express)
3. **Netlify** - Frontend (React/Vite)

---

## 🗄️ ADIM 1: PLANETSCALE DATABASE KURULUMU

### 1.1 PlanetScale Hesabı Oluştur

1. **PlanetScale'e Git:**
   ```
   https://planetscale.com/
   ```

2. **Sign Up** (GitHub ile giriş yapabilirsin)

3. **Free Plan** seç (yeterli!)

---

### 1.2 Database Oluştur

1. **"Create database"** butonuna tıkla

2. **Database Bilgileri:**
   - **Name:** `fifa-match-tracker` (veya istediğin isim)
   - **Region:** En yakın region seç (Europe için `eu-central` önerilir)
   - **Plan:** Free

3. **"Create database"** tıkla

---

### 1.3 Database Bağlantı Bilgilerini Al

1. **Database'e tıkla** → **"Overview"** sekmesi

2. **"Connect"** butonuna tıkla

3. **"Node.js"** seç

4. **Connection string'i kopyala:**
   ```
   mysql://USERNAME:PASSWORD@HOST/DATABASE?sslaccept=strict
   ```

   **VEYA ayrı ayrı:**
   - **Host:** `xxx.xxx.planetscale.com`
   - **Username:** `xxxxx`
   - **Password:** `xxxxx`
   - **Database:** `xxxxx`

5. **NOT:** Bu bilgileri kaydet, Render.com'da kullanacağız!

---

### 1.4 Schema Uygulama

**PlanetScale'de SQL çalıştırmak için iki yol var:**

#### Yöntem 1: PlanetScale Console (Önerilen)

1. **Database'e git** → **"Console"** sekmesi

2. **SQL Editor'ı aç**

3. **`database/schema.sql`** dosyasının içeriğini kopyala ve çalıştır

4. **Her tabloyu ayrı ayrı çalıştır:**
   - `CREATE TABLE users ...`
   - `CREATE TABLE drafts ...`
   - `CREATE TABLE matches ...`
   - `CREATE TABLE friends ...`
   - `CREATE TABLE chat_messages ...`

#### Yöntem 2: Local MySQL Client

1. **PlanetScale CLI kur:**
   ```bash
   npm install -g @planetscale/cli
   ```

2. **Login:**
   ```bash
   pscale auth login
   ```

3. **Branch oluştur:**
   ```bash
   pscale branch create main fifa-match-tracker
   ```

4. **Schema uygula:**
   ```bash
   pscale shell fifa-match-tracker main < database/schema.sql
   ```

5. **Deploy et:**
   ```bash
   pscale deploy-request create fifa-match-tracker main
   ```

---

### 1.5 Test Data Eklemek (Opsiyonel)

**Seed data eklemek için:**

1. **PlanetScale Console** → **SQL Editor**

2. **`database/seed.sql`** dosyasının içeriğini çalıştır

**VEYA manuel test user oluştur:**
```sql
INSERT INTO users (email, username, password_hash) 
VALUES ('test@example.com', 'testuser', '$2a$10$8ejOLkONuC8pNaie2FYGwOm04xBMPlAY3O6BgPlcU9DRXQHm22.QO');
-- Password: test123
```

---

## ☁️ ADIM 2: RENDER.COM BACKEND DEPLOYMENT

### 2.1 Render.com Hesabı Oluştur

1. **Render.com'a Git:**
   ```
   https://render.com/
   ```

2. **Sign Up** (GitHub ile giriş yapabilirsin)

3. **Free Plan** seç

---

### 2.2 GitHub Repository Hazırlığı

**Eğer repository yoksa:**

1. **GitHub'a git** → **New repository**

2. **Repository adı:** `fifa-match-tracker` (veya istediğin isim)

3. **Code'u push et:**
   ```bash
   cd C:\Users\umut\Desktop\TODOGAME
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/KULLANICI_ADI/REPO_ADI.git
   git push -u origin main
   ```

---

### 2.3 Render.com'da Web Service Oluştur

1. **Render Dashboard** → **"New +"** → **"Web Service"**

2. **GitHub repository'yi bağla**

3. **Service Ayarları:**
   - **Name:** `fifa-match-tracker-api` (veya istediğin isim)
   - **Region:** En yakın region (Frankfurt önerilir)
   - **Branch:** `main`
   - **Root Directory:** `.` (root)
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`

4. **"Create Web Service"** tıkla

---

### 2.4 Environment Variables Ayarlama

**Render.com'da Service'e git** → **"Environment"** sekmesi

**Şu değişkenleri ekle:**

```env
NODE_ENV=production

# PlanetScale Database
DB_HOST=xxxxx.xxxxx.planetscale.com
DB_USER=xxxxx
DB_PASSWORD=xxxxx
DB_NAME=xxxxx
DB_SSL=true

# JWT Secret
JWT_SECRET=buraya-guclu-bir-secret-key-yaz-en-az-32-karakter

# Cloudinary (opsiyonel, image upload için)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Server Port (Render otomatik set eder ama manuel de olabilir)
PORT=3000
```

**Önemli Notlar:**
- `JWT_SECRET`: Güçlü bir secret key oluştur:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- `DB_SSL=true`: PlanetScale SSL gerektirir!

---

### 2.5 Render.com Build Ayarları

**Service Settings** → **"Advanced"** sekmesi:

1. **Auto-Deploy:** `Yes` (her push'ta deploy)

2. **Health Check Path:** `/api/health` (opsiyonel, health check için)

3. **Instance Type:** `Free` (yeterli)

---

### 2.6 Health Check Endpoint Ekle (Opsiyonel)

**Backend'e health check eklemek için:**

`server.js` dosyasına ekle:
```javascript
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})
```

---

### 2.7 Deploy ve Test

1. **"Manual Deploy"** → **"Deploy latest commit"**

2. **Logs'u izle:**
   - Deploy başarılı olmalı
   - Database bağlantısı başarılı olmalı
   - Server `http://YOUR-SERVICE.onrender.com` adresinde çalışmalı

3. **Test Et:**
   ```
   https://YOUR-SERVICE.onrender.com/api/health
   ```

---

## 🌐 ADIM 3: NETLIFY FRONTEND DEPLOYMENT

### 3.1 Netlify Hesabı Oluştur

1. **Netlify'a Git:**
   ```
   https://netlify.com/
   ```

2. **Sign Up** (GitHub ile giriş yapabilirsin)

3. **Free Plan** seç

---

### 3.2 Netlify'da Site Oluştur

1. **"Add new site"** → **"Import an existing project"**

2. **GitHub repository'yi bağla**

3. **Build Settings:**
   - **Base directory:** `frontend` (frontend klasörü)
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`

4. **"Deploy site"** tıkla

---

### 3.3 Frontend Environment Variables

**Site Settings** → **"Environment variables"**:

```env
# Backend API URL (Render.com service URL'i)
VITE_API_URL=https://YOUR-SERVICE.onrender.com
VITE_SOCKET_URL=https://YOUR-SERVICE.onrender.com

# Cloudinary (opsiyonel)
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-upload-preset

# Development mode kapalı (production)
VITE_DEV_MODE=false
```

**Önemli:**
- `VITE_` prefix'i zorunlu! (Vite environment variables)
- Render.com service URL'i: `https://YOUR-SERVICE.onrender.com`

---

### 3.4 Netlify Build Ayarları

**Site Settings** → **"Build & deploy"**:

1. **Build command:** `npm run build`
2. **Publish directory:** `dist`
3. **Node version:** `18` veya `20`

---

### 3.5 Deploy ve Test

1. **"Deploys"** sekmesinde deploy'u izle

2. **Site URL'i:** `https://YOUR-SITE.netlify.app`

3. **Test Et:**
   - Frontend açılmalı
   - Login çalışmalı
   - Backend API'ye bağlanmalı

---

## 🔧 ADIM 4: BACKEND API URL GÜNCELLEME

### 4.1 Frontend API Client Güncelleme

**`frontend/src/services/api.js`** dosyasını kontrol et:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
```

**Bu zaten doğru!** Netlify environment variable'dan alacak.

---

### 4.2 Socket.IO URL Güncelleme

**`frontend/src/services/socket.js`** dosyasını kontrol et:

```javascript
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000'
```

**Bu da doğru!**

---

## ✅ ADIM 5: CANLI TEST

### 5.1 Test User Oluştur

**PlanetScale Console'da SQL Editor:**

```sql
-- Test user oluştur (password: test123)
INSERT INTO users (email, username, password_hash) 
VALUES (
  'test@example.com', 
  'testuser', 
  '$2a$10$8ejOLkONuC8pNaie2FYGwOm04xBMPlAY3O6BgPlcU9DRXQHm22.QO'
);
```

**VEYA frontend'ten Register sayfasından kayıt ol!**

---

### 5.2 Login Test

1. **Netlify site URL'ine git:**
   ```
   https://YOUR-SITE.netlify.app
   ```

2. **Login sayfasına git:**
   ```
   https://YOUR-SITE.netlify.app/login
   ```

3. **Test credentials ile giriş yap:**
   - **Email/Username:** `test@example.com` veya `testuser`
   - **Password:** `test123`

4. **Dashboard görünmeli!** ✅

---

## 🐛 SORUN GİDERME

### Sorun 1: Database Bağlantı Hatası

**Hata:**
```
Database connection error: Access denied
```

**Çözüm:**
- PlanetScale connection string'i kontrol et
- `DB_SSL=true` set edildi mi?
- PlanetScale password'ü yenile (expire olabilir)

---

### Sorun 2: CORS Hatası

**Hata:**
```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```

**Çözüm:**
**Backend `server.js` dosyasına CORS ekle:**
```javascript
const cors = require('cors')

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://YOUR-SITE.netlify.app'
  ],
  credentials: true
}))
```

---

### Sorun 3: Environment Variables Çalışmıyor

**Sorun:**
- Netlify'da environment variables görünmüyor

**Çözüm:**
1. **Site Settings** → **"Build & deploy"** → **"Environment"**
2. **"Edit variables"** tıkla
3. **Deploy'u yeniden başlat** (environment variables değişince rebuild gerekir)

---

### Sorun 4: Backend API 404

**Sorun:**
- Frontend backend'e istek atıyor ama 404 alıyor

**Çözüm:**
- Render.com service URL'ini kontrol et
- `VITE_API_URL` environment variable doğru mu?
- Backend route'ları `/api` prefix'i ile mi başlıyor?

---

## 📝 ÖZET CHECKLIST

### PlanetScale ✅
- [ ] Database oluşturuldu
- [ ] Connection string alındı
- [ ] Schema uygulandı (tablolar oluşturuldu)
- [ ] Test user oluşturuldu

### Render.com ✅
- [ ] GitHub repository bağlandı
- [ ] Web Service oluşturuldu
- [ ] Environment variables ayarlandı
- [ ] Deploy başarılı
- [ ] Health check çalışıyor

### Netlify ✅
- [ ] GitHub repository bağlandı
- [ ] Site oluşturuldu
- [ ] Environment variables ayarlandı
- [ ] Build başarılı
- [ ] Site çalışıyor

### Test ✅
- [ ] Frontend açılıyor
- [ ] Login çalışıyor
- [ ] Dashboard görünüyor
- [ ] Database'den data geliyor

---

## 🎉 BAŞARILI!

Artık canlı bir uygulaman var! 🚀

**Frontend:** `https://YOUR-SITE.netlify.app`
**Backend:** `https://YOUR-SERVICE.onrender.com`
**Database:** PlanetScale (managed MySQL)

---

## 📚 EK KAYNAKLAR

- **PlanetScale Docs:** https://planetscale.com/docs
- **Render.com Docs:** https://render.com/docs
- **Netlify Docs:** https://docs.netlify.com

