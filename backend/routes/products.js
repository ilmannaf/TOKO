const express = require('express');
const db = require('../database/database');
const router = express.Router();

// ─── GET semua produk ────────────────────
router.get('/', async (req, res) => {
  const { kategori, search } = req.query;
  try {
    let query = 'SELECT * FROM products';
    let params = [];
    const conditions = [];

    if (kategori) {
      conditions.push('kategori = ?');
      params.push(kategori);
    }
    if (search) {
      conditions.push('(nama LIKE ? OR deskripsi LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';

    const [products] = await db.query(query, params);
    res.json({ success: true, products });
  } catch (error) {
    console.error('Error ambil produk:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
});

// ─── GET produk by ID ────────────────────
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [products] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    if (products.length === 0)
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan.' });
    res.json({ success: true, product: products[0] });
  } catch (error) {
    console.error('Error ambil produk:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
});

// ─── POST tambah produk (admin) ──────────
router.post('/', async (req, res) => {
  const { nama, kategori, harga, stok, deskripsi, eco_points, carbon_saved, image } = req.body;
  if (!nama || !kategori || !harga)
    return res.status(400).json({ success: false, message: 'Nama, kategori, dan harga wajib diisi.' });
  const parsedHarga = parseFloat(harga);
  if (isNaN(parsedHarga) || parsedHarga <= 0)
    return res.status(400).json({ success: false, message: 'Harga harus berupa angka positif.' });
  if (parsedHarga > 9999999999999.99)
    return res.status(400).json({ success: false, message: 'Harga terlalu besar.' });
  try {
    const [result] = await db.query(
      'INSERT INTO products (nama, kategori, harga, stok, deskripsi, eco_points, carbon_saved, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [nama, kategori, parsedHarga, stok || 0, deskripsi || null, eco_points || 0, carbon_saved || 0, image || null]
    );
    res.status(201).json({ success: true, message: 'Produk berhasil ditambahkan.', id: result.insertId });
  } catch (error) {
    console.error('Error tambah produk:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
});

// ─── PUT update produk (admin) ───────────
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nama, kategori, harga, stok, deskripsi, eco_points, carbon_saved, image } = req.body;
  const parsedHarga = parseFloat(harga);
  if (isNaN(parsedHarga) || parsedHarga <= 0)
    return res.status(400).json({ success: false, message: 'Harga harus berupa angka positif.' });
  if (parsedHarga > 9999999999999.99)
    return res.status(400).json({ success: false, message: 'Harga terlalu besar.' });
  try {
    const [result] = await db.query(
      'UPDATE products SET nama = ?, kategori = ?, harga = ?, stok = ?, deskripsi = ?, eco_points = ?, carbon_saved = ?, image = ? WHERE id = ?',
      [nama, kategori, parsedHarga, stok, deskripsi, eco_points, carbon_saved, image, id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan.' });
    res.json({ success: true, message: 'Produk berhasil diupdate.' });
  } catch (error) {
    console.error('Error update produk:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
});

// ─── DELETE produk (admin) ──────────────
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan.' });
    res.json({ success: true, message: 'Produk berhasil dihapus.' });
  } catch (error) {
    console.error('Error hapus produk:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
});

module.exports = router;
