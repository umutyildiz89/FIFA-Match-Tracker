const pool = require('../config/database');
const { hashPassword, comparePassword } = require('../utils/bcrypt');
const { generateToken } = require('../utils/jwt');

const register = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Validasyon
    if (!email || !username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email, kullanıcı adı ve şifre gereklidir'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Şifre en az 6 karakter olmalıdır'
      });
    }

    // Email ve username kontrolü
    const [existingEmail] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingEmail.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Bu email adresi zaten kullanılıyor'
      });
    }

    const [existingUsername] = await pool.execute(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );

    if (existingUsername.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Bu kullanıcı adı zaten kullanılıyor'
      });
    }

    // Şifreyi hashle ve kullanıcıyı oluştur
    const passwordHash = await hashPassword(password);
    
    // PostgreSQL: RETURNING clause ile id'yi al
    const [result] = await pool.execute(
      'INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?) RETURNING id',
      [email, username, passwordHash]
    );

    const userId = result.insertId || result[0]?.id;
    const token = generateToken({ userId, email, username });

    res.status(201).json({
      success: true,
      message: 'Kullanıcı başarıyla oluşturuldu',
      data: {
        token,
        user: {
          id: userId,
          email,
          username
        }
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Email veya username ile giriş yapılabilir
    if (!password || (!email && !username)) {
      return res.status(400).json({
        success: false,
        message: 'Email/kullanıcı adı ve şifre gereklidir'
      });
    }

    // Kullanıcıyı bul
    let query = 'SELECT id, email, username, password_hash FROM users WHERE ';
    let params = [];

    if (email) {
      query += 'email = ?';
      params = [email];
    } else {
      query += 'username = ?';
      params = [username];
    }

    const [users] = await pool.execute(query, params);

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz email/kullanıcı adı veya şifre'
      });
    }

    const user = users[0];

    // Şifreyi kontrol et
    const isPasswordValid = await comparePassword(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz email/kullanıcı adı veya şifre'
      });
    }

    // Token oluştur
    const token = generateToken({ 
      userId: user.id, 
      email: user.email, 
      username: user.username 
    });

    res.json({
      success: true,
      message: 'Giriş başarılı',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const [users] = await pool.execute(
      'SELECT id, email, username, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    res.json({
      success: true,
      data: users[0]
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
};

module.exports = {
  register,
  login,
  getProfile
};

