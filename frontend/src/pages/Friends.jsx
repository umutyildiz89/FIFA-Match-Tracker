import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { friendsService, authService } from '../services/api'

const Friends = () => {
  const { user } = useAuth()
  const [friends, setFriends] = useState([])
  const [pendingRequests, setPendingRequests] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [activeTab, setActiveTab] = useState('list') // 'list', 'pending', 'add'
  const searchTimeoutRef = useRef(null)

  useEffect(() => {
    loadData()
  }, [])

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (searchQuery.trim().length >= 2) {
      searchTimeoutRef.current = setTimeout(() => {
        handleSearch()
      }, 500)
    } else {
      setSearchResults([])
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchQuery])

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

  const handleSearch = async () => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([])
      return
    }

    try {
      setSearching(true)
      const results = await authService.searchUsers(searchQuery.trim())
      setSearchResults(results || [])
    } catch (err) {
      console.error('Search error:', err)
      setSearchResults([])
    } finally {
      setSearching(false)
    }
  }

  const handleSendRequest = async (userId, username) => {
    try {
      setError('')
      setSuccess('')
      await friendsService.sendRequest(userId, username)
      setSuccess('Arkadaşlık isteği gönderildi!')
      setSearchQuery('')
      setSearchResults([])
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

  const getFriendshipStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return <span style={{ fontSize: '0.75rem', color: 'var(--success-color)', fontWeight: '600' }}>✓ Arkadaş</span>
      case 'pending':
        return <span style={{ fontSize: '0.75rem', color: 'var(--warning-color)', fontWeight: '600' }}>⏳ Beklemede</span>
      case 'self':
        return <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Sen</span>
      default:
        return null
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
      {/* Header with FIFA Icon */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          background: 'linear-gradient(135deg, #00A8E8 0%, #0056B3 100%)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          boxShadow: '0 4px 12px rgba(0, 168, 232, 0.3)'
        }}>
          ⚽
        </div>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          margin: 0,
          background: 'linear-gradient(135deg, #00A8E8 0%, #0056B3 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Arkadaşlarım
        </h1>
      </div>

      {error && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#fee2e2',
          color: 'var(--danger-color)',
          borderRadius: '0.5rem',
          marginBottom: '1.5rem',
          border: '1px solid #fecaca',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#d1fae5',
          color: 'var(--success-color)',
          borderRadius: '0.5rem',
          marginBottom: '1.5rem',
          border: '1px solid #a7f3d0',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>✓</span>
          <span>{success}</span>
        </div>
      )}

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1.5rem',
        borderBottom: '2px solid var(--border-color)',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setActiveTab('list')}
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderBottom: activeTab === 'list' ? '3px solid #00A8E8' : '3px solid transparent',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            fontWeight: activeTab === 'list' ? '600' : '400',
            color: activeTab === 'list' ? '#00A8E8' : 'var(--text-color)',
            marginBottom: '-2px',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <span>👥</span>
          <span>Arkadaşlarım ({friends.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderBottom: activeTab === 'pending' ? '3px solid #00A8E8' : '3px solid transparent',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            fontWeight: activeTab === 'pending' ? '600' : '400',
            color: activeTab === 'pending' ? '#00A8E8' : 'var(--text-color)',
            marginBottom: '-2px',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <span>⏳</span>
          <span>Bekleyen İstekler ({pendingRequests.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('add')}
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderBottom: activeTab === 'add' ? '3px solid #00A8E8' : '3px solid transparent',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            fontWeight: activeTab === 'add' ? '600' : '400',
            color: activeTab === 'add' ? '#00A8E8' : 'var(--text-color)',
            marginBottom: '-2px',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <span>➕</span>
          <span>Arkadaş Ekle</span>
        </button>
      </div>

      {/* Friends List */}
      {activeTab === 'list' && (
        <div>
          {friends.length === 0 ? (
            <div className="card" style={{ 
              textAlign: 'center', 
              padding: '3rem',
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              border: '2px dashed var(--border-color)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
              <p style={{ color: 'var(--text-light)', fontSize: '1.125rem', fontWeight: '500' }}>
                Henüz arkadaşın yok. Arkadaş ekleyerek başla!
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gap: '1rem',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'
            }}>
              {friends.map(friend => (
                <div key={friend.id || friend.friend_id} className="card" style={{
                  border: '1px solid var(--border-color)',
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'var(--shadow)'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        marginBottom: '0.5rem'
                      }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #00A8E8 0%, #0056B3 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '18px',
                          color: 'white',
                          fontWeight: 'bold'
                        }}>
                          {friend.username?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div>
                          <h3 style={{
                            fontSize: '1.125rem',
                            fontWeight: '600',
                            marginBottom: '0.25rem',
                            color: 'var(--text-color)'
                          }}>
                            {friend.username}
                          </h3>
                          <p style={{
                            fontSize: '0.875rem',
                            color: 'var(--text-light)'
                          }}>
                            {friend.email}
                          </p>
                        </div>
                      </div>
                      {friend.friendship_date && (
                        <p style={{
                          fontSize: '0.75rem',
                          color: 'var(--text-light)',
                          marginTop: '0.5rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}>
                          <span>📅</span>
                          <span>Arkadaşlık: {new Date(friend.friendship_date).toLocaleDateString('tr-TR')}</span>
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemove(friend.id || friend.friend_id)}
                      className="btn btn-danger"
                      style={{ 
                        fontSize: '0.875rem',
                        padding: '0.5rem 1rem'
                      }}
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
            <div className="card" style={{ 
              textAlign: 'center', 
              padding: '3rem',
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              border: '2px dashed var(--border-color)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
              <p style={{ color: 'var(--text-light)', fontSize: '1.125rem', fontWeight: '500' }}>
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
                <div key={request.id} className="card" style={{
                  border: '1px solid var(--border-color)',
                  background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '1rem'
                  }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #00A8E8 0%, #0056B3 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      color: 'white',
                      fontWeight: 'bold'
                    }}>
                      {request.username?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div>
                      <h3 style={{
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        marginBottom: '0.25rem'
                      }}>
                        {request.username}
                      </h3>
                      <p style={{
                        fontSize: '0.875rem',
                        color: 'var(--text-light)'
                      }}>
                        {request.email}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleAccept(request.id)}
                      className="btn btn-primary"
                      style={{ 
                        flex: 1,
                        background: 'linear-gradient(135deg, #00A8E8 0%, #0056B3 100%)',
                        border: 'none'
                      }}
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
        <div>
          <div className="card" style={{ maxWidth: '600px', marginBottom: '1.5rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #00A8E8 0%, #0056B3 100%)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                🔍
              </div>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                margin: 0
              }}>
                Kullanıcı Ara
              </h2>
            </div>
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--text-light)',
              marginBottom: '1.5rem'
            }}>
              Arkadaş eklemek için kullanıcı adı veya email ile ara. En az 2 karakter girin.
            </p>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Kullanıcı adı veya email ile ara..."
                style={{
                  padding: '0.75rem 1rem',
                  fontSize: '1rem',
                  border: '2px solid var(--border-color)',
                  borderRadius: '0.5rem'
                }}
              />
              {searching && (
                <div style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)'
                }}>
                  <div className="spinner" style={{ width: '1rem', height: '1rem', borderWidth: '2px' }}></div>
                </div>
              )}
            </div>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="card" style={{ maxWidth: '600px' }}>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: 'var(--text-color)'
              }}>
                Arama Sonuçları ({searchResults.length})
              </h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                {searchResults.map(result => (
                  <div key={result.id} style={{
                    padding: '1rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: result.id === user?.id ? '#f0f0f0' : 'white'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      flex: 1
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: result.id === user?.id 
                          ? 'linear-gradient(135deg, #64748b 0%, #475569 100%)'
                          : 'linear-gradient(135deg, #00A8E8 0%, #0056B3 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        color: 'white',
                        fontWeight: 'bold'
                      }}>
                        {result.username?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div>
                        <div style={{
                          fontSize: '1rem',
                          fontWeight: '600',
                          marginBottom: '0.25rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          <span>{result.username}</span>
                          {getFriendshipStatusBadge(result.friendshipStatus)}
                        </div>
                        <div style={{
                          fontSize: '0.875rem',
                          color: 'var(--text-light)'
                        }}>
                          {result.email}
                        </div>
                      </div>
                    </div>
                    {result.id !== user?.id && (
                      <button
                        onClick={() => handleSendRequest(result.id, result.username)}
                        disabled={result.friendshipStatus === 'accepted' || result.friendshipStatus === 'pending'}
                        className="btn btn-primary"
                        style={{
                          fontSize: '0.875rem',
                          padding: '0.5rem 1rem',
                          background: result.friendshipStatus === 'accepted' || result.friendshipStatus === 'pending'
                            ? 'var(--secondary-color)'
                            : 'linear-gradient(135deg, #00A8E8 0%, #0056B3 100%)',
                          border: 'none',
                          cursor: result.friendshipStatus === 'accepted' || result.friendshipStatus === 'pending' ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {result.friendshipStatus === 'accepted' 
                          ? '✓ Arkadaş' 
                          : result.friendshipStatus === 'pending'
                          ? '⏳ Beklemede'
                          : '➕ İstek Gönder'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {searchQuery.trim().length >= 2 && !searching && searchResults.length === 0 && (
            <div className="card" style={{ 
              maxWidth: '600px',
              textAlign: 'center',
              padding: '2rem',
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              border: '2px dashed var(--border-color)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</div>
              <p style={{ color: 'var(--text-light)', fontSize: '1rem' }}>
                Kullanıcı bulunamadı
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Friends
