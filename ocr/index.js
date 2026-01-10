import { processImageFromUrl, deleteTempFile } from './utils/imageDownloader.js';
import { initializeOCR, extractText, terminateOCR } from './utils/ocrExtractor.js';
import { parseMatchData } from './utils/textParser.js';
import { sendDraftToBackend } from './utils/apiClient.js';

/**
 * FIFA/EA FC Match OCR Service
 * Ana entry point
 */

/**
 * OCR pipeline'i çalıştır
 * @param {string} imageUrl - Cloudinary image URL
 * @param {string} jwtToken - JWT authentication token
 * @param {Object} options - Ekstra seçenekler
 * @returns {Promise<Object>} - İşlem sonucu
 */
export const processMatchImage = async (imageUrl, jwtToken, options = {}) => {
  const {
    backendUrl = process.env.BACKEND_URL || 'http://localhost:3000',
    preprocessOptions = {},
    skipBackend = false
  } = options;

  let tempFilePath = null;
  let result = {
    success: false,
    imageUrl,
    matchData: null,
    backendResponse: null,
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

    // 5. Backend'e gönder (opsiyonel)
    if (!skipBackend && jwtToken) {
      console.log('\n=== Backend Submission ===');
      const backendResponse = await sendDraftToBackend(
        matchData,
        imageUrl,
        jwtToken,
        backendUrl
      );
      result.backendResponse = backendResponse;
      result.success = backendResponse.success;
    } else {
      result.success = true;
      console.log('\nBackend submission atlandı (skipBackend: true veya JWT token yok)');
    }

    return result;
  } catch (error) {
    console.error('\n=== ERROR ===');
    console.error(error.message);
    result.errors.push(error.message);
    result.success = false;
    return result;
  } finally {
    // 6. Temizlik
    if (tempFilePath) {
      deleteTempFile(tempFilePath);
    }
    await terminateOCR();
  }
};

/**
 * CLI kullanımı için
 */
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.includes('index.js')) {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log(`
Kullanım: node index.js <imageUrl> <jwtToken> [backendUrl]

Örnek:
  node index.js https://res.cloudinary.com/example/image.jpg eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  
Environment Variables:
  BACKEND_URL - Backend API URL (default: http://localhost:3000)
    `);
    process.exit(1);
  }

  const [imageUrl, jwtToken, backendUrl] = args;

  processMatchImage(imageUrl, jwtToken, { backendUrl })
    .then(result => {
      console.log('\n=== SONUÇ ===');
      console.log(JSON.stringify(result, null, 2));
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export default processMatchImage;

