# 🔗 RAILWAY: MANUEL DATABASE_URL EKLEME

## 📋 ADIM ADIM

### 1️⃣ PostgreSQL Database Service'ine Git

1. **Railway.app** → **Projene gir**
2. **PostgreSQL database service'ine tıkla** (Postgres ikonu olan)
3. **"Connect"** veya **"Data"** sekmesine git

---

### 2️⃣ Connection URL'i Kopyala

1. **"Postgres Connection URL"** veya **"Connection String"** bul
2. **Kopyala** (genelde şu formatta):
   ```
   postgresql://postgres:PASSWORD@HOST:PORT/railway
   ```
   Veya:
   ```
   ${{Postgres.DATABASE_URL}}
   ```

---

### 3️⃣ Backend Service'e Dön

1. **Backend service'ine tıkla** (FIFA-Match-Tracker)
2. **"Variables"** sekmesine git

---

### 4️⃣ Manuel Variable Ekle

1. **"VARIABLE_NAME"** alanına yaz: `DATABASE_URL`
2. **"VALUE or ${{REF}}"** alanına yapıştır:
   - **Eğer Railway reference formatı varsa:** `${{Postgres.DATABASE_URL}}`
   - **Veya direkt connection string:** `postgresql://postgres:PASSWORD@HOST:PORT/railway`
3. **"Add"** butonuna tıkla ✅

---

### 5️⃣ Kontrol Et

1. **Variables listesinde** `DATABASE_URL` görünmeli
2. **Value** gizli olacak (güvenlik için)

---

### 6️⃣ Deploy

1. **"Deployments"** sekmesine git
2. **"Redeploy"** butonuna tıkla
3. **"Logs"** sekmesine git
4. **Beklenen:**
   ```
   ✅ PostgreSQL Database connected successfully (DATABASE_URL)
   ```

---

## 🔍 ALTERNATİF: Railway Reference Kullan

Eğer Railway reference formatı çalışıyorsa:

1. **"Add Reference"** dropdown'una tıkla
2. **PostgreSQL service'ini seç**
3. **`DATABASE_URL`** seç
4. Railway otomatik olarak `${{Postgres.DATABASE_URL}}` ekler

---

**Hangi yöntemi denedin? Sonucu söyle! 🚀**

