const { createWorker } = require('tesseract.js');

/**
 * Tesseract.js OCR text extraction
 */

let worker = null;

/**
 * Tesseract worker'ı başlat
 */
const initializeOCR = async () => {
  if (worker) {
    return worker;
  }

  try {
    console.log('Tesseract OCR worker başlatılıyor...');
    worker = await createWorker('eng', 1, {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
        }
      }
    });

    // OCR için optimize et
    await worker.setParameters({
      tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz -',
      tessedit_pageseg_mode: '6', // Uniform block of text
    });

    console.log('Tesseract OCR worker hazır');
    return worker;
  } catch (error) {
    console.error('OCR initialization error:', error.message);
    throw new Error(`OCR başlatılamadı: ${error.message}`);
  }
};

/**
 * Worker'ı kapat
 */
const terminateOCR = async () => {
  if (worker) {
    await worker.terminate();
    worker = null;
    console.log('Tesseract OCR worker kapatıldı');
  }
};

/**
 * Image buffer'dan text çıkar
 */
const extractText = async (imageBuffer) => {
  if (!worker) {
    await initializeOCR();
  }

  try {
    console.log('OCR text extraction başlatılıyor...');
    const { data } = await worker.recognize(imageBuffer);
    
    const text = data.text || '';
    const lines = text.split('\n').filter(line => line.trim().length > 0);

    console.log(`OCR tamamlandı: ${lines.length} satır bulundu`);
    console.log('Extracted text (ilk 500 karakter):', text.substring(0, 500));

    return {
      text,
      lines,
      confidence: data.confidence || 0
    };
  } catch (error) {
    console.error('OCR extraction error:', error.message);
    throw new Error(`Text çıkarılamadı: ${error.message}`);
  }
};

module.exports = {
  initializeOCR,
  terminateOCR,
  extractText
};

