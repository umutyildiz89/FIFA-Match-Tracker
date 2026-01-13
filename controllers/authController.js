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

// Kullanıcı arama (username ile)
const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const currentUserId = req.user?.id; // Authenticated user ID (optional)

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Arama sorgusu en az 2 karakter olmalıdır'
      });
    }

    const searchTerm = `%${query.trim()}%`;

    // Kullanıcıları ara (username veya email ile)
    const [users] = await pool.execute(
      `SELECT id, username, email, created_at 
       FROM users 
       WHERE username ILIKE ? OR email ILIKE ?
       ORDER BY username ASC
       LIMIT 20`,
      [searchTerm, searchTerm]
    );

    // Eğer authenticated user varsa, mevcut arkadaşlık durumunu kontrol et
    let usersWithStatus = users;
    if (currentUserId) {
      const userIds = users.map(u => u.id).filter(id => id !== currentUserId);
      
      if (userIds.length > 0) {
        const placeholders = userIds.map(() => '?').join(',');
        const [friendships] = await pool.execute(
          `SELECT 
            CASE 
              WHEN user_id = ? THEN friend_id
              ELSE user_id
            END as friend_id,
            status
           FROM friends 
           WHERE (user_id = ? OR friend_id = ?) 
           AND (user_id IN (${placeholders}) OR friend_id IN (${placeholders}))
           AND status IN ('accepted', 'pending')`,
          [currentUserId, currentUserId, currentUserId, ...userIds, ...userIds]
        );

        const friendshipMap = {};
        friendships.forEach(f => {
          friendshipMap[f.friend_id] = f.status;
        });

        usersWithStatus = users.map(user => ({
          ...user,
          friendshipStatus: user.id === currentUserId ? 'self' : (friendshipMap[user.id] || null)
        }));
      } else {
        usersWithStatus = users.map(user => ({
          ...user,
          friendshipStatus: user.id === currentUserId ? 'self' : null
        }));
      }
    }

    res.json({
      success: true,
      data: usersWithStatus
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  searchUsers
};

