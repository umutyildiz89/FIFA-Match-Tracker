# Kullanıcı Bilgileri - Username ve Şifre

## 🔐 KULLANICI BİLGİLERİ

---

## ✅ DEVELOPMENT MODE (Database Olmadan)

### Mock User (Otomatik):

**Username/Email:** `testuser` veya `test@example.com`  
**Şifre:** **GEREKMİYOR** (otomatik login)

**Nasıl Çalışır:**
- Development mode aktif (`npm run dev`)
- Mock user otomatik oluşturulur
- Dashboard'a direkt erişim sağlanır
- **Login sayfasına gitmez, direkt dashboard açılır**

**Not:** Bu sadece UI test için, gerçek veri yok.

---

## ❌ GERÇEK KULLANICI (Database ile)

### Database Olmadan:
**Kullanıcı yok! ❌**

Database kurulduktan sonra:

### Seçenek 1: Frontend'den Kayıt Ol

1. Database kur (XAMPP veya PlanetScale)
2. Schema uygula
3. Backend ve Frontend'i başlat
4. `http://localhost:5173` aç
5. "Kayıt Ol" butonuna tıkla
6. Formu doldur:
   - **Email:** `test@example.com`
   - **Username:** `testuser`
   - **Password:** `test123`
7. "Kayıt Ol" butonuna tıkla

**Sonra Giriş:**
- **Username/Email:** Kayıt olduğun bilgiler
- **Password:** Kayıt olduğun şifre

---

### Seçenek 2: Script ile Test Kullanıcısı Oluştur

**Database kurulduktan sonra:**

```bash
cd C:\Users\umut\Desktop\TODOGAME
node scripts/createTestUser.js
```

**Oluşturulacak Kullanıcı:**
- **Email:** `test@example.com`
- **Username:** `testuser`
- **Password:** `test123`

**Giriş Bilgileri:**
- **Username/Email:** `test@example.com` veya `testuser`
- **Password:** `test123`

---

## 🎯 ŞU ANDA NE YAPABİLİRSİN?

### Database Olmadan (Development Mode):

**Login Gereksiz! 🎉**

```bash
# Terminal 1: Backend
cd C:\Users\umut\Desktop\TODOGAME
npm run dev

# Terminal 2: Frontend
cd C:\Users\umut\Desktop\TODOGAME\frontend
npm run dev

# Tarayıcı: http://localhost:5173
# Dashboard otomatik açılır (login gerekmez)!
```

**Mock User Bilgileri (Sadece Bilgi):**
- Username: `testuser`
- Email: `test@example.com`
- Password: **YOK** (otomatik login)

---

### Database ile (Gerçek Kullanıcı):

**1. Database Kur (XAMPP):**
```bash
# XAMPP MySQL başlat
# phpMyAdmin: http://localhost/phpmyadmin
# Database oluştur: fifa_match_tracker
# Schema uygula: database/schema.sql
```

**2. .env Dosyasını Ayarla:**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=fifa_match_tracker
DB_PORT=3306
```

**3. Test Kullanıcısı Oluştur:**
```bash
cd C:\Users\umut\Desktop\TODOGAME
node scripts/createTestUser.js
```

**4. Giriş Yap:**
- Username/Email: `test@example.com` veya `testuser`
- Password: `test123`

---

## 📋 Özet

### Database Olmadan (Şu An):

**Login Gereksiz! ✅**
- Development mode aktif
- Mock user otomatik oluşturulur
- Dashboard'a direkt erişim
- Username/Password: **GEREKMİYOR**

**Mock User (Sadece Bilgi):**
- Username: `testuser`
- Email: `test@example.com`

---

### Database ile (Gerçek Kullanıcı):

**Test Kullanıcısı:**
- Username/Email: `testuser` veya `test@example.com`
- Password: `test123`

**Veya:**
- Frontend'den kayıt ol
- Kendi username/password'ünü belirle

---

## 🚀 Hızlı Başlangıç

### Database Olmadan (Şu An):

```powershell
# Terminal 1: Backend
cd C:\Users\umut\Desktop\TODOGAME
npm run dev

# Terminal 2: Frontend
cd C:\Users\umut\Desktop\TODOGAME\frontend
npm run dev

# Tarayıcı: http://localhost:5173
# Dashboard otomatik açılır! (login gerekmez)
```

**Username/Password:** **GEREKMİYOR** ✅

---

## ✅ Sonuç

**Database Olmadan:**
- ✅ **Login GEREKMİYOR!** 🎉
- ✅ Mock user otomatik oluşturulur
- ✅ Dashboard'a direkt erişim
- ✅ Username: `testuser` (otomatik)
- ✅ Password: **YOK** (otomatik login)

**Database ile:**
- ✅ Username/Email: `testuser` veya `test@example.com`
- ✅ Password: `test123` (test kullanıcısı)
- ✅ Veya kendi kayıt olduğun bilgiler

---

## 🎯 Öneri

**Şimdi Test Et (Database Olmadan):**

1. Backend başlat: `cd C:\Users\umut\Desktop\TODOGAME; npm run dev`
2. Frontend başlat: `cd C:\Users\umut\Desktop\TODOGAME\frontend; npm run dev`
3. Tarayıcı: `http://localhost:5173`
4. **Dashboard otomatik açılır! (Login gerekmez)**

**Sonra:** Database kur ve gerçek kullanıcı oluştur.

