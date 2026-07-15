const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const multer   = require('multer');
const path     = require('path');
const db       = require('../database/database');
const router   = express.Router();

// Setup upload avatar
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../frontend/assets/avatars/'));
  },
  filename: (req, file, cb) => {
    const uniqueName = 'avatar-' + Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});
const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    cb(ext && mime ? null : new Error('Hanya gambar (JPG, PNG, GIF)'), ext && mime);
  }
});

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

    const [result] = await db.query(
      'INSERT INTO users (nama, email, password, eco_points, eco_carbon, eco_vouchers_claimed) VALUES (?, ?, ?, 0, 0, 0)',
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
      user: { id: result.insertId, nama, email, eco_points: 0, eco_carbon: 0, eco_vouchers_claimed: 0 }
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
        eco_points: user.eco_points || 0,
        eco_carbon: user.eco_carbon || 0,
        eco_vouchers_claimed: user.eco_vouchers_claimed || 0
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
    const [users] = await db.query('SELECT id, nama, email, telepon, alamat, kota, provinsi, foto, eco_points, eco_carbon, eco_vouchers_claimed, created_at FROM users WHERE id = ?', [decoded.id]);

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

// ─── UPDATE PROFILE ───────────────────
router.put('/update', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ success: false, message: 'Token tidak ditemukan.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey123');
    const { nama, telepon, alamat, kota, provinsi, foto } = req.body;

    await db.query(
      'UPDATE users SET nama = ?, telepon = ?, alamat = ?, kota = ?, provinsi = ?, foto = COALESCE(?, foto) WHERE id = ?',
      [nama, telepon || null, alamat || null, kota || null, provinsi || null, foto || null, decoded.id]
    );

    res.json({ success: true, message: 'Profil berhasil diupdate.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
});

// ─── UPLOAD AVATAR ────────────────────
router.post('/upload-avatar', uploadAvatar.single('avatar'), async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Token tidak ditemukan.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey123');
    if (!req.file) return res.status(400).json({ success: false, message: 'Pilih file gambar.' });

    const fotoPath = '/assets/avatars/' + req.file.filename;
    await db.query('UPDATE users SET foto = ? WHERE id = ?', [fotoPath, decoded.id]);

    res.json({ success: true, message: 'Foto profil berhasil diupload!', foto: fotoPath });
  } catch (err) {
    if (err.name === 'JsonWebTokenError') return res.status(401).json({ success: false, message: 'Token tidak valid.' });
    console.error(err);
    res.status(500).json({ success: false, message: 'Gagal upload.' });
  }
});

// ─── SYNC ECO POINTS ───────────────────
router.put('/eco', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Token tidak ditemukan.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey123');
    const { eco_points, eco_carbon } = req.body;

    await db.query(
      'UPDATE users SET eco_points = ?, eco_carbon = ? WHERE id = ?',
      [eco_points || 0, eco_carbon || 0, decoded.id]
    );

    res.json({ success: true, message: 'Eco points tersimpan.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
});

// ─── CLAIM ECO VOUCHER ─────────────────
router.post('/eco-claim', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Token tidak ditemukan.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey123');
    const { milestone } = req.body;

    const kode = `ECO30-${decoded.id}-${milestone}`;

    const [existing] = await db.query('SELECT id FROM vouchers WHERE kode = ?', [kode]);
    if (existing.length > 0) {
      return res.json({ success: false, message: 'Voucher sudah pernah diklaim.' });
    }

    // Berlaku 30 hari
    const berlakuSampai = new Date();
    berlakuSampai.setDate(berlakuSampai.getDate() + 30);

    await db.query(
      'INSERT INTO vouchers (kode, diskon_persen, min_belanja, kuota, terpakai, aktif, berlaku_mulai, berlaku_sampai) VALUES (?, 30, 0, 1, 0, TRUE, CURDATE(), ?)',
      [kode, berlakuSampai.toISOString().split('T')[0]]
    );

    await db.query('UPDATE users SET eco_vouchers_claimed = eco_vouchers_claimed + 1 WHERE id = ?', [decoded.id]);

    res.json({
      success: true,
      message: `🎉 Selamat! Kamu mendapatkan voucher diskon 30%! Kode: ${kode}`,
      voucher: { kode, diskon_persen: 30 }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
});

// ─── ADMIN LOGIN ─────────────────────────
router.post('/admin-login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username dan password wajib diisi.' });
  }

  // Coba login via database (admin user)
  try {
    const [users] = await db.query('SELECT * FROM users WHERE (email = ? OR nama = ?) AND is_admin = TRUE', [username, username]);
    if (users.length > 0) {
      const user = users[0];
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const token = jwt.sign(
          { id: user.id, role: 'admin', email: user.email },
          process.env.JWT_SECRET || 'secretkey123',
          { expiresIn: '24h' }
        );
        return res.json({
          success: true,
          message: 'Login admin berhasil!',
          token,
          admin: { id: user.id, username: user.nama, email: user.email, role: 'admin' }
        });
      }
    }
  } catch (e) {
    // Kolom is_admin mungkin belum ada, lanjut ke hardcoded fallback
  }

  // Fallback: hardcoded credentials
  if (username === 'admintoko' && password === '123456') {
    const token = jwt.sign(
      { role: 'admin', username: 'admintoko' },
      process.env.JWT_SECRET || 'secretkey123',
      { expiresIn: '24h' }
    );
    return res.json({
      success: true,
      message: 'Login admin berhasil!',
      token,
      admin: { username: 'admintoko', role: 'admin' }
    });
  }

  return res.status(401).json({ success: false, message: 'Username atau password salah.' });
});

module.exports = router;
