# 🔍 RAILWAY_PRIVATE_DOMAIN NASIL BULUNUR?

## 📋 3 YÖNTEM

### Yöntem 1: PostgreSQL Service Variables (En Kolay) ✅

1. **Railway.app** → **PostgreSQL database service'ine tıkla**
2. **"Variables"** sekmesine git
3. **`RAILWAY_PRIVATE_DOMAIN`** variable'ını bul
4. **Value'yu kopyala** (örnek: `postgres-production-xxxx.up.railway.app`)

**Bu değeri Navicat'ta Host olarak kullan!**

---

### Yöntem 2: Connection String'den Parse Et

1. **Railway.app** → **PostgreSQL service** → **"Connect"** veya **"Data"** sekmesine git
2. **"Postgres Connection URL"** veya **"Connection String"** bul
3. **Format şöyle olacak:**
   ```
   postgresql://postgres:PASSWORD@HOST:5432/railway
   ```
4. **`@` işaretinden sonra, `:` işaretinden önceki kısım HOST'tur!**

**Örnek:**
```
postgresql://postgres:ymHCzptwgtHwaoawNIlDGXAgbjBPoGgR@postgres-production-xxxx.up.railway.app:5432/railway
```
**Host:** `postgres-production-xxxx.up.railway.app`

---

### Yöntem 3: Railway TCP Proxy (Alternatif)

1. **Railway.app** → **PostgreSQL service** → **"Connect"** sekmesine git
2. **"TCP Proxy"** veya **"Public Network"** bölümüne bak
3. **Domain'i kopyala**

**Not:** Bu genelde public domain olur, private domain farklı olabilir.

---

## 🎯 EN KOLAY YOL

**Yöntem 1'i kullan:**
1. PostgreSQL service → Variables
2. `RAILWAY_PRIVATE_DOMAIN` bul
3. Value'yu kopyala
4. Navicat'ta Host olarak yapıştır

---

## ⚠️ ÖNEMLİ NOT

**Eğer Variables'da `RAILWAY_PRIVATE_DOMAIN` görünmüyorsa:**

1. **Railway'in otomatik eklediği variables'lara bak:**
   - Variables sayfasında **"7 variables added by Railway"** linkine tıkla
   - Orada `RAILWAY_PRIVATE_DOMAIN` olmalı

2. **VEYA Connection String'den parse et** (Yöntem 2)

---

## 📝 NAVICAT İÇİN

**Navicat'ta connection oluştururken:**
- **Host:** `RAILWAY_PRIVATE_DOMAIN` değeri (örnek: `postgres-production-xxxx.up.railway.app`)
- **Port:** `5432`
- **Database:** `railway`
- **User:** `postgres`
- **Password:** Railway Variables'dan `POSTGRES_PASSWORD` değeri

---

**Hangi yöntemi denedin? Buldun mu? 🚀**

