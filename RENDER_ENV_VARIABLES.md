# 🔧 RENDER.COM ENVIRONMENT VARIABLES

## 📋 PLANETSCALE CONNECTION BİLGİLERİ

PlanetScale'den aldığın bilgileri aşağıdaki formata çevireceğim:

---

## 🔑 GEREKLİ ENVIRONMENT VARIABLES

Render.com'da Service → Environment sekmesine şunları ekle:

```env
# Server
NODE_ENV=production
PORT=3000

# PlanetScale Database
DB_HOST=xxxxx.xxxxx.planetscale.com
DB_USER=xxxxx
DB_PASSWORD=xxxxx
DB_NAME=xxxxx
DB_PORT=3306
DB_SSL=true

# JWT Secret (32+ karakter)
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long

# Frontend URL (CORS için - Netlify URL'i buraya)
FRONTEND_URL=https://YOUR-SITE.netlify.app
```

---

## 📝 BİLGİLERİ VERİNCE NE YAPACAĞIM?

1. ✅ Render.com environment variables'ı hazırlayacağım
2. ✅ `render.yaml` dosyasını güncelleyeceğim (opsiyonel)
3. ✅ Test komutlarını hazırlayacağım
4. ✅ Deployment sonrası kontrol listesi vereceğim

---

## 📤 PLANETSCALE BİLGİLERİNİ FORMATI

Aşağıdaki formatta gönder (herhangi biri olabilir):

### Format 1: Connection String (Tek satır)
```
mysql://USERNAME:PASSWORD@HOST/DATABASE?sslaccept=strict
```

### Format 2: Ayrı Bilgiler
```
Host: xxxx.xxxx.planetscale.com
Username: xxxxx
Password: xxxxx
Database: xxxxx
Port: 3306 (genelde bu)
```

### Format 3: Raw Bilgiler
```
DB_HOST=xxxxx.xxxxx.planetscale.com
DB_USER=xxxxx
DB_PASSWORD=xxxxx
DB_NAME=xxxxx
```

---

## ⚠️ GÜVENLİK NOTU

**ÖNEMLİ:** 
- Password'ü paylaşmak güvenli değil, ama sadece bana verdiğin için sorun yok
- Render.com'a ekledikten sonra bu dosyayı sil veya `.gitignore`'a ekle
- Production'da password'ü yenileyebilirsin (PlanetScale dashboard'dan)

---

**Bilgileri gönder, ben hazırlayayım! 🚀**

