import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { friendsService } from '../services/api'
import { useChat } from '../hooks/useChat'
import { useSocket } from '../hooks/useSocket'
import { getSocket } from '../services/socket'

const ChatPanel = ({ isOpen, onClose, selectedFriendId, onFriendSelect }) => {
  const { user } = useAuth()
  const { connected } = useSocket()
  const [friends, setFriends] = useState([])
  const [onlineFriends, setOnlineFriends] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [typingTimeout, setTypingTimeout] = useState(null)

  const selectedFriend = friends.find(f => (f.id || f.friend_id) === selectedFriendId)
  const chat = useChat(selectedFriendId || null)

  useEffect(() => {
    if (isOpen) {
      loadFriends()
    }
  }, [isOpen])

  const loadFriends = async () => {
    try {
      setLoading(true)
      const friendsData = await friendsService.getList()
      setFriends(friendsData)
    } catch (err) {
      console.error('Load friends error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Socket event: friend status change (online/offline)
  useEffect(() => {
    const socket = chat.socket || getSocket()
    if (!socket || !isOpen || !connected) return

    const handleFriendStatusChange = (data) => {
      setOnlineFriends(prev => {
        const newSet = new Set(prev)
        if (data.isOnline) {
          newSet.add(data.userId)
        } else {
          newSet.delete(data.userId)
        }
        return newSet
      })
    }

    socket.on('friend_status_change', handleFriendStatusChange)

    return () => {
      socket?.off('friend_status_change', handleFriendStatusChange)
    }
  }, [chat.socket, isOpen, connected])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!message.trim() || !selectedFriendId) return

    const result = await chat.sendMessage(message)
    if (result.success) {
      setMessage('')
      chat.stopTyping()
    }
  }

  const handleMessageChange = (e) => {
    setMessage(e.target.value)
    
    // Typing indicator
    if (!chat.typing && selectedFriendId) {
      chat.startTyping()
    }

    // Clear existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout)
    }

    // Set new timeout to stop typing
    const timeout = setTimeout(() => {
      chat.stopTyping()
    }, 1000)

    setTypingTimeout(timeout)
  }

  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout)
      }
    }
  }, [typingTimeout])

  if (!isOpen) return null

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999
          }}
        />
      )}
      <div style={{
        position: 'fixed',
        right: '0',
        top: '0',
        height: '100vh',
        width: '400px',
        maxWidth: '90vw',
        backgroundColor: '#fff',
        boxShadow: '-2px 0 10px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
        transition: 'transform 0.3s ease-in-out',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)'
      }}>
      {/* Header */}
      <div style={{
        padding: '1rem',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'var(--primary-color)',
        color: 'white'
      }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: '600', margin: 0 }}>
          💬 Chat
        </h2>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '1.5rem',
            cursor: 'pointer',
            padding: '0',
            width: '2rem',
            height: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ✕
        </button>
      </div>

      {/* Friends List / Chat Area */}
      {!selectedFriendId ? (
        <div style={{ flex: 1, overflow: 'auto' }}>
          {!connected && (
            <div style={{
              padding: '1rem',
              backgroundColor: '#fee2e2',
              color: 'var(--danger-color)',
              fontSize: '0.875rem',
              textAlign: 'center'
            }}>
              ⚠️ Bağlantı yok. Chat kullanılamıyor.
            </div>
          )}
          
          {loading ? (
            <div className="loading" style={{ padding: '2rem' }}>
              <div className="spinner"></div>
            </div>
          ) : friends.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-light)' }}>
              Arkadaşın yok. Arkadaş ekleyerek başla!
            </div>
          ) : (
            <div>
              {friends.map(friend => {
                const friendId = friend.id || friend.friend_id
                const isOnline = onlineFriends.has(friendId)
                return (
                  <div
                    key={friendId}
                    onClick={() => onFriendSelect(friendId)}
                    style={{
                      padding: '1rem',
                      borderBottom: '1px solid var(--border-color)',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-color)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary-color)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      position: 'relative'
                    }}>
                      {friend.username?.[0]?.toUpperCase() || '?'}
                      {isOnline && (
                        <div style={{
                          position: 'absolute',
                          bottom: '0',
                          right: '0',
                          width: '0.75rem',
                          height: '0.75rem',
                          borderRadius: '50%',
                          backgroundColor: 'var(--success-color)',
                          border: '2px solid white'
                        }} />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>
                        {friend.username}
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: isOnline ? 'var(--success-color)' : 'var(--text-light)'
                      }}>
                        {isOnline ? '🟢 Çevrimiçi' : '⚫ Çevrimdışı'}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Chat Header */}
          <div style={{
            padding: '1rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'var(--bg-color)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={() => onFriendSelect(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.25rem',
                  cursor: 'pointer',
                  padding: '0.25rem'
                }}
              >
                ←
              </button>
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>
                  {selectedFriend?.username || 'Bilinmeyen Kullanıcı'}
                </div>
                {chat.friendTyping && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontStyle: 'italic' }}>
                    Yazıyor...
                  </div>
                )}
              </div>
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: onlineFriends.has(selectedFriendId) ? 'var(--success-color)' : 'var(--text-light)'
            }}>
              {onlineFriends.has(selectedFriendId) ? '🟢 Çevrimiçi' : '⚫ Çevrimdışı'}
            </div>
          </div>

          {/* Messages List */}
          <div style={{
            flex: 1,
            overflow: 'auto',
            padding: '1rem',
            backgroundColor: '#f8f9fa'
          }}>
            {chat.loading ? (
              <div className="loading">
                <div className="spinner"></div>
              </div>
            ) : chat.messages.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '2rem',
                color: 'var(--text-light)'
              }}>
                Henüz mesaj yok. İlk mesajı sen gönder! 👋
              </div>
            ) : (
              chat.messages.map((msg, index) => {
                const isOwn = msg.senderId === user?.id
                return (
                  <div
                    key={msg.id || index}
                    style={{
                      display: 'flex',
                      justifyContent: isOwn ? 'flex-end' : 'flex-start',
                      marginBottom: '0.75rem'
                    }}
                  >
                    <div style={{
                      maxWidth: '70%',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '0.75rem',
                      backgroundColor: isOwn ? 'var(--primary-color)' : 'white',
                      color: isOwn ? 'white' : 'var(--text-color)',
                      boxShadow: 'var(--shadow)'
                    }}>
                      <div style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                        {msg.message}
                      </div>
                      <div style={{
                        fontSize: '0.625rem',
                        opacity: 0.7,
                        textAlign: 'right'
                      }}>
                        {new Date(msg.created_at || Date.now()).toLocaleTimeString('tr-TR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
            <div ref={chat.messagesEndRef} />
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} style={{
            padding: '1rem',
            borderTop: '1px solid var(--border-color)',
            backgroundColor: 'white'
          }}>
            {chat.error && (
              <div style={{
                padding: '0.5rem',
                backgroundColor: '#fee2e2',
                color: 'var(--danger-color)',
                borderRadius: '0.375rem',
                marginBottom: '0.5rem',
                fontSize: '0.75rem'
              }}>
                {chat.error}
              </div>
            )}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={message}
                onChange={handleMessageChange}
                onBlur={chat.stopTyping}
                placeholder="Mesaj yaz..."
                className="input"
                style={{ flex: 1 }}
                disabled={!connected}
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!connected || !message.trim()}
              >
                📤
              </button>
            </div>
          </form>
        </>
      )}
      </div>
    </>
  )
}

export default ChatPanel

