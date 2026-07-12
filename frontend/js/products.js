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

async function renderProducts() {
  const products = await fetchProducts();
  renderProductsFromData(products);
}

function renderProductsFromData(products) {
  const container = document.getElementById('product-list');
  if (!products || products.length === 0) {
    container.innerHTML = '<p style="text-align:center;padding:2rem;font-weight:700;text-transform:uppercase;color:#666;">Belum ada produk tersedia.</p>';
    return;
  }
  container.innerHTML = products.map(product => {
    const imgSrc = product.image || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=600';
    const safeName = product.nama.replace(/'/g, "\\'");
    return '<div class="nb-product-card" style="position:relative;">'
      + '<button onclick="toggleWishlist(' + product.id + ')" style="position:absolute;top:8px;right:8px;z-index:10;border:4px solid #000;background:#fff;padding:4px 8px;font-size:16px;line-height:1;cursor:pointer;box-shadow:4px 4px 0 0 rgba(0,0,0,1);font-weight:900;" title="Simpan ke Wishlist">'
        + '<span id="wishlist-icon-' + product.id + '">🤍</span>'
      + '</button>'
      + '<div style="height:220px;overflow:hidden;border-bottom:4px solid #000;">'
        + '<img src="' + imgSrc + '" alt="' + product.nama + '" style="width:100%;height:100%;object-fit:cover;display:block;" onerror="this.src=\'https://placehold.co/400x400?text=Error\'" />'
      + '</div>'
      + '<div style="padding:1rem;">'
        + '<h3 style="font-size:1.125rem;font-weight:900;text-transform:uppercase;margin:0;">' + product.nama + '</h3>'
        + '<p style="font-weight:700;margin-top:4px;">Rp ' + Number(product.harga).toLocaleString('id-ID') + '</p>'
        + '<p style="font-size:0.75rem;font-weight:700;text-transform:uppercase;margin-top:4px;opacity:0.6;">' + product.kategori + '</p>'
        + '<div style="margin-top:8px;font-size:0.75rem;font-weight:700;color:#4d7c0f;">'
          + '<span>🌱 +' + (product.eco_points || 0) + ' Eco-Points</span>'
          + '<span style="margin:0 4px;">•</span>'
          + '<span>' + Number(product.carbon_saved || 0).toFixed(1) + 'kg CO₂</span>'
        + '</div>'
        + '<button onclick="addToCart(' + product.id + ", '" + safeName + "', " + product.harga + ", '" + imgSrc + '\')" style="width:100%;margin-top:12px;border:4px solid #000;background:#000;color:#fff;padding:8px 16px;font-weight:900;text-transform:uppercase;font-size:0.875rem;cursor:pointer;box-shadow:6px 6px 0 0 rgba(0,0,0,1);font-family:inherit;">'
          + '🛒 TAMBAH'
        + '</button>'
      + '</div>'
    + '</div>';
  }).join('');
}

async function renderProductsByCategory(kategori) {
  const products = await fetchProducts();
  const filtered = kategori
    ? products.filter(p => p.kategori === kategori)
    : products;
  renderProductsFromData(filtered);
}

function formatRupiah(num) {
  return 'Rp ' + Number(num).toLocaleString('id-ID');
}

function filterByCategory(kategori) {
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.classList.remove('nb-btn-black');
    btn.classList.add('nb-btn-white');
    if (btn.dataset.category === kategori) {
      btn.classList.remove('nb-btn-white');
      btn.classList.add('nb-btn-black');
    }
  });
  if (kategori === 'all') {
    renderProducts();
  } else {
    renderProductsByCategory(kategori);
  }
}

async function searchProducts() {
  const query = document.getElementById('search-input').value.trim();
  if (!query) {
    renderProducts();
    return;
  }
  try {
    const response = await fetch(API_PRODUCTS + '?search=' + encodeURIComponent(query));
    const data = await response.json();
    if (data.success) {
      renderProductsFromData(data.products);
    }
  } catch (error) {
    console.error('Error searching products:', error);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  if (document.getElementById('product-list')) {
    await renderProducts();
    const allBtn = document.querySelector('[data-category="all"]');
    if (allBtn) {
      allBtn.classList.remove('nb-btn-white');
      allBtn.classList.add('nb-btn-black');
    }
  }
});
