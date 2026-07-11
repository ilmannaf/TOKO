const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../database/database');
const router = express.Router();

// Middleware untuk cek token
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Login dulu ya!' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey123');
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token tidak valid.' });
  }
}

// GET wishlist user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [items] = await db.query(
      `SELECT w.id as wishlist_id, p.* 
       FROM wishlist w 
       JOIN products p ON w.product_id = p.id 
       WHERE w.user_id = ?
       ORDER BY w.created_at DESC`,
      [req.userId]
    );
    res.json({ success: true, wishlist: items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// POST tambah ke wishlist
router.post('/add', authMiddleware, async (req, res) => {
  const { product_id } = req.body;
  if (!product_id) return res.status(400).json({ success: false, message: 'Product ID required.' });

  try {
    await db.query(
      'INSERT IGNORE INTO wishlist (user_id, product_id) VALUES (?, ?)',
      [req.userId, product_id]
    );
    res.json({ success: true, message: 'Ditambahkan ke Wishlist!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// DELETE hapus dari wishlist
router.delete('/remove/:product_id', authMiddleware, async (req, res) => {
  const { product_id } = req.params;
  try {
    await db.query(
      'DELETE FROM wishlist WHERE user_id = ? AND product_id = ?',
      [req.userId, product_id]
    );
    res.json({ success: true, message: 'Dihapus dari Wishlist.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
