import { useState, useEffect } from 'react'
import { draftsService } from '../services/api'
import ImageUpload from '../components/ImageUpload'

const Drafts = () => {
  const [drafts, setDrafts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [filter, setFilter] = useState('all') // 'all', 'pending', 'approved', 'rejected'

  useEffect(() => {
    loadDrafts()
  }, [filter])

  const loadDrafts = async () => {
    try {
      setLoading(true)
      const params = filter !== 'all' ? { status: filter } : {}
      const draftsData = await draftsService.getAll(params)
      
      // Players JSON parse
      const parsedDrafts = draftsData.map(draft => ({
        ...draft,
        players: typeof draft.players === 'string' ? JSON.parse(draft.players) : draft.players
      }))
      
      setDrafts(parsedDrafts)
    } catch (err) {
      setError('Draftlar yüklenirken hata oluştu')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id) => {
    try {
      setError('')
      setSuccess('')
      await draftsService.approve(id)
      setSuccess('Draft onaylandı ve match oluşturuldu!')
      loadDrafts()
    } catch (err) {
      const message = err.response?.data?.message || 'Draft onaylanamadı'
      setError(message)
    }
  }

  const handleReject = async (id) => {
    try {
      setError('')
      setSuccess('')
      await draftsService.reject(id)
      setSuccess('Draft reddedildi')
      loadDrafts()
    } catch (err) {
      const message = err.response?.data?.message || 'Draft reddedilemedi'
      setError(message)
    }
  }

  const handleUploadSuccess = (data) => {
    setSuccess(data.message || 'Resim başarıyla yüklendi')
    // OCR işlemi backend'de yapılacak, draft oluştuğunda otomatik görünecek
    setTimeout(() => {
      loadDrafts()
    }, 3000) // 3 saniye sonra yenile (OCR işlemi için zaman tanı)
  }

  const handleUploadError = (errorMessage) => {
    setError(errorMessage)
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
        Draft'lar
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

      {success && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#d1fae5',
          color: 'var(--success-color)',
          borderRadius: '0.375rem',
          marginBottom: '1.5rem'
        }}>
          {success}
        </div>
      )}

      {/* Image Upload */}
      <ImageUpload
        onUploadSuccess={handleUploadSuccess}
        onUploadError={handleUploadError}
      />

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1.5rem',
        borderBottom: '2px solid var(--border-color)',
        flexWrap: 'wrap'
      }}>
        {['all', 'pending', 'approved', 'rejected'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderBottom: filter === status ? '2px solid var(--primary-color)' : '2px solid transparent',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              fontWeight: filter === status ? '600' : '400',
              color: filter === status ? 'var(--primary-color)' : 'var(--text-color)',
              marginBottom: '-2px',
              textTransform: 'capitalize'
            }}
          >
            {status === 'all' ? 'Tümü' : 
             status === 'pending' ? 'Bekleyen' :
             status === 'approved' ? 'Onaylanan' : 'Reddedilen'}
            {filter === status && ` (${drafts.length})`}
          </button>
        ))}
      </div>

      {/* Drafts List */}
      {drafts.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-light)', fontSize: '1.125rem' }}>
            {filter === 'pending' 
              ? 'Bekleyen draft yok. Fotoğraf yükleyerek başla! 📸'
              : filter === 'all'
              ? 'Henüz draft yok. Fotoğraf yükleyerek başla! 📸'
              : 'Bu kategoride draft yok'}
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gap: '1rem',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))'
        }}>
          {drafts.map(draft => (
            <div key={draft.id} className="card">
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                marginBottom: '0.5rem'
              }}>
                <div>
                  <span style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-light)',
                    textTransform: 'uppercase',
                    fontWeight: '600'
                  }}>
                    {draft.mode}
                  </span>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    marginTop: '0.25rem',
                    marginBottom: '0.5rem'
                  }}>
                    {draft.team1_name} vs {draft.team2_name}
                  </h3>
                </div>
                <span style={{
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.25rem',
                  backgroundColor: draft.status === 'pending' ? '#fef3c7' :
                                  draft.status === 'approved' ? '#d1fae5' :
                                  '#fee2e2',
                  color: draft.status === 'pending' ? '#92400e' :
                         draft.status === 'approved' ? '#065f46' :
                         '#991b1b',
                  textTransform: 'capitalize',
                  fontWeight: '600'
                }}>
                  {draft.status === 'pending' ? 'Bekliyor' :
                   draft.status === 'approved' ? 'Onaylandı' :
                   draft.status === 'rejected' ? 'Reddedildi' :
                   draft.status === 'merged' ? 'Birleştirildi' : draft.status}
                </span>
              </div>

              <div style={{
                textAlign: 'center',
                padding: '1rem',
                backgroundColor: 'var(--bg-color)',
                borderRadius: '0.375rem',
                marginBottom: '1rem'
              }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 'bold'
                }}>
                  {draft.score1} - {draft.score2}
                </div>
              </div>

              {draft.image_url && (
                <img
                  src={draft.image_url}
                  alt="Draft screenshot"
                  style={{
                    width: '100%',
                    maxHeight: '200px',
                    objectFit: 'contain',
                    borderRadius: '0.375rem',
                    border: '1px solid var(--border-color)',
                    marginBottom: '1rem'
                  }}
                />
              )}

              {Array.isArray(draft.players) && draft.players.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-light)',
                    marginBottom: '0.5rem'
                  }}>
                    Oyuncular ({draft.players.length}):
                  </p>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.25rem'
                  }}>
                    {draft.players.slice(0, 5).map((player, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.25rem 0.5rem',
                          backgroundColor: 'var(--bg-color)',
                          borderRadius: '0.25rem'
                        }}
                      >
                        {player}
                      </span>
                    ))}
                    {draft.players.length > 5 && (
                      <span style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-light)'
                      }}>
                        +{draft.players.length - 5} daha
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div style={{
                fontSize: '0.75rem',
                color: 'var(--text-light)',
                marginBottom: '1rem'
              }}>
                Oluşturulma: {new Date(draft.created_at).toLocaleDateString('tr-TR')} {new Date(draft.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
              </div>

              {draft.status === 'pending' && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleApprove(draft.id)}
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                  >
                    ✅ Onayla
                  </button>
                  <button
                    onClick={() => handleReject(draft.id)}
                    className="btn btn-danger"
                    style={{ flex: 1 }}
                  >
                    ❌ Reddet
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Drafts

