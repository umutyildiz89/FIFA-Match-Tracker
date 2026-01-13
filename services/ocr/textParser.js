/**
 * Extracted text'ten match bilgilerini parse et
 */

// Mode pattern'leri
const MODE_PATTERNS = {
  clubs: /club/i,
  ultimate: /ultimate\s*team|ut|fut/i,
  seasons: /season/i,
  rivals: /rival/i
};

// Score pattern'leri (örn: "2 - 1", "3:2", "5-3")
const SCORE_PATTERN = /(\d+)\s*[:\-–]\s*(\d+)/i;

// Team name pattern (genellikle büyük harfler veya özel karakterler içerir)
const TEAM_NAME_PATTERN = /([A-Z][A-Za-z0-9\s]+(?:\s+[A-Z][A-Za-z0-9\s]+)?)/;

/**
 * Mode'u tespit et
 */
const detectMode = (text) => {
  const lowerText = text.toLowerCase();

  for (const [mode, pattern] of Object.entries(MODE_PATTERNS)) {
    if (pattern.test(lowerText)) {
      return mode === 'rivals' ? 'seasons' : mode; // Rivals as seasons
    }
  }

  // Default olarak clubs döndür
  return 'clubs';
};

/**
 * Score'u tespit et
 */
const extractScore = (text) => {
  const matches = text.match(SCORE_PATTERN);
  
  if (matches && matches.length >= 3) {
    const score1 = parseInt(matches[1], 10);
    const score2 = parseInt(matches[2], 10);
    
    if (!isNaN(score1) && !isNaN(score2) && score1 >= 0 && score2 >= 0) {
      return { score1, score2 };
    }
  }

  // Alternatif pattern'ler dene
  const altPatterns = [
    /(\d+)\s+(\d+)/, // "2 1" formatı
    /score[:\s]+(\d+)[:\s\-]+(\d+)/i,
    /(\d+)\s*-\s*(\d+)/
  ];

  for (const pattern of altPatterns) {
    const match = text.match(pattern);
    if (match) {
      const score1 = parseInt(match[1], 10);
      const score2 = parseInt(match[2], 10);
      if (!isNaN(score1) && !isNaN(score2)) {
        return { score1, score2 };
      }
    }
  }

  return null;
};

/**
 * Team name'leri tespit et
 */
const extractTeamNames = (text) => {
  const lines = text.split('\n').filter(line => line.trim().length > 2);
  const teamNames = [];

  // Score satırından önceki satırları kontrol et
  const scoreIndex = lines.findIndex(line => SCORE_PATTERN.test(line));
  
  if (scoreIndex > 0) {
    // Score'dan önceki 2 satır team name olabilir
    for (let i = Math.max(0, scoreIndex - 3); i < scoreIndex; i++) {
      const line = lines[i].trim();
      if (line.length > 2 && line.length < 50 && !/\d{2,}/.test(line)) {
        // Sayı içermeyen, uzunluk kontrolü geçen satırları al
        teamNames.push(line);
      }
    }
  }

  // Eğer team name bulunamadıysa, büyük harfle başlayan satırları ara
  if (teamNames.length < 2) {
    const capitalLines = lines.filter(line => {
      const trimmed = line.trim();
      return trimmed.length > 2 && 
             trimmed.length < 50 && 
             /^[A-Z]/.test(trimmed) &&
             !SCORE_PATTERN.test(trimmed);
    });

    teamNames.push(...capitalLines.slice(0, 2));
  }

  // İlk 2 unique team name'i al
  const uniqueTeams = [...new Set(teamNames.map(name => name.trim()))].slice(0, 2);

  return {
    team1_name: uniqueTeams[0] || 'Team 1',
    team2_name: uniqueTeams[1] || 'Team 2'
  };
};

/**
 * Player name'leri tespit et
 */
const extractPlayerNames = (text) => {
  const lines = text.split('\n').filter(line => line.trim().length > 1);
  const players = [];
  
  // Player name pattern: genellikle büyük harfle başlayan, 3-30 karakter arası
  // Sayı, skor veya özel karakter içermeyen satırlar
  const playerPattern = /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*$/;

  for (const line of lines) {
    const trimmed = line.trim();
    
    // Player name kontrolü
    if (trimmed.length >= 3 && 
        trimmed.length <= 30 && 
        playerPattern.test(trimmed) &&
        !SCORE_PATTERN.test(trimmed) &&
        !/\d{2,}/.test(trimmed)) {
      players.push(trimmed);
    }
  }

  // Unique player name'leri al ve sınırla (max 22 oyuncu - 11 vs 11)
  const uniquePlayers = [...new Set(players)].slice(0, 22);

  return uniquePlayers.length > 0 ? uniquePlayers : [];
};

/**
 * Text'i parse et ve match data'sı oluştur
 */
const parseMatchData = (extractedText) => {
  try {
    const { text, lines } = extractedText;

    // Mode'u tespit et
    const mode = detectMode(text);

    // Score'u tespit et
    const scoreData = extractScore(text);
    if (!scoreData) {
      console.warn('Score bulunamadı, default değerler kullanılıyor');
    }

    // Team name'leri tespit et
    const teams = extractTeamNames(text);

    // Player name'leri tespit et
    const players = extractPlayerNames(text);

    // Best-effort parsing - eksik veri olsa bile döndür
    const matchData = {
      mode: mode || 'clubs',
      team1_name: teams.team1_name || 'Team 1',
      team2_name: teams.team2_name || 'Team 2',
      score1: scoreData?.score1 ?? 0,
      score2: scoreData?.score2 ?? 0,
      players: players.length > 0 ? players : ['Unknown Player'],
      rawText: text.substring(0, 500) // Debug için raw text'in bir kısmı
    };

    console.log('Parsed match data:', JSON.stringify(matchData, null, 2));

    return matchData;
  } catch (error) {
    console.error('Parse match data error:', error.message);
    // Hata durumunda default data döndür
    return {
      mode: 'clubs',
      team1_name: 'Team 1',
      team2_name: 'Team 2',
      score1: 0,
      score2: 0,
      players: [],
      error: error.message
    };
  }
};

module.exports = {
  detectMode,
  extractScore,
  extractTeamNames,
  extractPlayerNames,
  parseMatchData
};

