const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware - CORS ayarları (production'da specific origin)
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',')
  : ["http://localhost:5173", "*"];

app.use(cors({
  origin: (origin, callback) => {
    // Production'da specific origin kontrolü
    if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/auth');
const draftRoutes = require('./routes/drafts');
const matchRoutes = require('./routes/matches');
const friendsRoutes = require('./routes/friends');

app.use('/api/auth', authRoutes);
app.use('/api/drafts', draftRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/friends', friendsRoutes);

// Socket.IO Chat - setupSocketIO zaten io'yu parametre olarak alıyor
require('./socket/chat').setupSocketIO(io);

// Health check endpoints
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running', timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API is running', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, io };

