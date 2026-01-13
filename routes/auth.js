const express = require('express');
const router = express.Router();
const { register, login, getProfile, searchUsers } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticate, getProfile);
router.get('/search', authenticate, searchUsers);

module.exports = router;

