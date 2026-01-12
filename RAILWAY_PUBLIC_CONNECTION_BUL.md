# 🌐 RAILWAY PUBLIC CONNECTION BULMA

## ⚠️ SORUN

**Hata:** `could not translate host name "postgres.railway.internal" to address`

**Neden:** `postgres.railway.internal` Railway'in internal network'ü için. Dışarıdan erişilemez!

**Çözüm:** Railway'den **public connection string** veya **TCP proxy domain** bul.

---

## 🔍 RAILWAY'DEN PUBLIC CONNECTION BULMA

### Yöntem 1: Railway Connect Sekmesi (En Kolay)

1. **Railway.app** → **PostgreSQL service'ine tıkla**
2. **"Connect"** sekmesine git
3. **"Public Network"** veya **"TCP Proxy"** bölümüne bak
4. **Public connection string'i kopyala:**
   ```
   postgresql://postgres:PASSWORD@PUBLIC-DOMAIN:PORT/railway
   ```
5. **Bu connection string'den host'u parse et**

---

### Yöntem 2: Railway TCP Proxy

1. **Railway.app** → **PostgreSQL service** → **"Connect"** sekmesine git
2. **"TCP Proxy"** bölümüne bak
3. **"Generate Domain"** veya **"Public Domain"** butonuna tıkla
4. **Public domain'i kopyala** (örnek: `postgres-production-xxxx.up.railway.app`)
5. **Port'u kopyala** (genelde `5432` değil, farklı bir port olabilir)

---

### Yöntem 3: Railway Variables'dan Public Domain

1. **Railway.app** → **PostgreSQL service** → **"Variables"** sekmesine git
2. **`RAILWAY_PUBLIC_DOMAIN`** veya **`RAILWAY_TCP_PROXY_DOMAIN`** variable'ını bul
3. **Value'yu kopyala**

---

## 📝 NAVICAT İÇİN PUBLIC BİLGİLER

**Public connection string bulduktan sonra:**

**Örnek Public Connection String:**
```
postgresql://postgres:ymHCzptwgtHwaoawNIlDGXAgbjBPoGgR@postgres-production-xxxx.up.railway.app:5432/railway
```

**Navicat İçin:**
- **Host:** `postgres-production-xxxx.up.railway.app` (PUBLIC domain)
- **Port:** `5432` (veya TCP proxy port'u)
- **Database:** `railway`
- **User:** `postgres`
- **Password:** `ymHCzptwgtHwaoawNIlDGXAgbjBPoGgR`

---

## 🔧 ALTERNATİF: Railway Query Editor Kullan

**Eğer Navicat çalışmazsa, Railway'in kendi Query Editor'ını kullan:**

1. **Railway.app** → **PostgreSQL service** → **"Data"** veya **"Query"** sekmesine git
2. **"Open Query"** veya **"New Query"** butonuna tıkla
3. **Schema SQL'i yapıştır**
4. **"Run"** butonuna tıkla

**Bu yöntem her zaman çalışır çünkü Railway'in kendi ağı içinde!**

---

## ✅ ÖNERİLEN YOL

**Railway Query Editor kullan** (en kolay ve garantili):
1. Railway → PostgreSQL → Data/Query sekmesi
2. Schema SQL'i yapıştır
3. Run tıkla
4. Tamamlandı! ✅

---

**Railway Connect sekmesinde public connection string var mı? Varsa onu kullan, yoksa Railway Query Editor kullan! 🚀**

