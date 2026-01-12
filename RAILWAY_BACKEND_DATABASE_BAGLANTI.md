# 🔗 RAILWAY: BACKEND SERVICE'E DATABASE BAĞLANTISI

## ⚠️ SORUN

**Backend loglarında:**
```
⚠️  Database not configured (DB_HOST, DB_USER, DB_NAME not set)
```

**Neden:** Backend service'inde `DATABASE_URL` environment variable'ı yok!

---

## ✅ ÇÖZÜM: DATABASE_URL EKLE

### Adım 1: Backend Service Variables'a Git

1. **Railway.app** → **Backend service** (FIFA-Match-Tracker) → **"Variables"** sekmesine git

---

### Adım 2: Database Reference Ekle

**İki yöntem var:**

#### Yöntem 1: Add Reference (Önerilen - Otomatik)

1. **"+ New Variable"** butonuna tıkla
2. **"Add Reference"** seçeneğini seç
3. **PostgreSQL database service'ini seç** (dropdown'dan)
4. **`DATABASE_URL`** seçeneğini seç
5. Railway otomatik olarak ekler! ✅

#### Yöntem 2: Manuel (Eğer Yöntem 1 çalışmazsa)

1. **PostgreSQL service** → **"Variables"** sekmesine git
2. **`DATABASE_URL`** variable'ını bul
3. **Value'yu kopyala** (gizli olabilir, ama reference olarak eklenebilir)
4. **Backend service** → **Variables** → **"+ New Variable"**
5. **Key:** `DATABASE_URL`
6. **Value:** `${{Postgres.DATABASE_URL}}` (Railway reference formatı)

---

### Adım 3: Kontrol Et

1. **Backend service** → **Variables** sekmesinde
2. **`DATABASE_URL`** görünmeli ✅
3. **Value** gizli olacak (güvenlik için)

---

### Adım 4: Redeploy

1. **Backend service** → **"Deployments"** sekmesine git
2. **"Redeploy"** butonuna tıkla (veya otomatik deploy olabilir)
3. **"Logs"** sekmesine git
4. **Beklenen log:**
   ```
   ✅ PostgreSQL Database connected successfully (DATABASE_URL)
   Server running on port 8080
   ```

---

## 🔍 ALTERNATİF: Manuel DATABASE_URL

**Eğer reference çalışmazsa, manuel ekle:**

1. **PostgreSQL service** → **"Connect"** sekmesine git
2. **Connection string'i kopyala:**
   ```
   postgresql://postgres:PASSWORD@HOST:5432/railway
   ```
3. **Backend service** → **Variables** → **"+ New Variable"**
4. **Key:** `DATABASE_URL`
5. **Value:** Connection string'i yapıştır

---

## ✅ BAŞARILI BAĞLANTI

Bağlantı başarılı olduğunda loglarda göreceksin:

```
✅ PostgreSQL Database connected successfully (DATABASE_URL)
Server running on port 8080
```

**Artık API endpoint'leri çalışacak! 🚀**

---

**DATABASE_URL'i backend service'e ekledin mi? Eklediysen "evet" yaz!**

