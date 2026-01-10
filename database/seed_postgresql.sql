-- PostgreSQL Seed Data
-- Test data for FIFA Match Tracker

-- Test Users (password: test123)
INSERT INTO users (email, username, password_hash) VALUES
('test@example.com', 'testuser', '$2a$10$8ejOLkONuC8pNaie2FYGwOm04xBMPlAY3O6BgPlcU9DRXQHm22.QO'),
('john.doe@example.com', 'johndoe', '$2a$10$8ejOLkONuC8pNaie2FYGwOm04xBMPlAY3O6BgPlcU9DRXQHm22.QO'),
('jane.smith@example.com', 'janesmith', '$2a$10$8ejOLkONuC8pNaie2FYGwOm04xBMPlAY3O6BgPlcU9DRXQHm22.QO')
ON CONFLICT (email) DO NOTHING;

-- Test Drafts
INSERT INTO drafts (mode, team1_name, team2_name, score1, score2, players, uploader_id, timestamp, status) VALUES
('Rivals', 'Team A', 'Team B', 3, 2, '["Player1", "Player2", "Player3"]'::jsonb, 1, NOW() - INTERVAL '10 minutes', 'pending'),
('Champions', 'Team X', 'Team Y', 1, 1, '["PlayerA", "PlayerB"]'::jsonb, 1, NOW() - INTERVAL '5 minutes', 'pending')
ON CONFLICT DO NOTHING;

-- Test Matches (Approved drafts converted to matches)
INSERT INTO matches (mode, team1_name, team2_name, score1, score2, players, uploader_id, match_date) VALUES
('Rivals', 'Team Alpha', 'Team Beta', 4, 1, '["Player1", "Player2"]'::jsonb, 1, NOW() - INTERVAL '1 day'),
('Champions', 'Team Gamma', 'Team Delta', 2, 3, '["Player3", "Player4"]'::jsonb, 2, NOW() - INTERVAL '2 days')
ON CONFLICT DO NOTHING;

-- Test Friends
INSERT INTO friends (user_id, friend_id, status) VALUES
(1, 2, 'accepted'),
(1, 3, 'pending'),
(2, 3, 'accepted')
ON CONFLICT (user_id, friend_id) DO NOTHING;

-- Test Chat Messages
INSERT INTO chat_messages (sender_id, receiver_id, message) VALUES
(1, 2, 'Merhaba! Nasılsın?'),
(2, 1, 'İyiyim teşekkürler, sen nasılsın?'),
(1, 2, 'Ben de iyiyim, maçlarına baktım, harika oynamışsın!')
ON CONFLICT DO NOTHING;

