# 🚂 RAILWAY CLI KURULUM VE KULLANIM

## ⚠️ NOT: Web Arayüzü Daha Kolay!

Railway CLI interaktif komutlar gerektiriyor. **Web arayüzü (Railway.app) kullanmanı öneririm!**

---

## 🌐 WEB ARAYÜZÜ İLE DEVAM ET (ÖNERİLEN)

1. **Railway.app'e git:** https://railway.app/
2. **Projene git**
3. **"+ New"** → **"GitHub Repo"** → Repo'nu seç
4. **Backend service oluşturuldu!**

**Çok daha kolay! ✅**

---

## 🔧 CLI İLE DEVAM ETMEK İSTERSEN

### Token ile Login (Non-Interactive)

1. **Railway.app** → **Account Settings** → **Tokens**
2. **"New Token"** oluştur
3. **Token'ı kopyala**

Sonra terminal'de:
```powershell
$env:RAILWAY_TOKEN="your-token-here"
npx @railway/cli whoami
```

---

## 📋 CLI KOMUTLARI (Referans)

```powershell
# Login (tarayıcı açılır)
npx @railway/cli login

# Proje oluştur
npx @railway/cli init

# Service ekle
npx @railway/cli add

# Deploy
npx @railway/cli up

# Logs
npx @railway/cli logs
```

---

**Öneri: Web arayüzü kullan! Daha kolay ve hızlı! 🚀**

