// JS/products.js - Handle produk dinamis dari API

// Fungsi untuk ambil semua produk dari API
async function fetchProducts() {
  try {
    const response = await fetch(`${API_PRODUCTS}`);
    const data = await response.json();
    return data.success ? data.products : [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Fungsi untuk render produk ke halaman toko.html
async function renderProducts() {
  const products = await fetchProducts();
  const container = document.getElementById('product-list');
  
  if (!products || products.length === 0) {
    container.innerHTML = '<p class="text-center text-gray-500 py-8">Belum ada produk tersedia.</p>';
    return;
  }

  container.innerHTML = products.map(product => `
    <div class="group relative bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300">
      <button onclick="toggleWishlist(${product.id})" class="absolute top-3 right-3 p-2 rounded-full bg-white/90 shadow-sm hover:scale-110 transition-transform z-10 text-gray-300 hover:text-red-600">
        <i class="far fa-heart" id="wishlist-icon-${product.id}"></i>
      </button>
      <div class="w-full overflow-hidden rounded-xl bg-gray-200">
        <img src="${product.image || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=600'}" 
             alt="${product.nama}" 
             class="h-64 w-full object-cover transition duration-500 group-hover:scale-110" />
      </div>
      <div class="mt-4 flex justify-between items-start">
        <h3 class="text-lg font-semibold text-gray-800">${product.nama}</h3>
        <p class="text-sm font-medium text-indigo-600">${formatRupiah(product.harga)}</p>
      </div>
      <p class="mt-2 text-xs text-gray-500">${product.kategori}</p>
      <div class="mt-2 text-xs text-emerald-600">
        <span>+${product.eco_points || 0} Eco-Points</span>
        <span class="mx-2">•</span>
        <span>${Number(product.carbon_saved || 0).toFixed(1)}kg CO2</span>
      </div>
      <button onclick="addToCart(${product.id}, '${product.nama}', ${product.harga}, '${product.image}')" 
              class="mt-4 w-full bg-gray-100 text-gray-800 py-2 rounded-lg font-medium hover:bg-indigo-600 hover:text-white transition-colors">
        Tambah ke Keranjang
      </button>
    </div>
  `).join('');
}

// Fungsi untuk render dengan filter
async function renderProductsByCategory(kategori) {
  const products = await fetchProducts();
  const filtered = kategori 
    ? products.filter(p => p.kategori === kategori)
    : products;
  renderProductsFromData(filtered);
}

// Fungsi untuk render dari data yang sudah di-filter
function renderProductsFromData(products) {
  const container = document.getElementById('product-list');
  
  if (products.length === 0) {
    container.innerHTML = '<p class="text-center text-gray-500 py-8">Tidak ada produk dalam kategori ini.</p>';
    return;
  }

  container.innerHTML = products.map(product => `
    <div class="group relative bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300">
      <div class="w-full overflow-hidden rounded-xl bg-gray-200">
        <img src="${product.image || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=600'}" 
             alt="${product.nama}" 
             class="h-64 w-full object-cover transition duration-500 group-hover:scale-110" />
      </div>
      <div class="mt-4 flex justify-between items-start">
        <h3 class="text-lg font-semibold text-gray-800">${product.nama}</h3>
        <p class="text-sm font-medium text-indigo-600">${formatRupiah(product.harga)}</p>
      </div>
      <p class="mt-2 text-xs text-gray-500">${product.kategori}</p>
      <div class="mt-2 text-xs text-emerald-600">
        <span>+${product.eco_points || 0} Eco-Points</span>
        <span class="mx-2">•</span>
        <span>${Number(product.carbon_saved || 0).toFixed(1)}kg CO2</span>
      </div>
      <button onclick="addToCart(${product.id}, '${product.nama}', ${product.harga}, '${product.image}')" 
              class="mt-4 w-full bg-gray-100 text-gray-800 py-2 rounded-lg font-medium hover:bg-indigo-600 hover:text-white transition-colors">
        Tambah ke Keranjang
      </button>
    </div>
  `).join('');
}

// Fungsi untuk format Rupiah
function formatRupiah(num) {
  return 'Rp ' + num.toLocaleString('id-ID');
}

// Fungsi filter berdasarkan kategori
function filterByCategory(kategori) {
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.classList.remove('bg-indigo-600', 'text-white');
    if (btn.dataset.category === kategori) {
      btn.classList.add('bg-indigo-600', 'text-white');
    } else {
      btn.classList.add('bg-white', 'text-gray-600', 'border', 'border-gray-300');
    }
  });
  
  if (kategori === 'all') {
    renderProducts();
  } else {
    renderProductsByCategory(kategori);
  }
}

// Fungsi search produk
async function searchProducts() {
  const query = document.getElementById('search-input').value.trim();
  if (!query) {
    renderProducts();
    return;
  }
  
  try {
    const response = await fetch(`${API_PRODUCTS}?search=${encodeURIComponent(query)}`);
    const data = await response.json();
    if (data.success) {
      renderProductsFromData(data.products);
    }
  } catch (error) {
    console.error('Error searching products:', error);
  }
}

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', async () => {
  if (document.getElementById('product-list')) {
    await renderProducts();
    
    // Auto-pilih kategori 'all' jika ada tombol
    const allBtn = document.querySelector('[data-category="all"]');
    if (allBtn) {
      allBtn.classList.add('bg-indigo-600', 'text-white');
      allBtn.classList.remove('bg-white', 'text-gray-600', 'border', 'border-gray-300');
    }
  }
});
