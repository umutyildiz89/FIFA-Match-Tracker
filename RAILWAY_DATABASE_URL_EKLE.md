# 🚀 RAILWAY: DATABASE_URL EKLEME REHBERİ

## ⚠️ SORUN

Backend loglarında şu hata görünüyor:
```
⚠️  Database not configured (DB_HOST, DB_USER, DB_NAME not set)
⚠️  API endpoints will not work without database
```

## ✅ ÇÖZÜM: DATABASE_URL EKLE

Railway'de PostgreSQL database oluşturulduğunda otomatik olarak `DATABASE_URL` environment variable'ı sağlanır. Backend service'ine bu variable'ı eklememiz gerekiyor.

---

## 📋 ADIM ADIM: RAILWAY'DE DATABASE_URL EKLEME

### Adım 1: Railway Dashboard'a Git

1. **Railway Dashboard:** https://railway.app/
2. Projeni seç
3. **Backend service'ine** tıkla (fifa-match-tracker-backend)

---

### Adım 2: Database Service'ini Bul

1. Railway projenin **ana sayfasına** dön
2. **PostgreSQL database service'ini** bul (genelde "Postgres" veya "Database" isimli)
3. Database service'ine tıkla

---

### Adım 3: DATABASE_URL'i Kopyala

1. Database service sayfasında **"Variables"** sekmesine git
2. **`DATABASE_URL`** variable'ını bul
3. **Değerini kopyala** (tam URL, örnek: `postgresql://postgres:password@host:port/database`)

**VEYA**

1. Database service sayfasında **"Connect"** sekmesine git
2. **"Postgres Connection URL"** veya **"DATABASE_URL"** değerini kopyala

---

### Adım 4: Backend Service'e DATABASE_URL Ekle

1. Railway projenin **ana sayfasına** dön
2. **Backend service'ine** tıkla
3. **"Variables"** sekmesine git
4. **"+ New Variable"** butonuna tıkla
5. Şunları ekle:
   - **Name:** `DATABASE_URL`
   - **Value:** Kopyaladığın DATABASE_URL değeri
6. **"Add"** butonuna tıkla

**VEYA (Daha Kolay Yöntem):**

1. Backend service → **"Variables"** sekmesi
2. **"+ New Variable"** → **"Add from Service"** seçeneğini kullan
3. Database service'ini seç
4. **`DATABASE_URL`** variable'ını seç
5. **"Add"** butonuna tıkla

---

## 🔄 DEPLOYMENT

`DATABASE_URL` eklendikten sonra:

1. Railway **otomatik olarak redeploy** edecek
2. Veya manuel olarak **"Deploy"** butonuna tıklayabilirsin
3. Deploy tamamlandığında logları kontrol et:
   ```
   ✅ PostgreSQL Database connected successfully (DATABASE_URL)
   ```

---

## ✅ KONTROL

Deploy tamamlandıktan sonra backend loglarında şunu görmelisin:

```
✅ PostgreSQL Database connected successfully (DATABASE_URL)
Server running on port 8080
```

**Hata yoksa başarılı! 🎉**

---

## 📝 NOTLAR

- **DATABASE_URL** Railway'de otomatik sağlanır, manuel oluşturmana gerek yok
- **"Add from Service"** yöntemi en kolay yöntemdir
- Database service'i silinirse `DATABASE_URL` de silinir, dikkat et!

---

## 🆘 SORUN GİDERME

### DATABASE_URL Bulunamıyor

1. Database service'in **"Variables"** sekmesine git
2. `DATABASE_URL` variable'ı yoksa:
   - Database service'i yeniden oluştur
   - Veya manuel olarak connection string oluştur

### Hala Bağlanamıyor

1. Backend loglarını kontrol et
2. `DATABASE_URL` formatını kontrol et (postgresql:// ile başlamalı)
3. Database service'in çalıştığından emin ol

---

**Bu adımları takip et, database bağlantısı çalışacak! 🚀**

