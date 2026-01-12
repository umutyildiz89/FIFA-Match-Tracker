# ✅ RAILWAY NAVICAT PUBLIC BAĞLANTI BİLGİLERİ

## 📋 PUBLIC NETWORKING BİLGİLERİ

**Railway'den aldığın bilgiler:**
- **Public TCP Proxy:** `metro.proxy.rlwy.net:31387`
- **Internal Port:** `:5432`

---

## 🔗 NAVICAT İÇİN CONNECTION BİLGİLERİ

**Navicat'ta yeni PostgreSQL connection oluştur:**

- **Connection Name:** `Railway PostgreSQL`
- **Host:** `metro.proxy.rlwy.net`
- **Port:** `31387` ⚠️ (5432 değil! TCP proxy port'u kullan!)
- **Database:** `railway`
- **User:** `postgres`
- **Password:** `ymHCzptwgtHwaoawNIlDGXAgbjBPoGgR`

---

## 📝 ADIM ADIM

1. **Navicat'ı aç**
2. **"Connection"** → **"PostgreSQL"** seç
3. **Connection bilgilerini gir:**
   - Host: `metro.proxy.rlwy.net`
   - Port: `31387`
   - Database: `railway`
   - User: `postgres`
   - Password: `ymHCzptwgtHwaoawNIlDGXAgbjBPoGgR`
4. **"Test Connection"** butonuna tıkla
5. **Bağlantı başarılı olursa** → **"Save"** tıkla ✅

---

## 🗄️ SCHEMA UYGULAMA

**Bağlantı başarılı olduktan sonra:**

1. **Navicat'ta Railway connection'a bağlan**
2. **`railway` database'ine tıkla**
3. **"Query"** sekmesine git (veya sağ tık → "New Query")
4. **Bu dosyayı aç:** `C:\Users\umut\Desktop\TODOGAME\database\schema_postgresql.sql`
5. **Tüm içeriği kopyala** (Ctrl+A, Ctrl+C)
6. **Navicat Query Editor'a yapıştır** (Ctrl+V)
7. **"Run"** butonuna tıkla (F5 veya ▶️ ikonu)

**Beklenen:**
- ✅ "Query executed successfully"
- ✅ 5 tablo oluşturuldu!

---

## ✅ KONTROL

1. **Navicat'ta** → **`railway` database** → **"Tables"** sekmesine git
2. **5 tablo görünmeli:**
   - ✅ `users`
   - ✅ `drafts`
   - ✅ `matches`
   - ✅ `friends`
   - ✅ `chat_messages`

---

## ⚠️ ÖNEMLİ NOT

**Port:** `31387` kullan! (5432 değil!)

Railway TCP proxy farklı bir port kullanıyor. Bu port Railway'in public networking için oluşturduğu proxy port'u.

---

**Navicat'ta bu bilgilerle bağlanmayı dene! 🚀**

