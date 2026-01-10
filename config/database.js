const mysql = require('mysql2/promise');

// Database bağlantısı opsiyonel - eğer environment variables yoksa mock pool döndür
let pool;

if (process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME) {
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    ssl: (process.env.DB_SSL === 'true' || process.env.DB_HOST?.includes('psdb.cloud') || process.env.DB_HOST?.includes('planetscale.com')) ? {
      rejectUnauthorized: false
    } : false,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  // Test connection (async, hata verse bile devam eder)
  pool.getConnection()
    .then(connection => {
      console.log('✅ Database connected successfully');
      connection.release();
    })
    .catch(err => {
      console.warn('⚠️  Database connection failed:', err.message);
      console.warn('⚠️  API endpoints will not work without database');
      console.warn('⚠️  To enable database, configure DB_* environment variables in .env file');
    });
} else {
  console.warn('⚠️  Database not configured (DB_HOST, DB_USER, DB_NAME not set)');
  console.warn('⚠️  API endpoints will not work without database');
  console.warn('⚠️  To enable database, add DB_* variables to .env file');
  
  // Mock pool - hata verir ama crash etmez
  pool = {
    execute: async () => {
      throw new Error('Database not configured. Please set DB_HOST, DB_USER, DB_NAME in .env file');
    },
    getConnection: async () => {
      throw new Error('Database not configured. Please set DB_HOST, DB_USER, DB_NAME in .env file');
    }
  };
}

module.exports = pool;

