-- TEST USER OLUŞTURMA (PlanetScale SQL Editor'da çalıştır)

-- Test User (Password: test123)
-- NOT: Password hash zaten oluşturulmuş (bcrypt)
INSERT INTO users (email, username, password_hash) 
VALUES (
  'test@example.com', 
  'testuser', 
  '$2a$10$8ejOLkONuC8pNaie2FYGwOm04xBMPlAY3O6BgPlcU9DRXQHm22.QO'
)
ON CONFLICT (email) DO NOTHING;

-- Kontrol et
SELECT id, email, username, created_at FROM users WHERE email = 'test@example.com';

-- ✅ Sonuç: 1 satır dönmeli (test user)

