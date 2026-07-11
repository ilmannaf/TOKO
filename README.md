# EcoStore - E-Commerce Fashion Ramah Lingkungan

Platform e-commerce modern dengan fitur gamifikasi eco-points untuk mendorong pembelian produk ramah lingkungan.

## 🚀 Fitur Utama

### User Features
- 🛍️ Katalog produk dinamis dengan filter & search
- 🛒 Keranjang belanja
- 📦 Sistem checkout & tracking pesanan
- 👤 Profil user & riwayat pesanan
- 🌱 Gamifikasi Eco-Points (pohon digital yang tumbuh)
- 🔐 Autentikasi JWT (register & login)
- 📞 Contact form

### Admin Features
- 📊 Dashboard statistik
- 📦 CRUD produk
- 📋 Kelola pesanan & update status
- 📬 Lihat pesan masuk dari contact form

## 📂 Struktur Project

```
TOKO/
├── backend/
│   ├── database/
│   │   ├── database.js          # MySQL connection pool
│   │   └── schema.sql            # Database schema & seed data
│   ├── routes/
│   │   ├── auth.js               # Auth API (register, login, profile)
│   │   ├── orders.js             # Orders API
│   │   ├── products.js           # Products API (CRUD)
│   │   └── contact.js            # Contact form API
│   ├── .env                      # Environment variables (jangan commit!)
│   ├── .env.example              # Template env variables
│   ├── server.js                 # Express server entry point
│   └── package.json
├── frontend/
│   ├── admin/
│   │   └── index.html            # Admin dashboard
│   ├── js/
│   │   ├── auth.js               # Auth helper functions
│   │   ├── config.js             # API base URL
│   │   ├── products.js           # Fetch & render products
│   │   ├── toko.js               # Cart functions
│   │   ├── keranjang.js          # Cart page logic
│   │   ├── profile.js            # User profile page
│   │   ├── script.js             # Home page & eco-points
│   │   └── contact.js            # Contact form handler
│   ├── assets/                   # Image assets
│   ├── index.html                # Homepage
│   ├── toko.html                 # Products page
│   ├── keranjang.html            # Cart page
│   ├── Checkout.html             # Checkout page
│   ├── Tracking.html             # Order tracking
│   ├── profile.html              # User profile
│   ├── login.html & register.html
│   ├── contact.html
│   ├── faq.html
│   ├── syarat.html
│   └── privasi.html
└── AGENTS.md                     # Developer documentation
```

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v16+)
- MySQL (v5.7+)

### 1. Clone Repository
```bash
git clone <repository-url>
cd TOKO
```

### 2. Setup Database
```bash
# Login ke MySQL
mysql -u root -p

# Import schema & seed data
mysql -u root -p < backend/database/schema.sql
```

### 3. Setup Backend
```bash
cd backend
npm install

# Copy .env.example ke .env dan sesuaikan
cp .env.example .env
nano .env  # Edit dengan kredensial database Anda
```

**File `.env` harus berisi:**
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ecostore_db
JWT_SECRET=your_secret_key_change_this
JWT_EXPIRES_IN=7d
```

### 4. Jalankan Server
```bash
# Development mode dengan auto-reload
npm run dev

# Production mode
npm start
```

Server akan berjalan di `http://localhost:3000`

### 5. Akses Aplikasi
- **Frontend**: http://localhost:3000/index.html
- **Toko**: http://localhost:3000/toko.html
- **Admin Panel**: http://localhost:3000/admin/index.html
- **API Test**: http://localhost:3000/ (akan menampilkan `{ success: true, message: "EcoStore API berjalan! 🚀" }`)

## 📡 API Endpoints

### Auth
- `POST /api/auth/register` - Daftar user baru
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Ambil profil user (butuh token)
- `PUT /api/auth/update` - Update profil (butuh token)

### Products
- `GET /api/products` - Ambil semua produk (support query `?kategori=` & `?search=`)
- `GET /api/products/:id` - Ambil detail produk
- `POST /api/products` - Tambah produk (admin)
- `PUT /api/products/:id` - Update produk (admin)
- `DELETE /api/products/:id` - Hapus produk (admin)

### Orders
- `POST /api/orders` - Buat pesanan baru
- `GET /api/orders/:nomor` - Ambil detail pesanan
- `GET /api/orders/user/:user_id` - Ambil pesanan by user
- `PATCH /api/orders/:nomor/status` - Update status (admin)

### Contact
- `POST /api/contact` - Kirim pesan
- `GET /api/contact` - Ambil semua pesan (admin)

## 🎨 Tech Stack

**Backend:**
- Node.js + Express.js
- MySQL2 (Promise-based)
- JWT untuk autentikasi
- bcryptjs untuk password hashing
- dotenv untuk environment variables

**Frontend:**
- HTML5, CSS3, JavaScript (Vanilla)
- Tailwind CSS via CDN
- LocalStorage untuk cart & eco-points

## 🌱 Fitur Eco-Points

Setiap produk memiliki nilai:
- **Eco-Points**: Poin yang didapat saat membeli
- **Carbon Saved**: Estimasi CO2 yang dihemat (kg)

User mendapat pohon digital yang tumbuh berdasarkan level:
- Level 1: 🌱 Tunas Harapan
- Level 2: 🌿 Bibit Muda
- Level 3: 🪴 Tanaman Hijau
- Level 4: 🌲 Pohon Rindang
- Level 5+: 🌳 Pohon Kehidupan

## 🔐 Security Notes

- Password di-hash dengan bcrypt (salt rounds: 10)
- JWT token expires dalam 7 hari (configurable)
- Input validation di backend
- CORS enabled untuk development
- **PENTING**: Jangan commit file `.env` ke repository!

## 📝 Development Notes

- Backend menggunakan `nodemon` untuk auto-reload saat development
- Frontend di-serve sebagai static files oleh Express
- Database menggunakan connection pool untuk performa
- Semua API response dalam format `{ success: boolean, ... }`

## 🚧 Todo / Future Improvements

- [ ] Upload gambar produk (multer)
- [ ] Wishlist/favorites
- [ ] Review & rating produk
- [ ] Sistem voucher/promo
- [ ] Email notification (nodemailer)
- [ ] Payment gateway integration (Midtrans)
- [ ] Admin authentication middleware
- [ ] Rate limiting & input sanitization
- [ ] Unit tests & integration tests

## 📄 License

© 2026 EcoStore. All rights reserved.

---

**Developed by**: [kelompok 4 web]  
**Contact**: support@ecostore.com
