# Backend Kod İnceleme Özeti

FIFA/EA FC Match Tracker Backend - Kod Analizi Raporu

---

## 1. OCR Draft Creation Endpoint

**Konum:** `routes/drafts.js` - Satır 15

**Endpoint:**
```
POST /api/drafts/ocr
```

**Controller:** `controllers/draftController.js` - `createDraftFromOCR` (Satır 5-75)

**Özellikler:**
- ✅ JWT authentication gerekli (`router.use(authenticate)` - Satır 13)
- ✅ Body parametreleri: `{ mode, team1_name, team2_name, score1, score2, players[], imageUrl? }`
- ✅ Validasyon: Mode, takım adları, skorlar ve oyuncu listesi zorunlu
- ✅ Otomatik merge kontrolü: Draft oluşturulduktan sonra `checkAndMergeDrafts()` çağrılıyor (Satır 52)
- ✅ Status: Draft başlangıçta `'pending'` olarak oluşturuluyor

---

## 2. Draft Merge Logic Konumu

**Merge Algoritması:** `utils/draftMerge.js`

**Ana Fonksiyonlar:**
- `canMergeDrafts()` (Satır 47-76) - Birleştirilebilirlik kontrolü
- `mergeDrafts()` (Satır 84-112) - Gerçek birleştirme işlemi
- `calculatePlayerOverlap()` (Satır 7-31) - Oyuncu overlap yüzdesi hesaplama
- `getTimestampDifferenceInMinutes()` (Satır 34-39) - Zaman farkı hesaplama

**Merge Kontrolü Çağrısı:** `controllers/draftController.js` - `checkAndMergeDrafts()` (Satır 78-130)

**Merge Koşulları** (utils/draftMerge.js - canMergeDrafts fonksiyonu):
1. ✅ Timestamp farkı ≤ 5 dakika (Satır 54-56)
2. ✅ Aynı mode (Satır 60-62)
3. ✅ Aynı skor (score1 ve score2) (Satır 65-67)
4. ✅ Oyuncu overlap ≥ %50 (Satır 70-73)

**Merge İşlem Akışı:**
- `createDraftFromOCR` içinde, draft oluşturulduktan sonra çağrılıyor (Satır 52)
- Son 10 dakikadaki aynı mode'daki pending draft'lar kontrol ediliyor (Satır 80-90)
- İlk uygun draft ile merge yapılıyor (Satır 124'te `break`)

---

## 3. JWT Middleware Kullanımı

**Middleware Dosyası:** `middleware/auth.js`

**Fonksiyon:** `authenticate` (Satır 4-47)

**İşleyiş:**
- Authorization header'dan `Bearer <token>` formatında token alıyor (Satır 8-15)
- Token'ı `utils/jwt.js`'deki `verifyToken()` ile doğruluyor (Satır 16)
- Kullanıcıyı veritabanından kontrol ediyor (Satır 26-29)
- `req.user`'a kullanıcı bilgilerini ekliyor (Satır 38)

**Kullanım Yerleri:**

1. **`routes/auth.js`:**
   - `/profile` endpoint'i için (Satır 8)

2. **`routes/drafts.js`:**
   - ✅ Tüm route'lar için (`router.use(authenticate)` - Satır 13)

3. **`routes/matches.js`:**
   - `/stats` endpoint'i için (Satır 13)
   - `/my-matches` endpoint'i için (Satır 14)
   - `/` ve `/:id` endpoint'leri public (Satır 12, 15)

4. **`routes/friends.js`:**
   - ✅ Tüm route'lar için (`router.use(authenticate)` - Satır 14)

5. **`socket/chat.js`:**
   - Socket.IO bağlantısı için custom middleware (Satır 10-42)
   - `auth.token` veya `authorization` header'dan token alıyor

---

## 4. Tüm API Endpoint'leri

### Authentication (`/api/auth`)

| Method | Endpoint | Auth | Açıklama |
|--------|----------|------|----------|
| POST | `/api/auth/register` | ❌ | Kullanıcı kaydı (email, username, password) |
| POST | `/api/auth/login` | ❌ | Giriş (email OR username, password) |
| GET | `/api/auth/profile` | ✅ | Kullanıcı profil bilgileri |

### Drafts (`/api/drafts`)

| Method | Endpoint | Auth | Açıklama |
|--------|----------|------|----------|
| POST | `/api/drafts/ocr` | ✅ | OCR sonucundan draft oluştur (otomatik merge kontrolü) |
| GET | `/api/drafts` | ✅ | Tüm draft'ları listele (query: `status?`, `mode?`) |
| GET | `/api/drafts/:id` | ✅ | Belirli draft detayı |
| POST | `/api/drafts/:id/approve` | ✅ | Draft'ı onayla ve match oluştur |
| POST | `/api/drafts/:id/reject` | ✅ | Draft'ı reddet (status: rejected) |

### Matches (`/api/matches`)

| Method | Endpoint | Auth | Açıklama |
|--------|----------|------|----------|
| GET | `/api/matches` | ❌ | Tüm match'leri listele (query: `mode?`, `userId?`, `startDate?`, `endDate?`) |
| GET | `/api/matches/:id` | ❌ | Belirli match detayı |
| GET | `/api/matches/my-matches` | ✅ | Kullanıcının kendi match'leri |
| GET | `/api/matches/stats` | ✅ | Match istatistikleri (toplam, mod dağılımı, kazanma/kaybetme) |

### Friends (`/api/friends`)

| Method | Endpoint | Auth | Açıklama |
|--------|----------|------|----------|
| POST | `/api/friends/request` | ✅ | Arkadaşlık isteği gönder (body: `friendId`) |
| GET | `/api/friends/pending` | ✅ | Bekleyen arkadaşlık istekleri |
| POST | `/api/friends/accept/:requestId` | ✅ | Arkadaşlık isteğini kabul et |
| POST | `/api/friends/reject/:requestId` | ✅ | Arkadaşlık isteğini reddet |
| GET | `/api/friends/list` | ✅ | Arkadaş listesi |
| DELETE | `/api/friends/:friendId` | ✅ | Arkadaşlığı kaldır |

### Health Check

| Method | Endpoint | Auth | Açıklama |
|--------|----------|------|----------|
| GET | `/health` | ❌ | Server durumu kontrolü |

### Socket.IO Chat Events

**Client → Server:**
- `send_message` - Mesaj gönder (`receiverId`, `message`)
- `get_messages` - Mesaj geçmişi (`friendId`, `limit?`, `offset?`)
- `typing_start` - Yazıyor göstergesi başlat (`receiverId`)
- `typing_stop` - Yazıyor göstergesi durdur (`receiverId`)

**Server → Client:**
- `connected` - Bağlantı başarılı
- `receive_message` - Yeni mesaj alındı
- `message_sent` - Mesaj gönderildi onayı
- `messages_history` - Mesaj geçmişi
- `friend_status_change` - Arkadaş online/offline
- `user_typing` / `user_stopped_typing` - Yazma durumu
- `error` - Hata mesajı

---

## Özet Bulgular

✅ **OCR Draft Endpoint:** `/api/drafts/ocr` - JWT gerekli, otomatik merge çalışıyor
✅ **Merge Logic:** `utils/draftMerge.js` ve `controllers/draftController.js` - Tüm koşullar implement edilmiş
✅ **JWT Middleware:** `middleware/auth.js` - Tüm kritik route'larda kullanılıyor
✅ **Toplam Endpoint:** 17 REST + Socket.IO chat events

**Genel Durum:** 
- Kod yapısı temiz ve mantıklı organize edilmiş
- Tüm özellikler implement edilmiş durumda
- Merge algoritması gereksinimlere uygun
- Authentication doğru şekilde kullanılmış

