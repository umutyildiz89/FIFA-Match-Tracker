# 👤 RAILWAY: TEST USER OLUŞTURMA (NAVICAT)

## 📋 NAVICAT İLE TEST USER OLUŞTUR

### Adım 1: Navicat'ta Query Editor Aç

1. **Navicat'ta** → **Railway connection** → **`railway` database'ine tıkla**
2. **"Query"** sekmesine git (veya sağ tık → "New Query")

---

### Adım 2: Test User SQL'i Çalıştır

**Navicat Query Editor'a şunu yapıştır ve "Run" tıkla (F5):**

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

### Adım 3: Kontrol Et

**Kullanıcının oluşturulduğunu kontrol et:**

```sql
SELECT id, email, username, created_at FROM users;
```

**1 satır görmeli:** 
- id: 1
- email: test@example.com
- username: testuser
- created_at: (tarih)

---

## 🎯 LOGIN BİLGİLERİ

**Frontend'de login yapmak için:**

- **Email/Username:** `test@example.com` veya `testuser`
- **Password:** `test123`

---

## 🧪 TEST

1. **Frontend URL'ini aç:** `https://frontend-production-8b94.up.railway.app`
2. **Login sayfasına git**
3. **Email/Username:** `test@example.com` veya `testuser`
4. **Password:** `test123`
5. **Login butonuna tıkla**
6. **Dashboard görünmeli! ✅**

---

## ✅ BAŞARILI!

**Test user oluşturuldu! Artık frontend'de login yapabilirsin! 🚀**

---

**Test user'ı oluşturdun mu? Oluşturduysan "evet" yaz, login test edelim!**

