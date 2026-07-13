// routes/orders.js
const express = require('express');
const db      = require('../database/database');
const router  = express.Router();

// ─────────────────────────────────────────
// AMBIL SEMUA PESANAN (admin)
// GET /api/orders
// ─────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT o.*, COUNT(oi.id) as jumlah_item
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       GROUP BY o.id
       ORDER BY o.created_at DESC`
    );

    res.json({ success: true, pesanan: orders });
  } catch (error) {
    console.error('Error ambil semua pesanan:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
});

// ─────────────────────────────────────────
// BUAT PESANAN BARU
// POST /api/orders
// ─────────────────────────────────────────
router.post('/', async (req, res) => {
  const {
    user_id,
    nama_penerima, telepon, alamat, kota, provinsi, kode_pos, catatan,
    kurir, metode_bayar,
    subtotal, ongkir, diskon, voucher, total,
    items,
  } = req.body;

  // Validasi wajib
  if (!nama_penerima || !telepon || !alamat || !kota || !provinsi) {
    return res.status(400).json({ success: false, message: 'Data alamat tidak lengkap.' });
  }
  if (!kurir || !metode_bayar) {
    return res.status(400).json({ success: false, message: 'Kurir dan metode bayar wajib dipilih.' });
  }
  if (!items || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Keranjang kosong.' });
  }

  try {
    // Generate nomor pesanan unik
    const nomor = 'ECO-' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 100);

    // Simpan pesanan ke tabel orders
    const [result] = await db.query(
      `INSERT INTO orders
        (nomor_pesanan, user_id, nama_penerima, telepon, alamat, kota, provinsi, kode_pos, catatan,
         kurir, metode_bayar, subtotal, ongkir, diskon, voucher, total)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nomor, user_id || null,
        nama_penerima, telepon, alamat, kota, provinsi, kode_pos || null, catatan || null,
        kurir, metode_bayar,
        subtotal, ongkir, diskon || 0, voucher || null, total,
      ]
    );

    const orderId = result.insertId;

    // Simpan setiap produk ke tabel order_items
    for (const item of items) {
      await db.query(
        `INSERT INTO order_items (order_id, product_id, nama_produk, harga, qty, image)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, item.id, item.name, item.price, item.qty, item.image || null]
      );
    }

    res.status(201).json({
      success: true,
      message: 'Pesanan berhasil dibuat!',
      nomor_pesanan: nomor,
      order_id: orderId,
    });

  } catch (error) {
    console.error('Error buat pesanan:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
});

// ─────────────────────────────────────────
// AMBIL DETAIL PESANAN BY NOMOR
// GET /api/orders/:nomor
// ─────────────────────────────────────────
router.get('/:nomor', async (req, res) => {
  const { nomor } = req.params;

  try {
    // Ambil data pesanan
    const [orders] = await db.query(
      'SELECT * FROM orders WHERE nomor_pesanan = ?',
      [nomor.toUpperCase()]
    );

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }

    const order = orders[0];

    // Ambil item produk dari pesanan ini
    const [items] = await db.query(
      'SELECT * FROM order_items WHERE order_id = ?',
      [order.id]
    );

    res.json({
      success: true,
      pesanan: {
        ...order,
        items,
        penerima: {
          nama:     order.nama_penerima,
          telepon:  order.telepon,
          alamat:   order.alamat,
          kota:     order.kota,
          provinsi: order.provinsi,
        },
      },
    });

  } catch (error) {
    console.error('Error ambil pesanan:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
});

// ─────────────────────────────────────────
// AMBIL SEMUA PESANAN USER
// GET /api/orders/user/:user_id
// ─────────────────────────────────────────
router.get('/user/:user_id', async (req, res) => {
  const { user_id } = req.params;

  try {
    const [orders] = await db.query(
      `SELECT o.*, COUNT(oi.id) as jumlah_item
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       WHERE o.user_id = ?
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [user_id]
    );

    res.json({ success: true, pesanan: orders });

  } catch (error) {
    console.error('Error ambil pesanan user:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
});

// ─────────────────────────────────────────
// UPDATE STATUS PESANAN (untuk admin)
// PATCH /api/orders/:nomor/status
// ─────────────────────────────────────────
router.patch('/:nomor/status', async (req, res) => {
  const { nomor }  = req.params;
  const { status } = req.body;

  const statusValid = ['dikonfirmasi','diproses','dikirim','dalam_perjalanan','tiba_di_kota','selesai','dibatalkan'];
  if (!statusValid.includes(status)) {
    return res.status(400).json({ success: false, message: 'Status tidak valid.' });
  }

  try {
    const [result] = await db.query(
      'UPDATE orders SET status = ? WHERE nomor_pesanan = ?',
      [status, nomor]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }

    res.json({ success: true, message: `Status pesanan diubah ke: ${status}` });

  } catch (error) {
    console.error('Error update status:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
});

module.exports = router;