// PostgreSQL Database bağlantısı - PlanetScale PostgreSQL için
const { Pool } = require('pg');

// Database bağlantısı opsiyonel - eğer environment variables yoksa mock pool döndür
let pool;

if (process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME) {
  pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432, // PostgreSQL default port
    ssl: (process.env.DB_SSL === 'true' || process.env.DB_HOST?.includes('psdb.cloud') || process.env.DB_HOST?.includes('planetscale.com')) ? {
      rejectUnauthorized: false
    } : false,
    max: 10, // connection limit
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  // Test connection (async, hata verse bile devam eder)
  pool.query('SELECT NOW()')
    .then(() => {
      console.log('✅ PostgreSQL Database connected successfully');
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
    query: async () => {
      throw new Error('Database not configured. Please set DB_HOST, DB_USER, DB_NAME in .env file');
    },
    connect: async () => {
      throw new Error('Database not configured. Please set DB_HOST, DB_USER, DB_NAME in .env file');
    }
  };
}

// Helper function: MySQL-style execute() → PostgreSQL query()
// MySQL: pool.execute(query, params) → [rows]
// PostgreSQL: pool.query(query, params) → { rows, rowCount }
// Returns MySQL-compatible format: rows array with insertId and affectedRows attached
pool.execute = async (query, params) => {
  // Convert MySQL ? placeholders to PostgreSQL $1, $2, $3...
  let paramIndex = 1;
  const pgQuery = query.replace(/\?/g, () => `$${paramIndex++}`);
  
  const result = await pool.query(pgQuery, params);
  
  // Attach MySQL-compatible properties to rows array
  const rows = result.rows || [];
  
  // For INSERT with RETURNING, get the id from first row
  if (rows.length > 0 && rows[0].id) {
    rows.insertId = rows[0].id;
  } else {
    rows.insertId = null;
  }
  
  // For UPDATE/DELETE, use rowCount
  rows.affectedRows = result.rowCount || 0;
  
  return [rows]; // MySQL-style: [rows], with insertId and affectedRows attached
};

module.exports = pool;
