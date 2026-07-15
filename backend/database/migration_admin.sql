-- Migration: Admin user in database
-- Jalankan: mysql -u root -p ecostore_db < database/migration_admin.sql

USE ecostore_db;

-- Tambah kolom is_admin
ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT FALSE AFTER eco_vouchers_claimed;

-- Buat admin user default (email: admin@ecostore.com, password: admin123)
INSERT IGNORE INTO users (nama, email, password, is_admin) VALUES (
  'Admin Toko',
  'admin@ecostore.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  TRUE
);
