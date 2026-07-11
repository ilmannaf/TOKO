# AGENTS

## Purpose
This repository is an e-commerce platform (EcoStore) with split frontend and backend design.
AI coding agents should prioritize backend endpoint behavior and frontend endpoint usage when making changes.

## Project Structure
```
TOKO/
├── backend/
│   ├── database/
│   │   ├── database.js          # MySQL connection pool
│   │   ├── schema.sql            # Main DB schema + seed data (12 products)
│   │   └── wishlist.sql          # Wishlist table
│   ├── routes/
│   │   ├── auth.js               # Auth API (register, login, profile, update)
│   │   ├── orders.js             # Orders API (CRUD)
│   │   ├── products.js           # Products API (CRUD + search/filter)
│   │   ├── contact.js            # Contact form API
│   │   ├── upload.js             # Image upload API (multer)
│   │   └── wishlist.js           # Wishlist API (add, remove, get)
│   ├── .env                      # Environment variables (DO NOT COMMIT!)
│   ├── .env.example              # Template for env
│   ├── server.js                 # Express server entry point
│   └── package.json
├── frontend/
│   ├── admin/
│   │   └── index.html            # Admin dashboard (manage products, orders, contacts)
│   ├── assets/
│   │   └── products/             # Uploaded product images
│   ├── js/
│   │   ├── auth.js               # Auth helper functions (login, logout, token)
│   │   ├── config.js             # API base URL configuration
│   │   ├── products.js           # Fetch & render products dynamically
│   │   ├── wishlist.js           # Wishlist functionality
│   │   ├── toko.js               # Cart functions (add, update, count)
│   │   ├── keranjang.js          # Cart page logic
│   │   ├── profile.js            # User profile page logic
│   │   ├── script.js             # Home page & eco-points gamification
│   │   └── contact.js            # Contact form handler
│   ├── index.html                # Homepage with eco-points
│   ├── toko.html                 # Products page (dynamic from API)
│   ├── wishlist.html             # User wishlist page
│   ├── keranjang.html            # Shopping cart
│   ├── Checkout.html             # Checkout page with shipping zones
│   ├── Tracking.html             # Order tracking with timeline
│   ├── profile.html              # User profile + order history
│   ├── login.html & register.html
│   ├── contact.html
│   ├── faq.html, syarat.html, privasi.html
│   └── 404.html
├── AGENTS.md                     # This file (developer documentation)
└── README.md                     # Setup guide & API documentation
```

## Key Features Implemented

### User Features
- 🛍️ **Dynamic Product Catalog** - Products loaded from database with search & filter
- 🛒 **Shopping Cart** - LocalStorage-based cart system
- ❤️ **Wishlist** - Save favorite products (requires login)
- 📦 **Checkout & Tracking** - Order creation with shipping zones & tracking
- 👤 **User Profile** - View profile, edit info, order history
- 🌱 **Eco-Points Gamification** - Digital tree that grows with purchases
- 🔐 **Authentication** - JWT-based register/login

### Admin Features
- 📊 **Dashboard** - Statistics (products, orders, pending, contacts)
- 📦 **Product Management** - CRUD products with image upload
- 📋 **Order Management** - View orders, update status
- 📬 **Contact Messages** - View messages from contact form

## Backend Setup & Run

### Prerequisites
- Node.js v16+
- MySQL v5.7+

### Installation
```bash
cd backend
npm install

# Copy .env.example to .env and configure
cp .env.example .env
# Edit .env with your MySQL credentials
```

### Database Setup
```bash
# Import schema (creates 6 tables + 12 seed products)
mysql -u root -p ecostore_db < database/schema.sql

# Import wishlist table
mysql -u root -p ecostore_db < database/wishlist.sql
```

### Run Server
```bash
# Development (auto-reload with nodemon)
npm run dev

# Production
npm start
```

Server runs at `http://localhost:3000`

## Database Schema

### Tables (6)
1. **users** - User accounts (nama, email, password, address fields, pohon_level, pohon_xp)
2. **products** - Product catalog (nama, kategori, harga, stok, eco_points, carbon_saved, image)
3. **categories** - Product categories
4. **orders** - Customer orders (nomor_pesanan, user_id, shipping info, totals, status)
5. **order_items** - Order line items
6. **contacts** - Contact form messages
7. **wishlist** - User wishlist (user_id, product_id)

## API Endpoints

### Auth (`/api/auth`)
- `POST /register` - Register new user. Body: `{ nama, email, password }`
- `POST /login` - Login user. Body: `{ email, password }`. Returns: `{ token, user }`
- `GET /me` - Get current user profile. Requires: `Authorization: Bearer <token>`
- `PUT /update` - Update user profile. Body: `{ nama, telepon, alamat, kota, provinsi }`

### Products (`/api/products`)
- `GET /` - Get all products. Query: `?kategori=Baju&search=kaos`
- `GET /:id` - Get product by ID
- `POST /` - Create product (admin). Body: `{ nama, kategori, harga, stok, deskripsi, eco_points, carbon_saved, image }`
- `PUT /:id` - Update product (admin)
- `DELETE /:id` - Delete product (admin)

### Orders (`/api/orders`)
- `POST /` - Create order. Body: order metadata + `items[]`
- `GET /:nomor` - Get order by order number
- `GET /user/:user_id` - Get orders by user
- `PATCH /:nomor/status` - Update order status (admin). Body: `{ status }`

### Wishlist (`/api/wishlist`) - Requires Auth
- `GET /` - Get user's wishlist
- `POST /add` - Add to wishlist. Body: `{ product_id }`
- `DELETE /remove/:product_id` - Remove from wishlist

### Upload (`/api/upload`)
- `POST /upload` - Upload product image (multipart/form-data). Returns: `{ path }`

### Contact (`/api/contact`)
- `POST /` - Send contact message. Body: `{ name, email, message }`
- `GET /` - Get all messages (admin)

## Frontend Usage

### Static Files
Frontend is served by Express at `http://localhost:3000/`
- Products: `/toko.html`
- Cart: `/keranjang.html`
- Wishlist: `/wishlist.html`
- Checkout: `/Checkout.html`
- Profile: `/profile.html`
- Admin: `/admin/index.html`

### JavaScript Modules
- **config.js** - API endpoints configuration
- **auth.js** - `getToken()`, `getUser()`, `isLoggedIn()`, `logout()`, `updateNavbar()`
- **products.js** - `fetchProducts()`, `renderProducts()`, `filterByCategory()`, `searchProducts()`
- **wishlist.js** - `addToWishlist()`, `removeFromWishlist()`, `renderWishlistPage()`
- **toko.js** - `getCart()`, `saveCart()`, `addToCart()`, `updateCartCount()`

## Environment Variables (.env)
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ecostore_db
JWT_SECRET=your_secret_key_change_in_production
JWT_EXPIRES_IN=7d
```

## Guidance for AI Agents

### When Adding Features
1. **Database changes** - Create SQL migration file in `backend/database/`
2. **New API endpoints** - Add route file in `backend/routes/`, register in `server.js`
3. **Frontend changes** - Add HTML in `frontend/`, JS in `frontend/js/`
4. **Update this file** - Document new endpoints and features

### Code Conventions
- Backend uses async/await with try/catch
- All API responses: `{ success: boolean, message?, data? }`
- Frontend uses fetch API, LocalStorage for cart/eco-points
- Auth required endpoints check `Authorization: Bearer <token>`

### Common Tasks
- **Add product**: Admin dashboard → Kelola Produk → Tambah Produk
- **View orders**: Admin dashboard → Pesanan
- **Test API**: `curl http://localhost:3000/api/products`
- **Check logs**: Backend console or `backend/server.log`

## Recent Changes (2026-07-11)
- ✅ Added wishlist feature (table, API, UI)
- ✅ Added image upload for products (multer)
- ✅ Added user profile page with order history
- ✅ Added admin dashboard with product/order/contact management
- ✅ Dynamic product rendering from database
- ✅ Search & filter products by category/name
- ✅ FAQ, Terms, Privacy pages

## TODO / Future Improvements
- [ ] Pagination for products (currently loads all)
- [ ] Product reviews & ratings
- [ ] Voucher/promo system
- [ ] Email notifications (nodemailer)
- [ ] Payment gateway integration (Midtrans)
- [ ] Admin authentication middleware
- [ ] Rate limiting & input sanitization
- [ ] Unit tests

## Notes
- No top-level `package.json`; backend package management is under `backend/`
- Frontend uses `http://localhost:3000` hardcoded in `config.js`
- Cart stored in LocalStorage as `ecostore_cart`
- Eco-points stored in LocalStorage as `ecoData`
- User/token stored in LocalStorage as `user` and `token`
- Order tracking uses simulated timeline based on order creation time

---
Last updated: 2026-07-11
