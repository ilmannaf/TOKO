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
}

// Render Eco-Points
function renderEcoPoints(user) {
  const level = user.pohon_level || 1;
  const xp = user.pohon_xp || 0;
  const nextLevelXp = level * 500;
  const xpPercentage = Math.min((xp / nextLevelXp) * 100, 100);

  let emoji = '🌱', sebutan = 'Tunas Harapan';
  if (level >= 2) { emoji = '🌿'; sebutan = 'Bibit Muda'; }
  if (level >= 3) { emoji = '🪴'; sebutan = 'Tanaman Hijau'; }
  if (level >= 4) { emoji = '🌲'; sebutan = 'Pohon Rindang'; }
  if (level >= 5) { emoji = '🌳'; sebutan = 'Pohon Kehidupan'; }

  document.getElementById('eco-tree-emoji').textContent = emoji;
  document.getElementById('eco-level-text').textContent = `Level ${level}: ${sebutan}`;
  document.getElementById('eco-progress-bar').style.width = `${xpPercentage}%`;
  document.getElementById('eco-xp-text').textContent = `${xp} / ${nextLevelXp} XP`;
  document.getElementById('eco-total-points').textContent = `${(level * 1000).toLocaleString()} Pts`;
  document.getElementById('eco-carbon-saved').textContent = `${(level * 15).toFixed(1)} kg`;
}

// Fetch orders
async function fetchOrders() {
  const user = await fetchUserProfile();
  if (!user || !user.id) return [];

  try {
    const response = await fetch(`${API_ORDERS}/user/${user.id}`);
    const data = await response.json();
    return data.success ? data.pesanan : [];
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

// Render orders
async function renderOrders() {
  const orders = await fetchOrders();
  const listEl = document.getElementById('orders-list');

  if (orders.length === 0) {
    listEl.innerHTML = `
      <div class="text-center py-8">
        <i class="fas fa-shopping-bag text-5xl text-gray-300 mb-4"></i>
        <p class="text-gray-500 mb-4">Belum ada pesanan</p>
        <a href="toko.html" class="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700">Mulai Belanja</a>
      </div>
    `;
    return;
  }

  listEl.innerHTML = orders.map(order => `
    <div class="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div class="flex justify-between items-start mb-3">
        <div>
          <p class="text-sm text-gray-500">${formatDate(order.created_at)}</p>
          <p class="font-bold text-indigo-600">#${order.nomor_pesanan}</p>
        </div>
        <span class="px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(order.status)}">${order.status}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">${order.jumlah_item || 0} produk</span>
        <span class="font-semibold text-gray-800">${formatRupiah(order.total)}</span>
      </div>
      <a href="Tracking.html?nomor=${order.nomor_pesanan}" class="mt-3 inline-block text-indigo-600 text-sm font-medium hover:underline">Lacak Pesanan →</a>
    </div>
  `).join('');
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
  document.getElementById(`content-${tab}`).classList.remove('hidden');
  
  document.querySelectorAll('[id^="tab-"]').forEach(el => {
    el.classList.remove('bg-indigo-50', 'text-indigo-600');
    el.classList.add('text-gray-600', 'hover:bg-gray-50');
  });
  
  const tabEl = document.getElementById(`tab-${tab}`);
  tabEl.classList.add('bg-indigo-50', 'text-indigo-600');
  tabEl.classList.remove('text-gray-600', 'hover:bg-gray-50');
}

// Handle form submit
document.addEventListener('DOMContentLoaded', async () => {
  const user = await fetchUserProfile();
  if (user) {
    renderProfile(user);
    renderEcoPoints(user);
    await renderOrders();
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
