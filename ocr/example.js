/**
 * OCR Service Örnek Kullanım
 */

import processMatchImage from './index.js';

// Örnek kullanım
const example = async () => {
  // Test için: Gerçek bir image URL gerekli
  // Örnek: const imageUrl = 'https://res.cloudinary.com/your-cloud/image/upload/v1234567890/match-screenshot.jpg';
  // Şimdilik test için placeholder - gerçek URL kullanılmalı
  const imageUrl = process.env.IMAGE_URL || 'https://via.placeholder.com/1920x1080.png?text=FIFA+Match+Screen';
  
  // JWT Token (backend'den alınmalı)
  // Önce backend'den token alınmalı: POST /api/auth/login
  const jwtToken = process.env.JWT_TOKEN || null;

  // Backend URL (opsiyonel, default: http://localhost:3000)
  const backendUrl = 'http://localhost:3000';

  try {
    console.log('OCR işlemi başlatılıyor...\n');

    // OCR işlemini çalıştır
    const result = await processMatchImage(imageUrl, jwtToken, {
      backendUrl,
      // Preprocess options (opsiyonel)
      preprocessOptions: {
        targetWidth: 2000,
        targetHeight: 2000,
        contrast: 1.2,
        brightness: 1.0
      },
      // Backend'e göndermeyi atla (JWT token yoksa veya test için)
      skipBackend: !jwtToken
    });

    // Sonuçları yazdır
    console.log('\n========== SONUÇ ==========');
    console.log('Success:', result.success);
    console.log('\nMatch Data:');
    console.log(JSON.stringify(result.matchData, null, 2));

    if (result.backendResponse) {
      console.log('\nBackend Response:');
      console.log(JSON.stringify(result.backendResponse, null, 2));
    }

    if (result.errors.length > 0) {
      console.log('\nErrors:');
      result.errors.forEach(error => console.log('-', error));
    }

  } catch (error) {
    console.error('Örnek çalıştırma hatası:', error);
  }
};

// Fonksiyonu çağır
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.includes('example.js')) {
  example();
}

export default example;

