# ✅ RENDER.COM ENVIRONMENT VARIABLES HAZIR!

## 🔑 PLANETSCALE BİLGİLERİN PARSE EDİLDİ

Verdiğin bilgiler:
- **Host:** `us-east-4.pg.psdb.cloud`
- **Username:** `pscale_api_8s4elrt6ngqf.ahs1ru2oomn6`
- **Password:** `WecCDGCozxsJoXNnyUq65hrEYvyC7wJy`

**⚠️ NOT:** Host `.pg.psdb.cloud` formatında (PostgreSQL). Ama bizim schema **MySQL** için yazıldı!

**PlanetScale'de database adı ne?** (Genelde `fifa-match-tracker` veya başka bir isim)

---

## 📋 RENDER.COM ENVIRONMENT VARIABLES

Render.com Dashboard → Service → **Environment** sekmesine şunları ekle:

```env
NODE_ENV=production
PORT=3000

# PlanetScale Database
DB_HOST=us-east-4.psdb.cloud
DB_USER=pscale_api_8s4elrt6ngqf
DB_PASSWORD=WecCDGCozxsJoXNnyUq65hrEYvyC7wJy
DB_NAME=ahs1ru2oomn6
DB_PORT=3306
DB_SSL=true

# JWT Secret (Güvenli random key oluşturuldu)
JWT_SECRET=ef7a9eb831581df58f608b82d5d42d704b7d38fffc04a08c39090bb43e0e4c4d

# Frontend URL (Netlify deployment sonrası ekle)
FRONTEND_URL=https://YOUR-SITE.netlify.app
```

---

## ⚠️ ÖNEMLİ: DATABASE ADI KONTROL

**Verdiğin username:** `pscale_api_8s4elrt6ngqf.ahs1ru2oomn6`

Bu format muhtemelen şu anlama geliyor:
- **Username:** `pscale_api_8s4elrt6ngqf`
- **Database:** `ahs1ru2oomn6` (noktadan sonraki kısım)

**VEYA**

PlanetScale'de full username format: `username@database`

**Kontrol Et:**
1. PlanetScale Dashboard'a git
2. Database'e tıkla
3. **"Connect"** butonuna tıkla
4. **"Node.js"** seç
5. Connection string'i kopyala ve paylaş:
   ```
   mysql://USERNAME:PASSWORD@HOST/DATABASE?sslaccept=strict
   ```

---

## 🔧 ALTERNATİF: HOST FORMATI

**Not:** `.pg.psdb.cloud` PostgreSQL formatı. Eğer MySQL kullanıyorsan:
- MySQL için: `us-east-4.psdb.cloud` (`.pg.` yok)
- PostgreSQL için: `us-east-4.pg.psdb.cloud` (`.pg.` var)

**Bizim schema MySQL için yazıldı!** Eğer PostgreSQL database oluşturduysan schema'yı güncellememiz gerekir.

---

## ✅ ŞİMDİ YAPILACAKLAR

### 1. Database Adını Kontrol Et

PlanetScale Dashboard'da:
- Database adı ne? (`fifa-match-tracker` mı, `ahs1ru2oomn6` mı?)

### 2. Host Formatını Kontrol Et

- MySQL mi kullanıyorsun? (MySQL için `.pg.` olmamalı)
- PostgreSQL mi? (PostgreSQL için `.pg.` olmalı ama schema MySQL için yazıldı)

### 3. Render.com'a Environment Variables Ekle

Yukarıdaki environment variables'ı Render.com'a ekle (DB_NAME'i doğru yap)

---

## 🚀 JWT SECRET OLUŞTURULDU

**JWT Secret (Güvenli):**
```
ef7a9eb831581df58f608b82d5d42d704b7d38fffc04a08c39090bb43e0e4c4d
```

Bu key'i Render.com'a ekle.

---

## 📝 DÜZELTME GEREKİRSE

**Eğer bilgiler yanlışsa:**

1. PlanetScale Dashboard → **"Connect"** → **"Node.js"**
2. **Connection string'i kopyala:**
   ```
   mysql://USERNAME:PASSWORD@HOST/DATABASE?sslaccept=strict
   ```
3. **Veya ayrı bilgileri paylaş:**
   - Host (MySQL için `.pg.` olmamalı)
   - Username
   - Password
   - Database name

**Ben tekrar parse edip düzelteceğim!**

