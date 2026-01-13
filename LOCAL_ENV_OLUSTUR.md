# 🔧 LOCAL .ENV DOSYASI OLUŞTURMA

## 📋 RAILWAY DATABASE URL'İNİ AL

### Adım 1: Railway Dashboard'a Git

1. **Railway.app** → **PostgreSQL service** → **"Variables"** sekmesine git
2. **`DATABASE_URL`** variable'ını bul
3. **Value'yu kopyala**

**ÖNEMLİ:** Railway internal URL (`postgres.railway.internal`) local'den çalışmaz!

### Adım 2: Public URL Kullan

1. **PostgreSQL service** → **"Connect"** sekmesine git
2. **"Public Network"** veya **"TCP Proxy"** sekmesine git
3. **Connection URL'i kopyala**

**Format:**
```
postgresql://postgres:password@metro.proxy.rlwy.net:31387/railway
```

---

## 📝 .ENV DOSYASI İÇERİĞİ

Ana dizinde `.env` dosyası oluştur:

```env
# Server
PORT=3000

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production-12345
JWT_EXPIRES_IN=7d

# Railway Database (Public URL kullan!)
DATABASE_URL=postgresql://postgres:password@metro.proxy.rlwy.net:31387/railway

# Cloudinary
CLOUDINARY_CLOUD_NAME=dnc27blds
CLOUDINARY_API_KEY=374854593451582
CLOUDINARY_API_SECRET=8CixQiMxLSY2tR9phDN8bwcniDo
```

---

## ✅ KONTROL

1. **Backend'i başlat:**
   ```bash
   npm run dev
   ```

2. **Log'ları kontrol et:**
   - `✅ PostgreSQL Database connected successfully` görünmeli

---

**Railway DATABASE_URL'ini alıp .env dosyasına eklememize yardımcı olur musun? 🚀**

