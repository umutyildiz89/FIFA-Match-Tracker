/**
 * Draft merge algoritması
 * İki draft'ı birleştirme koşullarını kontrol eder
 */

// İki oyuncu listesinin overlap yüzdesini hesapla
const calculatePlayerOverlap = (players1, players2) => {
  if (!players1 || !players2 || players1.length === 0 || players2.length === 0) {
    return 0;
  }

  // JSON string array olabilir, normalize et
  const list1 = Array.isArray(players1) ? players1 : JSON.parse(players1);
  const list2 = Array.isArray(players2) ? players2 : JSON.parse(players2);

  const set1 = new Set(list1.map(p => p.toLowerCase().trim()));
  const set2 = new Set(list2.map(p => p.toLowerCase().trim()));

  let overlapCount = 0;
  set1.forEach(player => {
    if (set2.has(player)) {
      overlapCount++;
    }
  });

  // Daha küçük listenin uzunluğuna göre overlap yüzdesi
  const minLength = Math.min(set1.size, set2.size);
  const overlapPercentage = minLength > 0 ? (overlapCount / minLength) * 100 : 0;

  return overlapPercentage;
};

// İki timestamp arasındaki farkı dakika cinsinden hesapla
const getTimestampDifferenceInMinutes = (timestamp1, timestamp2) => {
  const date1 = new Date(timestamp1);
  const date2 = new Date(timestamp2);
  const diffMs = Math.abs(date1 - date2);
  return diffMs / (1000 * 60); // dakika cinsinden
};

/**
 * İki draft'ın birleştirilebilir olup olmadığını kontrol et
 * @param {Object} draft1 - İlk draft
 * @param {Object} draft2 - İkinci draft
 * @returns {boolean} - Birleştirilebilir mi?
 */
const canMergeDrafts = (draft1, draft2) => {
  // Aynı draft ise false
  if (draft1.id === draft2.id) {
    return false;
  }

  // Timestamp farkı 5 dakikadan fazla ise false
  const timeDiff = getTimestampDifferenceInMinutes(draft1.timestamp, draft2.timestamp);
  if (timeDiff > 5) {
    return false;
  }

  // Aynı mod değilse false
  if (draft1.mode !== draft2.mode) {
    return false;
  }

  // Aynı skor değilse false
  if (draft1.score1 !== draft2.score1 || draft1.score2 !== draft2.score2) {
    return false;
  }

  // Oyuncu overlap yüzdesi %50'den az ise false
  const overlapPercentage = calculatePlayerOverlap(draft1.players, draft2.players);
  if (overlapPercentage < 50) {
    return false;
  }

  return true;
};

/**
 * İki draft'ı birleştir ve birleşik draft objesi döndür
 * @param {Object} draft1 - İlk draft
 * @param {Object} draft2 - İkinci draft
 * @returns {Object} - Birleşik draft
 */
const mergeDrafts = (draft1, draft2) => {
  // Daha eski olan draft'ı temel al
  const baseDraft = new Date(draft1.timestamp) < new Date(draft2.timestamp) ? draft1 : draft2;
  const otherDraft = baseDraft.id === draft1.id ? draft2 : draft1;

  // Oyuncu listelerini birleştir (unique)
  const players1 = Array.isArray(baseDraft.players) ? baseDraft.players : JSON.parse(baseDraft.players);
  const players2 = Array.isArray(otherDraft.players) ? otherDraft.players : JSON.parse(otherDraft.players);
  
  const mergedPlayersSet = new Set();
  [...players1, ...players2].forEach(player => {
    mergedPlayersSet.add(player.trim());
  });
  const mergedPlayers = Array.from(mergedPlayersSet);

  // Image URL'i koru (varsa base draft'ınki)
  const imageUrl = baseDraft.image_url || otherDraft.image_url;

  return {
    mode: baseDraft.mode,
    team1_name: baseDraft.team1_name,
    team2_name: baseDraft.team2_name,
    score1: baseDraft.score1,
    score2: baseDraft.score2,
    players: mergedPlayers,
    image_url: imageUrl,
    timestamp: baseDraft.timestamp // Daha eski timestamp'i kullan
  };
};

module.exports = {
  canMergeDrafts,
  mergeDrafts,
  calculatePlayerOverlap,
  getTimestampDifferenceInMinutes
};

