# 🔗 RAILWAY DATABASE BAĞLANTISI

## ⚠️ SORUN

Backend service çalışıyor ama `DATABASE_URL` environment variable'ı yok.

**Log:**
```
⚠️  Database not configured (DB_HOST, DB_USER, DB_NAME not set)
```

---

## ✅ ÇÖZÜM: DATABASE'İ SERVICE'E BAĞLA

Railway'de PostgreSQL database'i backend service'e **link** etmen gerekiyor!

### Adımlar:

1. **Railway.app'e git:** https://railway.app/
2. **Backend service'ine tıkla**
3. **"Variables"** sekmesine git
4. **"New Variable"** butonuna tıkla
5. **"Add from Service"** seçeneğini seç
6. **PostgreSQL database'ini seç**
7. Railway otomatik olarak `DATABASE_URL` ekler! ✅

---

## 🔍 ALTERNATİF: MANUEL KONTROL

Eğer `DATABASE_URL` hala yoksa:

1. **PostgreSQL database service'ine tıkla**
2. **"Connect"** sekmesine git
3. **"Postgres Connection URL"** kopyala
4. **Backend service** → **Variables** → **New Variable**
5. **Key:** `DATABASE_URL`
6. **Value:** Kopyaladığın connection URL'i yapıştır

---

## ✅ KONTROL ET

Deploy sonrası loglarda göreceksin:

```
✅ PostgreSQL Database connected successfully (DATABASE_URL)
```

---

**Database'i service'e bağladın mı? Bağladıysan "evet" yaz! 🚀**

