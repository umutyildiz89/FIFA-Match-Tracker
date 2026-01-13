const axios = require('axios');
const sharp = require('sharp');
const { unlinkSync } = require('fs');
const { join } = require('path');
const { tmpdir } = require('os');

/**
 * Image downloader ve preprocessor
 */

/**
 * URL'den image'i indir
 */
const downloadImage = async (imageUrl) => {
  try {
    const response = await axios({
      method: 'GET',
      url: imageUrl,
      responseType: 'arraybuffer',
      timeout: 30000
    });

    return Buffer.from(response.data, 'binary');
  } catch (error) {
    console.error('Image download error:', error.message);
    throw new Error(`Image indirilemedi: ${error.message}`);
  }
};

/**
 * Image'i preprocess et (grayscale, contrast, resize)
 */
const preprocessImage = async (imageBuffer, options = {}) => {
  try {
    const {
      targetWidth = 2000,
      targetHeight = 2000,
      contrast = 1.2,
      brightness = 1.0
    } = options;

    let pipeline = sharp(imageBuffer);

    // Metadata al
    const metadata = await pipeline.metadata();

    // Grayscale'e çevir
    pipeline = pipeline.greyscale();

    // Contrast ve brightness ayarla
    if (contrast !== 1.0 || brightness !== 1.0) {
      pipeline = pipeline.modulate({
        brightness: brightness,
        saturation: 0 // Grayscale için saturation 0
      });
    }

    // Resize (aspect ratio koru)
    if (metadata.width > targetWidth || metadata.height > targetHeight) {
      pipeline = pipeline.resize(targetWidth, targetHeight, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }

    // Process et
    const processedBuffer = await pipeline.toBuffer();

    return processedBuffer;
  } catch (error) {
    console.error('Image preprocessing error:', error.message);
    throw new Error(`Image işlenemedi: ${error.message}`);
  }
};

/**
 * Geçici dosyaya kaydet
 */
const saveImageToTemp = async (imageBuffer) => {
  try {
    const tempDir = tmpdir();
    const tempFileName = `ocr-${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
    const tempFilePath = join(tempDir, tempFileName);

    await sharp(imageBuffer).toFile(tempFilePath);

    return tempFilePath;
  } catch (error) {
    console.error('Save temp file error:', error.message);
    throw new Error(`Geçici dosya kaydedilemedi: ${error.message}`);
  }
};

/**
 * Geçici dosyayı sil
 */
const deleteTempFile = (filePath) => {
  try {
    if (filePath) {
      unlinkSync(filePath);
    }
  } catch (error) {
    console.warn('Delete temp file error:', error.message);
  }
};

/**
 * Image download ve preprocessing pipeline
 */
const processImageFromUrl = async (imageUrl, options = {}) => {
  let tempFilePath = null;

  try {
    // 1. Image'i indir
    console.log('Image indiriliyor...', imageUrl);
    const imageBuffer = await downloadImage(imageUrl);

    // 2. Preprocess et
    console.log('Image işleniyor...');
    const processedBuffer = await preprocessImage(imageBuffer, options);

    // 3. Geçici dosyaya kaydet (opsiyonel - Tesseract buffer da kabul edebilir)
    tempFilePath = await saveImageToTemp(processedBuffer);

    return {
      buffer: processedBuffer,
      path: tempFilePath
    };
  } catch (error) {
    if (tempFilePath) {
      deleteTempFile(tempFilePath);
    }
    throw error;
  }
};

module.exports = {
  downloadImage,
  preprocessImage,
  saveImageToTemp,
  deleteTempFile,
  processImageFromUrl
};

