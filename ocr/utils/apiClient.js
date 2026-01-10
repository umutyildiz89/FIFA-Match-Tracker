import axios from 'axios';

/**
 * Backend API client
 */

/**
 * Backend'e draft oluşturma isteği gönder
 */
export const sendDraftToBackend = async (matchData, imageUrl, jwtToken, backendUrl = 'http://localhost:3000') => {
  try {
    const endpoint = `${backendUrl}/api/drafts/ocr`;

    const payload = {
      mode: matchData.mode,
      team1_name: matchData.team1_name,
      team2_name: matchData.team2_name,
      score1: matchData.score1,
      score2: matchData.score2,
      players: matchData.players,
      imageUrl: imageUrl
    };

    console.log('Backend\'e gönderiliyor:', JSON.stringify(payload, null, 2));

    const response = await axios.post(endpoint, payload, {
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    console.log('Backend response:', response.data);

    return {
      success: true,
      data: response.data,
      status: response.status
    };
  } catch (error) {
    console.error('Backend request error:', error.message);
    
    if (error.response) {
      // Backend'den hata response'u
      return {
        success: false,
        error: error.response.data?.message || error.message,
        status: error.response.status,
        data: error.response.data
      };
    } else if (error.request) {
      // Request gönderildi ama response alınamadı
      return {
        success: false,
        error: 'Backend\'e bağlanılamadı',
        status: null
      };
    } else {
      // Request hazırlanırken hata
      return {
        success: false,
        error: error.message,
        status: null
      };
    }
  }
};

