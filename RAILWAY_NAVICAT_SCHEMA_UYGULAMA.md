# 🗄️ RAILWAY NAVICAT: SCHEMA UYGULAMA

## 📋 DURUM

Navicat'a bağlandın ve iki database görüyorsun:
- ✅ `postgres` - PostgreSQL'in varsayılan database'i (kullanma)
- ✅ `railway` - Railway'in oluşturduğu database (BURAYA SCHEMA UYGULA!)

---

## 🎯 SCHEMA UYGULAMA ADIMLARI

### 1️⃣ Doğru Database'i Seç

1. **Navicat'ta** → **`railway` database'ine tıkla** (postgres değil!)
2. **`railway` database'i seçili olduğundan emin ol**

---

### 2️⃣ Query Editor Aç

1. **`railway` database'ine sağ tıkla**
2. **"New Query"** veya **"Query"** seçeneğini seç
3. **VEYA** üst menüden **"Query"** → **"New Query"** tıkla

---

### 3️⃣ Schema SQL'i Yapıştır

1. **Bu dosyayı aç:** `C:\Users\umut\Desktop\TODOGAME\database\schema_postgresql.sql`
2. **Tüm içeriği seç:** Ctrl+A
3. **Kopyala:** Ctrl+C
4. **Navicat Query Editor'a yapıştır:** Ctrl+V

---

### 4️⃣ Query'yi Çalıştır

1. **"Run"** butonuna tıkla (F5 veya ▶️ ikonu)
2. **VEYA** Ctrl+R tuşlarına bas

**Bekle:** Birkaç saniye sürecek...

**Göreceksin:**
- ✅ "Query executed successfully"
- ✅ Veya "Success"
- ✅ Veya hiçbir hata mesajı yoksa başarılı!

---

### 5️⃣ Kontrol Et

1. **Navicat'ta** → **`railway` database** → **"Tables"** sekmesine git
2. **5 tablo görünmeli:**
   - ✅ `users`
   - ✅ `drafts`
   - ✅ `matches`
   - ✅ `friends`
   - ✅ `chat_messages`

**Eğer tablolar görünmüyorsa:**
- **"Refresh"** butonuna tıkla (F5)
- **VEYA** database'e sağ tıkla → **"Refresh"**

---

## 🧪 TEST USER OLUŞTUR (Opsiyonel)

**Schema uygulandıktan sonra test user oluştur:**

1. **Navicat'ta** → **`railway` database** → **"Query"** sekmesi
2. **Şu SQL'i yaz ve "Run" tıkla:**

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

## ⚠️ ÖNEMLİ NOTLAR

1. **`railway` database'ine uygula!** (postgres değil!)
2. **Tüm SQL'i bir seferde çalıştırabilirsin** (schema_postgresql.sql dosyasının tamamı)
3. **Hata alırsan** → Hata mesajını oku ve bana gönder

---

## ✅ TAMAMLANDI!

**Schema uygulandıktan sonra:**
- ✅ 5 tablo oluşturuldu
- ✅ Backend API'leri çalışacak
- ✅ Test user oluşturabilirsin

---

**Schema'yı `railway` database'ine uyguladın mı? Uyguladıysan "evet" yaz! 🚀**

