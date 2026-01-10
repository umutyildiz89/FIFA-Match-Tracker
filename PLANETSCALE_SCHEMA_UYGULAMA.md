# 🗄️ PLANETSCALE'E SCHEMA UYGULAMA REHBERİ

## 📋 ADIM ADIM REHBER

### ADIM 1: PlanetScale Console'a Git

1. **PlanetScale Dashboard'a git:**
   ```
   https://planetscale.com/
   ```

2. **Login yap** (GitHub ile)

3. **Database'ini seç:**
   - Database: `fifa-match-tracker` (veya oluşturduğun isim)
   - Tıkla

---

### ADIM 2: SQL Console'u Aç

1. **"Console"** sekmesine git
   - Sol menüde **"Console"** veya **"SQL Editor"** görünür

2. **SQL Editor'ı aç:**
   - **"New query"** veya **"Run SQL"** butonuna tıkla
   - Veya direkt SQL editor açık olabilir

---

### ADIM 3: Schema'yı Uygula

**İki Yöntem Var:**

#### Yöntem 1: Tek Seferde (Önerilen - Hızlı) ⚡

1. **`database/schema_postgresql.sql`** dosyasını aç
2. **Tüm içeriği kopyala** (Ctrl+A, Ctrl+C)
3. **PlanetScale SQL Editor'a yapıştır** (Ctrl+V)
4. **"Run"** veya **"Execute"** butonuna tıkla

**Sonuç:**
- Tüm tablolar, trigger'lar, index'ler oluşturulur
- Hata varsa gösterilir, düzeltip tekrar dene

---

#### Yöntem 2: Ayrı Ayrı (Daha Güvenli) ✅

**Sıra Önemli!** Şu sırayla çalıştır:

##### 1. Trigger Function (ÖNCE BU!)

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

**"Run"** tıkla → ✅ Başarılı olmalı

---

##### 2. Enum Types

```sql
CREATE TYPE draft_status AS ENUM ('pending', 'merged', 'approved', 'rejected');
```

**"Run"** tıkla

```sql
CREATE TYPE friend_status AS ENUM ('pending', 'accepted', 'blocked');
```

**"Run"** tıkla

---

##### 3. Users Table

```sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

**"Run"** tıkla → ✅ Users tablosu oluşturuldu

---

##### 4. Drafts Table

```sql
CREATE TABLE IF NOT EXISTS drafts (
  id SERIAL PRIMARY KEY,
  mode VARCHAR(50) NOT NULL,
  team1_name VARCHAR(100) NOT NULL,
  team2_name VARCHAR(100) NOT NULL,
  score1 INTEGER NOT NULL DEFAULT 0,
  score2 INTEGER NOT NULL DEFAULT 0,
  players JSONB NOT NULL,
  image_url VARCHAR(500),
  uploader_id INTEGER NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  status draft_status DEFAULT 'pending',
  merged_with INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (uploader_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (merged_with) REFERENCES drafts(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_drafts_status ON drafts(status);
CREATE INDEX IF NOT EXISTS idx_drafts_timestamp ON drafts(timestamp);
CREATE INDEX IF NOT EXISTS idx_drafts_uploader ON drafts(uploader_id);
CREATE INDEX IF NOT EXISTS idx_drafts_mode_timestamp ON drafts(mode, timestamp);

CREATE TRIGGER update_drafts_updated_at
  BEFORE UPDATE ON drafts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

**"Run"** tıkla → ✅ Drafts tablosu oluşturuldu

---

##### 5. Matches Table

```sql
CREATE TABLE IF NOT EXISTS matches (
  id SERIAL PRIMARY KEY,
  mode VARCHAR(50) NOT NULL,
  team1_name VARCHAR(100) NOT NULL,
  team2_name VARCHAR(100) NOT NULL,
  score1 INTEGER NOT NULL DEFAULT 0,
  score2 INTEGER NOT NULL DEFAULT 0,
  players JSONB NOT NULL,
  image_url VARCHAR(500),
  uploader_id INTEGER NOT NULL,
  draft_id INTEGER,
  match_date TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (uploader_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (draft_id) REFERENCES drafts(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_matches_uploader ON matches(uploader_id);
CREATE INDEX IF NOT EXISTS idx_matches_match_date ON matches(match_date);

CREATE TRIGGER update_matches_updated_at
  BEFORE UPDATE ON matches
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

**"Run"** tıkla → ✅ Matches tablosu oluşturuldu

---

##### 6. Friends Table

```sql
CREATE TABLE IF NOT EXISTS friends (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  friend_id INTEGER NOT NULL,
  status friend_status DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (friend_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE (user_id, friend_id)
);

CREATE INDEX IF NOT EXISTS idx_friends_user_status ON friends(user_id, status);
CREATE INDEX IF NOT EXISTS idx_friends_friend_status ON friends(friend_id, status);

CREATE TRIGGER update_friends_updated_at
  BEFORE UPDATE ON friends
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

**"Run"** tıkla → ✅ Friends tablosu oluşturuldu

---

##### 7. Chat Messages Table

```sql
CREATE TABLE IF NOT EXISTS chat_messages (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER NOT NULL,
  receiver_id INTEGER NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_sender_receiver ON chat_messages(sender_id, receiver_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
```

**"Run"** tıkla → ✅ Chat messages tablosu oluşturuldu

---

### ADIM 4: Kontrol Et

1. **"Tables"** sekmesine git
2. **5 tablo görünmeli:**
   - ✅ `users`
   - ✅ `drafts`
   - ✅ `matches`
   - ✅ `friends`
   - ✅ `chat_messages`

3. **Her tablonun yapısını kontrol et:**
   - Tabloya tıkla → **"Structure"** veya **"Schema"** sekmesi
   - Kolonların doğru olduğunu kontrol et

---

### ADIM 5: Test Data Ekle (Opsiyonel)

**Test user oluşturmak için:**

```sql
INSERT INTO users (email, username, password_hash) 
VALUES (
  'test@example.com', 
  'testuser', 
  '$2a$10$8ejOLkONuC8pNaie2FYGwOm04xBMPlAY3O6BgPlcU9DRXQHm22.QO'
);
-- Password: test123
```

**"Run"** tıkla → ✅ Test user oluşturuldu

---

## ⚠️ YAYGIN HATALAR VE ÇÖZÜMLER

### Hata 1: "Function already exists"

**Hata:**
```
ERROR: function update_updated_at_column() already exists
```

**Çözüm:**
- `CREATE OR REPLACE FUNCTION` kullan (zaten var)
- Veya function'ı sil ve tekrar oluştur:
  ```sql
  DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
  -- Sonra tekrar CREATE et
  ```

---

### Hata 2: "Type already exists"

**Hata:**
```
ERROR: type "draft_status" already exists
```

**Çözüm:**
- Enum type zaten varsa sorun değil
- Devam et, tabloyu oluştur

---

### Hata 3: "Table already exists"

**Hata:**
```
ERROR: relation "users" already exists
```

**Çözüm:**
- `CREATE TABLE IF NOT EXISTS` kullan (zaten var)
- Veya mevcut tabloyu sil ve tekrar oluştur:
  ```sql
  DROP TABLE IF EXISTS users CASCADE;
  -- Sonra tekrar CREATE et
  ```

**⚠️ DİKKAT:** `CASCADE` kullanırsan tüm foreign key'ler de silinir!

---

### Hata 4: "Foreign key constraint fails"

**Hata:**
```
ERROR: insert or update on table "drafts" violates foreign key constraint
```

**Çözüm:**
- Foreign key'ler doğru mu kontrol et
- Tablolar doğru sırada mı oluşturuldu? (users önce, sonra drafts)

---

### Hata 5: "Syntax error near..."

**Hata:**
```
ERROR: syntax error at or near "..."
```

**Çözüm:**
- SQL syntax'ı kontrol et
- PostgreSQL syntax doğru mu?
- Her satırı ayrı ayrı çalıştırmayı dene

---

## 📝 HIZLI YÖNTEM (Copy-Paste)

### En Kolay Yol:

1. **`database/schema_postgresql.sql`** dosyasını aç
2. **Tüm içeriği kopyala** (Ctrl+A, Ctrl+C)
3. **PlanetScale SQL Editor'a yapıştır**
4. **"Run"** tıkla
5. **Hata varsa:** Hata mesajını oku, ilgili kısmı düzelt

---

## ✅ BAŞARILI KONTROL

**Schema uygulandıktan sonra:**

1. **"Tables"** sekmesinde 5 tablo görünmeli ✅
2. **Her tablo için:**
   - Kolonlar doğru mu?
   - Foreign key'ler var mı?
   - Index'ler oluşturulmuş mu?
3. **Test query çalıştır:**
   ```sql
   SELECT COUNT(*) FROM users;
   ```
   **Beklenen:** `0` (tablo boş ama var)

---

## 🎯 SONRAKI ADIM

**Schema uygulandıktan sonra:**

1. ✅ **Render.com'a deploy et** (Environment variables hazır)
2. ✅ **Database connection test et**
3. ✅ **Test user oluştur ve login dene**

---

## 📚 EK KAYNAKLAR

- **PlanetScale Docs:** https://planetscale.com/docs
- **PostgreSQL Docs:** https://www.postgresql.org/docs/
- **Schema Dosyası:** `database/schema_postgresql.sql`

---

## 🎉 BAŞARILI!

**Schema uygulandı!** Artık Render.com'a deploy edebilirsin! 🚀

