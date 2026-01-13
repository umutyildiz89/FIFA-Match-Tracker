const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  createDraftFromOCR,
  getAllDrafts,
  getDraftById,
  approveDraft,
  rejectDraft
} = require('../controllers/draftController');

// Tüm route'lar authentication gerektirir
router.use(authenticate);

router.post('/ocr', createDraftFromOCR);
router.get('/', getAllDrafts);
router.get('/:id', getDraftById);
router.post('/:id/approve', approveDraft);
router.post('/:id/reject', rejectDraft);

module.exports = router;

