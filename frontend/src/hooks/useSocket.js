import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { initializeSocket, getSocket, disconnectSocket } from '../services/socket'

export const useSocket = () => {
  const { token, isAuthenticated } = useAuth()
  const [socket, setSocket] = useState(null)
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isAuthenticated || !token) {
      return
    }

    // Socket'i başlat
    const socketInstance = initializeSocket(token)
    setSocket(socketInstance)

    // Connection event'leri
    socketInstance.on('connect', () => {
      console.log('Socket connected:', socketInstance.id)
      setConnected(true)
      setError(null)
    })

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected')
      setConnected(false)
    })

    socketInstance.on('connect_error', (err) => {
      console.error('Socket connection error:', err)
      setError(err.message || 'Bağlantı hatası')
      setConnected(false)
    })

    socketInstance.on('connected', (data) => {
      console.log('Socket connected event:', data)
    })

    // Cleanup
    return () => {
      socketInstance.off('connect')
      socketInstance.off('disconnect')
      socketInstance.off('connect_error')
      socketInstance.off('connected')
    }
  }, [token, isAuthenticated])

  // Component unmount olduğunda socket'i kapat
  useEffect(() => {
    return () => {
      if (!isAuthenticated) {
        disconnectSocket()
      }
    }
  }, [isAuthenticated])

  return { socket, connected, error }
}

