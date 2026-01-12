# 🗄️ RAILWAY: POSTGRESQL SCHEMA UYGULAMA

## 📋 ADIM ADIM

### 1️⃣ Railway PostgreSQL Console'a Git

1. **Railway.app** → **PostgreSQL database service'ine tıkla**
2. **"Data"** veya **"Query"** sekmesine git
3. **"Open Query"** veya **"New Query"** butonuna tıkla

---

### 2️⃣ Schema Dosyasını Aç

1. **Bu bilgisayarda şu dosyayı aç:**
   ```
   C:\Users\umut\Desktop\TODOGAME\database\schema_postgresql.sql
   ```

2. **Dosyanın tüm içeriğini seç:**
   - **Ctrl+A** (Tümünü seç)
   - **Ctrl+C** (Kopyala)

---

### 3️⃣ Railway Query Editor'a Yapıştır

1. **Railway Query Editor'daki text area'ya tıkla**
2. **Ctrl+V** (Yapıştır)
3. **"Run"** veya **"Execute"** butonuna tıkla

**Bekle:** Birkaç saniye sürecek...

**Göreceksin:**
- ✅ "Success" mesajı
- ✅ Veya "Query executed successfully"

---

### 4️⃣ Kontrol Et

1. **Railway PostgreSQL service** → **"Data"** sekmesine git
2. **5 tablo görünmeli:**
   - ✅ `users`
   - ✅ `drafts`
   - ✅ `matches`
   - ✅ `friends`
   - ✅ `chat_messages`

---

## 🧪 TEST USER OLUŞTUR (Opsiyonel)

**Railway Query Editor'da şunu yaz ve "Run" tıkla:**

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

**Kontrol:**
```sql
SELECT * FROM users;
```

**1 satır görmeli:** test@example.com / testuser

---

## ✅ TAMAMLANDI!

**Yaptığın şey:**
1. ✅ Railway PostgreSQL Console'a gittin
2. ✅ Query Editor'ı açtın
3. ✅ `schema_postgresql.sql` dosyasını kopyaladın
4. ✅ Railway'e yapıştırıp "Run" tıkladın
5. ✅ 5 tablo oluşturuldu!

**Artık:**
- ✅ Database hazır!
- ✅ Backend API'leri çalışacak!
- ✅ Test user oluşturabilirsin!

---

**Schema'yı uyguladın mı? Uyguladıysan "evet" yaz, frontend service'i ekleyelim! 🚀**

