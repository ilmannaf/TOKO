// JS/profile.js - Halaman profil user

// Redirect ke login jika belum login
if (!isLoggedIn()) {
  window.location.href = 'login.html';
}

let currentUser = null;

// Ambil data user dari API
async function fetchUserProfile() {
  const token = getToken();
  if (!token) return;
  try {
    const response = await fetch(`${API_AUTH}/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (data.success) {
      currentUser = data.user;
      return data.user;
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
  }
  return null;
}

// Render data user
function renderProfile(user) {
  if (!user) return;
  document.getElementById('user-name').textContent = user.nama;
  document.getElementById('user-email').textContent = user.email;
  document.getElementById('edit-nama').value = user.nama;
  document.getElementById('edit-email').value = user.email;
  document.getElementById('edit-telepon').value = user.telepon || '';
  document.getElementById('edit-alamat').value = user.alamat || '';
  document.getElementById('edit-kota').value = user.kota || '';
  document.getElementById('edit-provinsi').value = user.provinsi || '';
  // Avatar
  if (user.foto) {
    var img = document.getElementById('avatar-img');
    img.src = user.foto;
    img.style.display = 'block';
    document.getElementById('avatar-fallback').style.display = 'none';
  }
}

async function uploadAvatar(input) {
  var file = input.files[0];
  if (!file) return;
  var formData = new FormData();
  formData.append('avatar', file);
  try {
    var res = await fetch(API_BASE_URL + '/api/auth/upload-avatar', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + getToken() },
      body: formData
    });
    var data = await res.json();
    if (data.success) {
      var img = document.getElementById('avatar-img');
      img.src = data.foto + '?t=' + Date.now();
      img.style.display = 'block';
      document.getElementById('avatar-fallback').style.display = 'none';
      alert('Foto profil berhasil diupload!');
    } else {
      alert(data.message || 'Gagal upload.');
    }
  } catch (e) {
    alert('Gagal terhubung ke server.');
  }
  input.value = '';
}

// Render Eco-Points
function renderEcoPoints(user) {
  var ecoData = JSON.parse(localStorage.getItem('ecoData') || '{"points":0,"carbon":0}');
  var points = ecoData.points || 0;
  var vouchersClaimed = user.eco_vouchers_claimed || 0;

  var nextMilestone = (Math.floor(points / 1000) + 1) * 1000;
  var progressPct = points > 0 ? ((points % 1000) / 1000 * 100) : 0;

  document.getElementById('eco-total-points').textContent = points.toLocaleString('id-ID') + ' Pts';
  document.getElementById('eco-vouchers-claimed').textContent = vouchersClaimed;
  document.getElementById('eco-progress-bar').style.width = progressPct + '%';
  document.getElementById('eco-milestone-text').textContent = points + ' / ' + nextMilestone + ' Pts';
}

// Fetch orders
async function fetchOrders(userId) {
  if (!userId) return [];
  try {
    const response = await fetch(`${API_ORDERS}/user/${userId}`);
    const data = await response.json();
    return data.success ? data.pesanan : [];
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

// Render orders
async function renderOrders(user) {
  const orders = await fetchOrders(user.id);
  const listEl = document.getElementById('orders-list');
  // Hapus loading
  var loading = document.getElementById('orders-loading');
  if (loading) loading.remove();

  if (orders.length === 0) {
    listEl.innerHTML = '<div style="text-align:center;padding:2rem;">'
      + '<p style="font-size:3rem;margin-bottom:1rem;">🛍️</p>'
      + '<p style="font-weight:700;margin-bottom:1rem;text-transform:uppercase;">Belum ada pesanan</p>'
      + '<a href="toko.html" class="modern-btn modern-btn-primary" style="display:inline-block;">MULAI BELANJA</a>'
      + '</div>';
    return;
  }

  var h = '';
  for (var i = 0; i < orders.length; i++) {
    var o = orders[i];
    var statusOk = o.status === 'dikonfirmasi' || o.status === 'diproses';
    h += '<div style="border:1px solid var(--border);border-radius:12px;padding:1rem;margin-bottom:1rem;background:var(--card);">'
      + '<div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:0.5rem;">'
        + '<div>'
          + '<p style="font-size:0.75rem;font-weight:700;opacity:0.6;text-transform:uppercase;">' + formatDate(o.created_at) + '</p>'
          + '<p style="font-weight:900;font-size:1.1rem;">#' + o.nomor_pesanan + '</p>'
        + '</div>'
        + '<div style="display:flex;align-items:center;gap:8px;">'
          + '<span class="modern-badge modern-badge-info" style="font-size:0.65rem;">' + (o.status || 'diproses') + '</span>'
          + (statusOk ? '<button onclick="batalkanPesananProfile(\'' + o.nomor_pesanan + '\')" style="padding:4px 8px;background:#FF6B9D;color:#fff;font-weight:700;font-size:0.65rem;border:2px solid #000;cursor:pointer;">✕</button>' : '')
        + '</div>'
      + '</div>'
      + '<div style="display:flex;justify-content:space-between;font-size:0.875rem;font-weight:700;">'
        + '<span>' + (o.jumlah_item || 0) + ' produk</span>'
        + '<span>' + formatRupiah(o.total) + '</span>'
      + '</div>'
      + '<a href="Tracking.html?nomor=' + o.nomor_pesanan + '" style="display:inline-block;margin-top:0.75rem;font-weight:900;text-transform:uppercase;font-size:0.75rem;text-decoration:underline;text-underline-offset:4px;">LACAK PESANAN →</a>'
    + '</div>';
  }
  listEl.innerHTML = h;
}

async function batalkanPesananProfile(nomor) {
  var token = getToken();
  if (!token) { alert('Login dulu.'); return; }
  if (!confirm('Yakin batalkan pesanan #' + nomor + '?')) return;
  try {
    var res = await fetch(API_BASE_URL + '/api/orders/' + nomor + '/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
    });
    var data = await res.json();
    if (data.success) {
      alert('Pesanan dibatalkan.');
      var user = await fetchUserProfile();
      if (user) await renderOrders(user);
    } else {
      alert(data.message || 'Gagal.');
    }
  } catch (e) {
    alert('Gagal terhubung ke server.');
  }
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('id-ID', { 
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
  });
}

function formatRupiah(num) {
  return 'Rp ' + num.toLocaleString('id-ID');
}

function getStatusBadge(status) {
  const badges = {
    'dikonfirmasi': 'bg-purple-100 text-purple-700',
    'diproses': 'bg-yellow-100 text-yellow-700',
    'dikirim': 'bg-blue-100 text-blue-700',
    'dalam_perjalanan': 'bg-sky-100 text-sky-700',
    'tiba_di_kota': 'bg-orange-100 text-orange-700',
    'selesai': 'bg-green-100 text-green-700',
    'dibatalkan': 'bg-red-100 text-red-700',
  };
  return badges[status] || 'bg-gray-100 text-gray-700';
}

// Tab switching
function showTab(tab) {
  document.querySelectorAll('[id^="content-"]').forEach(el => el.classList.add('hidden'));
  document.getElementById('content-' + tab).classList.remove('hidden');
  
  document.querySelectorAll('[id^="tab-"]').forEach(el => {
    el.className = 'modern-btn modern-btn-white';
    el.style.cssText = 'width:100%;margin-bottom:0.5rem;';
  });
  
  var tabEl = document.getElementById('tab-' + tab);
  if (tabEl) {
    tabEl.className = 'modern-btn modern-btn-primary';
    tabEl.style.cssText = 'width:100%;margin-bottom:0.5rem;';
  }
  
  if (tab === 'wishlist') {
    renderProfileWishlist();
  }
}

// Render wishlist in profile page
async function renderProfileWishlist() {
  const container = document.getElementById('profile-wishlist-container');
  try {
    const response = await fetch(`${API_WISHLIST}`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    const data = await response.json();

    if (!data.success || data.wishlist.length === 0) {
      container.innerHTML = '<div style="text-align:center;padding:2rem;">'
        + '<p style="font-size:3rem;margin-bottom:1rem;">🤍</p>'
        + '<p style="font-weight:700;text-transform:uppercase;">Wishlist kosong</p>'
        + '<a href="toko.html" class="modern-btn modern-btn-primary" style="display:inline-block;margin-top:1rem;">JELAJAHI PRODUK</a>'
        + '</div>';
      return;
    }

    var h = '';
    for (var i = 0; i < data.wishlist.length; i++) {
      var p = data.wishlist[i];
      h += '<div style="display:flex;gap:0.75rem;border:1px solid var(--border);border-radius:12px;padding:0.75rem;background:var(--card);">'
        + '<img src="' + (p.image || 'https://via.placeholder.com/80') + '" style="width:80px;height:80px;object-fit:cover;border-radius:8px;border:1px solid var(--border);" alt="' + (p.nama || '') + '" onerror="this.src=\'https://via.placeholder.com/80\'">'
        + '<div style="flex:1;">'
          + '<h4 style="font-weight:900;font-size:0.875rem;text-transform:uppercase;">' + (p.nama || '') + '</h4>'
          + '<p style="font-weight:900;font-size:0.875rem;margin-top:4px;">' + formatRupiah(p.harga) + '</p>'
          + '<div style="margin-top:0.5rem;display:flex;gap:0.5rem;font-size:0.75rem;font-weight:900;text-transform:uppercase;">'
            + '<a href="toko.html" style="text-decoration:underline;text-underline-offset:3px;">LIHAT</a>'
            + '<button onclick="removeFromWishlistProfile(' + p.id + ')" style="background:none;border:none;color:red;font-weight:900;text-transform:uppercase;cursor:pointer;padding:0;font-family:inherit;font-size:0.75rem;text-decoration:underline;text-underline-offset:3px;">HAPUS</button>'
          + '</div>'
        + '</div>'
      + '</div>';
    }
    container.innerHTML = h;
  } catch (error) {
    container.innerHTML = '<p class="text-red-500 text-center">Gagal memuat wishlist</p>';
  }
}

async function removeFromWishlistProfile(productId) {
  try {
    const response = await fetch(`${API_WISHLIST}/remove/${productId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    if (response.ok) {
      renderProfileWishlist();
    }
  } catch (error) {
    alert('Gagal menghapus dari wishlist');
  }
}

// Handle form submit
document.addEventListener('DOMContentLoaded', async () => {
  const user = await fetchUserProfile();
  if (user) {
    renderProfile(user);
    renderEcoPoints(user);
    try {
      await renderOrders(user);
    } catch (e) {
      console.error('Render orders error:', e);
    }
    showTab('orders');
  } else {
    document.getElementById('user-name').textContent = 'GAGAL MEMUAT';
    document.getElementById('user-email').textContent = 'Periksa koneksi atau login ulang.';
    document.getElementById('orders-list').innerHTML = '<p style="text-align:center;font-weight:700;color:red;padding:2rem;">Gagal memuat data. Pastikan backend berjalan.</p>';
  }

  // Form submit handler
  document.getElementById('profile-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = await fetchUserProfile();
    if (!user) return;

    const updatedData = {
      nama: document.getElementById('edit-nama').value,
      telepon: document.getElementById('edit-telepon').value,
      alamat: document.getElementById('edit-alamat').value,
      kota: document.getElementById('edit-kota').value,
      provinsi: document.getElementById('edit-provinsi').value,
    };

    try {
      const response = await fetch(`${API_AUTH}/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify(updatedData),
      });
      const data = await response.json();
      if (data.success) {
        alert('Profil berhasil diperbarui!');
        window.location.reload();
      } else {
        alert(data.message || 'Gagal memperbarui profil.');
      }
    } catch (error) {
      alert('Terjadi kesalahan. Pastikan server berjalan.');
    }
  });
});
