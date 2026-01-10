import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()
  
  // Not: Mock user redirect'i App.jsx'teki route yapısı ile handle ediliyor
  // Login sayfasına mock user ile gelinirse, wildcard route veya ProtectedRoute handle eder
  // Bu sayfada ekstra redirect'e gerek yok - loop önlenir

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    const result = await login(emailOrUsername, password)
    
    if (result.success) {
      navigate('/')
    } else {
      setError(result.message || 'Giriş başarısız')
    }
    
    setSubmitting(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-color)',
      padding: '1rem'
    }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <h1 style={{
          fontSize: '1.875rem',
          fontWeight: 'bold',
          marginBottom: '0.5rem',
          textAlign: 'center'
        }}>
          FIFA Match Tracker
        </h1>
        <p style={{
          color: 'var(--text-light)',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          Maçlarını takip et, arkadaşlarınla rekabet et
        </p>

        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{
              padding: '0.75rem',
              backgroundColor: '#fee2e2',
              color: 'var(--danger-color)',
              borderRadius: '0.375rem',
              marginBottom: '1rem',
              fontSize: '0.875rem'
            }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              Email veya Kullanıcı Adı
            </label>
            <input
              type="text"
              className="input"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              placeholder="email@example.com veya kullanıcı adı"
              required
              autoFocus
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              Şifre
            </label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginBottom: '1rem' }}
            disabled={submitting}
          >
            {submitting ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>

          <p style={{
            textAlign: 'center',
            color: 'var(--text-light)',
            fontSize: '0.875rem'
          }}>
            Hesabın yok mu?{' '}
            <Link to="/register" style={{
              color: 'var(--primary-color)',
              textDecoration: 'none',
              fontWeight: '500'
            }}>
              Kayıt Ol
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login

