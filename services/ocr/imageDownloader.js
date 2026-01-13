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
    pipeline = pipeline.modulate({
      brightness: brightness * 100,
      saturation: 0
    });

    // Contrast için normalize et
    pipeline = pipeline.linear(contrast, -(128 * contrast) + 128);

    // Resize (aspect ratio korunarak)
    pipeline = pipeline.resize(targetWidth, targetHeight, {
      fit: 'inside',
      withoutEnlargement: true
    });

    // PNG formatına çevir (Tesseract için daha iyi)
    const processedBuffer = await pipeline.png().toBuffer();

    return processedBuffer;
  } catch (error) {
    console.error('Image preprocessing error:', error.message);
    throw new Error(`Image işlenemedi: ${error.message}`);
  }
};

/**
 * Image'i geçici dosyaya kaydet
 */
const saveImageToTemp = async (imageBuffer, filename = 'ocr-temp.png') => {
  try {
    const tempPath = join(tmpdir(), filename);
    
    await sharp(imageBuffer)
      .png()
      .toFile(tempPath);

    return tempPath;
  } catch (error) {
    console.error('Save image error:', error.message);
    throw new Error(`Image kaydedilemedi: ${error.message}`);
  }
};

/**
 * Geçici dosyayı sil
 */
const deleteTempFile = (filePath) => {
  try {
    unlinkSync(filePath);
  } catch (error) {
    console.warn('Temp file silinemedi:', filePath, error.message);
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

