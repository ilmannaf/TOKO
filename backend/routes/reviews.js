const express = require('express');
const db = require('../database/database');
const router = express.Router();

// GET reviews by product ID
router.get('/:product_id', async (req, res) => {
  const { product_id } = req.params;
  try {
    const [reviews] = await db.query(
      `SELECT r.*, u.nama AS user_name 
       FROM reviews r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.product_id = ? 
       ORDER BY r.created_at DESC`,
      [product_id]
    );
    const [[{ avg }]] = await db.query('SELECT ROUND(AVG(rating), 1) AS avg FROM reviews WHERE product_id = ?', [product_id]);
    res.json({ success: true, reviews, avg_rating: avg || 0, total: reviews.length });
  } catch (error) {
    console.error('Error ambil reviews:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
});

// POST add review (requires auth)
router.post('/', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ success: false, message: 'Harus login untuk memberi review.' });

  try {
    const token = authHeader.split(' ')[1];
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { product_id, rating, komentar } = req.body;
    if (!product_id || !rating)
      return res.status(400).json({ success: false, message: 'Produk dan rating wajib diisi.' });
    if (rating < 1 || rating > 5)
      return res.status(400).json({ success: false, message: 'Rating harus 1-5.' });

    // Check if already reviewed
    const [existing] = await db.query('SELECT id FROM reviews WHERE user_id = ? AND product_id = ?', [userId, product_id]);
    if (existing.length > 0)
      return res.status(400).json({ success: false, message: 'Kamu sudah mereview produk ini.' });

    await db.query(
      'INSERT INTO reviews (user_id, product_id, rating, komentar) VALUES (?, ?, ?, ?)',
      [userId, product_id, rating, komentar || null]
    );
    res.status(201).json({ success: true, message: 'Review berhasil ditambahkan.' });
  } catch (error) {
    if (error.name === 'JsonWebTokenError')
      return res.status(401).json({ success: false, message: 'Token tidak valid.' });
    console.error('Error tambah review:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
});

module.exports = router;
