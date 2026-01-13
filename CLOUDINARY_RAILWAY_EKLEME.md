# 🔧 CLOUDINARY RAILWAY'E EKLEME

## ✅ CLOUD NAME ALINDI

**Cloud Name:** `dnc27blds`

---

## 📋 ADIM 1: API KEY VE API SECRET AL

1. **Cloudinary Dashboard** → **Settings** (⚙️) → **"Access Keys"** sekmesine git
2. Şunları kopyala:
   - **API Key** (örn: `123456789012345`)
   - **API Secret** (⚠️ "Reveal" butonuna tıkla, gizli görünür)

**ÖNEMLİ:** API Secret sadece bir kere gösterilir! Kopyaladığından emin ol!

---

## 📋 ADIM 2: UNSIGNED UPLOAD PRESET OLUŞTUR

1. **Cloudinary Dashboard** → **Settings** → **"Upload"** sekmesine git
2. **"Add upload preset"** butonuna tıkla
3. Ayarlar:
   - **Preset name:** `fifa-match-tracker` (veya istediğin isim)
   - **Signing mode:** **"Unsigned"** seç (⚠️ ÖNEMLİ!)
   - **Folder (optional):** `fifa-matches` (opsiyonel)
   - Diğer ayarları varsayılan bırak
4. **"Save"** butonuna tıkla

**Preset name'i not al** (örn: `fifa-match-tracker`)

---

## 📋 ADIM 3: RAILWAY'E ENVIRONMENT VARIABLES EKLE

### Frontend Service:

1. **Railway.app** → **Frontend service** → **"Variables"** sekmesine git
2. **"+ New Variable"** butonuna tıkla
3. **Key:** `VITE_CLOUDINARY_CLOUD_NAME`
   **Value:** `dnc27blds`
   **"Add"** tıkla
4. **Tekrar "+ New Variable"** tıkla
5. **Key:** `VITE_CLOUDINARY_UPLOAD_PRESET`
   **Value:** Preset name (örn: `fifa-match-tracker`)
   **"Add"** tıkla

### Backend Service:

1. **Railway.app** → **Backend service** → **"Variables"** sekmesine git
2. **"+ New Variable"** butonuna tıkla
3. **Key:** `CLOUDINARY_CLOUD_NAME`
   **Value:** `dnc27blds`
   **"Add"** tıkla
4. **Tekrar "+ New Variable"** tıkla
5. **Key:** `CLOUDINARY_API_KEY`
   **Value:** API Key (kopyaladığın)
   **"Add"** tıkla
6. **Tekrar "+ New Variable"** tıkla
7. **Key:** `CLOUDINARY_API_SECRET`
   **Value:** API Secret (kopyaladığın)
   **"Add"** tıkla

---

## 📋 ADIM 4: REDEPLOY

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
5. **"📤 Yükle ve OCR İşle"** butonuna tıkla
6. Görsel yüklenmeli! ✅

---

## 🎯 ÖZET: EKLENECEK VARIABLES

### Frontend Service:
- `VITE_CLOUDINARY_CLOUD_NAME` = `dnc27blds`
- `VITE_CLOUDINARY_UPLOAD_PRESET` = `fifa-match-tracker` (veya oluşturduğun preset name)

### Backend Service:
- `CLOUDINARY_CLOUD_NAME` = `dnc27blds`
- `CLOUDINARY_API_KEY` = (API Key'i buraya)
- `CLOUDINARY_API_SECRET` = (API Secret'ı buraya)

---

## ⚠️ ÖNEMLİ NOTLAR

- **API Secret sadece bir kere gösterilir!** Kopyaladığından emin ol!
- **Upload Preset'in "Unsigned" olması gerekiyor!** Aksi halde frontend'den yükleme çalışmaz!
- **Preset name'i doğru yaz!** Büyük/küçük harf duyarlı!

---

**API Key ve Secret'ı aldın mı? Upload Preset oluşturdun mu? Railway'e ekledikten sonra "tamam" yaz, redeploy yapalım! 🚀**

