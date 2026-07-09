const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const db       = require('../database/database');
const router   = express.Router();

// ── REGISTER ──────────────────────────────
router.post('/register', async (req, res) => {
  const { nama, email, password } = req.body;
  if (!nama || !email || !password)
    return res.status(400).json({ success: false, message: 'Semua kolom wajib diisi.' });
  if (password.length < 6)
    return res.status(400).json({ success: false, message: 'Password minimal 6 karakter.' });
  try {
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0)
      return res.status(409).json({ success: false, message: 'Email sudah terdaftar.' });

    const hashed = await bcrypt.hash(password, 10);

    // Simpan ke database dengan nilai default pohon
    const [result] = await db.query(
      'INSERT INTO users (nama, email, password, pohon_level, pohon_xp) VALUES (?, ?, ?, 1, 0)',
      [nama, email, hashed]
    );

    const token = jwt.sign(
      { id: result.insertId, email },
      process.env.JWT_SECRET || 'secretkey123',
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil!',
      token,
      user: { id: result.insertId, nama, email, pohon_level: 1, pohon_xp: 0 }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
});

// ── LOGIN ─────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ success: false, message: 'Email dan password wajib diisi.' });
  try {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0)
      return res.status(401).json({ success: false, message: 'Email atau password salah.' });

    const user = users[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ success: false, message: 'Email atau password salah.' });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'secretkey123',
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    res.json({
      success: true,
      message: 'Login berhasil!',
      token,
      user: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        pohon_level: user.pohon_level || 1,
        pohon_xp: user.pohon_xp || 0
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
});

// ── CEK TOKEN & PROFILE ───────────────────
router.get('/me', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token)
    return res.status(401).json({ success: false, message: 'Token tidak ditemukan.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey123');
    const [users] = await db.query('SELECT id, nama, email, pohon_level, pohon_xp, created_at FROM users WHERE id = ?', [decoded.id]);

    if (users.length === 0)
      return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });

    res.json({
      success: true,
      user: users[0]
    });
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token tidak valid atau kedaluwarsa.' });
    }
    console.error(err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
});

module.exports = router;
