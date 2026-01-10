const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  getAllMatches,
  getMatchById,
  getMyMatches,
  getMatchStats
} = require('../controllers/matchController');

// Public: Tüm match'leri görüntüleme (opsiyonel)
router.get('/', getAllMatches);
router.get('/stats', authenticate, getMatchStats);
router.get('/my-matches', authenticate, getMyMatches);
router.get('/:id', getMatchById);

module.exports = router;

