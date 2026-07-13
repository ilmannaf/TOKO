var pageState = { page: 1, limit: 8, kategori: '', search: '', totalPages: 1 };

function starsHtml(rating) {
  var r = Math.round(rating || 0);
  var s = '';
  for (var i = 1; i <= 5; i++) s += i <= r ? '⭐' : '☆';
  return s;
}

async function fetchProducts(page, kategori, search) {
  try {
    var url = API_PRODUCTS + '?page=' + (page || 1) + '&limit=' + pageState.limit;
    if (kategori) url += '&kategori=' + encodeURIComponent(kategori);
    if (search) url += '&search=' + encodeURIComponent(search);
    var res = await fetch(url);
    return await res.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return { success: false, products: [], total: 0, totalPages: 1 };
  }
}

async function renderProducts() {
  var data = await fetchProducts(pageState.page, pageState.kategori, pageState.search);
  if (!data.success) return;
  pageState.totalPages = data.totalPages || 1;
  renderProductsFromData(data.products);
  renderPagination();
}

function renderProductsFromData(products) {
  var container = document.getElementById('product-list');
  if (!products || products.length === 0) {
    container.innerHTML = '<p style="text-align:center;padding:2rem;font-weight:700;text-transform:uppercase;color:#666;">Belum ada produk tersedia.</p>';
    return;
  }
  container.innerHTML = products.map(function(product) {
    var imgSrc = product.image || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=600';
    var safeName = product.nama.replace(/'/g, "\\'");
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
        + '<div style="margin-top:6px;font-size:0.8rem;">'
          + '<span>' + starsHtml(product.avg_rating) + '</span>'
          + '<span style="font-weight:700;margin-left:4px;font-size:0.75rem;">(' + (product.review_count || 0) + ')</span>'
        + '</div>'
        + '<div style="margin-top:4px;font-size:0.75rem;font-weight:700;color:#4d7c0f;">'
          + '<span>🎁 +' + (product.eco_points || 0) + ' Eco-Points</span>'
          + '<span style="margin:0 4px;">•</span>'
          + '<span>' + Number(product.carbon_saved || 0).toFixed(1) + 'kg CO₂</span>'
        + '</div>'
        + '<button onclick="openReviewModal(' + product.id + ", '" + safeName + '\')" style="width:100%;margin-top:8px;border:4px solid #000;background:#FFE500;color:#000;padding:6px 16px;font-weight:900;text-transform:uppercase;font-size:0.75rem;cursor:pointer;box-shadow:4px 4px 0 0 rgba(0,0,0,1);font-family:inherit;">⭐ REVIEW</button>'
        + '<button onclick="addToCart(' + product.id + ", '" + safeName + "', " + product.harga + ", '" + imgSrc + '\')" style="width:100%;margin-top:12px;border:4px solid #000;background:#000;color:#fff;padding:8px 16px;font-weight:900;text-transform:uppercase;font-size:0.875rem;cursor:pointer;box-shadow:6px 6px 0 0 rgba(0,0,0,1);font-family:inherit;">'
          + '🛒 TAMBAH'
        + '</button>'
      + '</div>'
    + '</div>';
  }).join('');
}

function renderPagination() {
  var container = document.getElementById('pagination');
  if (!container) return;
  if (pageState.totalPages <= 1) { container.innerHTML = ''; return; }
  var html = '<div style="display:flex;justify-content:center;align-items:center;gap:8px;margin-top:2rem;">';
  if (pageState.page > 1) {
    html += '<button onclick="goToPage(' + (pageState.page - 1) + ')" class="nb-btn nb-btn-white" style="padding:8px 16px;font-weight:900;cursor:pointer;">◀ SEBELUMNYA</button>';
  }
  for (var i = 1; i <= pageState.totalPages; i++) {
    if (i === pageState.page) {
      html += '<span class="nb-btn nb-btn-black" style="padding:8px 16px;font-weight:900;min-width:44px;text-align:center;">' + i + '</span>';
    } else {
      html += '<button onclick="goToPage(' + i + ')" class="nb-btn nb-btn-white" style="padding:8px 16px;font-weight:900;cursor:pointer;min-width:44px;text-align:center;">' + i + '</button>';
    }
  }
  if (pageState.page < pageState.totalPages) {
    html += '<button onclick="goToPage(' + (pageState.page + 1) + ')" class="nb-btn nb-btn-white" style="padding:8px 16px;font-weight:900;cursor:pointer;">BERIKUTNYA ▶</button>';
  }
  html += '</div>';
  container.innerHTML = html;
}

function goToPage(page) {
  if (page < 1 || page > pageState.totalPages) return;
  pageState.page = page;
  renderProducts();
  window.scrollTo({ top: document.getElementById('koleksi').offsetTop - 100, behavior: 'smooth' });
}

async function renderProductsByCategory(kategori) {
  var data = await fetchProducts(1, kategori, '');
  pageState.page = 1;
  pageState.kategori = kategori;
  pageState.search = '';
  pageState.totalPages = data.totalPages || 1;
  renderProductsFromData(data.products);
  renderPagination();
}

function formatRupiah(num) {
  return 'Rp ' + Number(num).toLocaleString('id-ID');
}

function filterByCategory(kategori) {
  document.querySelectorAll('.category-btn').forEach(function(btn) {
    btn.classList.remove('nb-btn-black');
    btn.classList.add('nb-btn-white');
    if (btn.dataset.category === kategori) {
      btn.classList.remove('nb-btn-white');
      btn.classList.add('nb-btn-black');
    }
  });
  if (kategori === 'all') {
    pageState.kategori = '';
    pageState.page = 1;
    renderProducts();
  } else {
    renderProductsByCategory(kategori);
  }
}

async function searchProducts() {
  var query = document.getElementById('search-input').value.trim();
  pageState.search = query;
  pageState.kategori = '';
  pageState.page = 1;
  if (!query) {
    renderProducts();
    return;
  }
  var data = await fetchProducts(1, '', query);
  pageState.totalPages = data.totalPages || 1;
  renderProductsFromData(data.products);
  renderPagination();
}

// ─── Review Modal ───
const API_REVIEWS = API_BASE_URL + '/api/reviews';

async function openReviewModal(productId, productName) {
  document.getElementById('review-modal-title').textContent = '⭐ Review: ' + productName;
  document.getElementById('review-product-id').value = productId;
  document.getElementById('review-rating').value = 0;
  document.getElementById('review-komentar').value = '';
  document.getElementById('review-list').innerHTML = '<p style="font-weight:700;text-align:center;color:#999;">Memuat review...</p>';

  // Reset stars
  for (var i = 1; i <= 5; i++) document.getElementById('star-' + i).textContent = '☆';

  // Show/hide form based on login
  var loggedIn = typeof isLoggedIn === 'function' && isLoggedIn();
  document.getElementById('review-form').className = loggedIn ? '' : 'hidden';
  document.getElementById('review-login-msg').className = loggedIn ? 'hidden' : '';

  document.getElementById('review-modal').style.display = 'flex';
  document.getElementById('review-modal').classList.remove('hidden');

  // Fetch reviews
  try {
    var res = await fetch(API_REVIEWS + '/' + productId);
    var data = await res.json();
    if (data.success) {
      var html = '';
      if (data.reviews.length === 0) {
        html = '<p style="text-align:center;font-weight:700;color:#999;">Belum ada review untuk produk ini.</p>';
      } else {
        for (var i = 0; i < data.reviews.length; i++) {
          var r = data.reviews[i];
          html += '<div style="border:4px solid #000;padding:12px;margin-bottom:8px;">'
            + '<div style="display:flex;justify-content:space-between;align-items:center;">'
              + '<span style="font-weight:900;">' + r.user_name + '</span>'
              + '<span>' + starsHtml(r.rating) + '</span>'
            + '</div>'
            + (r.komentar ? '<p style="margin-top:4px;font-weight:600;">' + r.komentar + '</p>' : '')
            + '<p style="font-size:0.7rem;font-weight:700;opacity:0.5;margin-top:4px;">' + new Date(r.created_at).toLocaleDateString('id-ID') + '</p>'
          + '</div>';
        }
      }
      document.getElementById('review-list').innerHTML = html;
    }
  } catch (err) {
    document.getElementById('review-list').innerHTML = '<p style="font-weight:700;text-align:center;color:red;">Gagal memuat review.</p>';
  }
}

function closeReviewModal() {
  document.getElementById('review-modal').style.display = 'none';
  document.getElementById('review-modal').classList.add('hidden');
}

function setRating(val) {
  document.getElementById('review-rating').value = val;
  for (var i = 1; i <= 5; i++) {
    document.getElementById('star-' + i).textContent = i <= val ? '⭐' : '☆';
  }
}

async function submitReview() {
  var productId = document.getElementById('review-product-id').value;
  var rating = parseInt(document.getElementById('review-rating').value);
  var komentar = document.getElementById('review-komentar').value.trim();

  if (!rating) { alert('Pilih rating dulu!'); return; }

  try {
    var res = await fetch(API_REVIEWS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getToken() },
      body: JSON.stringify({ product_id: productId, rating: rating, komentar: komentar || null })
    });
    var data = await res.json();
    if (data.success) {
      showToast('Review berhasil dikirim! ⭐');
      closeReviewModal();
      renderProducts();
    } else {
      alert(data.message);
    }
  } catch (err) {
    alert('Gagal mengirim review.');
  }
}

document.addEventListener('DOMContentLoaded', async function() {
  if (document.getElementById('product-list')) {
    await renderProducts();
    var allBtn = document.querySelector('[data-category="all"]');
    if (allBtn) {
      allBtn.classList.remove('nb-btn-white');
      allBtn.classList.add('nb-btn-black');
    }
  }
});
