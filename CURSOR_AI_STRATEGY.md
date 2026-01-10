# Cursor AI Ajan Stratejisi - FIFA Match Tracker

**Tarih:** 2026-01-10  
**Hedef:** En sağlam ve verimli şekilde MVP'yi tamamlamak

---

## 🎯 Önerilen Ajan Yapısı

### Strateji 1: **4 Ajan Yaklaşımı** (Önerilen) ⭐

#### **Ajan 1: Backend Finalization Ajanı** ✅ (Tamamlandı)
- **Durum:** ✅ Zaten yapıldı
- **Görevler:** 
  - Database bağlantı testi
  - Environment variables setup
  - API endpoint testleri
  - Bug fixes
- **Süre:** 1-2 saat
- **Öncelik:** 🟢 Düşük (zaten hazır)

---

#### **Ajan 2: Frontend Core Ajanı** 🔴 (Sıradaki - Kritik)
- **Durum:** ❌ Yapılacak
- **Görevler:**
  - React + Vite projesi kurulumu
  - Routing setup (React Router)
  - Authentication pages (Login, Register)
  - API client service (axios)
  - Token management (localStorage)
  - Protected routes wrapper
  - Base layout & navigation
  - Environment variables config
- **Süre:** 1-2 gün
- **Öncelik:** 🔴 YÜKSEK - Tüm frontend'in temeli
- **Deliverables:**
  ```
  frontend/
  ├── src/
  │   ├── App.jsx
  │   ├── main.jsx
  │   ├── router.jsx
  │   ├── pages/
  │   │   ├── Login.jsx
  │   │   ├── Register.jsx
  │   │   └── Dashboard.jsx (boş template)
  │   ├── components/
  │   │   ├── ProtectedRoute.jsx
  │   │   └── Layout.jsx
  │   ├── services/
  │   │   └── api.js
  │   └── utils/
  │       └── auth.js
  ├── package.json
  └── vite.config.js
  ```

---

#### **Ajan 3: Frontend Features Ajanı** 🟡 (İkinci Sıra)
- **Durum:** ❌ Yapılacak
- **Görevler:**
  - Dashboard ana sayfa (match listesi)
  - Image upload komponenti (Cloudinary)
  - Draft listesi ve onaylama sayfası
  - Match detay sayfası
  - Match istatistikleri komponenti
  - Friends sayfası (list, add, accept)
  - Responsive CSS/styling
- **Süre:** 1-2 gün
- **Öncelik:** 🟡 ORTA - Frontend Core'dan sonra
- **Deliverables:**
  ```
  frontend/src/
  ├── pages/
  │   ├── Dashboard.jsx (tamamlanmış)
  │   ├── Matches.jsx
  │   ├── Drafts.jsx
  │   ├── Friends.jsx
  │   └── Profile.jsx
  ├── components/
  │   ├── ImageUpload.jsx (Cloudinary)
  │   ├── MatchCard.jsx
  │   ├── DraftCard.jsx
  │   ├── FriendCard.jsx
  │   ├── StatsPanel.jsx
  │   └── Navigation.jsx
  └── styles/
      └── App.css
  ```

---

#### **Ajan 4: Frontend Chat Ajanı** 🟡 (Üçüncü Sıra)
- **Durum:** ❌ Yapılacak
- **Görevler:**
  - Socket.IO client setup
  - Chat panel komponenti
  - Message list ve input
  - Typing indicator
  - Online/offline status
  - Friend list ile chat başlatma
  - Chat history
- **Süre:** 0.5-1 gün
- **Öncelik:** 🟡 ORTA - Features'dan sonra
- **Deliverables:**
  ```
  frontend/src/
  ├── components/
  │   ├── ChatPanel.jsx
  │   ├── ChatMessage.jsx
  │   ├── ChatInput.jsx
  │   └── ChatFriendList.jsx
  ├── hooks/
  │   └── useSocket.js
  └── services/
      └── socket.js
  ```

---

#### **Ajan 5: Deploy & Integration Ajanı** 🔵 (Son Adım)
- **Durum:** ❌ Yapılacak
- **Görevler:**
  - PlanetScale database setup
  - Backend environment variables (Render.com)
  - Frontend environment variables (Netlify)
  - OCR servisini backend'e entegre etme
  - Build script'leri
  - Deploy configuration
  - Production testing
  - Health checks
- **Süre:** 3-4 saat
- **Öncelik:** 🔵 Son - Tüm feature'lar hazır olduktan sonra
- **Deliverables:**
  - `render.yaml` veya Render config
  - `netlify.toml`
  - `.env.example` dosyaları
  - Deploy guide

---

## 📊 Ajan İş Bölümü Detayı

### **Toplam: 4-5 Ajan**

| Ajan | Durum | Süre | Bağımlılık | Öncelik |
|------|-------|------|------------|---------|
| Backend Finalization | ✅ | 1-2h | Yok | 🟢 Düşük |
| Frontend Core | ❌ | 1-2gün | Yok | 🔴 Yüksek |
| Frontend Features | ❌ | 1-2gün | Frontend Core | 🟡 Orta |
| Frontend Chat | ❌ | 0.5-1gün | Frontend Core | 🟡 Orta |
| Deploy & Integration | ❌ | 3-4h | Tümü | 🔵 Son |

---

## 🎯 Alternatif Stratejiler

### Strateji 2: **2 Büyük Ajan** (Daha Hızlı ama Riskli)

#### **Ajan 1: Frontend Full Stack**
- Tüm frontend (Core + Features + Chat)
- Süre: 2-3 gün
- Risk: Çok büyük görev, karmaşık olabilir

#### **Ajan 2: Deploy & Integration**
- Database + Deploy + Testing
- Süre: 4-5 saat
- Risk: Düşük

**Toplam: 2 Ajan, 2-3 gün**

---

### Strateji 3: **6 Küçük Ajan** (Çok Detaylı)

1. Backend Finalization (1-2h)
2. Frontend Setup (0.5gün)
3. Frontend Auth (0.5gün)
4. Frontend Dashboard (1gün)
5. Frontend Chat (1gün)
6. Deploy (3-4h)

**Toplam: 6 Ajan, 3-4 gün**

---

## ⭐ ÖNERİLEN: 4-5 Ajan Stratejisi

### Neden Bu Strateji?

✅ **En Dengeli:**
- Her ajan makul büyüklükte görev alıyor
- Birbirine bağımlılık mantıklı
- Hata riski düşük

✅ **Modüler:**
- Her ajan bağımsız test edilebilir
- Her aşamada çalışır durumda kod
- Rollback kolay

✅ **Verimli:**
- Paralel çalışma imkanı (Core'dan sonra Features ve Chat)
- Her ajan odaklı çalışır
- Timeboxing kolay

---

## 📋 Ajan Çalıştırma Sırası

### **Faz 1: Hazırlık** (1-2 saat)
```
Ajan 1: Backend Finalization
  → Database bağlantı testi
  → Environment setup
  → API testleri
```

### **Faz 2: Frontend Temeli** (1-2 gün)
```
Ajan 2: Frontend Core
  → React + Vite setup
  → Routing + Auth
  → Base structure
```

### **Faz 3: Frontend Özellikler** (1-2 gün)
```
Ajan 3: Frontend Features (Ajan 2'den sonra)
  → Dashboard
  → Image upload
  → Match pages
  → Friends pages

Ajan 4: Frontend Chat (Ajan 2'den sonra, Ajan 3 ile paralel olabilir)
  → Socket.IO client
  → Chat panel
  → Real-time messaging
```

### **Faz 4: Production** (3-4 saat)
```
Ajan 5: Deploy & Integration
  → PlanetScale setup
  → Render.com deploy
  → Netlify deploy
  → End-to-end testing
```

---

## 🎯 Her Ajan İçin Prompt Örnekleri

### **Ajan 2: Frontend Core Prompt Örneği**

```
Sen bir senior React frontend mühendisisin.

Görev:
FIFA Match Tracker için React + Vite frontend'in temel yapısını oluştur.

Gereksinimler:
1. React + Vite projesi kur (TypeScript değil, JavaScript)
2. React Router v6 ile routing setup
3. Authentication sayfaları (Login, Register)
4. Protected routes wrapper
5. Axios API client service (backend: http://localhost:3000)
6. JWT token management (localStorage)
7. Base layout ve navigation
8. Environment variables (.env)
9. Responsive base CSS

Backend API:
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/profile (Bearer token)

Kod yapısı:
- Clean code principles
- Modüler component yapısı
- Error handling
- Loading states

Sadece frontend klasörü içinde çalış. Backend'e dokunma.
```

### **Ajan 3: Frontend Features Prompt Örneği**

```
Sen bir senior React frontend mühendisisin.

Görev:
FIFA Match Tracker frontend'ine özellikleri ekle.

Mevcut:
- React + Vite projesi hazır
- Auth sayfaları hazır
- Routing hazır
- API client hazır

Yapılacaklar:
1. Dashboard ana sayfa (match listesi)
2. Cloudinary image upload komponenti
3. Draft listesi ve onaylama sayfası
4. Match detay ve istatistikleri
5. Friends sayfası (ekle, kabul, reddet)
6. Responsive styling (modern UI)

Backend API Endpoints (zaten hazır):
- GET /api/matches
- GET /api/drafts
- POST /api/drafts/:id/approve
- POST /api/friends/request
- GET /api/friends/list

UI/UX:
- Modern, temiz tasarım
- Mobile-first responsive
- Loading ve error states
- User feedback messages
```

### **Ajan 4: Frontend Chat Prompt Örneği**

```
Sen bir senior React frontend mühendisisin.

Görev:
FIFA Match Tracker'e real-time chat özelliği ekle.

Mevcut:
- Frontend Core hazır
- Socket.IO backend hazır (localhost:3000)

Yapılacaklar:
1. Socket.IO client setup (socket.io-client)
2. Chat panel komponenti (sidebar veya modal)
3. Message list ve input
4. Typing indicator
5. Online/offline status gösterimi
6. Friend list ile chat başlatma
7. Chat history yükleme

Socket.IO Events:
- connect, disconnect
- send_message, receive_message
- typing_start, typing_stop
- get_messages, messages_history
- friend_status_change

UI:
- Modern chat UI (WhatsApp/Discord benzeri)
- Responsive
- Smooth scrolling
- Message timestamps
```

### **Ajan 5: Deploy Prompt Örneği**

```
Sen bir DevOps mühendisisin.

Görev:
FIFA Match Tracker'i production'a deploy et.

Backend (Render.com):
- Node.js Express server
- Environment variables setup
- OCR servisini entegre et (Render'da çalıştır)
- Health check endpoint var (/health)

Frontend (Netlify):
- React + Vite build
- Environment variables
- SPA routing config

Database (PlanetScale):
- Schema dosyası hazır (database/schema.sql)
- MySQL bağlantısı

Adımlar:
1. PlanetScale database oluştur ve schema uygula
2. Backend .env dosyasını ayarla
3. Render.com'da web service oluştur
4. Frontend .env dosyasını ayarla
5. Netlify'da site oluştur
6. Build ve deploy
7. End-to-end test

Deliverables:
- Deploy guide
- Environment variables listesi
- Production checklist
```

---

## 📊 Süre Tahmini (4-5 Ajan Stratejisi)

| Faz | Ajan | Süre | Toplam |
|-----|------|------|--------|
| Hazırlık | Backend Finalization | 1-2h | 1-2h |
| Frontend Temeli | Frontend Core | 1-2 gün | 1-2 gün |
| Frontend Özellikler | Frontend Features | 1-2 gün | 1-2 gün |
| Frontend Özellikler | Frontend Chat | 0.5-1 gün | (paralel olabilir) |
| Production | Deploy & Integration | 3-4h | 3-4h |
| **TOPLAM** | | | **3-4 gün** |

---

## ✅ Final Öneri

**En Sağlam Yaklaşım: 4-5 Ajan**

1. ✅ **Backend Finalization** (1-2h) - Zaten %95 hazır
2. 🔴 **Frontend Core** (1-2 gün) - En kritik, ilk yapılmalı
3. 🟡 **Frontend Features** (1-2 gün) - Core'dan sonra
4. 🟡 **Frontend Chat** (0.5-1 gün) - Core'dan sonra (Features ile paralel)
5. 🔵 **Deploy & Integration** (3-4h) - Son adım

**Toplam: 4-5 ajan ile 3-4 günde MVP hazır!**

Bu strateji ile:
- ✅ Her aşama test edilebilir
- ✅ Her aşamada çalışır durumda kod
- ✅ Hata riski minimize
- ✅ Modüler yapı
- ✅ En verimli süre kullanımı

