const { verifyToken } = require('../utils/jwt');
const pool = require('../config/database');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Yetkilendirme token\'ı bulunamadı' 
      });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ 
        success: false, 
        message: 'Geçersiz veya süresi dolmuş token' 
      });
    }

    // Kullanıcıyı veritabanından kontrol et
    const [users] = await pool.execute(
      'SELECT id, email, username FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (users.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Kullanıcı bulunamadı' 
      });
    }

    req.user = users[0];
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Sunucu hatası' 
    });
  }
};

module.exports = {
  authenticate
};

