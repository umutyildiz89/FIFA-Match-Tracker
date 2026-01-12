# 🔧 RAILWAY: LOGIN SORUN ÇÖZÜMÜ

## ⚠️ SORUN: LOGIN OLAMIYORUM

**Olası nedenler:**
1. Test user oluşturulmamış olabilir
2. Frontend backend'e bağlanamıyor (CORS veya environment variables)
3. Backend API hatası
4. Network hatası

---

## 🔍 SORUN TESPİTİ

### 1. Test User Kontrolü

**Navicat'ta kontrol et:**

```sql
SELECT id, email, username FROM users WHERE email = 'test@example.com';
```

**Sonuç:** 1 satır görmeli. Yoksa test user oluşturulmamış!

---

### 2. Frontend Console Kontrolü

1. **Frontend URL'ini aç:** `https://frontend-production-8b94.up.railway.app`
2. **Browser DevTools aç** (F12)
3. **Console sekmesine git**
4. **Login yapmayı dene**
5. **Hata mesajını kopyala ve gönder**

**Olası hatalar:**
- `Network Error` → Backend'e bağlanamıyor
- `CORS Error` → CORS ayarı yanlış
- `401 Unauthorized` → Kullanıcı bulunamadı veya şifre yanlış
- `500 Internal Server Error` → Backend hatası

---

### 3. Backend Logları Kontrolü

1. **Railway.app** → **Backend service** → **"Logs"** sekmesine git
2. **Login yapmayı dene**
3. **Logları kontrol et**
4. **Hata mesajını kopyala ve gönder**

---

### 4. Environment Variables Kontrolü

**Frontend service → Variables:**
- ✅ `VITE_API_URL` = `https://fifa-match-tracker-production.up.railway.app` var mı?
- ✅ `VITE_SOCKET_URL` = `https://fifa-match-tracker-production.up.railway.app` var mı?

**Backend service → Variables:**
- ✅ `DATABASE_URL` var mı?
- ✅ `FRONTEND_URL` = `https://frontend-production-8b94.up.railway.app` var mı?

---

## ✅ ÇÖZÜMLER

### Çözüm 1: Test User Oluştur (Eğer Yoksa)

**Navicat'ta:**

```sql
INSERT INTO users (email, username, password_hash) 
VALUES (
  'test@example.com', 
  'testuser', 
  '$2a$10$8ejOLkONuC8pNaie2FYGwOm04xBMPlAY3O6BgPlcU9DRXQHm22.QO'
)
ON CONFLICT (email) DO NOTHING;
```

**Password:** `test123`

---

### Çözüm 2: Environment Variables Kontrolü

**Frontend service → Variables:**
- `VITE_API_URL` yoksa ekle: `https://fifa-match-tracker-production.up.railway.app`
- `VITE_SOCKET_URL` yoksa ekle: `https://fifa-match-tracker-production.up.railway.app`
- **Redeploy yap**

**Backend service → Variables:**
- `FRONTEND_URL` yoksa ekle: `https://frontend-production-8b94.up.railway.app`
- **Redeploy yap**

---

### Çözüm 3: CORS Kontrolü

**Backend loglarında CORS hatası görüyorsan:**

1. **Backend service** → **Variables** → `FRONTEND_URL` var mı kontrol et
2. **Yoksa ekle:** `https://frontend-production-8b94.up.railway.app`
3. **Redeploy yap**

---

## 🧪 TEST

1. **Test user oluştur** (yukarıdaki SQL)
2. **Frontend URL'ini aç**
3. **Browser Console'u aç** (F12)
4. **Login yapmayı dene:**
   - Email/Username: `test@example.com` veya `testuser`
   - Password: `test123`
5. **Console'da hata var mı kontrol et**
6. **Hata mesajını gönder**

---

**Hangi hatayı görüyorsun? Console'da veya backend loglarında ne yazıyor? 🚀**

