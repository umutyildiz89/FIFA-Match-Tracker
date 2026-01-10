import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Register = () => {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır')
      return
    }

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor')
      return
    }

    setLoading(true)

    const result = await register(email, username, password)
    
    if (result.success) {
      navigate('/')
    } else {
      setError(result.message || 'Kayıt başarısız')
    }
    
    setLoading(false)
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
          Yeni hesap oluştur
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
              Email
            </label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
              autoFocus
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              Kullanıcı Adı
            </label>
            <input
              type="text"
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="kullanıcı_adı"
              required
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              Şifre (min. 6 karakter)
            </label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              Şifre Tekrar
            </label>
            <input
              type="password"
              className="input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginBottom: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
          </button>

          <p style={{
            textAlign: 'center',
            color: 'var(--text-light)',
            fontSize: '0.875rem'
          }}>
            Zaten hesabın var mı?{' '}
            <Link to="/login" style={{
              color: 'var(--primary-color)',
              textDecoration: 'none',
              fontWeight: '500'
            }}>
              Giriş Yap
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Register

