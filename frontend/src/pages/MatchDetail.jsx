import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { matchesService } from '../services/api'

const MatchDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [match, setMatch] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadMatch()
  }, [id])

  const loadMatch = async () => {
    try {
      setLoading(true)
      const matchData = await matchesService.getById(id)
      
      if (matchData.players && typeof matchData.players === 'string') {
        matchData.players = JSON.parse(matchData.players)
      }
      
      setMatch(matchData)
    } catch (err) {
      setError('Maç bulunamadı')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    )
  }

  if (error || !match) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Maç Bulunamadı</h2>
        <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem' }}>
          {error || 'Aradığınız maç bulunamadı'}
        </p>
        <Link to="/" className="btn btn-primary">
          Dashboard'a Dön
        </Link>
      </div>
    )
  }

  const players = Array.isArray(match.players) ? match.players : []

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <button
          onClick={() => navigate(-1)}
          className="btn btn-secondary"
          style={{ marginBottom: '1rem' }}
        >
          ← Geri
        </button>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'start',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <div>
            <span style={{
              fontSize: '0.875rem',
              color: 'var(--text-light)',
              textTransform: 'uppercase',
              fontWeight: '600'
            }}>
              {match.mode}
            </span>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginTop: '0.25rem'
            }}>
              {match.team1_name} vs {match.team2_name}
            </h1>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontSize: '0.875rem',
              color: 'var(--text-light)',
              marginBottom: '0.25rem'
            }}>
              {new Date(match.match_date).toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
            {match.draft_id && (
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--text-light)'
              }}>
                Draft ID: {match.draft_id}
              </div>
            )}
          </div>
        </div>

        <div style={{
          textAlign: 'center',
          padding: '2rem',
          backgroundColor: 'var(--bg-color)',
          borderRadius: '0.5rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            fontSize: '4rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem'
          }}>
            {match.score1} - {match.score2}
          </div>
          <div style={{
            fontSize: '0.875rem',
            color: 'var(--text-light)'
          }}>
            {match.score1 > match.score2 ? 'Kazandın! 🎉' : 
             match.score1 < match.score2 ? 'Kaybettin 😢' : 
             'Berabere 🤝'}
          </div>
        </div>

        {match.image_url && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '600',
              marginBottom: '0.5rem'
            }}>
              Maç Ekran Görüntüsü
            </h3>
            <img
              src={match.image_url}
              alt="Match screenshot"
              style={{
                width: '100%',
                maxHeight: '600px',
                objectFit: 'contain',
                borderRadius: '0.375rem',
                border: '1px solid var(--border-color)'
              }}
            />
          </div>
        )}

        {players.length > 0 && (
          <div>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '600',
              marginBottom: '0.75rem'
            }}>
              Oyuncular ({players.length})
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: '0.5rem'
            }}>
              {players.map((player, index) => (
                <div
                  key={index}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: 'var(--bg-color)',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    textAlign: 'center'
                  }}
                >
                  {player}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MatchDetail

