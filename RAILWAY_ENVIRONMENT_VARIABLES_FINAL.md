# 🔗 RAILWAY: ENVIRONMENT VARIABLES FINAL

## ✅ BACKEND URL BULUNDU!

**Backend URL:** `https://fifa-match-tracker-production.up.railway.app`

---

## 📋 FRONTEND ENVIRONMENT VARIABLES

### Adım 1: Frontend Service Variables

1. **Railway.app** → **Frontend service** → **"Variables"** sekmesine git
2. **"+ New Variable"** butonuna tıkla
3. **Şunları ekle:**

   **Variable 1:**
   - **Key:** `VITE_API_URL`
   - **Value:** `https://fifa-match-tracker-production.up.railway.app`

   **Variable 2:**
   - **Key:** `VITE_SOCKET_URL`
   - **Value:** `https://fifa-match-tracker-production.up.railway.app`

---

## 📋 BACKEND ENVIRONMENT VARIABLES

### Adım 2: Backend Service Variables (CORS için)

1. **Railway.app** → **Backend service** → **"Variables"** sekmesine git
2. **Frontend service URL'ini bul:**
   - **Frontend service** → **"Settings"** → **"Domains"**
   - **Frontend URL'i kopyala** (örnek: `https://fifa-match-tracker-frontend.up.railway.app`)
3. **Backend service** → **"Variables"** → **"+ New Variable"**
4. **Şunu ekle:**
   - **Key:** `FRONTEND_URL`
   - **Value:** Frontend service URL'i

---

## ✅ REDEPLOY

### Frontend Service

1. **Frontend service** → **"Deployments"** sekmesine git
2. **"Redeploy"** butonuna tıkla
3. **"Logs"** sekmesine git
4. **Deploy başarılı mı kontrol et**

### Backend Service (Eğer FRONTEND_URL eklediysen)

1. **Backend service** → **"Deployments"** sekmesine git
2. **"Redeploy"** butonuna tıkla
3. **"Logs"** sekmesine git
4. **Deploy başarılı mı kontrol et**

---

## 🧪 TEST

1. **Frontend service** → **"Settings"** → **"Domains"**
2. **Frontend URL'ini kopyala**
3. **Tarayıcıda aç**
4. **Uygulama çalışıyor mu kontrol et**
5. **Register/Login test et**

---

## 📋 ÖZET

**Frontend Variables:**
- ✅ `VITE_API_URL` = `https://fifa-match-tracker-production.up.railway.app`
- ✅ `VITE_SOCKET_URL` = `https://fifa-match-tracker-production.up.railway.app`

**Backend Variables:**
- ✅ `DATABASE_URL` = (PostgreSQL reference - zaten var)
- ⏳ `FRONTEND_URL` = (Frontend domain - eklenmeli)

---

**Environment variables ekledin mi? Eklediysen "evet" yaz! 🚀**

