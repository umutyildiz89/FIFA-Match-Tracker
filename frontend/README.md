# FIFA Match Tracker - Frontend

React + Vite ile geliştirilmiş FIFA Match Tracker frontend uygulaması.

## Teknoloji Stack

- **React 18** - UI library
- **Vite** - Build tool
- **React Router v6** - Routing
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time chat

## Kurulum

```bash
cd frontend
npm install
```

## Development

```bash
npm run dev
```

Frontend `http://localhost:5173` adresinde çalışacak.

## Build

```bash
npm run build
```

Build dosyaları `dist` klasörüne oluşturulacak.

## Preview

```bash
npm run preview
```

Production build'i preview modda test eder.

## Environment Variables

`.env` dosyası oluşturun:

```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
VITE_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
```

## Proje Yapısı

```
frontend/
├── src/
│   ├── components/      # Reusable components
│   │   ├── Layout.jsx
│   │   └── ProtectedRoute.jsx
│   ├── contexts/        # React contexts
│   │   └── AuthContext.jsx
│   ├── pages/           # Page components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Dashboard.jsx
│   ├── services/        # API services
│   │   └── api.js
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── public/              # Static files
├── package.json
├── vite.config.js
└── index.html
```

## Özellikler

✅ React + Vite setup
✅ React Router v6 routing
✅ Authentication (Login/Register)
✅ Protected routes
✅ API client service (Axios)
✅ Token management (localStorage)
✅ Base layout & navigation
✅ Responsive CSS
✅ Dashboard (basic)

## Backend Bağlantısı

Backend API `http://localhost:3000` adresinde çalışmalıdır.

Vite config'de proxy ayarları yapılmıştır, development'ta `/api` istekleri otomatik olarak backend'e yönlendirilir.

## Sonraki Adımlar

- [ ] Image upload komponenti (Cloudinary)
- [ ] Match detay sayfası
- [ ] Friends sayfası
- [ ] Chat panel komponenti
- [ ] Match istatistikleri görselleştirme
