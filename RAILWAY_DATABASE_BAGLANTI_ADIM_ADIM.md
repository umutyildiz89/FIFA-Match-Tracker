# 🔗 RAILWAY: POSTGRESQL DATABASE'İ BACKEND'E BAĞLAMA

## 📋 ADIM ADIM REHBER

### 1️⃣ Railway.app'e Git

1. **Tarayıcıyı aç**
2. **Railway.app'e git:** https://railway.app/
3. **Login yap**

---

### 2️⃣ Backend Service'ine Git

1. **Projene gir** (PostgreSQL database'in olduğu proje)
2. **Backend service'ine tıkla** (GitHub repo'dan oluşturduğun service)

---

### 3️⃣ Variables Sekmesine Git

1. **Backend service sayfasında**
2. **"Variables"** sekmesine tıkla (üst menüde)

---

### 4️⃣ Database'i Bağla

**İki yöntem var:**

#### Yöntem 1: Add from Service (Önerilen - Otomatik)

1. **"+ New Variable"** butonuna tıkla
2. **"Add from Service"** seçeneğini seç
3. **PostgreSQL database'ini seç** (dropdown'dan)
4. Railway otomatik olarak `DATABASE_URL` ekler! ✅

#### Yöntem 2: Manuel (Eğer Yöntem 1 çalışmazsa)

1. **PostgreSQL database service'ine git**
2. **"Connect"** veya **"Data"** sekmesine git
3. **"Postgres Connection URL"** veya **"Connection String"** kopyala
4. **Backend service** → **Variables** → **"+ New Variable"**
5. **Key:** `DATABASE_URL`
6. **Value:** Kopyaladığın connection URL'i yapıştır

---

### 5️⃣ Kontrol Et

1. **Backend service** → **Variables** sekmesinde
2. **`DATABASE_URL`** görünmeli ✅
3. **Value** gizli olacak (güvenlik için)

---

### 6️⃣ Deploy Kontrolü

1. **Backend service** → **"Deployments"** sekmesine git
2. **"Redeploy"** butonuna tıkla (veya otomatik deploy olacak)
3. **"Logs"** sekmesine git
4. **Beklenen log:**
   ```
   ✅ PostgreSQL Database connected successfully (DATABASE_URL)
   ```

---

## ⚠️ SORUN GİDERME

### DATABASE_URL görünmüyor

**Çözüm:**
- PostgreSQL database service'inin backend service ile aynı projede olduğundan emin ol
- "Add from Service" yerine manuel ekle (Yöntem 2)

---

### Hala bağlantı hatası

**Kontrol et:**
1. `DATABASE_URL` variable'ı var mı?
2. Deploy yapıldı mı? (Redeploy butonuna tıkla)
3. Logs'da hata var mı?

---

## ✅ BAŞARILI BAĞLANTI

Bağlantı başarılı olduğunda loglarda göreceksin:

```
✅ PostgreSQL Database connected successfully (DATABASE_URL)
Server running on port 8080
```

**Artık API endpoint'leri çalışacak! 🚀**

