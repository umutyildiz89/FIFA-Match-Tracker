/**
 * Test kullanıcısı oluşturma scripti
 * Database bağlantısı gerektirir
 */

const pool = require('../config/database');
const { hashPassword } = require('../utils/bcrypt');

const createTestUser = async () => {
  try {
    const email = 'test@example.com';
    const username = 'testuser';
    const password = 'test123';

    console.log('Test kullanıcısı oluşturuluyor...');
    console.log('Email:', email);
    console.log('Username:', username);
    console.log('Password:', password);

    // Şifreyi hashle
    const passwordHash = await hashPassword(password);

    // Kullanıcıyı oluştur
    const [result] = await pool.execute(
      'INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?)',
      [email, username, passwordHash]
    );

    console.log('✅ Test kullanıcısı başarıyla oluşturuldu!');
    console.log('User ID:', result.insertId);
    console.log('\nGiriş bilgileri:');
    console.log('Email/Username:', email, 'veya', username);
    console.log('Password:', password);

    return {
      id: result.insertId,
      email,
      username,
      password
    };
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      console.log('⚠️  Kullanıcı zaten var');
    } else {
      console.error('❌ Hata:', error.message);
    }
    throw error;
  }
};

// Script olarak çalıştırılırsa
if (require.main === module) {
  require('dotenv').config();
  
  createTestUser()
    .then(() => {
      console.log('\n✅ Tamamlandı!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Hata:', error.message);
      process.exit(1);
    });
}

module.exports = createTestUser;

