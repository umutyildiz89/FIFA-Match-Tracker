/**
 * Basit OCR Test - Image indirme olmadan
 * Sadece Tesseract.js'in çalışıp çalışmadığını test eder
 */

import { initializeOCR, extractText, terminateOCR } from './utils/ocrExtractor.js';
import { unlinkSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';

const testOCR = async () => {
  console.log('=== Basit OCR Test ===\n');

  try {
    // 1. Basit bir test image oluştur (text içeren)
    console.log('Test image oluşturuluyor...');
    const testImagePath = join(process.cwd(), 'test-image.png');
    
    // Sharp ile basit bir text image oluştur
    const svg = `
      <svg width="800" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="800" height="200" fill="white"/>
        <text x="50" y="50" font-family="Arial" font-size="24" fill="black">FIFA CLUBS</text>
        <text x="50" y="80" font-family="Arial" font-size="24" fill="black">Team A 2 - 1 Team B</text>
        <text x="50" y="110" font-family="Arial" font-size="20" fill="black">Player 1</text>
        <text x="50" y="140" font-family="Arial" font-size="20" fill="black">Player 2</text>
      </svg>
    `;

    const buffer = Buffer.from(svg);
    await sharp(buffer).png().toFile(testImagePath);
    console.log('Test image oluşturuldu:', testImagePath);

    // 2. OCR'ı başlat
    console.log('\nOCR başlatılıyor...');
    await initializeOCR();

    // 3. Text extract et
    console.log('\nText extraction başlatılıyor...');
    const result = await extractText(testImagePath);

    // 4. Sonuçları göster
    console.log('\n========== OCR SONUÇ ==========');
    console.log('Confidence:', result.confidence.toFixed(2) + '%');
    console.log('\nExtracted Text:');
    console.log(result.text);
    console.log('\nLines:');
    result.lines.forEach((line, i) => {
      console.log(`${i + 1}. ${line}`);
    });

    // 5. Temizlik
    try {
      unlinkSync(testImagePath);
      console.log('\nTest image silindi');
    } catch (e) {
      console.warn('Test image silinemedi:', e.message);
    }

    await terminateOCR();
    console.log('\n✅ OCR Test başarılı!');

  } catch (error) {
    console.error('\n❌ OCR Test hatası:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

// Test'i çalıştır
testOCR();

