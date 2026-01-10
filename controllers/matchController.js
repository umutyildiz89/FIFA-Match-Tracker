const pool = require('../config/database');

// Tüm match'leri listele
const getAllMatches = async (req, res) => {
  try {
    const { mode, userId, startDate, endDate } = req.query;
    let query = 'SELECT * FROM matches WHERE 1=1';
    const params = [];

    if (mode) {
      query += ' AND mode = ?';
      params.push(mode);
    }

    if (userId) {
      query += ' AND uploader_id = ?';
      params.push(userId);
    }

    if (startDate) {
      query += ' AND match_date >= ?';
      params.push(startDate);
    }

    if (endDate) {
      query += ' AND match_date <= ?';
      params.push(endDate);
    }

    query += ' ORDER BY match_date DESC';

    const [matches] = await pool.execute(query, params);

    // Players JSONB parse et (PostgreSQL'de zaten object olabilir)
    const parsedMatches = matches.map(match => ({
      ...match,
      players: typeof match.players === 'string' ? JSON.parse(match.players) : match.players
    }));

    res.json({
      success: true,
      data: parsedMatches
    });
  } catch (error) {
    console.error('Get all matches error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
};

// Belirli bir match'i getir
const getMatchById = async (req, res) => {
  try {
    const { id } = req.params;

    const [matches] = await pool.execute(
      'SELECT * FROM matches WHERE id = ?',
      [id]
    );

    if (matches.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Match bulunamadı'
      });
    }

    const match = matches[0];
    // PostgreSQL JSONB zaten object olabilir
    if (typeof match.players === 'string') {
      match.players = JSON.parse(match.players);
    }

    res.json({
      success: true,
      data: match
    });
  } catch (error) {
    console.error('Get match by id error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
};

// Kullanıcının kendi match'lerini getir
const getMyMatches = async (req, res) => {
  try {
    const userId = req.user.id;

    const [matches] = await pool.execute(
      'SELECT * FROM matches WHERE uploader_id = ? ORDER BY match_date DESC',
      [userId]
    );

    // PostgreSQL JSONB zaten object olabilir
    const parsedMatches = matches.map(match => ({
      ...match,
      players: typeof match.players === 'string' ? JSON.parse(match.players) : match.players
    }));

    res.json({
      success: true,
      data: parsedMatches
    });
  } catch (error) {
    console.error('Get my matches error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
};

// Match istatistikleri
const getMatchStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Toplam match sayısı
    const [totalMatches] = await pool.execute(
      'SELECT COUNT(*) as total FROM matches WHERE uploader_id = ?',
      [userId]
    );

    // Mode'a göre dağılım
    const [modeStats] = await pool.execute(
      `SELECT mode, COUNT(*) as count 
       FROM matches 
       WHERE uploader_id = ? 
       GROUP BY mode`,
      [userId]
    );

    // Kazanma/beraberlik/kaybetme sayıları (score1 > score2 ise kazanma)
    const [winStats] = await pool.execute(
      `SELECT 
        SUM(CASE WHEN score1 > score2 THEN 1 ELSE 0 END) as wins,
        SUM(CASE WHEN score1 = score2 THEN 1 ELSE 0 END) as draws,
        SUM(CASE WHEN score1 < score2 THEN 1 ELSE 0 END) as losses
       FROM matches 
       WHERE uploader_id = ?`,
      [userId]
    );

    res.json({
      success: true,
      data: {
        total: totalMatches[0].total,
        modeDistribution: modeStats,
        winStats: winStats[0]
      }
    });
  } catch (error) {
    console.error('Get match stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
};

module.exports = {
  getAllMatches,
  getMatchById,
  getMyMatches,
  getMatchStats
};

