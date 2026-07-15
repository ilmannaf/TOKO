const jwt = require('jsonwebtoken');

function adminAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Akses ditolak. Token admin diperlukan.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey123');
    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Akses ditolak. Hanya untuk admin.' });
    }
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token tidak valid atau kedaluwarsa.' });
  }
}

module.exports = adminAuth;
