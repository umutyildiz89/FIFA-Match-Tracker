const pool = require('../config/database');

// Arkadaş ekleme isteği gönder
const sendFriendRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { friendId } = req.body;

    if (!friendId) {
      return res.status(400).json({
        success: false,
        message: 'Arkadaş ID gereklidir'
      });
    }

    if (userId === friendId) {
      return res.status(400).json({
        success: false,
        message: 'Kendinize arkadaş isteği gönderemezsiniz'
      });
    }

    // Kullanıcının var olup olmadığını kontrol et
    const [users] = await pool.execute(
      'SELECT id, username FROM users WHERE id = ?',
      [friendId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    // Mevcut friendship durumunu kontrol et
    const [existing] = await pool.execute(
      `SELECT * FROM friends 
       WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)`,
      [userId, friendId, friendId, userId]
    );

    if (existing.length > 0) {
      const friendship = existing[0];
      
      if (friendship.status === 'accepted') {
        return res.status(400).json({
          success: false,
          message: 'Bu kullanıcı zaten arkadaşınız'
        });
      }

      if (friendship.status === 'pending') {
        return res.status(400).json({
          success: false,
          message: 'Zaten bekleyen bir arkadaşlık isteği var'
        });
      }

      if (friendship.status === 'blocked') {
        return res.status(400).json({
          success: false,
          message: 'Bu kullanıcı engellenmiş'
        });
      }
    }

    // Yeni arkadaşlık isteği oluştur
    await pool.execute(
      'INSERT INTO friends (user_id, friend_id, status) VALUES (?, ?, ?)',
      [userId, friendId, 'pending']
    );

    res.json({
      success: true,
      message: 'Arkadaşlık isteği gönderildi'
    });
  } catch (error) {
    console.error('Send friend request error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
};

// Gelen arkadaşlık isteklerini listele
const getPendingRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const [requests] = await pool.execute(
      `SELECT f.id, f.user_id, f.friend_id, f.created_at, u.username, u.email
       FROM friends f
       JOIN users u ON f.user_id = u.id
       WHERE f.friend_id = ? AND f.status = 'pending'
       ORDER BY f.created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      data: requests
    });
  } catch (error) {
    console.error('Get pending requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
};

// Arkadaşlık isteğini kabul et
const acceptFriendRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { requestId } = req.params;

    // İsteğin bu kullanıcıya ait olduğunu ve pending olduğunu kontrol et
    const [requests] = await pool.execute(
      'SELECT * FROM friends WHERE id = ? AND friend_id = ? AND status = ?',
      [requestId, userId, 'pending']
    );

    if (requests.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Arkadaşlık isteği bulunamadı'
      });
    }

    const request = requests[0];

    // Status'u accepted olarak güncelle
    await pool.execute(
      'UPDATE friends SET status = ? WHERE id = ?',
      ['accepted', requestId]
    );

    res.json({
      success: true,
      message: 'Arkadaşlık isteği kabul edildi'
    });
  } catch (error) {
    console.error('Accept friend request error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
};

// Arkadaşlık isteğini reddet
const rejectFriendRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { requestId } = req.params;

    const [result] = await pool.execute(
      'DELETE FROM friends WHERE id = ? AND friend_id = ? AND status = ?',
      [requestId, userId, 'pending']
    );

    if ((result.affectedRows || 0) === 0) {
      return res.status(404).json({
        success: false,
        message: 'Arkadaşlık isteği bulunamadı'
      });
    }

    res.json({
      success: true,
      message: 'Arkadaşlık isteği reddedildi'
    });
  } catch (error) {
    console.error('Reject friend request error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
};

// Arkadaş listesini getir
const getFriendsList = async (req, res) => {
  try {
    const userId = req.user.id;

    const [friends] = await pool.execute(
      `SELECT 
        CASE 
          WHEN f.user_id = ? THEN f.friend_id
          ELSE f.user_id
        END as friend_id,
        u.username,
        u.email,
        u.id,
        f.created_at as friendship_date
       FROM friends f
       JOIN users u ON (
         CASE 
           WHEN f.user_id = ? THEN u.id = f.friend_id
           ELSE u.id = f.user_id
         END
       )
       WHERE (f.user_id = ? OR f.friend_id = ?) AND f.status = 'accepted'
       ORDER BY f.created_at DESC`,
      [userId, userId, userId, userId]
    );

    res.json({
      success: true,
      data: friends
    });
  } catch (error) {
    console.error('Get friends list error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
};

// Arkadaşlığı kaldır
const removeFriend = async (req, res) => {
  try {
    const userId = req.user.id;
    const { friendId } = req.params;

    const [result] = await pool.execute(
      `DELETE FROM friends 
       WHERE ((user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)) 
       AND status = 'accepted'`,
      [userId, friendId, friendId, userId]
    );

    if ((result.affectedRows || 0) === 0) {
      return res.status(404).json({
        success: false,
        message: 'Arkadaşlık bulunamadı'
      });
    }

    res.json({
      success: true,
      message: 'Arkadaşlık kaldırıldı'
    });
  } catch (error) {
    console.error('Remove friend error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
};

// İki kullanıcının arkadaş olup olmadığını kontrol et
const checkFriendship = async (userId, friendId) => {
  try {
    const [friends] = await pool.execute(
      `SELECT * FROM friends 
       WHERE ((user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?))
       AND status = 'accepted'`,
      [userId, friendId, friendId, userId]
    );

    return friends.length > 0;
  } catch (error) {
    console.error('Check friendship error:', error);
    return false;
  }
};

module.exports = {
  sendFriendRequest,
  getPendingRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendsList,
  removeFriend,
  checkFriendship
};

