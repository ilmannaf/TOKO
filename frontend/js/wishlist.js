async function isProductInWishlist(productId) {
  if (!isLoggedIn()) return false;
  try {
    const response = await fetch(API_WISHLIST, {
      headers: { 'Authorization': 'Bearer ' + getToken() }
    });
    const data = await response.json();
    if (data.success) {
      return data.wishlist.some(function(item) { return item.id === productId || item.product_id === productId; });
    }
  } catch (error) { return false; }
  return false;
}

async function addToWishlist(productId) {
  if (!isLoggedIn()) {
    alert('Login dulu ya untuk simpan ke wishlist!');
    window.location.href = 'login.html';
    return;
  }
  try {
    const response = await fetch(API_WISHLIST + '/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getToken() },
      body: JSON.stringify({ product_id: productId })
    });
    const data = await response.json();
    if (data.success) {
      showToast('Produk ditambahkan ke Wishlist! ❤️');
      updateWishlistButton(productId, true);
    } else { showToast('Gagal menambah ke Wishlist'); }
  } catch (error) { showToast('Gagal menambah ke Wishlist'); }
}

async function removeFromWishlist(productId) {
  try {
    const response = await fetch(API_WISHLIST + '/remove/' + productId, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + getToken() }
    });
    const data = await response.json();
    if (data.success) {
      showToast('Dihapus dari Wishlist.');
      updateWishlistButton(productId, false);
    }
  } catch (error) { showToast('Gagal menghapus dari Wishlist'); }
}

function updateWishlistButton(productId, inWishlist) {
  var btn = document.getElementById('wishlist-icon-' + productId);
  if (btn) { btn.textContent = inWishlist ? '❤️' : '🤍'; }
}

async function toggleWishlist(productId) {
  if (!isLoggedIn()) {
    alert('Login dulu ya untuk simpan ke wishlist!');
    window.location.href = 'login.html';
    return;
  }
  var inWishlist = await isProductInWishlist(productId);
  if (inWishlist) { await removeFromWishlist(productId); }
  else { await addToWishlist(productId); }
}

async function renderWishlistPage() {
  if (!isLoggedIn()) { window.location.href = 'login.html'; return; }
  try {
    var response = await fetch(API_WISHLIST, {
      headers: { 'Authorization': 'Bearer ' + getToken() }
    });
    var data = await response.json();
    var container = document.getElementById('wishlist-container');
    if (!data.success || data.wishlist.length === 0) {
      container.innerHTML = '<div style="text-align:center;padding:5rem 0;">'
        + '<div style="font-size:4rem;margin-bottom:1rem;">🤍</div>'
        + '<h3 style="font-size:1.5rem;font-weight:900;text-transform:uppercase;margin-bottom:8px;">Wishlist Kosong</h3>'
        + '<p style="font-weight:700;text-transform:uppercase;font-size:0.875rem;opacity:0.6;">Mulai simpan produk favoritmu!</p>'
        + '<a href="toko.html" class="nb-btn nb-btn-yellow" style="display:inline-block;margin-top:1.5rem;text-transform:uppercase;font-weight:900;text-decoration:none;">Jelajahi Produk</a>'
        + '</div>';
      return;
    }
    var html = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1.5rem;">';
    for (var i = 0; i < data.wishlist.length; i++) {
      var product = data.wishlist[i];
      var imgSrc = product.image || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=600';
      var safeName = product.nama.replace(/'/g, "\\'");
      html += '<div class="nb-product-card">'
        + '<div style="height:180px;overflow:hidden;border-bottom:4px solid #000;position:relative;">'
          + '<img src="' + imgSrc + '" alt="' + product.nama + '" style="width:100%;height:100%;object-fit:cover;display:block;" onerror="this.src=\'https://placehold.co/400x400?text=Error\'" />'
          + '<button onclick="removeFromWishlist(' + product.id + ')" style="position:absolute;top:8px;right:8px;border:4px solid #000;background:#FF6B9D;color:#fff;padding:4px 8px;font-size:14px;line-height:1;cursor:pointer;box-shadow:4px 4px 0 0 rgba(0,0,0,1);font-weight:900;z-index:10;">❤️</button>'
        + '</div>'
        + '<div style="padding:1rem;">'
          + '<h3 style="font-weight:900;text-transform:uppercase;margin:0;">' + product.nama + '</h3>'
          + '<p style="font-weight:700;margin-top:4px;">Rp ' + Number(product.harga).toLocaleString('id-ID') + '</p>'
          + '<div style="margin-top:12px;display:flex;gap:8px;">'
            + '<button onclick="addToCart(' + product.id + ", '" + safeName + "', " + product.harga + ", '" + imgSrc + '\')" style="flex:1;border:4px solid #000;background:#000;color:#fff;padding:8px;font-weight:900;text-transform:uppercase;font-size:0.875rem;cursor:pointer;box-shadow:6px 6px 0 0 rgba(0,0,0,1);font-family:inherit;">🛒 BELI</button>'
            + '<button onclick="removeFromWishlist(' + product.id + ')" style="border:4px solid #000;background:#fff;padding:8px 12px;font-weight:900;cursor:pointer;box-shadow:6px 6px 0 0 rgba(0,0,0,1);font-family:inherit;font-size:1rem;">🗑️</button>'
          + '</div>'
        + '</div>'
      + '</div>';
    }
    html += '</div>';
    container.innerHTML = html;
  } catch (error) {
    console.error(error);
    document.getElementById('wishlist-container').innerHTML = '<p style="text-align:center;color:red;font-weight:700;">Gagal memuat wishlist</p>';
  }
}

function showToast(message) {
  var toast = document.getElementById('toast');
  if (toast) {
    toast.innerHTML = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    setTimeout(function() {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(1rem)';
    }, 2000);
  }
}

document.addEventListener('DOMContentLoaded', async function() {
  var wishlistBtns = document.querySelectorAll('[id^="wishlist-btn-"]');
  for (var i = 0; i < wishlistBtns.length; i++) {
    var btn = wishlistBtns[i];
    var productId = parseInt(btn.id.split('-')[2]);
    var inWishlist = await isProductInWishlist(productId);
    updateWishlistButton(productId, inWishlist);
  }
});
