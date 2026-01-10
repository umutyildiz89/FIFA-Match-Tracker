-- Test Kullanıcıları (Seed Data)
-- Şifreler: "test123" (bcrypt hash'lenmiş)

-- Test User 1
INSERT INTO users (email, username, password_hash) VALUES
('test1@example.com', 'testuser1', '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq');

-- Test User 2
INSERT INTO users (email, username, password_hash) VALUES
('test2@example.com', 'testuser2', '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq');

-- Not: Gerçek bcrypt hash oluşturmak için backend'de register endpoint'ini kullan
-- veya bcryptjs ile hash oluştur

