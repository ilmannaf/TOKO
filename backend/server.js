// backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const orderRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contact');
const productRoutes = require('./routes/products');
const uploadRoutes = require('./routes/upload');
const wishlistRoutes = require('./routes/wishlist');
const reviewRoutes = require('./routes/reviews');
const voucherRoutes = require('./routes/vouchers');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───────────────────────────
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Terlalu banyak request, coba lagi nanti.' }
});
app.use('/api/', limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Terlalu banyak percobaan login. Coba lagi 15 menit.' }
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/admin-login', authLimiter);

// Sanitasi input dasar
app.use((req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].replace(/<[^>]*>/g, '').trim();
      }
    }
  }
  next();
});

// Serve static files dari frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// ─── Routes ──────────────────────────────
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/vouchers', voucherRoutes);

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