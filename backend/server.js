// backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const orderRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ──────────────────────────────
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

// Route test
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'EcoStore API berjalan! 🚀'
  });
});

// ─── Jalankan Server ─────────────────────
app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
  console.log(`📦 Orders API : http://localhost:${PORT}/api/orders`);
  console.log(`👤 Auth API   : http://localhost:${PORT}/api/auth`);
});