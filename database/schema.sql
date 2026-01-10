-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_username (username)
);

-- Drafts Table
CREATE TABLE IF NOT EXISTS drafts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  mode VARCHAR(50) NOT NULL,
  team1_name VARCHAR(100) NOT NULL,
  team2_name VARCHAR(100) NOT NULL,
  score1 INT NOT NULL DEFAULT 0,
  score2 INT NOT NULL DEFAULT 0,
  players JSON NOT NULL,
  image_url VARCHAR(500),
  uploader_id INT NOT NULL,
  timestamp DATETIME NOT NULL,
  status ENUM('pending', 'merged', 'approved', 'rejected') DEFAULT 'pending',
  merged_with INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (uploader_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (merged_with) REFERENCES drafts(id) ON DELETE SET NULL,
  INDEX idx_status (status),
  INDEX idx_timestamp (timestamp),
  INDEX idx_uploader (uploader_id),
  INDEX idx_mode_timestamp (mode, timestamp)
);

-- Matches Table (Final approved matches)
CREATE TABLE IF NOT EXISTS matches (
  id INT PRIMARY KEY AUTO_INCREMENT,
  mode VARCHAR(50) NOT NULL,
  team1_name VARCHAR(100) NOT NULL,
  team2_name VARCHAR(100) NOT NULL,
  score1 INT NOT NULL DEFAULT 0,
  score2 INT NOT NULL DEFAULT 0,
  players JSON NOT NULL,
  image_url VARCHAR(500),
  uploader_id INT NOT NULL,
  draft_id INT NULL,
  match_date DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (uploader_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (draft_id) REFERENCES drafts(id) ON DELETE SET NULL,
  INDEX idx_uploader (uploader_id),
  INDEX idx_match_date (match_date)
);

-- Friends Table
CREATE TABLE IF NOT EXISTS friends (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  friend_id INT NOT NULL,
  status ENUM('pending', 'accepted', 'blocked') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (friend_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_friendship (user_id, friend_id),
  INDEX idx_user_status (user_id, status),
  INDEX idx_friend_status (friend_id, status)
);

-- Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_sender_receiver (sender_id, receiver_id),
  INDEX idx_created_at (created_at)
);

