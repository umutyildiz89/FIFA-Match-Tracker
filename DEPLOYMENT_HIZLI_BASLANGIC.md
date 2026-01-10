# ⚡ DEPLOYMENT HIZLI BAŞLANGIÇ

## 🚀 3 ADIMDA CANLI UYGULAMA!

### ADIM 1: PLANETSCALE DATABASE (5 dakika)

1. **PlanetScale'e git:** https://planetscale.com/
2. **Sign up** (GitHub ile)
3. **"Create database"** → İsim: `fifa-match-tracker`
4. **"Connect"** → **"Node.js"** → Connection bilgilerini kopyala
5. **"Console"** → SQL Editor → `database/schema.sql` dosyasını kopyala ve çalıştır (5 tablo oluştur)

**✅ Database hazır!**

---

### ADIM 2: RENDER.COM BACKEND (10 dakika)

1. **Render.com'a git:** https://render.com/
2. **Sign up** (GitHub ile)
3. **"New +"** → **"Web Service"**
4. **GitHub repo'yu bağla**
5. **Ayarlar:**
   ```
   Name: fifa-match-tracker-api
   Build Command: npm install
   Start Command: node server.js
   ```
6. **Environment Variables ekle:**
   ```
   NODE_ENV=production
   PORT=3000
   DB_HOST=xxxxx (PlanetScale'den)
   DB_USER=xxxxx
   DB_PASSWORD=xxxxx
   DB_NAME=xxxxx
   DB_SSL=true
   JWT_SECRET=32-karakterlik-guclu-secret-key
   ```
7. **"Create Web Service"** → Deploy!

**✅ Backend hazır!** URL: `https://YOUR-SERVICE.onrender.com`

---

### ADIM 3: NETLIFY FRONTEND (5 dakika)

1. **Netlify'a git:** https://netlify.com/
2. **Sign up** (GitHub ile)
3. **"Add new site"** → **"Import an existing project"**
4. **GitHub repo'yu bağla**
5. **Build Settings:**
   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/dist
   ```
6. **Environment Variables ekle:**
   ```
   VITE_API_URL=https://YOUR-SERVICE.onrender.com
   VITE_SOCKET_URL=https://YOUR-SERVICE.onrender.com
   VITE_DEV_MODE=false
   ```
7. **"Deploy site"**

**✅ Frontend hazır!** URL: `https://YOUR-SITE.netlify.app`

---

## 🎉 BİTTİ! TEST ET

1. **Netlify site URL'ine git**
2. **Register** sayfasından kayıt ol
3. **Login** yap
4. **Dashboard görünür!** ✅

---

## 📋 DETAYLI REHBER

**Daha detaylı adımlar için:**
- `PLANETSCALE_KURULUM.md` - Database kurulumu
- `DEPLOYMENT_REHBERI.md` - Tam deployment rehberi

---

## 🔑 ÖNEMLİ NOTLAR

1. **JWT_SECRET oluştur:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **DB_SSL=true zorunlu!** (PlanetScale SSL gerektirir)

3. **CORS:** Render.com service URL'ini Netlify environment variable'ına ekle

4. **Frontend URL'i Render.com'a ekle** (CORS için):
   ```
   FRONTEND_URL=https://YOUR-SITE.netlify.app
   ```

---

## 🐛 SORUN MU VAR?

**Database bağlanmıyor?**
- `DB_SSL=true` set edildi mi?
- PlanetScale password expire olmuş olabilir (yenile)

**CORS hatası?**
- Render.com'da `FRONTEND_URL` environment variable ekle
- Netlify URL'ini doğru yaz

**404 hatası?**
- Backend URL'i doğru mu? (`VITE_API_URL`)
- Route'lar `/api` prefix'i ile mi başlıyor?

