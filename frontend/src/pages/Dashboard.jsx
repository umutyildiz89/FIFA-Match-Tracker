import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { matchesService, draftsService } from '../services/api'

const Dashboard = () => {
  const { user } = useAuth()
  const [matches, setMatches] = useState([])
  const [drafts, setDrafts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [matchesData, draftsData] = await Promise.all([
        matchesService.getMyMatches().catch(() => {
          // Database yoksa mock data göster
          console.warn('API hatası: Database bağlantısı yok. Mock data gösteriliyor.')
          return []
        }),
        draftsService.getAll({ status: 'pending' }).catch(() => {
          // Database yoksa mock data göster
          console.warn('API hatası: Database bağlantısı yok. Mock data gösteriliyor.')
          return []
        })
      ])
      
      setMatches(matchesData)
      setDrafts(draftsData)
      
      // Database yoksa kullanıcıya bilgi ver
      if (matchesData.length === 0 && draftsData.length === 0) {
        console.log('💡 İpucu: Database bağlantısı yok. API\'ler çalışmıyor.')
        console.log('💡 Database kurmak için: XAMPP/WAMP veya PlanetScale')
      }
    } catch (err) {
      setError('Veriler yüklenirken hata oluştu (Database bağlantısı gerekli)')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleApproveDraft = async (id) => {
    try {
      await draftsService.approve(id)
      setDrafts(drafts.filter(d => d.id !== id))
      loadData() // Refresh matches
    } catch (err) {
      alert('Draft onaylanırken hata oluştu')
    }
  }

  const handleRejectDraft = async (id) => {
    try {
      await draftsService.reject(id)
      setDrafts(drafts.filter(d => d.id !== id))
    } catch (err) {
      alert('Draft reddedilirken hata oluştu')
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 style={{
        fontSize: '2rem',
        fontWeight: 'bold',
        marginBottom: '2rem'
      }}>
        Hoş geldin, {user?.username}! 👋
      </h1>

      {error && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#fee2e2',
          color: 'var(--danger-color)',
          borderRadius: '0.375rem',
          marginBottom: '1.5rem'
        }}>
          {error}
        </div>
      )}

      {/* Pending Drafts */}
      {drafts.length > 0 && (
        <section style={{ marginBottom: '2rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600'
            }}>
              Bekleyen Draft'lar ({drafts.length})
            </h2>
            <Link
              to="/drafts"
              className="btn btn-secondary"
              style={{ textDecoration: 'none', fontSize: '0.875rem' }}
            >
              Tümünü Gör →
            </Link>
          </div>
          <div style={{
            display: 'grid',
            gap: '1rem',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'
          }}>
            {drafts.slice(0, 3).map(draft => (
              <div key={draft.id} className="card">
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem'
                }}>
                  {draft.mode?.toUpperCase()} - {draft.team1_name} vs {draft.team2_name}
                </h3>
                <p style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem',
                  textAlign: 'center'
                }}>
                  {draft.score1} - {draft.score2}
                </p>
                <p style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-light)',
                  marginBottom: '1rem'
                }}>
                  {Array.isArray(draft.players) ? draft.players.length : 0} oyuncu tespit edildi
                </p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleApproveDraft(draft.id)}
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                  >
                    ✅ Onayla
                  </button>
                  <button
                    onClick={() => handleRejectDraft(draft.id)}
                    className="btn btn-danger"
                    style={{ flex: 1 }}
                  >
                    ❌ Reddet
                  </button>
                </div>
              </div>
            ))}
          </div>
          {drafts.length > 3 && (
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <Link
                to="/drafts"
                style={{
                  color: 'var(--primary-color)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                +{drafts.length - 3} draft daha gör →
              </Link>
            </div>
          )}
        </section>
      )}

      {/* My Matches */}
      <section>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          marginBottom: '1rem'
        }}>
          Maçlarım ({matches.length})
        </h2>
        {matches.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--text-light)', fontSize: '1.125rem', marginBottom: '1rem' }}>
              {error ? '⚠️ Database bağlantısı yok. API\'ler çalışmıyor.' : 'Henüz maç eklenmemiş. Fotoğraf yükleyerek başla! 📸'}
            </p>
            {error && (
              <div style={{
                padding: '1rem',
                backgroundColor: '#fef3c7',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                color: '#92400e'
              }}>
                <strong>💡 İpucu:</strong> Database kurmak için XAMPP/WAMP veya PlanetScale kullan. 
                Detaylar için <code>LOCAL_SETUP.md</code> dosyasına bak.
              </div>
            )}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gap: '1rem',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'
          }}>
            {matches.map(match => (
              <Link
                key={match.id}
                to={`/matches/${match.id}`}
                style={{
                  textDecoration: 'none',
                  color: 'inherit'
                }}
              >
                <div className="card" style={{
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'var(--shadow)'
                }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    marginBottom: '0.5rem'
                  }}>
                    <h3 style={{
                      fontSize: '0.875rem',
                      color: 'var(--text-light)',
                      textTransform: 'uppercase',
                      fontWeight: '600'
                    }}>
                      {match.mode}
                    </h3>
                    <span style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-light)'
                    }}>
                      {new Date(match.match_date).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                  <h4 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    marginBottom: '0.5rem'
                  }}>
                    {match.team1_name} vs {match.team2_name}
                  </h4>
                  <p style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    marginBottom: '0.5rem',
                    textAlign: 'center'
                  }}>
                    {match.score1} - {match.score2}
                  </p>
                  {match.image_url && (
                    <img
                      src={match.image_url}
                      alt="Match screenshot"
                      style={{
                        width: '100%',
                        maxHeight: '150px',
                        objectFit: 'contain',
                        borderRadius: '0.375rem',
                        marginTop: '0.5rem',
                        border: '1px solid var(--border-color)'
                      }}
                    />
                  )}
                  <div style={{
                    marginTop: '0.5rem',
                    fontSize: '0.75rem',
                    color: 'var(--primary-color)',
                    textAlign: 'right'
                  }}>
                    Detayları gör →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Dashboard

