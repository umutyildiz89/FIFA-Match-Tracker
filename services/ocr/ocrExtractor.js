const { createWorker } = require('tesseract.js');
const { readFileSync } = require('fs');

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
 * Image'den text extract et
 */
const extractText = async (imageSource) => {
  try {
    if (!worker) {
      await initializeOCR();
    }

    // Image source (path veya buffer)
    let imageData;
    if (typeof imageSource === 'string') {
      // File path
      imageData = readFileSync(imageSource);
    } else {
      // Buffer
      imageData = imageSource;
    }

    console.log('OCR text extraction başlatılıyor...');
    const { data: { text, confidence } } = await worker.recognize(imageData);

    console.log(`OCR tamamlandı. Confidence: ${confidence.toFixed(2)}%`);
    console.log('Extracted text:', text.substring(0, 200) + '...');

    return {
      text: text.trim(),
      confidence: confidence,
      lines: text.split('\n').filter(line => line.trim().length > 0)
    };
  } catch (error) {
    console.error('OCR extraction error:', error.message);
    throw new Error(`Text extract edilemedi: ${error.message}`);
  }
};

module.exports = {
  initializeOCR,
  terminateOCR,
  extractText
};

