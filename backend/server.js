const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const authRoutes = require('../routes/auth');

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───────────────────────────
app.use(cors());                            // izinkan request dari frontend
app.use(express.json());                    // parse body JSON
app.use(express.urlencoded({ extended: true }));

// ─── Routes ──────────────────────────────
app.use('/api/auth', authRoutes);

// Route test — cek server hidup
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'EcoStore API berjalan! 🚀',
  });
});

// ─── Jalankan Server ─────────────────────
app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});