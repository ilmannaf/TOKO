// JS/wishlist.js - Handle wishlist functionality

// Cek apakah produk sudah ada di wishlist
async function isProductInWishlist(productId) {
  if (!isLoggedIn()) return false;
  try {
    const response = await fetch(`${API_WISHLIST}`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    const data = await response.json();
    if (data.success) {
      return data.wishlist.some(item => item.id === productId || item.product_id === productId);
    }
  } catch (error) {
    return false;
  }
  return false;
}

// Tambah ke wishlist
async function addToWishlist(productId) {
  if (!isLoggedIn()) {
    alert('Login dulu ya untuk simpan ke wishlist!');
    window.location.href = 'login.html';
    return;
  }
  try {
    const response = await fetch(`${API_WISHLIST}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify({ product_id: productId })
    });
    const data = await response.json();
    if (data.success) {
      showToast('Produk ditambahkan ke Wishlist! ❤️');
      updateWishlistButton(productId, true);
    } else {
      showToast('Gagal menambah ke Wishlist');
    }
  } catch (error) {
    showToast('Gagal menambah ke Wishlist');
  }
}

// Hapus dari wishlist
async function removeFromWishlist(productId) {
  try {
    const response = await fetch(`${API_WISHLIST}/remove/${productId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    const data = await response.json();
    if (data.success) {
      showToast('Dihapus dari Wishlist.');
      updateWishlistButton(productId, false);
    }
  } catch (error) {
    showToast('Gagal menghapus dari Wishlist');
  }
}

// Update button UI
function updateWishlistButton(productId, inWishlist) {
  const btn = document.getElementById(`wishlist-btn-${productId}`);
  if (btn) {
    if (inWishlist) {
      btn.innerHTML = '<i class="fas fa-heart"></i>';
      btn.classList.add('text-red-600');
      btn.classList.remove('text-gray-300', 'hover:text-red-600');
    } else {
      btn.innerHTML = '<i class="far fa-heart"></i>';
      btn.classList.remove('text-red-600');
      btn.classList.add('text-gray-300', 'hover:text-red-600');
    }
  }
}

// Render button wishlist di produk card
function renderWishlistButton(productId, inWishlist) {
  return `
    <button id="wishlist-btn-${productId}" 
            onclick="${inWishlist ? `removeFromWishlist(${productId})` : `addToWishlist(${productId})`}"
            class="absolute top-3 right-3 p-2 rounded-full bg-white/90 shadow-sm hover:scale-110 transition-transform z-10 ${inWishlist ? 'text-red-600' : 'text-gray-300 hover:text-red-600'}">
      <i class="fas ${inWishlist ? 'fa-heart' : 'far fa-heart'}"></i>
    </button>
  `;
}

// Render Wishlist page
async function renderWishlistPage() {
  if (!isLoggedIn()) {
    window.location.href = 'login.html';
    return;
  }

  try {
    const response = await fetch(`${API_WISHLIST}`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    const data = await response.json();

    const container = document.getElementById('wishlist-container');
    if (!data.success || data.wishlist.length === 0) {
      container.innerHTML = `
        <div class="text-center py-20">
          <i class="far fa-heart text-6xl text-gray-300 mb-4"></i>
          <h3 class="text-2xl font-bold text-gray-600 mb-2">Wishlist kamu kosong</h3>
          <p class="text-gray-500">Mulai simpan produk favoritmu!</p>
          <a href="toko.html" class="inline-block mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700">Jelajahi Produk</a>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        ${data.wishlist.map(product => `
          <div class="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all">
            <div class="relative">
              ${renderWishlistButton(product.id, true)}
              <img src="${product.image}" class="h-48 w-full object-cover" alt="${product.nama}">
            </div>
            <div class="p-4">
              <h3 class="font-semibold text-gray-900">${product.nama}</h3>
              <p class="text-indigo-600 font-bold mt-2">Rp ${Number(product.harga).toLocaleString('id-ID')}</p>
              <div class="mt-3 flex gap-2">
                <button onclick="addToCart(${product.id}, '${product.nama}', ${product.harga}, '${product.image}')" class="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">
                  <i class="fas fa-shopping-cart mr-1"></i> Beli
                </button>
                <button onclick="removeFromWishlist(${product.id})" class="px-3 py-2 bg-gray-100 text-red-600 rounded-lg hover:bg-red-50">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } catch (error) {
    console.error(error);
    document.getElementById('wishlist-container').innerHTML = '<p class="text-center text-red-500">Gagal memuat wishlist</p>';
  }
}

// Toast helper
function showToast(message) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.innerHTML = message;
    toast.classList.remove('opacity-0', 'translate-y-4');
    toast.classList.add('opacity-100', 'translate-y-0');
    setTimeout(() => {
      toast.classList.remove('opacity-100', 'translate-y-0');
      toast.classList.add('opacity-0', 'translate-y-4');
    }, 2000);
  }
}

// Init saat halaman dimuat
document.addEventListener('DOMContentLoaded', async () => {
  // Update button wishlist jika ada
  const wishlistBtns = document.querySelectorAll('[id^="wishlist-btn-"]');
  for (const btn of wishlistBtns) {
    const productId = parseInt(btn.id.split('-')[2]);
    const inWishlist = await isProductInWishlist(productId);
    updateWishlistButton(productId, inWishlist);
  }
});
