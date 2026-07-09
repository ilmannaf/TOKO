const express = require('express');
const router  = express.Router();

router.post('/', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Semua kolom wajib diisi.' });
  }
  // Simpan ke database nanti jika perlu
  console.log('Pesan kontak baru:', { name, email, message });
  res.json({ success: true, message: 'Pesan berhasil dikirim.' });
});

module.exports = router;
