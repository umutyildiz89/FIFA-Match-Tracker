# 📸 CLOUDINARY KURULUM REHBERİ

## 🎯 NE İÇİN GEREKLI?

**FIFA/EA FC maç ekran görüntülerini yüklemek ve OCR ile otomatik veri çıkarmak için Cloudinary gerekli!**

---

## 🔍 SİSTEM NASIL ÇALIŞIYOR?

### 1. **Görsel Yükleme** (Frontend)
- Kullanıcı maç ekran görüntüsünü seçer
- Görsel Cloudinary'e yüklenir
- Cloudinary URL'i alınır

### 2. **OCR İşlemi** (Backend)
- Cloudinary URL'den görsel indirilir
- OCR ile görselden text çıkarılır (skor, takım isimleri, oyuncular)
- Text parse edilir (ayrıştırılır)

### 3. **Draft Oluşturma** (Backend)
- Parse edilen veriler draft olarak database'e kaydedilir
- Kullanıcı draft'ı onaylar/reddeder
- Onaylanan draft match olur

---

## 📋 CLOUDINARY KURULUM ADIMLARI

### Adım 1: Cloudinary Hesabı Oluştur

1. **https://cloudinary.com** → **"Sign Up"** (Ücretsiz!)
2. Email ile kayıt ol
3. Email doğrulama yap
4. Dashboard'a git

---

### Adım 2: Cloud Name ve API Keys Al

1. **Dashboard'da** → **"Settings"** (⚙️) → **"Access Keys"**
2. Şunları kopyala:
   - **Cloud Name** (örn: `dxyz123abc`)
   - **API Key** (örn: `123456789012345`)
   - **API Secret** (örn: `abcdefghijklmnopqrstuvwxyz123456`)

---

### Adım 3: Upload Preset Oluştur (Unsigned Upload İçin)

1. **Dashboard'da** → **"Settings"** → **"Upload"**
2. **"Add upload preset"** butonuna tıkla
3. **Preset name:** `fifa-match-tracker` (veya istediğin isim)
4. **Signing mode:** **"Unsigned"** seç (önemli!)
5. **"Save"** tıkla

**Not:** Unsigned preset frontend'den direkt yükleme için gerekli!

---

### Adım 4: Railway'de Environment Variables Ekle

#### Frontend Service:

1. **Railway.app** → **Frontend service** → **"Variables"**
2. Şu değişkenleri ekle:
   - **Key:** `VITE_CLOUDINARY_CLOUD_NAME`
     **Value:** Cloud Name (örn: `dxyz123abc`)
   - **Key:** `VITE_CLOUDINARY_UPLOAD_PRESET`
     **Value:** Preset name (örn: `fifa-match-tracker`)

#### Backend Service:

1. **Railway.app** → **Backend service** → **"Variables"**
2. Şu değişkenleri ekle:
   - **Key:** `CLOUDINARY_CLOUD_NAME`
     **Value:** Cloud Name (örn: `dxyz123abc`)
   - **Key:** `CLOUDINARY_API_KEY`
     **Value:** API Key (örn: `123456789012345`)
   - **Key:** `CLOUDINARY_API_SECRET`
     **Value:** API Secret (örn: `abcdefghijklmnopqrstuvwxyz123456`)

---

### Adım 5: Redeploy

1. **Frontend service** → **"Deployments"** → **"Redeploy"**
2. **Backend service** → **"Deployments"** → **"Redeploy"**
3. Deploy tamamlanmasını bekle (1-2 dakika)

---

## ✅ TEST

1. **Frontend URL'ini aç:** `https://frontend-production-8b94.up.railway.app`
2. **Login yap**
3. **Drafts sayfasına git**
4. **"📸 Maç Fotoğrafı Yükle"** bölümüne görsel sürükle/bırak
5. **"📤 Yükle ve OCR İşle"** butonuna tıkla
6. Görsel yüklenmeli!

---

## ⚠️ ÖNEMLİ NOTLAR

### Unsigned Upload Preset Neden Gerekli?

- Frontend'den direkt Cloudinary'e yükleme için gerekli
- Signed preset backend'den yükleme için kullanılır
- Bizim sistemimiz frontend'den yükleyip backend'e URL gönderiyor

### Güvenlik:

- **API Secret** sadece backend'de olmalı, frontend'de ASLA!
- Frontend sadece `cloud_name` ve `upload_preset` kullanır
- Unsigned preset'te dosya boyutu ve format kısıtlamaları ekleyebilirsin

---

## 🔧 SORUN ÇÖZME

### "Cloudinary cloud name yapılandırılmamış" Hatası:

1. Railway → Frontend service → Variables kontrol et
2. `VITE_CLOUDINARY_CLOUD_NAME` var mı?
3. Redeploy yap

### Upload Başarısız:

1. Upload preset'in **"Unsigned"** olduğundan emin ol
2. Preset name doğru mu kontrol et
3. Cloudinary dashboard'da kullanım limiti var mı kontrol et (free tier)

### Görsel Yükleniyor Ama OCR Çalışmıyor:

- OCR backend'de çalışıyor, backend loglarını kontrol et
- OCR servisi henüz entegre edilmediyse manuel draft oluştur

---

**Cloudinary kurulumunu tamamladın mı? Sorun olursa haber ver! 🚀**

