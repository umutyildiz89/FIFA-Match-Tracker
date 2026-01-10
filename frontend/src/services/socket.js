import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000'

let socket = null

export const initializeSocket = (token) => {
  if (socket?.connected) {
    return socket
  }

  socket = io(SOCKET_URL, {
    auth: {
      token: token
    },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5
  })

  return socket
}

export const getSocket = () => {
  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export default socket

