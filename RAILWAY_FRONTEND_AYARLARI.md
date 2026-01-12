# 🎨 RAILWAY: FRONTEND SERVICE AYARLARI

## 📋 FRONTEND SERVICE AYARLARI

### 1️⃣ Settings Kontrolü

1. **Railway.app** → **Frontend service** → **"Settings"** sekmesine git
2. **Kontrol et:**
   - **Root Directory:** `frontend` (önemli!)
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** Railway otomatik algılayabilir (static files için)

---

### 2️⃣ Root Directory Ayarla

**Eğer Root Directory boşsa veya yanlışsa:**

1. **"Root Directory"** alanına yaz: `frontend`
2. **"Save"** butonuna tıkla

---

### 3️⃣ Build Command Ayarla

**Eğer Build Command yoksa veya yanlışsa:**

1. **"Build Command"** alanına yaz: `npm install && npm run build`
2. **"Save"** butonuna tıkla

---

### 4️⃣ Start Command (Opsiyonel)

**Railway genelde otomatik algılar, ama kontrol et:**

- **Static files için:** Railway otomatik serve eder
- **VEYA:** `npx serve -s dist` (eğer gerekirse)

---

## 🔗 ENVIRONMENT VARIABLES

### Backend Service URL'ini Bul

1. **Railway.app** → **Backend service** (FIFA-Match-Tracker) → **"Settings"** sekmesine git
2. **"Domains"** veya **"Generate Domain"** bölümüne bak
3. **Backend URL'i kopyala** (örnek: `https://fifa-match-tracker-production.up.railway.app`)

---

### Frontend Environment Variables Ekle

1. **Frontend service** → **"Variables"** sekmesine git
2. **"+ New Variable"** butonuna tıkla
3. **Şunları ekle:**

   **Variable 1:**
   - **Key:** `VITE_API_URL`
   - **Value:** Backend service URL'i (örnek: `https://fifa-match-tracker-production.up.railway.app`)

   **Variable 2:**
   - **Key:** `VITE_SOCKET_URL`
   - **Value:** Backend service URL'i (aynı - Socket.IO için)

---

## ✅ KONTROL

1. **Frontend service** → **"Deployments"** sekmesine git
2. **Deploy başladı mı kontrol et**
3. **"Logs"** sekmesine git
4. **Build başarılı mı kontrol et**

---

## 🎯 SONRAKI ADIMLAR

1. ✅ Frontend service ayarları yapıldı
2. ✅ Environment variables eklendi
3. ✅ Deploy başladı
4. ⏳ Deploy tamamlanmasını bekle
5. ⏳ Frontend URL'ini al ve test et

---

**Frontend service ayarlarını yaptın mı? Yaptıysan "evet" yaz! 🚀**

