// backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const orderRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contact');
const productRoutes = require('./routes/products');
const uploadRoutes = require('./routes/upload');
const wishlistRoutes = require('./routes/wishlist');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files dari frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// ─── Routes ──────────────────────────────
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/wishlist', wishlistRoutes);

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
  console.log(`📦 Orders API    : http://localhost:${PORT}/api/orders`);
  console.log(`👤 Auth API      : http://localhost:${PORT}/api/auth`);
  console.log(`🛍️  Products API   : http://localhost:${PORT}/api/products`);
console.log(`❤️   Wishlist API  : http://localhost:${PORT}/api/wishlist`);
});