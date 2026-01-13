import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Axios instance oluştur
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor - token ekle
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - 401 durumunda logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Development mode check
    const isDevMode = import.meta.env.MODE === 'development' ||
      import.meta.env.DEV === true ||
      (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
    const isMockToken = localStorage.getItem('token') === 'mock-token'

    if (error.response?.status === 401) {
      // In production OR if it's NOT a mock token, redirect to login
      if (!isDevMode || !isMockToken) {
        localStorage.removeItem('token')
        window.location.href = '/login'
      } else {
        console.warn('⚠️ API 401 Hatası (Dev Mode): Mock token kullanıldığı için yönlendirme engellendi.')
      }
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authService = {
  register: (email, username, password) => {
    return api.post('/api/auth/register', { email, username, password })
  },

  login: (emailOrUsername, password) => {
    const isEmail = emailOrUsername.includes('@')
    const payload = isEmail
      ? { email: emailOrUsername, password }
      : { username: emailOrUsername, password }

    return api.post('/api/auth/login', payload)
  },

  getProfile: () => {
    return api.get('/api/auth/profile').then(res => res.data.data)
  }
}

// Matches API
export const matchesService = {
  getAll: (params = {}) => {
    return api.get('/api/matches', { params }).then(res => res.data.data)
  },

  getById: (id) => {
    return api.get(`/api/matches/${id}`).then(res => res.data.data)
  },

  getMyMatches: () => {
    return api.get('/api/matches/my-matches').then(res => res.data.data)
  },

  getStats: () => {
    return api.get('/api/matches/stats').then(res => res.data.data)
  }
}

// Drafts API
export const draftsService = {
  getAll: (params = {}) => {
    return api.get('/api/drafts', { params }).then(res => res.data.data)
  },

  getById: (id) => {
    return api.get(`/api/drafts/${id}`).then(res => res.data.data)
  },

  processImage: (imageUrl) => {
    return api.post('/api/drafts/process-image', { imageUrl }).then(res => res.data.data)
  },

  createFromOCR: (data) => {
    return api.post('/api/drafts/ocr', data).then(res => res.data.data)
  },

  approve: (id) => {
    return api.post(`/api/drafts/${id}/approve`).then(res => res.data.data)
  },

  reject: (id) => {
    return api.post(`/api/drafts/${id}/reject`).then(res => res.data)
  }
}

// Friends API
export const friendsService = {
  sendRequest: (friendId) => {
    return api.post('/api/friends/request', { friendId }).then(res => res.data)
  },

  getPending: () => {
    return api.get('/api/friends/pending').then(res => res.data.data)
  },

  accept: (requestId) => {
    return api.post(`/api/friends/accept/${requestId}`).then(res => res.data)
  },

  reject: (requestId) => {
    return api.post(`/api/friends/reject/${requestId}`).then(res => res.data)
  },

  getList: () => {
    return api.get('/api/friends/list').then(res => res.data.data)
  },

  remove: (friendId) => {
    return api.delete(`/api/friends/${friendId}`).then(res => res.data)
  }
}

export default api

