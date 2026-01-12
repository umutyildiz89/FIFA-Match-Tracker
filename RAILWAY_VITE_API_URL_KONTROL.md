# 🔍 RAILWAY: VITE_API_URL KONTROL (ALTERNATİF YÖNTEM)

## ⚠️ IMPORT.META CONSOLE'DA ÇALIŞMAZ!

**Browser console'da `import.meta` kullanılamaz!**

**Alternatif kontrol yöntemleri:**

---

## 🔍 YÖNTEM 1: NETWORK SEKmesi (EN KOLAY)

1. **Browser DevTools** → **Network sekmesine git**
2. **Login yapmayı dene**
3. **API isteği görünüyor mu?** (`/api/auth/login`)
4. **Request URL'e bak:**
   - ✅ **Doğru:** `https://fifa-match-tracker-production.up.railway.app/api/auth/login`
   - ❌ **Yanlış:** `http://localhost:3000/api/auth/login` → VITE_API_URL eksik!

---

## 🔍 YÖNTEM 2: SOURCE CODE KONTROLÜ

1. **Browser DevTools** → **Sources sekmesine git**
2. **Frontend kodunu bul** (genelde `index-*.js` dosyası)
3. **`VITE_API_URL` veya `localhost:3000` ara**
4. **Hangi URL kullanılıyor?**

---

## 🔍 YÖNTEM 3: RAILWAY VARIABLES KONTROLÜ

1. **Railway.app** → **Frontend service** → **"Variables"** sekmesine git
2. **`VITE_API_URL` var mı kontrol et**
3. **Value ne?** (`https://fifa-match-tracker-production.up.railway.app` olmalı)

---

## ✅ ÇÖZÜM

### Eğer Network Sekmesinde `localhost:3000` Görüyorsan:

**VITE_API_URL eksik! Ekle:**

1. **Railway.app** → **Frontend service** → **"Variables"** sekmesine git
2. **"+ New Variable"** butonuna tıkla
3. **Key:** `VITE_API_URL`
4. **Value:** `https://fifa-match-tracker-production.up.railway.app`
5. **"Save"** tıkla
6. **Tekrar "+ New Variable"** tıkla
7. **Key:** `VITE_SOCKET_URL`
8. **Value:** `https://fifa-match-tracker-production.up.railway.app`
9. **"Save"** tıkla
10. **Redeploy yap**

---

## 🧪 TEST

1. **Frontend URL'ini aç**
2. **Browser DevTools** → **Network sekmesine git**
3. **Login yapmayı dene**
4. **Request URL'e bak:**
   - ✅ Backend URL görünüyorsa → Başarılı!
   - ❌ localhost:3000 görünüyorsa → VITE_API_URL eksik!

---

**Network sekmesinde Request URL ne? localhost:3000 mi yoksa backend URL mi? 🚀**

