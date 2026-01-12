// PlanetScale PostgreSQL Bağlantı Test Scripti
require('dotenv').config();
const { Pool } = require('pg');

console.log('🔍 PlanetScale Bağlantı Testi Başlatılıyor...\n');

// Environment variables kontrolü
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  ssl: (process.env.DB_SSL === 'true' || process.env.DB_HOST?.includes('psdb.cloud') || process.env.DB_HOST?.includes('planetscale.com')) ? {
    rejectUnauthorized: false
  } : false
};

console.log('📋 Environment Variables Kontrolü:');
console.log('-----------------------------------');
console.log('DB_HOST:', dbConfig.host || '❌ YOK');
console.log('DB_USER:', dbConfig.user || '❌ YOK');
console.log('DB_NAME:', dbConfig.database || '❌ YOK');
console.log('DB_PORT:', dbConfig.port);
console.log('DB_SSL:', dbConfig.ssl ? '✅ Aktif' : '❌ Kapalı');
console.log('DB_PASSWORD:', dbConfig.password ? '✅ Var' : '❌ YOK');
console.log('-----------------------------------\n');

// Eğer gerekli bilgiler yoksa
if (!dbConfig.host || !dbConfig.user || !dbConfig.database) {
  console.error('❌ HATA: PlanetScale bilgileri eksik!');
  console.error('\n📝 .env dosyasına şunları ekle:');
  console.error('-----------------------------------');
  console.error('DB_HOST=us-east-4.pg.psdb.cloud');
  console.error('DB_USER=pscale_api_XXXXX');
  console.error('DB_PASSWORD=pscale_pw_XXXXX');
  console.error('DB_NAME=XXXXX');
  console.error('DB_PORT=5432');
  console.error('DB_SSL=true');
  console.error('-----------------------------------\n');
  console.error('💡 PlanetScale bilgilerini nereden alacağın:');
  console.error('1. PlanetScale Dashboard\'a git: https://planetscale.com/');
  console.error('2. Database\'ini seç');
  console.error('3. "Connect" butonuna tıkla');
  console.error('4. "Node.js" seçeneğini seç');
  console.error('5. Connection string\'den bilgileri al\n');
  process.exit(1);
}

// Bağlantı testi
console.log('🔌 PlanetScale\'e bağlanılıyor...\n');

const pool = new Pool(dbConfig);

pool.query('SELECT NOW() as current_time, version() as pg_version')
  .then(result => {
    console.log('✅ BAĞLANTI BAŞARILI!\n');
    console.log('📊 Database Bilgileri:');
    console.log('-----------------------------------');
    console.log('Zaman:', result.rows[0].current_time);
    console.log('PostgreSQL Versiyonu:', result.rows[0].pg_version.split(' ')[0] + ' ' + result.rows[0].pg_version.split(' ')[1]);
    console.log('-----------------------------------\n');
    
    // Tabloları kontrol et
    return pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
  })
  .then(result => {
    console.log('📋 Mevcut Tablolar:');
    console.log('-----------------------------------');
    if (result.rows.length === 0) {
      console.log('⚠️  Hiç tablo yok! Schema uygulanmamış.');
      console.log('💡 PlanetScale Console\'dan schema_postgresql.sql dosyasını çalıştır.\n');
    } else {
      result.rows.forEach((row, index) => {
        console.log(`${index + 1}. ${row.table_name}`);
      });
      console.log('-----------------------------------\n');
    }
    
    // Users tablosunu kontrol et
    return pool.query(`
      SELECT COUNT(*) as user_count 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'users';
    `);
  })
  .then(result => {
    if (result.rows[0].user_count > 0) {
      // Users tablosu varsa kullanıcı sayısını göster
      return pool.query('SELECT COUNT(*) as count FROM users');
    } else {
      return Promise.resolve({ rows: [{ count: 0 }] });
    }
  })
  .then(result => {
    if (result.rows[0].count > 0) {
      console.log(`👥 Toplam Kullanıcı Sayısı: ${result.rows[0].count}\n`);
    } else {
      console.log('⚠️  Users tablosu boş veya yok.\n');
    }
    
    console.log('✅ Test tamamlandı!');
    pool.end();
    process.exit(0);
  })
  .catch(err => {
    console.error('\n❌ BAĞLANTI HATASI!\n');
    console.error('Hata Mesajı:', err.message);
    console.error('\n🔍 Olası Sorunlar:');
    console.error('1. DB_HOST, DB_USER, DB_NAME doğru mu kontrol et');
    console.error('2. DB_PASSWORD doğru mu kontrol et');
    console.error('3. PlanetScale database\'i aktif mi kontrol et');
    console.error('4. Internet bağlantısı var mı kontrol et');
    console.error('5. Firewall SSL bağlantısını engelliyor mu kontrol et\n');
    pool.end();
    process.exit(1);
  });

