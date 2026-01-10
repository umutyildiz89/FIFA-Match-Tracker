# FIFA/EA FC Match Tracker Backend

FIFA/EA FC maç takip uygulaması için Node.js backend API'si.

## Teknoloji Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL (PlanetScale)** - Veritabanı
- **Socket.IO** - Real-time chat
- **JWT** - Authentication
- **bcryptjs** - Şifre hashleme
- **Cloudinary** - Image URL storage

## Proje Yapısı

```
├── config/           # Veritabanı ve Cloudinary konfigürasyonları
├── controllers/      # Route handler'ları
├── database/         # Database schema dosyası
├── middleware/       # Authentication middleware
├── routes/           # Express route tanımları
├── socket/           # Socket.IO chat implementasyonu
├── utils/            # Yardımcı fonksiyonlar (JWT, bcrypt, merge algoritması)
├── server.js         # Ana server dosyası
└── package.json      # Proje bağımlılıkları
```

## Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. `.env` dosyası oluşturun (`.env.example` dosyasını referans alın):
```env
PORT=3000
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
DB_HOST=your-planetscale-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=your-db-name
DB_PORT=3306
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

3. Database schema'yı oluşturun:
```bash
mysql -h YOUR_HOST -u YOUR_USER -p < database/schema.sql
```

4. Server'ı başlatın:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication (`/api/auth`)

- `POST /api/auth/register` - Kullanıcı kaydı
  - Body: `{ email, username, password }`
  
- `POST /api/auth/login` - Giriş yap
  - Body: `{ email OR username, password }`
  
- `GET /api/auth/profile` - Kullanıcı profili (Auth gerekli)

### Drafts (`/api/drafts`)

- `POST /api/drafts/ocr` - OCR sonucundan draft oluştur (Auth gerekli)
  - Body: `{ mode, team1_name, team2_name, score1, score2, players[], imageUrl? }`
  
- `GET /api/drafts` - Tüm draft'ları listele (Auth gerekli)
  - Query params: `status?`, `mode?`
  
- `GET /api/drafts/:id` - Draft detayı (Auth gerekli)
  
- `POST /api/drafts/:id/approve` - Draft'ı onayla ve match oluştur (Auth gerekli)
  
- `POST /api/drafts/:id/reject` - Draft'ı reddet (Auth gerekli)

### Matches (`/api/matches`)

- `GET /api/matches` - Tüm match'leri listele
  - Query params: `mode?`, `userId?`, `startDate?`, `endDate?`
  
- `GET /api/matches/:id` - Match detayı
  
- `GET /api/matches/my-matches` - Kullanıcının kendi match'leri (Auth gerekli)
  
- `GET /api/matches/stats` - Match istatistikleri (Auth gerekli)

### Friends (`/api/friends`)

- `POST /api/friends/request` - Arkadaşlık isteği gönder (Auth gerekli)
  - Body: `{ friendId }`
  
- `GET /api/friends/pending` - Bekleyen arkadaşlık istekleri (Auth gerekli)
  
- `POST /api/friends/accept/:requestId` - Arkadaşlık isteğini kabul et (Auth gerekli)
  
- `POST /api/friends/reject/:requestId` - Arkadaşlık isteğini reddet (Auth gerekli)
  
- `GET /api/friends/list` - Arkadaş listesi (Auth gerekli)
  
- `DELETE /api/friends/:friendId` - Arkadaşlığı kaldır (Auth gerekli)

## Socket.IO Chat

Socket.IO üzerinden real-time chat implementasyonu. Sadece arkadaşlar arasında mesajlaşma yapılabilir.

### Connection

```javascript
const socket = io('http://localhost:3000', {
  auth: {
    token: 'YOUR_JWT_TOKEN'
  }
});
```

### Events

**Client → Server:**

- `send_message` - Mesaj gönder
  - Data: `{ receiverId, message }`
  
- `get_messages` - Mesaj geçmişini getir
  - Data: `{ friendId, limit?, offset? }`
  
- `typing_start` - Yazıyor göstergesi başlat
  - Data: `{ receiverId }`
  
- `typing_stop` - Yazıyor göstergesi durdur
  - Data: `{ receiverId }`

**Server → Client:**

- `connected` - Bağlantı başarılı
- `receive_message` - Yeni mesaj alındı
- `message_sent` - Mesaj gönderildi onayı
- `messages_history` - Mesaj geçmişi
- `friend_status_change` - Arkadaş online/offline durumu
- `user_typing` - Kullanıcı yazıyor
- `user_stopped_typing` - Kullanıcı yazmayı durdurdu
- `error` - Hata mesajı

## Draft Merge Algoritması

Draft merge işlemi şu koşullara göre yapılır:

1. **Timestamp farkı ≤ 5 dakika** - İki draft'ın timestamp'i arasında en fazla 5 dakika fark olmalı
2. **Aynı mod** - Mode değeri aynı olmalı
3. **Aynı skor** - score1 ve score2 değerleri aynı olmalı
4. **%50+ oyuncu overlap** - Oyuncu listelerinin en az %50'si örtüşmeli

Merge işlemi otomatik olarak OCR endpoint'i çağrıldığında yapılır.

## Database Schema

### Users
- id, email, username, password_hash, created_at, updated_at

### Drafts
- id, mode, team1_name, team2_name, score1, score2, players (JSON), image_url, uploader_id, timestamp, status (pending/merged/approved/rejected), merged_with, created_at, updated_at

### Matches
- id, mode, team1_name, team2_name, score1, score2, players (JSON), image_url, uploader_id, draft_id, match_date, created_at, updated_at

### Friends
- id, user_id, friend_id, status (pending/accepted/blocked), created_at, updated_at

### Chat Messages
- id, sender_id, receiver_id, message, created_at

## Özellikler

✅ JWT Authentication (email + username ile giriş)
✅ Draft sistemi (OCR sonucu ile otomatik oluşturma)
✅ Draft merge algoritması
✅ Draft onaylama → Match'e dönüştürme
✅ Friends sistemi (ekleme, kabul/reddetme)
✅ Real-time chat (Socket.IO, sadece arkadaşlar arası)
✅ Match istatistikleri
✅ RESTful API endpoints

## Notlar

- Cloudinary sadece image URL'leri saklamak için kullanılıyor, image upload işlemi frontend tarafında yapılmalı
- PlanetScale MySQL uyumlu schema kullanıldı
- Tüm mesajlaşmalar sadece arkadaşlar arasında yapılabilir
- Draft merge işlemi otomatik olarak yapılır

