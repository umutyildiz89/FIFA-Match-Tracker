const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  sendFriendRequest,
  getPendingRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendsList,
  removeFriend
} = require('../controllers/friendsController');

// Tüm route'lar authentication gerektirir
router.use(authenticate);

router.post('/request', sendFriendRequest);
router.get('/pending', getPendingRequests);
router.post('/accept/:requestId', acceptFriendRequest);
router.post('/reject/:requestId', rejectFriendRequest);
router.get('/list', getFriendsList);
router.delete('/:friendId', removeFriend);

module.exports = router;

