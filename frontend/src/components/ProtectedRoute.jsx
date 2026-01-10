import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user, token } = useAuth()
  const location = useLocation()

  // Development mode: Mock authentication bypass
  // Vite'da sadece MODE kullanılır (DEV diye bir şey yok!)
  const isDevMode = import.meta.env.MODE === 'development' ||
    import.meta.env.DEV === true ||
    import.meta.env.VITE_DEV_MODE === 'true' ||
    (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))

  // DEBUG: Development mode kontrolü
  console.log('🔍 ProtectedRoute isDevMode kontrolü:', {
    MODE: import.meta.env.MODE,
    VITE_DEV_MODE: import.meta.env.VITE_DEV_MODE,
    isDevMode: isDevMode
  })

  // Mock token ve user kontrolü (localStorage ve state'ten) - her render'da kontrol et
  // localStorage'dan direkt kontrol et çünkü state update bekleme
  const savedTokenFromStorage = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  // Falsy token kontrolü (mock-token hariç - o zaten geçerli bir token!)
  const isFalsyMode = !savedTokenFromStorage ||
    savedTokenFromStorage === 'null' ||
    savedTokenFromStorage === 'undefined' ||
    savedTokenFromStorage === '' ||
    savedTokenFromStorage === 'false'
  // mock-token ayrı kontrol ediliyor (mockToken değişkeni)

  const mockTokenInState = token === 'mock-token'
  const mockToken = (savedTokenFromStorage === 'mock-token') || mockTokenInState
  const isMockUser = user?.username === 'testuser' || user?.email === 'test@example.com'

  // Development mode'da her türlü falsy durumda veya mock-token'da geçişe izin ver
  const shouldUseMockToken = isDevMode && (isFalsyMode || mockToken || isMockUser)

  // DEBUG: Console'a yazdır (geliştirme için)
  if (isDevMode) {
    console.log('🔍 ProtectedRoute DEBUG:', {
      isDevMode,
      savedTokenFromStorage,
      isFalsyMode,
      mockTokenInState,
      mockToken,
      isMockUser,
      shouldUseMockToken,
      user,
      token,
      loading,
      isAuthenticated
    })
  }

  // Development mode kontrolü - ÖNCE bu kontrol edilmeli
  // Loading bitmeden bile mock user'ı kabul et (sadece development mode'da)
  if (isDevMode) {
    // Development mode'da token yoksa veya mock-token ise direkt geç
    // Mock token, mock user veya shouldUseMockToken varsa direkt geç (loading beklemeden, isAuthenticated kontrolü yapmadan)
    // localStorage'dan direkt kontrol et, state update bekleme
    if (shouldUseMockToken) {
      console.log('✅ ProtectedRoute: Mock user bulundu veya development mode, direkt geçiliyor')
      return children // Early return - mock user varsa direkt geç, isAuthenticated kontrolüne gitme
    }

    // Development mode ama mock user yok, loading bitene kadar bekle
    if (loading) {
      console.log('⏳ ProtectedRoute: Loading...')
      return (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      )
    }

    // Development mode ama mock user yok ve loading bitti, authenticated kontrolü yap
    console.log('❌ ProtectedRoute: Mock user yok, authenticated kontrolü yapılıyor')
    if (!isAuthenticated) {
      console.log('🚫 ProtectedRoute: Authenticated değil, login\'e yönlendiriliyor')
      return <Navigate to="/login" replace state={{ from: location }} />
    }

    return children
  }

  // Production mode: Loading bitene kadar bekle
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    )
  }

  // Production mode: Normal authentication kontrolü
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

export default ProtectedRoute

