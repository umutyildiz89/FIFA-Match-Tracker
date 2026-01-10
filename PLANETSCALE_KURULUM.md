# 🗄️ PLANETSCALE DATABASE KURULUMU

## 📋 ADIM ADIM REHBER

### 1. PlanetScale Hesabı Oluştur

1. **PlanetScale'e Git:**
   ```
   https://planetscale.com/
   ```

2. **"Sign up"** tıkla (GitHub ile giriş yapabilirsin - önerilir)

3. **Free Plan** seç (yeterli!)

---

### 2. Database Oluştur

1. **"Create database"** butonuna tıkla

2. **Database Bilgileri:**
   ```
   Name: fifa-match-tracker
   Region: eu-central (veya en yakın region)
   Plan: Free
   ```

3. **"Create database"** tıkla

4. **Database oluşturuldu!** ✅

---

### 3. Connection String (Bağlantı Bilgileri) Al

1. **Database'e tıkla** → **"Overview"** sekmesi

2. **"Connect"** butonuna tıkla

3. **"Node.js"** seç

4. **İki seçenek var:**

   **A) Connection String (Tek satır):**
   ```
   mysql://USERNAME:PASSWORD@HOST/DATABASE?sslaccept=strict
   ```
   
   **B) Ayrı Bilgiler:**
   ```
   Host: xxxx.xxxx.planetscale.com
   Username: xxxxx
   Password: xxxxx (göster)
   Database: xxxxx
   ```

5. **Bu bilgileri kaydet!** Render.com'da kullanacağız.

---

### 4. Schema Uygulama (Tablo Oluşturma)

#### Yöntem 1: PlanetScale Console (En Kolay) ✅

1. **Database'e git** → **"Branches"** sekmesi

2. **"main" branch'ine tıkla** (veya yeni branch oluştur)

3. **"Console"** sekmesine git

4. **SQL Editor'ı aç**

5. **`database/schema.sql`** dosyasını aç ve içeriğini kopyala

6. **Her tabloyu ayrı ayrı çalıştır:**

   **Tablo 1: users**
   ```sql
   CREATE TABLE IF NOT EXISTS users (
     id INT PRIMARY KEY AUTO_INCREMENT,
     email VARCHAR(255) UNIQUE NOT NULL,
     username VARCHAR(100) UNIQUE NOT NULL,
     password_hash VARCHAR(255) NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     INDEX idx_email (email),
     INDEX idx_username (username)
   );
   ```

   **Tablo 2: drafts**
   ```sql
   CREATE TABLE IF NOT EXISTS drafts (
     id INT PRIMARY KEY AUTO_INCREMENT,
     mode VARCHAR(50) NOT NULL,
     team1_name VARCHAR(100) NOT NULL,
     team2_name VARCHAR(100) NOT NULL,
     score1 INT NOT NULL DEFAULT 0,
     score2 INT NOT NULL DEFAULT 0,
     players JSON NOT NULL,
     image_url VARCHAR(500),
     uploader_id INT NOT NULL,
     timestamp DATETIME NOT NULL,
     status ENUM('pending', 'merged', 'approved', 'rejected') DEFAULT 'pending',
     merged_with INT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     FOREIGN KEY (uploader_id) REFERENCES users(id) ON DELETE CASCADE,
     FOREIGN KEY (merged_with) REFERENCES drafts(id) ON DELETE SET NULL,
     INDEX idx_status (status),
     INDEX idx_timestamp (timestamp),
     INDEX idx_uploader (uploader_id),
     INDEX idx_mode_timestamp (mode, timestamp)
   );
   ```

   **Tablo 3: matches**
   ```sql
   CREATE TABLE IF NOT EXISTS matches (
     id INT PRIMARY KEY AUTO_INCREMENT,
     mode VARCHAR(50) NOT NULL,
     team1_name VARCHAR(100) NOT NULL,
     team2_name VARCHAR(100) NOT NULL,
     score1 INT NOT NULL DEFAULT 0,
     score2 INT NOT NULL DEFAULT 0,
     players JSON NOT NULL,
     image_url VARCHAR(500),
     uploader_id INT NOT NULL,
     draft_id INT NULL,
     match_date DATETIME NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     FOREIGN KEY (uploader_id) REFERENCES users(id) ON DELETE CASCADE,
     FOREIGN KEY (draft_id) REFERENCES drafts(id) ON DELETE SET NULL,
     INDEX idx_uploader (uploader_id),
     INDEX idx_match_date (match_date)
   );
   ```

   **Tablo 4: friends**
   ```sql
   CREATE TABLE IF NOT EXISTS friends (
     id INT PRIMARY KEY AUTO_INCREMENT,
     user_id INT NOT NULL,
     friend_id INT NOT NULL,
     status ENUM('pending', 'accepted', 'blocked') DEFAULT 'pending',
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
     FOREIGN KEY (friend_id) REFERENCES users(id) ON DELETE CASCADE,
     UNIQUE KEY unique_friendship (user_id, friend_id),
     INDEX idx_user_status (user_id, status),
     INDEX idx_friend_status (friend_id, status)
   );
   ```

   **Tablo 5: chat_messages**
   ```sql
   CREATE TABLE IF NOT EXISTS chat_messages (
     id INT PRIMARY KEY AUTO_INCREMENT,
     sender_id INT NOT NULL,
     receiver_id INT NOT NULL,
     message TEXT NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
     FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
     INDEX idx_sender_receiver (sender_id, receiver_id),
     INDEX idx_created_at (created_at)
   );
   ```

7. **Her tabloyu çalıştırdıktan sonra kontrol et:**
   - **"Table"** sekmesine git
   - 5 tablo görünmeli: `users`, `drafts`, `matches`, `friends`, `chat_messages`

---

#### Yöntem 2: PlanetScale CLI (Gelişmiş)

1. **PlanetScale CLI Kur:**
   ```bash
   npm install -g @planetscale/cli
   ```

2. **Login:**
   ```bash
   pscale auth login
   ```

3. **Branch oluştur (deploy için):**
   ```bash
   pscale branch create main fifa-match-tracker
   ```

4. **Schema uygula:**
   ```bash
   pscale shell fifa-match-tracker main < database/schema.sql
   ```

5. **Deploy request oluştur:**
   ```bash
   pscale deploy-request create fifa-match-tracker main
   ```

6. **Deploy request'i merge et:**
   ```bash
   pscale deploy-request deploy fifa-match-tracker <deploy-request-number>
   ```

---

### 5. Test User Oluştur

**PlanetScale Console → SQL Editor:**

```sql
-- Test user oluştur (password: test123)
INSERT INTO users (email, username, password_hash) 
VALUES (
  'test@example.com', 
  'testuser', 
  '$2a$10$8ejOLkONuC8pNaie2FYGwOm04xBMPlAY3O6BgPlcU9DRXQHm22.QO'
);
```

**VEYA Register endpoint'i ile kayıt ol!**

---

### 6. Connection Bilgilerini Render.com'a Ekle

**Render.com Dashboard** → **Service** → **Environment** sekmesi:

```env
DB_HOST=xxxxx.xxxxx.planetscale.com
DB_USER=xxxxx
DB_PASSWORD=xxxxx
DB_NAME=xxxxx
DB_SSL=true
```

**NOT:** 
- Password'ü her zaman gösterebilirsin (PlanetScale dashboard'dan)
- Password expire olabilir, yenileyebilirsin
- `DB_SSL=true` zorunlu! PlanetScale SSL gerektirir

---

## ✅ KONTROL LİSTESİ

- [ ] PlanetScale hesabı oluşturuldu
- [ ] Database oluşturuldu (`fifa-match-tracker`)
- [ ] Connection string/bilgileri alındı
- [ ] 5 tablo oluşturuldu (`users`, `drafts`, `matches`, `friends`, `chat_messages`)
- [ ] Test user oluşturuldu
- [ ] Render.com'a connection bilgileri eklendi

---

## 🎉 BAŞARILI!

Database hazır! Render.com deployment'a geçebilirsin! 🚀

**Sonraki Adım:** `DEPLOYMENT_REHBERI.md` dosyasındaki "ADIM 2: RENDER.COM BACKEND DEPLOYMENT" bölümüne git.

