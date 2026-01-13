const pool = require('../config/database');
const { canMergeDrafts, mergeDrafts } = require('../utils/draftMerge');
const { processMatchImage } = require('../services/ocr');

// OCR sonucu geldiğinde draft oluştur
const createDraftFromOCR = async (req, res) => {
  try {
    const { mode, team1_name, team2_name, score1, score2, players, imageUrl } = req.body;
    const uploaderId = req.user.id;

    // Validasyon
    if (!mode || !team1_name || !team2_name || score1 === undefined || score2 === undefined || !players) {
      return res.status(400).json({
        success: false,
        message: 'Mode, takım adları, skor ve oyuncular gereklidir'
      });
    }

    if (!Array.isArray(players) || players.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Oyuncu listesi geçerli bir array olmalıdır'
      });
    }

    const timestamp = new Date();

    // Draft'ı oluştur (PostgreSQL: RETURNING clause ile id al)
    const [result] = await pool.execute(
      `INSERT INTO drafts (mode, team1_name, team2_name, score1, score2, players, image_url, uploader_id, timestamp, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending') RETURNING id`,
      [mode, team1_name, team2_name, score1, score2, JSON.stringify(players), imageUrl || null, uploaderId, timestamp]
    );

    const draftId = result.insertId || result[0]?.id;

    // Oluşturulan draft'ı getir
    const [drafts] = await pool.execute(
      'SELECT * FROM drafts WHERE id = ?',
      [draftId]
    );

    if (drafts.length === 0) {
      return res.status(500).json({
        success: false,
        message: 'Draft oluşturulurken hata oluştu'
      });
    }

    const newDraft = drafts[0];
    // PostgreSQL JSONB zaten object olabilir
    if (typeof newDraft.players === 'string') {
      newDraft.players = JSON.parse(newDraft.players);
    }

    // Merge kontrolü yap
    await checkAndMergeDrafts(newDraft);

    // Güncellenmiş draft'ı tekrar getir
    const [updatedDrafts] = await pool.execute(
      'SELECT * FROM drafts WHERE id = ?',
      [draftId]
    );

    const finalDraft = updatedDrafts[0];
    // PostgreSQL JSONB zaten object olabilir, parse etmeye çalış
    if (typeof finalDraft.players === 'string') {
      finalDraft.players = JSON.parse(finalDraft.players);
    }

    res.status(201).json({
      success: true,
      message: 'Draft başarıyla oluşturuldu',
      data: finalDraft
    });
  } catch (error) {
    console.error('Create draft error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
};

// Mevcut draft'larla merge kontrolü yap
const checkAndMergeDrafts = async (newDraft) => {
  try {
    // Son 10 dakika içindeki aynı mod'daki pending draft'ları getir
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    
    const [existingDrafts] = await pool.execute(
      `SELECT * FROM drafts 
       WHERE mode = ? 
       AND status = 'pending' 
       AND timestamp >= ? 
       AND id != ?`,
      [newDraft.mode, tenMinutesAgo, newDraft.id]
    );

    for (const existingDraft of existingDrafts) {
      // PostgreSQL JSONB zaten object olabilir
      if (typeof existingDraft.players === 'string') {
        existingDraft.players = JSON.parse(existingDraft.players);
      }
      
      if (canMergeDrafts(newDraft, existingDraft)) {
        // Merge işlemi
        const mergedData = mergeDrafts(newDraft, existingDraft);

        // Eski draft'ı merged olarak işaretle ve merged_with'i set et
        await pool.execute(
          `UPDATE drafts 
           SET status = 'merged', merged_with = ? 
           WHERE id = ?`,
          [newDraft.id, existingDraft.id]
        );

        // Yeni draft'ı güncelle
        await pool.execute(
          `UPDATE drafts 
           SET team1_name = ?, team2_name = ?, score1 = ?, score2 = ?, players = ?, image_url = ?
           WHERE id = ?`,
          [
            mergedData.team1_name,
            mergedData.team2_name,
            mergedData.score1,
            mergedData.score2,
            JSON.stringify(mergedData.players),
            mergedData.image_url,
            newDraft.id
          ]
        );

        console.log(`Draft ${existingDraft.id} merged with draft ${newDraft.id}`);
        break; // İlk merge'den sonra dur
      }
    }
  } catch (error) {
    console.error('Check and merge drafts error:', error);
  }
};

// Tüm draft'ları listele
const getAllDrafts = async (req, res) => {
  try {
    const { status, mode } = req.query;
    let query = 'SELECT * FROM drafts WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (mode) {
      query += ' AND mode = ?';
      params.push(mode);
    }

    query += ' ORDER BY created_at DESC';

    const [drafts] = await pool.execute(query, params);

    // Players JSONB parse et (PostgreSQL'de zaten object olabilir)
    const parsedDrafts = drafts.map(draft => ({
      ...draft,
      players: typeof draft.players === 'string' ? JSON.parse(draft.players) : draft.players
    }));

    res.json({
      success: true,
      data: parsedDrafts
    });
  } catch (error) {
    console.error('Get all drafts error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
};

// Belirli bir draft'ı getir
const getDraftById = async (req, res) => {
  try {
    const { id } = req.params;

    const [drafts] = await pool.execute(
      'SELECT * FROM drafts WHERE id = ?',
      [id]
    );

    if (drafts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Draft bulunamadı'
      });
    }

    const draft = drafts[0];
    // PostgreSQL JSONB zaten object olabilir
    if (typeof draft.players === 'string') {
      draft.players = JSON.parse(draft.players);
    }

    res.json({
      success: true,
      data: draft
    });
  } catch (error) {
    console.error('Get draft by id error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
};

// Draft'ı onayla (final match'e dönüştür)
const approveDraft = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Draft'ı getir
    const [drafts] = await pool.execute(
      'SELECT * FROM drafts WHERE id = ? AND status = ?',
      [id, 'pending']
    );

    if (drafts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Onaylanabilir draft bulunamadı (pending status)'
      });
    }

    const draft = drafts[0];

    // Match oluştur (PostgreSQL: RETURNING clause ile id al)
    const [matchResult] = await pool.execute(
      `INSERT INTO matches (mode, team1_name, team2_name, score1, score2, players, image_url, uploader_id, draft_id, match_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`,
      [
        draft.mode,
        draft.team1_name,
        draft.team2_name,
        draft.score1,
        draft.score2,
        typeof draft.players === 'string' ? draft.players : JSON.stringify(draft.players),
        draft.image_url,
        draft.uploader_id,
        draft.id,
        draft.timestamp
      ]
    );

    const matchId = matchResult.insertId || matchResult[0]?.id;

    // Draft'ı approved olarak işaretle
    await pool.execute(
      'UPDATE drafts SET status = ? WHERE id = ?',
      ['approved', id]
    );

    // Match'i getir
    const [matches] = await pool.execute(
      'SELECT * FROM matches WHERE id = ?',
      [matchId]
    );

    const match = matches[0];
    // PostgreSQL JSONB zaten object olabilir
    if (typeof match.players === 'string') {
      match.players = JSON.parse(match.players);
    }

    res.json({
      success: true,
      message: 'Draft başarıyla onaylandı ve match oluşturuldu',
      data: match
    });
  } catch (error) {
    console.error('Approve draft error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
};

// Draft'ı reddet
const rejectDraft = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      'UPDATE drafts SET status = ? WHERE id = ? AND status = ?',
      ['rejected', id, 'pending']
    );

    if ((result.affectedRows || 0) === 0) {
      return res.status(404).json({
        success: false,
        message: 'Reddedilebilir draft bulunamadı'
      });
    }

    res.json({
      success: true,
      message: 'Draft başarıyla reddedildi'
    });
  } catch (error) {
    console.error('Reject draft error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
};

// OCR ile image işle ve draft oluştur
const processImageWithOCR = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const uploaderId = req.user.id;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Image URL gereklidir'
      });
    }

    console.log(`OCR işlemi başlatılıyor: ${imageUrl}`);

    // OCR işlemini çalıştır
    const ocrResult = await processMatchImage(imageUrl, {
      preprocessOptions: {
        targetWidth: 2000,
        targetHeight: 2000,
        contrast: 1.2,
        brightness: 1.0
      }
    });

    if (!ocrResult.success || !ocrResult.matchData) {
      console.error('OCR işlemi başarısız:', ocrResult.errors);
      return res.status(500).json({
        success: false,
        message: 'OCR işlemi başarısız',
        errors: ocrResult.errors
      });
    }

    const matchData = ocrResult.matchData;
    const timestamp = new Date();

    // Draft'ı oluştur (PostgreSQL: RETURNING clause ile id al)
    const [result] = await pool.execute(
      `INSERT INTO drafts (mode, team1_name, team2_name, score1, score2, players, image_url, uploader_id, timestamp, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending') RETURNING id`,
      [
        matchData.mode || 'clubs',
        matchData.team1_name || 'Team 1',
        matchData.team2_name || 'Team 2',
        matchData.score1 ?? 0,
        matchData.score2 ?? 0,
        JSON.stringify(matchData.players || []),
        imageUrl,
        uploaderId,
        timestamp
      ]
    );

    const draftId = result.insertId || result[0]?.id;

    // Oluşturulan draft'ı getir
    const [drafts] = await pool.execute(
      'SELECT * FROM drafts WHERE id = ?',
      [draftId]
    );

    if (drafts.length === 0) {
      return res.status(500).json({
        success: false,
        message: 'Draft oluşturulurken hata oluştu'
      });
    }

    const newDraft = drafts[0];
    // PostgreSQL JSONB zaten object olabilir
    if (typeof newDraft.players === 'string') {
      newDraft.players = JSON.parse(newDraft.players);
    }

    // Merge kontrolü yap
    await checkAndMergeDrafts(newDraft);

    // Güncellenmiş draft'ı tekrar getir
    const [updatedDrafts] = await pool.execute(
      'SELECT * FROM drafts WHERE id = ?',
      [draftId]
    );

    const finalDraft = updatedDrafts[0];
    // PostgreSQL JSONB zaten object olabilir, parse etmeye çalış
    if (typeof finalDraft.players === 'string') {
      finalDraft.players = JSON.parse(finalDraft.players);
    }

    res.status(201).json({
      success: true,
      message: 'OCR işlemi tamamlandı ve draft oluşturuldu',
      data: finalDraft
    });
  } catch (error) {
    console.error('Process image with OCR error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası: ' + error.message
    });
  }
};

module.exports = {
  createDraftFromOCR,
  getAllDrafts,
  getDraftById,
  approveDraft,
  rejectDraft,
  processImageWithOCR
};

