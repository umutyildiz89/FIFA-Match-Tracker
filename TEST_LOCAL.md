# Local Çalıştırma - Test Rehberi

## ✅ ŞU ANDA ÇALIŞTIRILABILIR MI?

**EVET! 🎯** Database olmadan da çalıştırılabilir (sınırlı).

---

## 🚀 Hızlı Test

### ✅ Hazır Olanlar:
- ✅ Backend bağımlılıkları yüklendi
- ✅ Frontend bağımlılıkları yüklendi
- ✅ .env dosyası oluşturuldu
- ✅ Database bağlantısı opsiyonel hale getirildi

---

## 📋 Çalıştırma Adımları

### 1. Backend'i Başlat

**Terminal 1:**
```bash
cd C:\Users\umut\Desktop\TODOGAME
npm run dev
```

**Beklenen:**
- ✅ Server başlar: `http://localhost:3000`
- ⚠️ Database bağlantı hatası görünebilir (normal, database yok)
- ✅ Health check çalışır: `http://localhost:3000/health`

**Test:**
- Tarayıcıda aç: `http://localhost:3000/health`
- Beklenen: `{"status":"OK","message":"Server is running"}`

---

### 2. Frontend'i Başlat

**Terminal 2 (Yeni Terminal):**
```bash
cd C:\Users\umut\Desktop\TODOGAME\frontend
npm run dev
```

**Beklenen:**
- ✅ Frontend başlar: `http://localhost:5173`
- ✅ Login sayfası görüntülenir
- ✅ Routing çalışır
- ⚠️ API çağrıları hata verecektir (database yok, normal)

**Test:**
- Tarayıcıda aç: `http://localhost:5173`
- Login/Register sayfalarını görüntüle
- Sayfalar arası geçiş test et (Dashboard, Friends, Drafts)

---

## ✅ ÇALIŞAN ÖZELLİKLER (Database Olmadan)

1. ✅ **Backend Server** - Başlar ve çalışır
2. ✅ **Health Check Endpoint** - `/health` çalışır
3. ✅ **Frontend UI** - Tüm sayfalar görüntülenir:
   - Login sayfası
   - Register sayfası
   - Dashboard (layout, navigation)
   - Friends sayfası (UI)
   - Drafts sayfası (UI)
   - Match Detail sayfası (UI)
   - Chat Panel (UI, aç/kapa)
4. ✅ **Routing** - React Router çalışır
5. ✅ **Navigation** - Menü geçişleri çalışır
6. ✅ **Responsive Design** - Mobile/tablet/desktop test edilebilir
7. ✅ **Socket.IO Server** - Backend'de başlar (mesaj saklanamaz ama bağlantı test edilebilir)

---

## ❌ ÇALIŞMAYAN ÖZELLİKLER (Database Gerekiyor)

1. ❌ **Kullanıcı Kaydı** - API hata verir (database gerekiyor)
2. ❌ **Kullanıcı Girişi** - API hata verir (database gerekiyor)
3. ❌ **Match Listesi** - API hata verir (database gerekiyor)
4. ❌ **Draft Listesi** - API hata verir (database gerekiyor)
5. ❌ **Friends Listesi** - API hata verir (database gerekiyor)
6. ❌ **Chat Mesajlaşma** - Database gerekiyor (mesaj saklanamaz)
7. ❌ **Image Upload** - Backend API gerekiyor (database)

---

## 🎯 Test Senaryoları

### Senaryo 1: UI Test (Database Olmadan)

**Yapabilecekleriniz:**
```bash
# 1. Backend başlat
npm run dev

# 2. Frontend başlat (yeni terminal)
cd frontend
npm run dev

# 3. Tarayıcıda test et:
- ✅ Login sayfası: http://localhost:5173/login
- ✅ Register sayfası: http://localhost:5173/register
- ✅ Routing: Sayfalar arası geçiş
- ✅ Navigation: Menü butonları
- ✅ Responsive: Tarayıcıyı küçült/büyüt
- ✅ Chat Panel: Chat butonuna tıkla, panel aç/kapa
- ✅ Form validation: Input alanları, butonlar
```

**Yapamayacaklarınız:**
- ❌ Gerçek kullanıcı kaydı/girişi
- ❌ API çağrıları (database gerekiyor)
- ❌ Veri görüntüleme (database gerekiyor)

---

### Senaryo 2: Tam Test (Database ile)

**Gereksinimler:**
1. Local MySQL (XAMPP/WAMP) veya PlanetScale
2. Database oluştur
3. Schema uygula
4. `.env` dosyasında database bilgilerini ayarla

**Sonra:**
- ✅ Tüm özellikler çalışır
- ✅ Kullanıcı kaydı/girişi
- ✅ Match/Draft işlemleri
- ✅ Chat
- ✅ Friends sistemi

---

## 💡 Şu Anda Test Edebilecekleriniz

1. **Frontend UI Test:**
   - ✅ Tüm sayfaların görünümü
   - ✅ Routing ve navigation
   - ✅ Responsive design
   - ✅ Form validasyonu
   - ✅ Loading states
   - ✅ Error handling UI

2. **Backend Server Test:**
   - ✅ Server başlatma
   - ✅ Health check endpoint
   - ✅ CORS ayarları
   - ✅ Socket.IO bağlantısı (UI'den)

3. **Integration Test (Kısmi):**
   - ✅ Frontend ↔ Backend bağlantısı (health check)
   - ✅ Socket.IO bağlantısı (UI'den)
   - ❌ API endpoint'leri (database gerekiyor)

---

## 🎯 Şimdi Ne Yapalım?

**Seçenek 1: UI Test (Hemen, Database Olmadan)**
```bash
# Terminal 1: Backend
npm run dev

# Terminal 2: Frontend  
cd frontend && npm run dev

# Tarayıcı: http://localhost:5173
# Test: UI, routing, responsive
```

**Seçenek 2: Tam Test (Database Kurulumu Gerekli)**
- XAMPP/WAMP MySQL kur
- Database oluştur
- Schema uygula
- `.env` ayarla
- Tekrar başlat

---

## 🚀 Önerim

**Şimdi test edelim!** 

1. Backend'i başlat (`npm run dev`)
2. Frontend'i başlat (`cd frontend && npm run dev`)
3. Tarayıcıda aç: `http://localhost:5173`
4. UI ve routing'i test et

**Sonra:** Database kur ve tam test yap

---

## ✅ Hazır!

**EVET, local'de çalıştırılabilir! 🎉**

- ✅ Backend bağımlılıkları yüklü
- ✅ Frontend bağımlılıkları yüklü
- ✅ .env dosyası oluşturuldu
- ✅ Database opsiyonel (olmadan da başlar)

**Test için hazır!** 🚀

