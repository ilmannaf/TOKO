const express = require('express');
const db = require('../database/database');
const router = express.Router();

// GET semua pesan (admin)
router.get('/', async (req, res) => {
  try {
    const [contacts] = await db.query('SELECT * FROM contacts ORDER BY created_at DESC');
    res.json({ success: true, contacts });
  } catch (error) {
    console.error('Error ambil contacts:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
});

// POST simpan pesan
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Semua kolom wajib diisi.' });
  }
  try {
    const [result] = await db.query(
      'INSERT INTO contacts (nama, email, pesan) VALUES (?, ?, ?)',
      [name, email, message]
    );
    res.status(201).json({ success: true, message: 'Pesan berhasil dikirim.', id: result.insertId });
  } catch (error) {
    console.error('Error simpan contact:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
});

module.exports = router;
