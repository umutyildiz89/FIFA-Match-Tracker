# LocalStorage Temizlik ve Test Rehberi

## 🚨 SORUN: `/` Adresine Gidince Direkt `/login`'e Yönleniyor

## ✅ ÇÖZÜM ADIMLARI

### 1. Browser Console'u Aç (F12)

**ÖNEMLİ:** Console'da debug loglarını göreceksin. Bunları paylaş!

### 2. LocalStorage'ı Temizle (Console'da)

```javascript
// F12 → Console → Şunu yaz ve Enter'a bas:
localStorage.clear()
sessionStorage.clear()
console.log('✅ LocalStorage temizlendi')
```

**VEYA Manuel Temizlik:**
- Browser → `F12` → `Application` tab → `Local Storage` → `http://localhost:5173` → `Clear All`
- `Session Storage` → `http://localhost:5173` → `Clear All`
- `Cookies` → `http://localhost:5173` → `Clear All`

### 3. Sayfayı Yenile (Hard Refresh)

**Windows/Linux:**
- `Ctrl + Shift + R` veya
- `Ctrl + F5`

**Mac:**
- `Cmd + Shift + R`

### 4. Test Et

```
http://localhost:5173/
```

**Console'da Şunları Görmelisin:**
```
🔍 ProtectedRoute DEBUG: { ... }
✅ ProtectedRoute: Mock user bulundu veya development mode, direkt geçiliyor
```

**Eğer Şunu Görürsen:**
```
❌ ProtectedRoute: Mock user yok, authenticated kontrolü yapılıyor
🚫 ProtectedRoute: Authenticated değil, login'e yönlendiriliyor
```

**Bu durumda:**
- `isDevMode` false olabilir
- localStorage'da eski bir token olabilir
- Development mode düzgün algılanmıyor olabilir

---

## 🔍 DEBUG KONTROLÜ

### Console'da Kontrol Et:

```javascript
// 1. Development mode kontrolü
console.log('MODE:', import.meta.env.MODE)
console.log('DEV:', import.meta.env.DEV)

// 2. LocalStorage kontrolü
console.log('Token:', localStorage.getItem('token'))

// 3. Mock user kontrolü
console.log('Mock token var mı?', localStorage.getItem('token') === 'mock-token')
```

### Beklenen Değerler:

**Development Mode'da:**
- `MODE: "development"` veya `"development"` içermeli
- `DEV: true` olmalı (Vite'da)
- `Token: "mock-token"` olmalı (localStorage temizlendikten sonra)

---

## 🛠️ MANUEL DÜZELTME (Eğer Hala Sorun Varsa)

### Console'da Şunu Çalıştır:

```javascript
// Development mode'u zorla aktif et
localStorage.setItem('token', 'mock-token')
location.reload()
```

**VEYA:**

```javascript
// Tüm local storage'ı temizle ve mock token set et
localStorage.clear()
sessionStorage.clear()
localStorage.setItem('token', 'mock-token')
console.log('✅ Mock token set edildi:', localStorage.getItem('token'))
location.reload()
```

---

## 📝 SORUN DEVAM EDERSE

**Şunları Paylaş:**

1. **Console Logları:**
   - `🔍 ProtectedRoute DEBUG:` logunu paylaş
   - `✅` veya `❌` loglarını paylaş

2. **Development Mode Kontrolü:**
   ```javascript
   console.log('MODE:', import.meta.env.MODE)
   console.log('DEV:', import.meta.env.DEV)
   console.log('VITE_DEV_MODE:', import.meta.env.VITE_DEV_MODE)
   ```

3. **LocalStorage İçeriği:**
   ```javascript
   console.log('Token:', localStorage.getItem('token'))
   console.log('Tüm localStorage:', { ...localStorage })
   ```

---

## ✅ BAŞARILI TEST

**Şunları Görmelisin:**

1. ✅ `http://localhost:5173/` açıldığında
2. ✅ Console'da: `✅ ProtectedRoute: Mock user bulundu veya development mode, direkt geçiliyor`
3. ✅ Dashboard görünür
4. ✅ Login sayfasına YÖNLENDİRİLMEZ

---

## 🎯 HIZLI ÇÖZÜM

**Tek Komut (Console'da):**

```javascript
localStorage.clear(); sessionStorage.clear(); localStorage.setItem('token', 'mock-token'); location.reload()
```

Bu komut:
1. LocalStorage'ı temizler
2. Mock token set eder
3. Sayfayı yeniler

**Sonuç:** Dashboard görünmeli! ✅

