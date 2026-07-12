-- EcoStore Database Schema
-- Execute this SQL to create all tables

-- Buat database (jika belum ada)
CREATE DATABASE IF NOT EXISTS ecostore_db;
USE ecostore_db;

-- 1. Tabel Users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  telepon VARCHAR(20),
  alamat TEXT,
  kota VARCHAR(50),
  provinsi VARCHAR(50),
  kode_pos VARCHAR(10),
  pohon_level INT DEFAULT 1,
  pohon_xp INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Tabel Products (produk yang bisa dijual)
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  kategori VARCHAR(50) NOT NULL,
  harga DECIMAL(15,2) NOT NULL,
  stok INT DEFAULT 0,
  deskripsi TEXT,
  eco_points INT DEFAULT 0,
  carbon_saved DECIMAL(5,2) DEFAULT 0.0,
  image VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Tabel Orders (pesanan)
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nomor_pesanan VARCHAR(50) NOT NULL UNIQUE,
  user_id INT,
  nama_penerima VARCHAR(100) NOT NULL,
  telepon VARCHAR(20) NOT NULL,
  alamat TEXT NOT NULL,
  kota VARCHAR(50) NOT NULL,
  provinsi VARCHAR(50) NOT NULL,
  kode_pos VARCHAR(10),
  catatan TEXT,
  kurir VARCHAR(50) NOT NULL,
  metode_bayar VARCHAR(50) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  ongkir DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'dikonfirmasi',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 4. Tabel Order Items (detail produk per pesanan)
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT,
  nama_produk VARCHAR(100) NOT NULL,
  harga DECIMAL(10,2) NOT NULL,
  qty INT NOT NULL DEFAULT 1,
  image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- 5. Tabel Contacts (pesan dari contact form)
CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  pesan TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'belum_dibaca',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 6. Tabel Categories (untuk kategori produk)
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(50) NOT NULL UNIQUE,
  deskripsi TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Data Awal (seed data)

-- Users sample (password: password123)
INSERT INTO users (nama, email, password, telepon, kota, provinsi) VALUES
('John Doe', 'john@example.com', '$2a$10$8K1p.P9Qv5v5v5v5v5v5v5v5v5v5v5v5v5v5v5v5v5v5v5v5v5v5v', '081234567890', 'Semarang', 'Jawa Tengah');

-- Categories sample
INSERT INTO categories (nama, deskripsi) VALUES
('Baju', 'Produk pakaian'),
('Sepatu', 'Produk alas kaki'),
('Aksesoris', 'Produk aksesori'),
('Alat Tulis', 'Produk alat tulis');

-- Products sample (12 produk dengan atribut eco)
INSERT INTO products (nama, kategori, harga, stok, deskripsi, eco_points, carbon_saved, image) VALUES
('Kaos Basic', 'Baju', 120000, 50, 'Kaos katun organik ramah lingkungan, nyaman dipakai sehari-hari.', 150, 1.5, 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=600'),
('Kemeja Casual', 'Baju', 250000, 30, 'Kemeja kain linen semi organik, perfect untuk gaya kasual Anda.', 100, 1.0, 'https://images.unsplash.com/photo-1489987707023-af11241ce70f?auto=format&fit=crop&q=80&w=600'),
('Celana Denim', 'Baju', 300000, 25, 'Celana denim daur ulang, tahan lama dan modern.', 250, 2.5, 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=600'),
('Sepatu Sneakers', 'Sepatu', 450000, 20, 'Sneakers dengan bahan daur ulang, nyaman dan stylish.', 120, 1.2, 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=600'),
('Jaket Hoodie', 'Baju', 320000, 35, 'Hoodie dari kapas organik, hangat dan nyaman.', 200, 2.0, 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?auto=format&fit=crop&q=80&w=600'),
('Topi Baseball', 'Aksesoris', 85000, 100, 'Topi baseball dari bahan ramah lingkungan.', 50, 0.5, 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=600'),
('Tas Ransel', 'Aksesoris', 275000, 15, 'Ransel dari plastik daur ulang, besar dan kuat.', 150, 1.5, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600'),
('Kacamata Sunglasses', 'Aksesoris', 150000, 40, 'Kacamata hitam dengan frame daur ulang.', 80, 0.8, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=600'),
('Jam Tangan', 'Aksesoris', 580000, 10, 'Jam tangan elegan dari bahan ramah lingkungan.', 100, 1.0, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600'),
('Kaos Kaki', 'Baju', 35000, 200, 'Kaos kaki dari kapas organik, 3 pasang dalam 1 pack.', 30, 0.3, 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&q=80&w=600'),
('Celana Jogger', 'Baju', 195000, 30, 'Celana jogger nyaman untuk olahraga dan santai.', 180, 1.8, 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&q=80&w=600'),
('Sandal Casual', 'Sepatu', 110000, 50, 'Sandal nyaman dari bahan daur ulang.', 70, 0.7, 'https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&q=80&w=600');
