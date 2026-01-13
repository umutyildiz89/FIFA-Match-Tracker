import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/api'
import { initializeSocket, disconnectSocket } from '../services/socket'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  // Development mode: Mock user (database olmadan test için)
  // Development mode kontrolü - Vite'da sadece MODE kullanılır
  const isDevMode = import.meta.env.MODE === 'development' ||
    import.meta.env.DEV === true ||
    import.meta.env.VITE_DEV_MODE === 'true' ||
    (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))

  const MOCK_USER = {
    id: 1,
    email: 'test@example.com',
    username: 'testuser'
  }

  // Initial state: Development mode'da mock token ile başla
  const savedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  // Falsy string checks (sometimes stored by mistake)
  const isFalsyToken = !savedToken ||
    savedToken === 'null' ||
    savedToken === 'undefined' ||
    savedToken === '' ||
    savedToken === 'false'

  // If in dev mode and token is missing or invalid, assume mock-token
  const initialToken = isDevMode && isFalsyToken ? 'mock-token' : savedToken
  const shouldUseMock = isDevMode && (initialToken === 'mock-token' || isFalsyToken)

  // Development mode'da mock user varsa loading'i false yap (ilk render'da hemen geç)
  const initialLoading = isDevMode && shouldUseMock ? false : true

  const [user, setUser] = useState(shouldUseMock ? MOCK_USER : null)
  const [loading, setLoading] = useState(initialLoading)
  const [token, setToken] = useState(initialToken)

  // NOT: localStorage'a yazma işlemi useEffect içinde yapılmalı (render sırasında yapılmaz!)

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    disconnectSocket()
  }

  // loadUser fonksiyonunu tanımla (useEffect'ten önce)
  const loadUser = async () => {
    try {
      const userData = await authService.getProfile()
      setUser(userData)
    } catch (error) {
      console.error('Load user error:', error)
      // Development mode'da mock user'a dön
      if (isDevMode) {
        console.log('⚠️ API hatası: Development mode\'a geri dönülüyor (mock user)')
        setUser(MOCK_USER)
        setToken('mock-token')
        localStorage.setItem('token', 'mock-token')
      } else {
        logout()
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // DEBUG: Development mode kontrolü (sadece dev mode'da)
    if (isDevMode) {
      console.log('🔧 AuthContext useEffect:', {
        isDevMode,
        savedToken,
        initialToken,
        shouldUseMock,
        currentToken: token,
        currentUser: user
      })
    }

    // İlk render: Development mode kontrolü (sadece bir kere çalışır)
    if (isDevMode) {
      const hasToken = localStorage.getItem('token')

      // Eğer token yoksa veya mock-token ise mock user kullan
      if (!hasToken || hasToken === 'mock-token') {
        console.log('✅ AuthContext: Development mode - Mock user set ediliyor')

        // LocalStorage'a mock token yaz (eğer yoksa)
        if (!hasToken) {
          localStorage.setItem('token', 'mock-token')
          console.log('✅ AuthContext: localStorage\'a mock-token yazıldı')
        }

        // Token state'i kontrol et, eğer null veya undefined ise set et
        if (!token || token !== 'mock-token') {
          setToken('mock-token')
          console.log('✅ AuthContext: Token state mock-token olarak set edildi')
        }

        // User state'i kontrol et, eğer null veya undefined ise set et
        if (!user || user.username !== 'testuser') {
          setUser(MOCK_USER)
          console.log('✅ AuthContext: User state MOCK_USER olarak set edildi')
        }

        setLoading(false)
        console.log('✅ AuthContext: Loading false yapıldı, mock user hazır!')
        return // Early return - mock user set edildi, devam etme
      }
    }

    // Token varsa ve mock değilse kullanıcı bilgilerini yükle
    if (token && token !== 'mock-token') {
      loadUser()
      // Socket'i başlat
      initializeSocket(token)
    } else if (!isDevMode) {
      // Production mode ve token yoksa loading'i durdur
      setLoading(false)
      disconnectSocket()
    } else {
      // Development mode ve mock token varsa loading'i durdur
      // (Yukarıdaki early return'e takılmazsa buraya gelir - zaten mock user var)
      setLoading(false)
    }
  }, []) // Sadece mount'ta çalıştır - dependency array boş, sadece bir kere çalışır

  const login = async (emailOrUsername, password) => {
    try {
      const response = await authService.login(emailOrUsername, password)
      // Backend response format: { success: true, data: { token, user } }
      // Axios response.data = backend response
      const { token: newToken, user: userData } = response.data.data

      setToken(newToken)
      setUser(userData)
      localStorage.setItem('token', newToken)

      return { success: true, user: userData }
    } catch (error) {
      const message = error.response?.data?.message || 'Giriş başarısız'
      return { success: false, message }
    }
  }

  const register = async (email, username, password) => {
    try {
      const response = await authService.register(email, username, password)
      // Backend response format: { success: true, data: { token, user } }
      // Axios response.data = backend response
      const { token: newToken, user: userData } = response.data.data

      setToken(newToken)
      setUser(userData)
      localStorage.setItem('token', newToken)

      return { success: true, user: userData }
    } catch (error) {
      const message = error.response?.data?.message || 'Kayıt başarısız'
      return { success: false, message }
    }
  }

  // Development mode'da mock token varsa authenticated say
  // Normal mode'da sadece token varsa authenticated
  // NOT: Her render'da localStorage'dan tekrar oku (güncel değeri al)
  const currentTokenFromStorage = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const mockTokenFromStorage = currentTokenFromStorage === 'mock-token'
  const isMockUserInState = user?.username === 'testuser' || user?.email === 'test@example.com'
  const mockTokenInState = token === 'mock-token'

  // Current token'ı tekrar kontrol et (her render'da, localStorage güncel olabilir)
  const isCurrentFalsyToken = !currentTokenFromStorage ||
    currentTokenFromStorage === 'null' ||
    currentTokenFromStorage === 'undefined' ||
    currentTokenFromStorage === '' ||
    currentTokenFromStorage === 'false'

  // Agresif dev mode kontrolü: Localhost'ta ve token hatalıysa her zaman authenticated göster
  const mockTokenCheck = isDevMode && (mockTokenFromStorage || mockTokenInState || isMockUserInState || isCurrentFalsyToken)
  const computedIsAuthenticated = (token && token !== 'null' && token !== 'undefined') || mockTokenCheck

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: computedIsAuthenticated
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

