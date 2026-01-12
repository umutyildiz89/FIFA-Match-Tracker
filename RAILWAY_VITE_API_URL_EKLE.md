# 🔧 RAILWAY: VITE_API_URL EKLEME (ACİL!)

## ⚠️ SORUN

**Console logları:**
- `isDevMode: false` → Production mode
- `savedToken: null` → Token yok
- Login çalışmıyor

**Neden:** Frontend backend'e bağlanamıyor çünkü `VITE_API_URL` environment variable'ı eksik!

---

## ✅ ÇÖZÜM: VITE_API_URL EKLE

### Adım 1: Frontend Service Variables'a Git

1. **Railway.app** → **Frontend service** → **"Variables"** sekmesine git

---

### Adım 2: VITE_API_URL Ekle

1. **"+ New Variable"** butonuna tıkla
2. **Key:** `VITE_API_URL`
3. **Value:** `https://fifa-match-tracker-production.up.railway.app`
4. **"Save"** tıkla

---

### Adım 3: VITE_SOCKET_URL Ekle

1. **Tekrar "+ New Variable"** butonuna tıkla
2. **Key:** `VITE_SOCKET_URL`
3. **Value:** `https://fifa-match-tracker-production.up.railway.app`
4. **"Save"** tıkla

---

### Adım 4: Redeploy

1. **Frontend service** → **"Deployments"** sekmesine git
2. **"Redeploy"** butonuna tıkla
3. **Deploy tamamlanmasını bekle** (1-2 dakika)

---

### Adım 5: Test

1. **Frontend URL'ini aç:** `https://frontend-production-8b94.up.railway.app`
2. **Browser Console'u aç** (F12)
3. **Console'da şunu yaz:**
   ```javascript
   console.log('API URL:', import.meta.env.VITE_API_URL)
   ```
4. **Beklenen:** `https://fifa-match-tracker-production.up.railway.app`
5. **Eğer `undefined` görüyorsan:** Redeploy yap veya environment variable'ı kontrol et

---

## 🧪 LOGIN TEST

1. **Login sayfasına git**
2. **Browser Console → Network sekmesine git**
3. **Login yapmayı dene**
4. **API isteği görünüyor mu?** (`/api/auth/login`)
5. **Status code ne?** (200 = başarılı, 401 = şifre yanlış, 500 = backend hatası)

---

## ✅ BAŞARILI OLURSA

**Login başarılı olduğunda:**
- ✅ Token kaydedilir
- ✅ Dashboard'a yönlendirilir
- ✅ Console'da `savedToken` görünür

---

**VITE_API_URL'i ekledin mi? Eklediysen "evet" yaz, test edelim! 🚀**

