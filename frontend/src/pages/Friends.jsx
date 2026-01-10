import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { friendsService } from '../services/api'

const Friends = () => {
  const { user } = useAuth()
  const [friends, setFriends] = useState([])
  const [pendingRequests, setPendingRequests] = useState([])
  const [friendId, setFriendId] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [activeTab, setActiveTab] = useState('list') // 'list', 'pending', 'add'

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [friendsData, pendingData] = await Promise.all([
        friendsService.getList().catch(() => []),
        friendsService.getPending().catch(() => [])
      ])
      
      setFriends(friendsData)
      setPendingRequests(pendingData)
    } catch (err) {
      setError('Veriler yüklenirken hata oluştu')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSendRequest = async (e) => {
    e.preventDefault()
    if (!friendId.trim()) {
      setError('Lütfen kullanıcı ID girin')
      return
    }

    try {
      setError('')
      setSuccess('')
      await friendsService.sendRequest(parseInt(friendId))
      setSuccess('Arkadaşlık isteği gönderildi!')
      setFriendId('')
      loadData()
    } catch (err) {
      const message = err.response?.data?.message || 'İstek gönderilemedi'
      setError(message)
    }
  }

  const handleAccept = async (requestId) => {
    try {
      await friendsService.accept(requestId)
      setSuccess('Arkadaşlık isteği kabul edildi!')
      loadData()
    } catch (err) {
      setError('İstek kabul edilemedi')
    }
  }

  const handleReject = async (requestId) => {
    try {
      await friendsService.reject(requestId)
      setSuccess('Arkadaşlık isteği reddedildi')
      loadData()
    } catch (err) {
      setError('İstek reddedilemedi')
    }
  }

  const handleRemove = async (friendId) => {
    if (!window.confirm('Arkadaşlığı kaldırmak istediğinizden emin misiniz?')) {
      return
    }

    try {
      await friendsService.remove(friendId)
      setSuccess('Arkadaşlık kaldırıldı')
      loadData()
    } catch (err) {
      setError('Arkadaşlık kaldırılamadı')
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
        Arkadaşlarım
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

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1.5rem',
        borderBottom: '2px solid var(--border-color)'
      }}>
        <button
          onClick={() => setActiveTab('list')}
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderBottom: activeTab === 'list' ? '2px solid var(--primary-color)' : '2px solid transparent',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            fontWeight: activeTab === 'list' ? '600' : '400',
            color: activeTab === 'list' ? 'var(--primary-color)' : 'var(--text-color)',
            marginBottom: '-2px'
          }}
        >
          Arkadaşlarım ({friends.length})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderBottom: activeTab === 'pending' ? '2px solid var(--primary-color)' : '2px solid transparent',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            fontWeight: activeTab === 'pending' ? '600' : '400',
            color: activeTab === 'pending' ? 'var(--primary-color)' : 'var(--text-color)',
            marginBottom: '-2px'
          }}
        >
          Bekleyen İstekler ({pendingRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('add')}
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderBottom: activeTab === 'add' ? '2px solid var(--primary-color)' : '2px solid transparent',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            fontWeight: activeTab === 'add' ? '600' : '400',
            color: activeTab === 'add' ? 'var(--primary-color)' : 'var(--text-color)',
            marginBottom: '-2px'
          }}
        >
          Arkadaş Ekle
        </button>
      </div>

      {/* Friends List */}
      {activeTab === 'list' && (
        <div>
          {friends.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: 'var(--text-light)', fontSize: '1.125rem' }}>
                Henüz arkadaşın yok. Arkadaş ekleyerek başla! 👥
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gap: '1rem',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'
            }}>
              {friends.map(friend => (
                <div key={friend.id || friend.friend_id} className="card">
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start'
                  }}>
                    <div>
                      <h3 style={{
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        marginBottom: '0.25rem'
                      }}>
                        {friend.username}
                      </h3>
                      <p style={{
                        fontSize: '0.875rem',
                        color: 'var(--text-light)'
                      }}>
                        {friend.email}
                      </p>
                      {friend.friendship_date && (
                        <p style={{
                          fontSize: '0.75rem',
                          color: 'var(--text-light)',
                          marginTop: '0.5rem'
                        }}>
                          Arkadaşlık: {new Date(friend.friendship_date).toLocaleDateString('tr-TR')}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemove(friend.id || friend.friend_id)}
                      className="btn btn-danger"
                      style={{ fontSize: '0.875rem' }}
                    >
                      Kaldır
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pending Requests */}
      {activeTab === 'pending' && (
        <div>
          {pendingRequests.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: 'var(--text-light)', fontSize: '1.125rem' }}>
                Bekleyen arkadaşlık isteği yok
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gap: '1rem',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'
            }}>
              {pendingRequests.map(request => (
                <div key={request.id} className="card">
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    marginBottom: '0.25rem'
                  }}>
                    {request.username}
                  </h3>
                  <p style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-light)',
                    marginBottom: '1rem'
                  }}>
                    {request.email}
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleAccept(request.id)}
                      className="btn btn-primary"
                      style={{ flex: 1 }}
                    >
                      ✅ Kabul Et
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      className="btn btn-danger"
                      style={{ flex: 1 }}
                    >
                      ❌ Reddet
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Friend */}
      {activeTab === 'add' && (
        <div className="card" style={{ maxWidth: '500px' }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            marginBottom: '1rem'
          }}>
            Arkadaş Ekle
          </h2>
          <p style={{
            fontSize: '0.875rem',
            color: 'var(--text-light)',
            marginBottom: '1.5rem'
          }}>
            Arkadaş eklemek için kullanıcı ID'sini girin. Kullanıcı ID'sini profil sayfasından bulabilirsiniz.
          </p>
          <form onSubmit={handleSendRequest}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}>
                Kullanıcı ID
              </label>
              <input
                type="number"
                className="input"
                value={friendId}
                onChange={(e) => setFriendId(e.target.value)}
                placeholder="Örn: 1"
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              Arkadaşlık İsteği Gönder
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default Friends

