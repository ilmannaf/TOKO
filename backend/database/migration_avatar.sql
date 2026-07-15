-- Migration: Add foto column to users
USE ecostore_db;
ALTER TABLE users ADD COLUMN foto VARCHAR(255) DEFAULT NULL AFTER provinsi;
