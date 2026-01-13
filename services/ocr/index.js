const { processImageFromUrl, deleteTempFile } = require('./imageDownloader');
const { initializeOCR, extractText, terminateOCR } = require('./ocrExtractor');
const { parseMatchData } = require('./textParser');

/**
 * FIFA/EA FC Match OCR Service
 * Ana entry point
 */

/**
 * OCR pipeline'i çalıştır
 * @param {string} imageUrl - Cloudinary image URL
 * @param {Object} options - Ekstra seçenekler
 * @returns {Promise<Object>} - İşlem sonucu
 */
const processMatchImage = async (imageUrl, options = {}) => {
  const {
    preprocessOptions = {},
  } = options;

  let tempFilePath = null;
  let result = {
    success: false,
    imageUrl,
    matchData: null,
    errors: []
  };

  try {
    // 1. OCR'ı başlat
    await initializeOCR();

    // 2. Image'i indir ve preprocess et
    console.log('\n=== Image Processing ===');
    const imageData = await processImageFromUrl(imageUrl, preprocessOptions);
    tempFilePath = imageData.path;

    // 3. OCR text extraction
    console.log('\n=== OCR Text Extraction ===');
    const extractedText = await extractText(imageData.buffer);

    // 4. Text'i parse et
    console.log('\n=== Text Parsing ===');
    const matchData = parseMatchData(extractedText);
    result.matchData = matchData;
    result.success = true;

    return result;
  } catch (error) {
    console.error('\n=== ERROR ===');
    console.error(error.message);
    result.errors.push(error.message);
    result.success = false;
    return result;
  } finally {
    // 5. Temizlik
    if (tempFilePath) {
      deleteTempFile(tempFilePath);
    }
    await terminateOCR();
  }
};

module.exports = {
  processMatchImage
};

