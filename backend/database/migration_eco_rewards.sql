-- Migration: Eco Points Rewards System
-- Hapus tree/level system, ganti dengan milestone-based discount
-- Jalankan: mysql -u root -p ecostore_db < database/migration_eco_rewards.sql

USE ecostore_db;

-- Tambah kolom baru untuk eco system
ALTER TABLE users ADD COLUMN eco_points INT DEFAULT 0 AFTER updated_at;
ALTER TABLE users ADD COLUMN eco_carbon DECIMAL(10,2) DEFAULT 0.0 AFTER eco_points;
ALTER TABLE users ADD COLUMN eco_vouchers_claimed INT DEFAULT 0 AFTER eco_carbon;

-- Copy data lama jika ada
UPDATE users SET eco_points = pohon_xp WHERE pohon_xp > 0;
