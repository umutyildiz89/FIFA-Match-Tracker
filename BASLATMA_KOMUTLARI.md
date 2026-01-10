# 🚀 Başlatma Komutları - Tam Yol

## Terminal 1: Backend Başlatma

```powershell
# Ana dizine git
cd C:\Users\umut\Desktop\TODOGAME

# Backend'i başlat (development mode - otomatik restart)
npm run dev
```

**Alternatif (production mode):**
```powershell
cd C:\Users\umut\Desktop\TODOGAME
npm start
```

**Beklenen:**
- ✅ Server `http://localhost:3000` adresinde başlar
- ✅ Health check: `http://localhost:3000/health`
- ⚠️ Database bağlantı hatası görünebilir (normal, database yok)

---

## Terminal 2: Frontend Başlatma

```powershell
# Frontend dizinine git
cd C:\Users\umut\Desktop\TODOGAME\frontend

# Frontend'i başlat
npm run dev
```

**Beklenen:**
- ✅ Frontend `http://localhost:5173` adresinde başlar
- ✅ Tarayıcıda otomatik açılır (veya manuel aç)

---

## Tek Satırda (Her Terminal İçin)

### Backend:
```powershell
cd C:\Users\umut\Desktop\TODOGAME; npm run dev
```

### Frontend:
```powershell
cd C:\Users\umut\Desktop\TODOGAME\frontend; npm run dev
```

---

## Test Etme

### Backend Test:
Tarayıcıda aç: `http://localhost:3000/health`

**Beklenen Response:**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

### Frontend Test:
Tarayıcıda aç: `http://localhost:5173`

**Beklenen:**
- Login sayfası görüntülenir
- Routing çalışır
- Navigation çalışır

---

## Durduğunda

### Backend'i Durdurma:
`Ctrl + C` (Terminal 1'de)

### Frontend'i Durdurma:
`Ctrl + C` (Terminal 2'de)

---

## Sorun Giderme

### Backend başlamıyor:
```powershell
# Port kullanımda mı kontrol et
netstat -ano | findstr :3000

# Eğer kullanımdaysa, process'i durdur veya port'u değiştir
# .env dosyasında PORT=3001 gibi
```

### Frontend başlamıyor:
```powershell
# Port kullanımda mı kontrol et
netstat -ano | findstr :5173

# Bağımlılıklar yüklü mü kontrol et
cd C:\Users\umut\Desktop\TODOGAME\frontend
npm install
```

### Database hatası görünüyor:
**Normal!** Database yok, sadece uyarı verir. Server yine de çalışır.

---

## Hızlı Kopyala-Yapıştır

### Terminal 1 (Backend):
```
cd C:\Users\umut\Desktop\TODOGAME
npm run dev
```

### Terminal 2 (Frontend):
```
cd C:\Users\umut\Desktop\TODOGAME\frontend
npm run dev
```

