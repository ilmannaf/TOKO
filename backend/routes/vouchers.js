const express = require('express');
const db = require('../database/database');
const router = express.Router();

// GET all vouchers (admin)
router.get('/', async (req, res) => {
  try {
    const [vouchers] = await db.query('SELECT * FROM vouchers ORDER BY created_at DESC');
    res.json({ success: true, vouchers });
  } catch (error) {
    console.error('Error ambil vouchers:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
});

// POST create voucher (admin)
router.post('/', async (req, res) => {
  const { kode, diskon_persen, diskon_nominal, min_belanja, maks_diskon, kuota, berlaku_mulai, berlaku_sampai } = req.body;
  if (!kode) return res.status(400).json({ success: false, message: 'Kode voucher wajib diisi.' });
  try {
    await db.query(
      'INSERT INTO vouchers (kode, diskon_persen, diskon_nominal, min_belanja, maks_diskon, kuota, berlaku_mulai, berlaku_sampai) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [kode.toUpperCase(), diskon_persen || 0, diskon_nominal || 0, min_belanja || 0, maks_diskon || null, kuota || null, berlaku_mulai || null, berlaku_sampai || null]
    );
    res.status(201).json({ success: true, message: 'Voucher berhasil dibuat.' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(400).json({ success: false, message: 'Kode voucher sudah ada.' });
    console.error('Error buat voucher:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
});

// POST validate voucher (public - for checkout)
router.post('/validate', async (req, res) => {
  const { kode, total_belanja } = req.body;
  if (!kode) return res.status(400).json({ success: false, message: 'Masukkan kode voucher.' });
  try {
    const [vouchers] = await db.query('SELECT * FROM vouchers WHERE kode = ?', [kode.toUpperCase()]);
    if (vouchers.length === 0) return res.json({ success: false, message: 'Voucher tidak ditemukan.' });

    const v = vouchers[0];

    if (!v.aktif) return res.json({ success: false, message: 'Voucher sudah tidak aktif.' });
    if (v.kuota && v.terpakai >= v.kuota) return res.json({ success: false, message: 'Kuota voucher habis.' });

    const today = new Date().toISOString().split('T')[0];
    if (v.berlaku_mulai && today < v.berlaku_mulai.toISOString().split('T')[0])
      return res.json({ success: false, message: 'Voucher belum berlaku.' });
    if (v.berlaku_sampai && today > v.berlaku_sampai.toISOString().split('T')[0])
      return res.json({ success: false, message: 'Voucher sudah kadaluarsa.' });

    if (total_belanja && total_belanja < Number(v.min_belanja))
      return res.json({ success: false, message: 'Minimal belanja Rp ' + Number(v.min_belanja).toLocaleString('id-ID') + ' untuk voucher ini.' });

    var diskon = 0;
    if (v.diskon_persen > 0) {
      diskon = Math.floor(total_belanja * v.diskon_persen / 100);
      if (v.maks_diskon && diskon > Number(v.maks_diskon)) diskon = Number(v.maks_diskon);
    } else if (v.diskon_nominal > 0) {
      diskon = Number(v.diskon_nominal);
    }

    res.json({
      success: true,
      message: 'Voucher berlaku!',
      voucher: {
        kode: v.kode,
        diskon_persen: v.diskon_persen,
        diskon_nominal: v.diskon_nominal,
        diskon: diskon,
        min_belanja: v.min_belanja
      }
    });
  } catch (error) {
    console.error('Error validasi voucher:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
});

// DELETE voucher (admin)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM vouchers WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Voucher tidak ditemukan.' });
    res.json({ success: true, message: 'Voucher berhasil dihapus.' });
  } catch (error) {
    console.error('Error hapus voucher:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
});

module.exports = router;
