# 🔗 RAILWAY NAVICAT CONNECTION BİLGİLERİ

## 📋 CONNECTION STRING'DEN PARSE EDİLEN BİLGİLER

**Connection String:**
```
postgresql://postgres:ymHCzptwgtHwaoawNIlDGXAgbjBPoGgR@postgres.railway.internal:5432/railway
```

**Navicat İçin:**
- **Host:** `postgres.railway.internal`
- **Port:** `5432`
- **Database:** `railway`
- **User:** `postgres`
- **Password:** `ymHCzptwgtHwaoawNIlDGXAgbjBPoGgR`

---

## ⚠️ ÖNEMLİ: INTERNAL DOMAIN

**`postgres.railway.internal`** Railway'in **internal network domain'i**. 

**Sorun:** Navicat'tan bağlanmak için bu internal domain çalışmayabilir çünkü bu sadece Railway'in kendi servisleri arasında çalışır.

---

## ✅ ÇÖZÜM: PUBLIC CONNECTION STRING KULLAN

### Yöntem 1: Railway Public Connection String (Önerilen)

1. **Railway.app** → **PostgreSQL service** → **"Connect"** sekmesine git
2. **"Public Network"** veya **"TCP Proxy"** bölümüne bak
3. **Public connection string'i kopyala** (genelde şu formatta):
   ```
   postgresql://postgres:PASSWORD@PUBLIC-DOMAIN:PORT/railway
   ```
4. **Bu connection string'den host'u parse et**

---

### Yöntem 2: Railway TCP Proxy Domain

1. **Railway.app** → **PostgreSQL service** → **"Connect"** sekmesine git
2. **"TCP Proxy"** veya **"Public Network"** bölümüne bak
3. **Public domain'i kopyala** (örnek: `postgres-production-xxxx.up.railway.app`)
4. **Navicat'ta bu domain'i Host olarak kullan**

---

### Yöntem 3: Internal Domain'i Dene (Bazen Çalışır)

**Eğer Railway'in network ayarları izin veriyorsa:**

1. **Navicat'ta connection oluştur:**
   - **Host:** `postgres.railway.internal`
   - **Port:** `5432`
   - **Database:** `railway`
   - **User:** `postgres`
   - **Password:** `ymHCzptwgtHwaoawNIlDGXAgbjBPoGgR`

2. **"Test Connection"** butonuna tıkla
3. **Eğer çalışmazsa** → Public connection string kullan (Yöntem 1 veya 2)

---

## 🎯 EN İYİ YOL

**Railway Connect sekmesinde public connection string'i bul:**
- **"Public Network"** veya **"TCP Proxy"** bölümüne bak
- **Public domain'i kopyala**
- **Navicat'ta kullan**

---

## 📝 NAVICAT AYARLARI

**Connection oluştururken:**
- **Connection Name:** `Railway PostgreSQL`
- **Host:** Public domain (veya `postgres.railway.internal` dene)
- **Port:** `5432`
- **Database:** `railway`
- **User:** `postgres`
- **Password:** `ymHCzptwgtHwaoawNIlDGXAgbjBPoGgR`
- **SSL:** Gerekirse "Require" veya "Allow" seç

---

**Railway Connect sekmesinde public connection string var mı? Varsa onu kullan! 🚀**

