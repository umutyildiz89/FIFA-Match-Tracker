# 🚀 CLOUDINARY RAILWAY'E EKLEME (FİNAL ADIMLAR)

## ✅ HAZIR BİLGİLER

- **Cloud Name:** `dnc27blds`
- **API Key:** `374854593451582`
- **API Secret:** `8CixQiMxLSY2tR9phDN8bwcniDo`
- **Upload Preset:** `fifa-match-tracker` ✅

---

## 📋 RAILWAY'E ENVIRONMENT VARIABLES EKLE

### ADIM 1: FRONTEND SERVICE

1. **Railway.app** → **Frontend service** → **"Variables"** sekmesine git
2. **"+ New Variable"** butonuna tıkla
3. **Key:** `VITE_CLOUDINARY_CLOUD_NAME`
   **Value:** `dnc27blds`
   **"Add"** tıkla
4. **Tekrar "+ New Variable"** tıkla
5. **Key:** `VITE_CLOUDINARY_UPLOAD_PRESET`
   **Value:** `fifa-match-tracker`
   **"Add"** tıkla

**Toplam 2 variable eklenmeli:**
- ✅ `VITE_CLOUDINARY_CLOUD_NAME` = `dnc27blds`
- ✅ `VITE_CLOUDINARY_UPLOAD_PRESET` = `fifa-match-tracker`

---

### ADIM 2: BACKEND SERVICE

1. **Railway.app** → **Backend service** → **"Variables"** sekmesine git
2. **"+ New Variable"** butonuna tıkla
3. **Key:** `CLOUDINARY_CLOUD_NAME`
   **Value:** `dnc27blds`
   **"Add"** tıkla
4. **Tekrar "+ New Variable"** tıkla
5. **Key:** `CLOUDINARY_API_KEY`
   **Value:** `374854593451582`
   **"Add"** tıkla
6. **Tekrar "+ New Variable"** tıkla
7. **Key:** `CLOUDINARY_API_SECRET`
   **Value:** `8CixQiMxLSY2tR9phDN8bwcniDo`
   **"Add"** tıkla

**Toplam 3 variable eklenmeli:**
- ✅ `CLOUDINARY_CLOUD_NAME` = `dnc27blds`
- ✅ `CLOUDINARY_API_KEY` = `374854593451582`
- ✅ `CLOUDINARY_API_SECRET` = `8CixQiMxLSY2tR9phDN8bwcniDo`

---

## 🔄 ADIM 3: REDEPLOY

1. **Frontend service** → **"Deployments"** sekmesine git
2. **"Redeploy"** butonuna tıkla
3. **Backend service** → **"Deployments"** sekmesine git
4. **"Redeploy"** butonuna tıkla
5. Deploy tamamlanmasını bekle (1-2 dakika)

---

## ✅ TEST

1. **Frontend URL'ini aç:** `https://frontend-production-8b94.up.railway.app`
2. **Login yap**
3. **Drafts sayfasına git** (`/drafts`)
4. **"📸 Maç Fotoğrafı Yükle"** bölümüne bir görsel sürükle/bırak
5. **Preview görünmeli!** ✅
6. **"📤 Yükle ve OCR İşle"** butonuna tıkla
7. Görsel yüklenmeli! ✅
8. Console'da `Image uploaded to Cloudinary: https://res.cloudinary.com/...` görünmeli

---

## 📝 KONTROL LİSTESİ

### Frontend Service:
- [ ] `VITE_CLOUDINARY_CLOUD_NAME` = `dnc27blds`
- [ ] `VITE_CLOUDINARY_UPLOAD_PRESET` = `fifa-match-tracker`

### Backend Service:
- [ ] `CLOUDINARY_CLOUD_NAME` = `dnc27blds`
- [ ] `CLOUDINARY_API_KEY` = `374854593451582`
- [ ] `CLOUDINARY_API_SECRET` = `8CixQiMxLSY2tR9phDN8bwcniDo`

### Deploy:
- [ ] Frontend redeploy yapıldı
- [ ] Backend redeploy yapıldı

---

## 🎉 BAŞARILI OLURSA

- ✅ Görsel yükleme çalışır
- ✅ Cloudinary'e görsel yüklenir
- ✅ URL alınır
- ✅ OCR işlemi için hazır (backend'de OCR servisi entegre edildiğinde)

---

**Railway'e ekledikten sonra "tamam" yaz, redeploy yapalım! 🚀**

