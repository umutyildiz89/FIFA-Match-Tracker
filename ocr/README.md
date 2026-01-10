# FIFA/EA FC OCR Service

FIFA/EA FC match ekran fotoğraflarından OCR ile maç bilgilerini çıkaran servis.

## Özellikler

- ✅ Cloudinary URL'den image indirme
- ✅ Image preprocessing (grayscale, contrast, resize)
- ✅ Tesseract.js OCR text extraction
- ✅ Akıllı text parsing (mode, score, teams, players)
- ✅ Backend API'ye otomatik gönderim
- ✅ Best-effort parsing (eksik veri olsa bile çalışır)
- ✅ Graceful error handling

## Kurulum

```bash
cd ocr
npm install
```

## Kullanım

### Modül olarak kullanım

```javascript
import processMatchImage from './index.js';

const result = await processMatchImage(
  'https://res.cloudinary.com/example/image.jpg',
  'JWT_TOKEN_HERE',
  {
    backendUrl: 'http://localhost:3000',
    preprocessOptions: {
      targetWidth: 2000,
      contrast: 1.2
    }
  }
);

console.log(result.matchData);
```

### CLI kullanımı

```bash
node index.js <imageUrl> <jwtToken> [backendUrl]
```

Örnek:
```bash
node index.js https://res.cloudinary.com/example/image.jpg eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Örnek çalıştırma

```bash
npm test
# veya
node example.js
```

## Pipeline

1. **Image Download** - URL'den image'i indir
2. **Preprocessing** - Grayscale, contrast, resize işlemleri
3. **OCR Extraction** - Tesseract.js ile text çıkar
4. **Text Parsing** - Mode, score, teams, players parse et
5. **Backend Submission** - Backend `/api/drafts/ocr` endpoint'ine POST

## Output Format

```json
{
  "success": true,
  "imageUrl": "https://...",
  "matchData": {
    "mode": "clubs | ultimate | seasons",
    "team1_name": "Team Name 1",
    "team2_name": "Team Name 2",
    "score1": 2,
    "score2": 1,
    "players": ["Player 1", "Player 2", ...]
  },
  "backendResponse": {
    "success": true,
    "data": {...}
  }
}
```

## Modüller

### `utils/imageDownloader.js`
- Image indirme
- Image preprocessing (grayscale, contrast, resize)
- Geçici dosya yönetimi

### `utils/ocrExtractor.js`
- Tesseract.js wrapper
- Text extraction
- OCR worker yönetimi

### `utils/textParser.js`
- Mode detection (clubs, ultimate, seasons)
- Score extraction (regex patterns)
- Team name extraction
- Player name extraction

### `utils/apiClient.js`
- Backend API client
- JWT authentication
- Error handling

### `index.js`
- Ana entry point
- Pipeline orchestration
- CLI interface

## Environment Variables

- `BACKEND_URL` - Backend API URL (default: http://localhost:3000)

## Notlar

- OCR doğruluğu image kalitesine bağlıdır
- Best-effort parsing: Eksik veri olsa bile default değerlerle çalışır
- Preprocessing parametreleri image'e göre ayarlanabilir
- Tesseract worker her çalıştırmada başlatılır ve kapatılır

## Troubleshooting

**OCR çok düşük doğruluk veriyor:**
- Image kalitesini artır
- Preprocessing contrast ve brightness değerlerini ayarla
- Image boyutunu artır (targetWidth/targetHeight)

**Team/Player name'ler yanlış parse ediliyor:**
- `textParser.js` içindeki regex pattern'leri image formatına göre ayarla
- Raw text'i kontrol et (`matchData.rawText`)

**Backend'e bağlanamıyor:**
- JWT token'ın geçerli olduğundan emin ol
- Backend URL'ini kontrol et
- Network bağlantısını kontrol et

