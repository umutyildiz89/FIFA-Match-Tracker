# 🗄️ PLANETSCALE'E SCHEMA UYGULAMA - ADIM ADIM

## 🎯 EN KOLAY YÖNTEM (3 ADIM)

### ADIM 1: PlanetScale Console'a Git

1. **PlanetScale'e git:** https://planetscale.com/
2. **Login yap**
3. **Database'ini seç** (fifa-match-tracker veya oluşturduğun isim)
4. **"Console"** sekmesine tıkla (sol menüde)

---

### ADIM 2: SQL Editor'ı Aç

1. **"SQL Editor"** veya **"Run SQL"** butonuna tıkla
2. **SQL Editor açılır** (büyük text area)

---

### ADIM 3: Schema'yı Kopyala-Yapıştır

1. **`database/schema_postgresql.sql`** dosyasını aç (bu projede)
2. **Tüm içeriği kopyala** (Ctrl+A, Ctrl+C)
3. **PlanetScale SQL Editor'a yapıştır** (Ctrl+V)
4. **"Run"** veya **"Execute"** butonuna tıkla

**SONUÇ:** 
- ✅ Tüm tablolar, trigger'lar, index'ler oluşturulur
- ✅ Hata varsa gösterilir

---

## ✅ KONTROL ET

**Schema uygulandıktan sonra:**

1. **"Tables"** sekmesine git (sol menüde)
2. **5 tablo görünmeli:**
   - `users`
   - `drafts`
   - `matches`
   - `friends`
   - `chat_messages`

**Her tabloya tıklayıp yapısını kontrol et:**
- Kolonlar doğru mu?
- Foreign key'ler var mı?
- Index'ler oluşturulmuş mu?

---

## 🧪 TEST USER OLUŞTUR (Opsiyonel)

**PlanetScale SQL Editor'da:**

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

---

## ⚠️ YAYGIN HATALAR

### "Function already exists"
- **Sorun değil!** Function zaten var, devam et.

### "Type already exists"
- **Sorun değil!** Enum type zaten var, devam et.

### "Table already exists"
- **Sorun değil!** Tablo zaten var (`CREATE TABLE IF NOT EXISTS` kullandık).

### "Syntax error"
- **SQL'i kontrol et** - Hatalı satırı düzelt.

---

## 📋 HAZIR DOSYALAR

1. **`database/schema_postgresql.sql`** - Tam schema (kopyala-yapıştır)
2. **`PLANETSCALE_SCHEMA_COPY_PASTE.txt`** - Kopyala-yapıştır için özel format
3. **`PLANETSCALE_TEST_USER.sql`** - Test user oluşturma

---

## 🚀 SONRAKI ADIM

**Schema uygulandıktan sonra:**
1. ✅ Render.com'a deploy et
2. ✅ Database connection test et
3. ✅ Login dene! 🎉

---

**Kolay gelsin! Schema'yı kopyala-yapıştır, "Run" tıkla, bitti! 🚀**

