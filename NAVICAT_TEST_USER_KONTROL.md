# 👤 NAVICAT: TEST USER KONTROL QUERY'LERİ

## 📋 TEST USER VAR MI KONTROL ET

### Navicat'ta Query Editor Aç

1. **Navicat'ta** → **Railway connection** → **`railway` database'ine tıkla**
2. **"Query"** sekmesine git (veya sağ tık → "New Query")

---

## 🔍 QUERY'LER

### 1. Test User Var Mı? (Önerilen)

**Navicat Query Editor'a şunu yapıştır ve "Run" tıkla (F5):**

```sql
SELECT id, email, username FROM users WHERE email = 'test@example.com';
```

**Beklenen Sonuç:**
- **1 satır görmeli:**
  - id: 1 (veya başka bir sayı)
  - email: test@example.com
  - username: testuser

**Eğer sonuç boşsa:** Test user oluşturulmamış!

---

### 2. TÜM Kullanıcıları Gör

**Tüm kullanıcıları görmek için:**

```sql
SELECT * FROM users;
```

**VEYA sadece email ve username:**

```sql
SELECT email, username FROM users;
```

---

### 3. Kullanıcı Sayısı

**Toplam kaç kullanıcı var:**

```sql
SELECT COUNT(*) as user_count FROM users;
```

---

## ✅ TEST USER YOKSA OLUŞTUR

**Eğer test user yoksa, şunu çalıştır:**

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

**Kontrol et:**
```sql
SELECT id, email, username FROM users WHERE email = 'test@example.com';
```

**1 satır görmeli! ✅**

---

## 🎯 LOGIN BİLGİLERİ

**Test user oluşturulduktan sonra:**

- **Email/Username:** `test@example.com` veya `testuser`
- **Password:** `test123`

---

**Test user var mı? Kontrol et ve sonucu söyle! 🚀**

