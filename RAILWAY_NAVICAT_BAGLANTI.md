# 🗄️ RAILWAY POSTGRESQL - NAVICAT İLE BAĞLANTI

## 📋 ADIM ADIM

### 1️⃣ Railway'den Connection Bilgilerini Al

1. **Railway.app** → **PostgreSQL database service'ine tıkla**
2. **"Connect"** veya **"Data"** sekmesine git
3. **Connection bilgilerini kopyala:**
   - **Host:** `${{RAILWAY_PRIVATE_DOMAIN}}` (veya gerçek domain)
   - **Port:** `5432`
   - **Database:** `railway`
   - **User:** `postgres`
   - **Password:** `ymHCzptwgtHwaoawNIlDGXAgbjBPoGgR` (Railway'den gösterilen)

---

### 2️⃣ Navicat'ta Yeni Connection Oluştur

1. **Navicat'ı aç**
2. **"Connection"** → **"PostgreSQL"** seç
3. **Connection bilgilerini gir:**
   - **Connection Name:** `Railway PostgreSQL`
   - **Host:** Railway'den aldığın host (veya `${{RAILWAY_PRIVATE_DOMAIN}}` gerçek değeri)
   - **Port:** `5432`
   - **Database:** `railway`
   - **User:** `postgres`
   - **Password:** `ymHCzptwgtHwaoawNIlDGXAgbjBPoGgR`
4. **"Test Connection"** butonuna tıkla
5. **Bağlantı başarılı olursa** → **"Save"** tıkla

---

### 3️⃣ Railway'den Gerçek Host'u Al

**ÖNEMLİ:** Railway'de `${{RAILWAY_PRIVATE_DOMAIN}}` bir variable. Gerçek değeri almak için:

1. **Railway.app** → **PostgreSQL service** → **"Variables"** sekmesine git
2. **`RAILWAY_PRIVATE_DOMAIN`** variable'ını bul
3. **Value'yu kopyala** (örnek: `postgres-production-xxxx.up.railway.app`)

**VEYA** Railway'in verdiği connection string'den host'u çıkar:
```
postgresql://postgres:PASSWORD@HOST:5432/railway
```
Buradaki `HOST` kısmını kullan.

---

### 4️⃣ Navicat'ta Schema Uygula

1. **Navicat'ta Railway connection'a bağlan**
2. **`railway` database'ine tıkla**
3. **"Query"** sekmesine git (veya sağ tık → "New Query")
4. **Bu dosyayı aç:** `C:\Users\umut\Desktop\TODOGAME\database\schema_postgresql.sql`
5. **Tüm içeriği kopyala** (Ctrl+A, Ctrl+C)
6. **Navicat Query Editor'a yapıştır** (Ctrl+V)
7. **"Run"** butonuna tıkla (F5 veya ▶️ ikonu)

**Bekle:** Birkaç saniye sürecek...

**Göreceksin:**
- ✅ "Query executed successfully"
- ✅ Veya "Success"

---

### 5️⃣ Kontrol Et

1. **Navicat'ta** → **`railway` database** → **"Tables"** sekmesine git
2. **5 tablo görünmeli:**
   - ✅ `users`
   - ✅ `drafts`
   - ✅ `matches`
   - ✅ `friends`
   - ✅ `chat_messages`

---

## 🧪 TEST USER OLUŞTUR (Opsiyonel)

**Navicat Query Editor'da şunu yaz ve "Run" tıkla:**

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

---

## ⚠️ SORUN GİDERME

### Bağlantı hatası

**Olası nedenler:**
1. **Host yanlış** - Railway'den gerçek host'u al
2. **Password yanlış** - Railway Variables'dan kontrol et
3. **Firewall** - Railway'in IP'sine izin verilmemiş olabilir
4. **SSL gerekli** - Navicat'ta SSL ayarlarını kontrol et

**Çözüm:**
- Railway'den connection string'i al ve parse et
- Navicat'ta SSL ayarlarını aç (SSL Mode: "Require" veya "Allow")

---

## ✅ TAMAMLANDI!

**Yaptığın şey:**
1. ✅ Railway'den connection bilgilerini aldın
2. ✅ Navicat'ta PostgreSQL connection oluşturdun
3. ✅ Bağlantıyı test ettin
4. ✅ Schema'yı uyguladın
5. ✅ 5 tablo oluşturuldu!

**Artık:**
- ✅ Database hazır!
- ✅ Backend API'leri çalışacak!
- ✅ Navicat'tan database'i yönetebilirsin!

---

**Navicat ile bağlandın mı? Bağlandıysan "evet" yaz! 🚀**

