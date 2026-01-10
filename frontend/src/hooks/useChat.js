import { useState, useEffect, useCallback, useRef } from 'react'
import { getSocket } from '../services/socket'

export const useChat = (friendId) => {
  const [socket, setSocket] = useState(null)
  const [connected, setConnected] = useState(false)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [typing, setTyping] = useState(false)
  const [friendTyping, setFriendTyping] = useState(false)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)

  // Get socket instance
  useEffect(() => {
    const socketInstance = getSocket()
    if (socketInstance) {
      setSocket(socketInstance)
      setConnected(socketInstance.connected)

      const handleConnect = () => {
        setConnected(true)
      }

      const handleDisconnect = () => {
        setConnected(false)
      }

      socketInstance.on('connect', handleConnect)
      socketInstance.on('disconnect', handleDisconnect)

      return () => {
        socketInstance.off('connect', handleConnect)
        socketInstance.off('disconnect', handleDisconnect)
      }
    }
  }, [])

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load chat history
  const loadMessages = useCallback(async (limit = 50, offset = 0) => {
    if (!socket || !friendId || !connected) return

    try {
      setLoading(true)
      setError(null)
      
      socket.emit('get_messages', { friendId, limit, offset })
      
      socket.once('messages_history', (data) => {
        if (data.friendId === friendId) {
          setMessages(data.messages || [])
        }
        setLoading(false)
      })
    } catch (err) {
      console.error('Load messages error:', err)
      setError('Mesaj geçmişi yüklenirken hata oluştu')
      setLoading(false)
    }
  }, [socket, friendId, connected])

  // Send message
  const sendMessage = useCallback(async (message) => {
    if (!socket || !friendId || !connected || !message.trim()) {
      return { success: false, error: 'Bağlantı yok veya mesaj boş' }
    }

    try {
      setError(null)
      setTyping(false)
      
      // Stop typing indicator
      socket.emit('typing_stop', { receiverId: friendId })
      
      // Send message
      socket.emit('send_message', { receiverId: friendId, message: message.trim() })
      
      // Wait for confirmation
      return new Promise((resolve) => {
        socket.once('message_sent', (data) => {
          if (data.receiverId === friendId) {
            setMessages(prev => [...prev, data])
            resolve({ success: true, data })
          }
        })

        socket.once('error', (error) => {
          setError(error.message || 'Mesaj gönderilemedi')
          resolve({ success: false, error: error.message })
        })

        // Timeout after 5 seconds
        setTimeout(() => {
          resolve({ success: false, error: 'Mesaj gönderilemedi (timeout)' })
        }, 5000)
      })
    } catch (err) {
      console.error('Send message error:', err)
      setError('Mesaj gönderilemedi')
      return { success: false, error: err.message }
    }
  }, [socket, friendId, connected])

  // Typing indicators
  const startTyping = useCallback(() => {
    if (!socket || !friendId || !connected) return
    setTyping(true)
    socket.emit('typing_start', { receiverId: friendId })
  }, [socket, friendId, connected])

  const stopTyping = useCallback(() => {
    if (!socket || !friendId || !connected) return
    setTyping(false)
    socket.emit('typing_stop', { receiverId: friendId })
  }, [socket, friendId, connected])

  // Socket event listeners
  useEffect(() => {
    if (!socket || !friendId || !connected) return

    // Receive message
    const handleReceiveMessage = (data) => {
      if (data.senderId === friendId || data.receiverId === friendId) {
        setMessages(prev => {
          // Check if message already exists
          const exists = prev.find(m => m.id === data.id)
          if (exists) return prev
          return [...prev, data]
        })
      }
    }

    // User typing
    const handleUserTyping = (data) => {
      if (data.userId === friendId) {
        setFriendTyping(true)
      }
    }

    // User stopped typing
    const handleUserStoppedTyping = (data) => {
      if (data.userId === friendId) {
        setFriendTyping(false)
      }
    }

    socket.on('receive_message', handleReceiveMessage)
    socket.on('user_typing', handleUserTyping)
    socket.on('user_stopped_typing', handleUserStoppedTyping)

    // Load messages when friend changes
    loadMessages()

    return () => {
      socket.off('receive_message', handleReceiveMessage)
      socket.off('user_typing', handleUserTyping)
      socket.off('user_stopped_typing', handleUserStoppedTyping)
    }
  }, [socket, friendId, connected, loadMessages])

  return {
    messages,
    loading,
    error,
    typing,
    friendTyping,
    connected,
    sendMessage,
    loadMessages,
    startTyping,
    stopTyping,
    messagesEndRef
  }
}

