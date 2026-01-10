import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import ChatPanel from './ChatPanel'

const Layout = ({ children }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [chatOpen, setChatOpen] = useState(false)
  const [selectedFriendId, setSelectedFriendId] = useState(null)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{
        backgroundColor: '#fff',
        borderBottom: '1px solid var(--border-color)',
        padding: '1rem 0',
        boxShadow: 'var(--shadow)'
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link to="/" style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: 'var(--primary-color)',
            textDecoration: 'none'
          }}>
            ⚽ FIFA Match Tracker
          </Link>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {user && (
              <span style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>
                👤 {user.username}
              </span>
            )}
            <nav style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <Link to="/" style={{
                textDecoration: 'none',
                padding: '0.5rem 0.75rem',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                color: (location.pathname === '/' || location.pathname === '/dashboard') ? 'var(--primary-color)' : 'var(--text-color)',
                fontWeight: (location.pathname === '/' || location.pathname === '/dashboard') ? '600' : '400',
                backgroundColor: (location.pathname === '/' || location.pathname === '/dashboard') ? 'rgba(30, 64, 175, 0.1)' : 'transparent',
                transition: 'all 0.2s'
              }}>
                📊 Dashboard
              </Link>
              <Link to="/drafts" style={{
                textDecoration: 'none',
                padding: '0.5rem 0.75rem',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                color: location.pathname === '/drafts' ? 'var(--primary-color)' : 'var(--text-color)',
                fontWeight: location.pathname === '/drafts' ? '600' : '400',
                backgroundColor: location.pathname === '/drafts' ? 'rgba(30, 64, 175, 0.1)' : 'transparent',
                transition: 'all 0.2s'
              }}>
                📝 Drafts
              </Link>
              <Link to="/friends" style={{
                textDecoration: 'none',
                padding: '0.5rem 0.75rem',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                color: location.pathname === '/friends' ? 'var(--primary-color)' : 'var(--text-color)',
                fontWeight: location.pathname === '/friends' ? '600' : '400',
                backgroundColor: location.pathname === '/friends' ? 'rgba(30, 64, 175, 0.1)' : 'transparent',
                transition: 'all 0.2s'
              }}>
                👥 Arkadaşlar
              </Link>
            </nav>
            <button
              onClick={() => setChatOpen(!chatOpen)}
              className="btn btn-secondary"
              style={{ fontSize: '0.875rem', textDecoration: 'none' }}
            >
              💬 Chat
            </button>
            <button onClick={handleLogout} className="btn btn-danger" style={{ fontSize: '0.875rem' }}>
              Çıkış
            </button>
          </div>
        </div>
      </nav>

      {/* Chat Panel */}
      <ChatPanel
        isOpen={chatOpen}
        onClose={() => {
          setChatOpen(false)
          setSelectedFriendId(null)
        }}
        selectedFriendId={selectedFriendId}
        onFriendSelect={setSelectedFriendId}
      />

      <main style={{ flex: 1, padding: '2rem 0' }}>
        <div className="container">
          {children}
        </div>
      </main>

      <footer style={{
        backgroundColor: '#fff',
        borderTop: '1px solid var(--border-color)',
        padding: '1.5rem 0',
        marginTop: 'auto',
        textAlign: 'center',
        color: 'var(--text-light)',
        fontSize: '0.875rem'
      }}>
        <div className="container">
          © 2026 FIFA Match Tracker. Tüm hakları saklıdır.
        </div>
      </footer>
    </div>
  )
}

export default Layout

