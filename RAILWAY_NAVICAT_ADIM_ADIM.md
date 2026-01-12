# 🗄️ RAILWAY NAVICAT: ADIM ADIM SCHEMA UYGULAMA

## 📋 NAVICAT'TA NEW QUERY AÇTIN - HAZIRSIN!

**Her adımı tek tek uygula. Her adımda başarılı olursa "evet" yaz, hata verirse hata mesajını gönder.**

---

## ✅ ADIM 1: TRIGGER FUNCTION (ÖNCE BU!)

**Navicat Query Editor'a şunu yapıştır ve "Run" tıkla:**

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

**Beklenen:** "Query executed successfully" veya hiçbir hata mesajı yoksa başarılı!

**Başarılı oldu mu? "evet" yaz veya hata mesajını gönder.**

---

## ✅ ADIM 2: ENUM TYPES

**Navicat Query Editor'a şunu yapıştır ve "Run" tıkla:**

```sql
CREATE TYPE IF NOT EXISTS draft_status AS ENUM ('pending', 'merged', 'approved', 'rejected');
CREATE TYPE IF NOT EXISTS friend_status AS ENUM ('pending', 'accepted', 'blocked');
```

**Beklenen:** "Query executed successfully"

**Başarılı oldu mu? "evet" yaz veya hata mesajını gönder.**

---

## ✅ ADIM 3: USERS TABLE

**Navicat Query Editor'a şunu yapıştır ve "Run" tıkla:**

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

**Beklenen:** "Query executed successfully"

**Başarılı oldu mu? "evet" yaz veya hata mesajını gönder.**

---

## ✅ ADIM 4: DRAFTS TABLE

**Navicat Query Editor'a şunu yapıştır ve "Run" tıkla:**

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

**Beklenen:** "Query executed successfully"

**Başarılı oldu mu? "evet" yaz veya hata mesajını gönder.**

---

## ✅ ADIM 5: MATCHES TABLE

**Navicat Query Editor'a şunu yapıştır ve "Run" tıkla:**

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

**Beklenen:** "Query executed successfully"

**Başarılı oldu mu? "evet" yaz veya hata mesajını gönder.**

---

## ✅ ADIM 6: FRIENDS TABLE

**Navicat Query Editor'a şunu yapıştır ve "Run" tıkla:**

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

**Beklenen:** "Query executed successfully"

**Başarılı oldu mu? "evet" yaz veya hata mesajını gönder.**

---

## ✅ ADIM 7: CHAT MESSAGES TABLE (SON ADIM!)

**Navicat Query Editor'a şunu yapıştır ve "Run" tıkla:**

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

**Beklenen:** "Query executed successfully"

**Başarılı oldu mu? "evet" yaz veya hata mesajını gönder.**

---

## 🎉 TAMAMLANDI!

**Tüm adımlar başarılı olduysa:**

1. **Navicat'ta** → **`railway` database** → **"Tables"** sekmesine git
2. **5 tablo görünmeli:**
   - ✅ `users`
   - ✅ `drafts`
   - ✅ `matches`
   - ✅ `friends`
   - ✅ `chat_messages`

**Tablolar görünüyor mu? "evet" yaz! 🚀**

