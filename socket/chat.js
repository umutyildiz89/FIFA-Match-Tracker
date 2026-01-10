const pool = require('../config/database');
const { verifyToken } = require('../utils/jwt');
const { checkFriendship: checkFriendshipUtil } = require('../controllers/friendsController');

// Socket.IO bağlantılarını yönet
const connectedUsers = new Map(); // userId -> socketId mapping

const setupSocketIO = (io) => {
  // Authentication middleware for Socket.IO
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.substring(7);

      if (!token) {
        return next(new Error('Yetkilendirme token\'ı bulunamadı'));
      }

      const decoded = verifyToken(token);

      if (!decoded) {
        return next(new Error('Geçersiz token'));
      }

      // Kullanıcıyı veritabanından kontrol et
      const [users] = await pool.execute(
        'SELECT id, email, username FROM users WHERE id = ?',
        [decoded.userId]
      );

      if (users.length === 0) {
        return next(new Error('Kullanıcı bulunamadı'));
      }

      socket.userId = decoded.userId;
      socket.user = users[0];
      next();
    } catch (error) {
      next(new Error('Yetkilendirme hatası'));
    }
  });

  io.on('connection', async (socket) => {
    const userId = socket.userId;
    const username = socket.user.username;

    console.log(`User connected: ${username} (${userId})`);

    // Kullanıcıyı bağlı kullanıcılar listesine ekle
    connectedUsers.set(userId, socket.id);

    // Kullanıcıya başarılı bağlantı bildirimi gönder
    socket.emit('connected', {
      message: 'Başarıyla bağlandınız',
      userId,
      username
    });

    // Tüm bağlı arkadaşları kullanıcıya bildir
    await notifyOnlineFriends(io, userId);

    // Özel mesaj gönderme
    socket.on('send_message', async (data) => {
      try {
        const { receiverId, message } = data;

        if (!receiverId || !message || message.trim().length === 0) {
          socket.emit('error', { message: 'Alıcı ID ve mesaj gereklidir' });
          return;
        }

        // Arkadaş kontrolü
        const areFriends = await checkFriendshipUtil(userId, receiverId);

        if (!areFriends) {
          socket.emit('error', { message: 'Bu kullanıcı arkadaşınız değil' });
          return;
        }

        // Mesajı veritabanına kaydet (PostgreSQL: RETURNING clause ile id al)
        const [result] = await pool.execute(
          'INSERT INTO chat_messages (sender_id, receiver_id, message) VALUES (?, ?, ?) RETURNING id, created_at',
          [userId, receiverId, message.trim()]
        );

        const messageId = result.insertId || result[0]?.id;
        const createdAt = result[0]?.created_at || new Date();

        const messageData = {
          id: messageId,
          senderId: userId,
          senderUsername: username,
          receiverId,
          message: message.trim(),
          createdAt: createdAt
        };

        // Alıcıya mesaj gönder (eğer online ise)
        const receiverSocketId = connectedUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('receive_message', messageData);
        }

        // Gönderene onay gönder
        socket.emit('message_sent', {
          messageId: messageId,
          ...messageData
        });
      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('error', { message: 'Mesaj gönderilirken hata oluştu' });
      }
    });

    // Mesaj geçmişini getir
    socket.on('get_messages', async (data) => {
      try {
        const { friendId, limit = 50, offset = 0 } = data;

        if (!friendId) {
          socket.emit('error', { message: 'Arkadaş ID gereklidir' });
          return;
        }

        // Arkadaş kontrolü
        const areFriends = await checkFriendshipUtil(userId, friendId);

        if (!areFriends) {
          socket.emit('error', { message: 'Bu kullanıcı arkadaşınız değil' });
          return;
        }

        // Mesaj geçmişini getir
        const [messages] = await pool.execute(
          `SELECT cm.*, u.username as sender_username
           FROM chat_messages cm
           JOIN users u ON cm.sender_id = u.id
           WHERE (cm.sender_id = ? AND cm.receiver_id = ?) 
              OR (cm.sender_id = ? AND cm.receiver_id = ?)
           ORDER BY cm.created_at DESC
           LIMIT ? OFFSET ?`,
          [userId, friendId, friendId, userId, parseInt(limit), parseInt(offset)]
        );

        // Mesajları ters çevir (en eski en üstte)
        messages.reverse();

        socket.emit('messages_history', {
          friendId,
          messages
        });
      } catch (error) {
        console.error('Get messages error:', error);
        socket.emit('error', { message: 'Mesaj geçmişi alınırken hata oluştu' });
      }
    });

    // Typing indicator
    socket.on('typing_start', async (data) => {
      try {
        const { receiverId } = data;

        if (!receiverId) return;

        // Arkadaş kontrolü
        const areFriends = await checkFriendshipUtil(userId, receiverId);
        if (!areFriends) return;

        const receiverSocketId = connectedUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('user_typing', {
            userId,
            username
          });
        }
      } catch (error) {
        console.error('Typing start error:', error);
      }
    });

    socket.on('typing_stop', async (data) => {
      try {
        const { receiverId } = data;

        if (!receiverId) return;

        const receiverSocketId = connectedUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('user_stopped_typing', {
            userId
          });
        }
      } catch (error) {
        console.error('Typing stop error:', error);
      }
    });

    // Bağlantı kesildiğinde
    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${username} (${userId})`);
      connectedUsers.delete(userId);
      await notifyOnlineFriends(io, userId, false);
    });
  });
};

// Arkadaşları online/offline durumundan haberdar et
const notifyOnlineFriends = async (io, userId, isOnline = true) => {
  try {
    // Kullanıcının tüm arkadaşlarını getir
    const [friends] = await pool.execute(
      `SELECT 
        CASE 
          WHEN f.user_id = ? THEN f.friend_id
          ELSE f.user_id
        END as friend_id
       FROM friends f
       WHERE (f.user_id = ? OR f.friend_id = ?) AND f.status = 'accepted'`,
      [userId, userId, userId]
    );

    // Her arkadaşa online/offline bildirimi gönder
    for (const friend of friends) {
      const friendSocketId = connectedUsers.get(friend.friend_id);
      if (friendSocketId) {
        io.to(friendSocketId).emit('friend_status_change', {
          userId,
          isOnline
        });
      }
    }
  } catch (error) {
    console.error('Notify online friends error:', error);
  }
};

module.exports = {
  setupSocketIO,
  connectedUsers
};

