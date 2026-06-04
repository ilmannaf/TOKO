// JS/auth.js
// File ini dipanggil di semua halaman untuk:
// 1. Cek apakah user sudah login
// 2. Tampilkan nama user di navbar
// 3. Fungsi logout

// ─────────────────────────────────────────────
// CEK STATUS LOGIN
// ─────────────────────────────────────────────
function getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

function getToken() {
  return localStorage.getItem('token') || null;
}

function isLoggedIn() {
  return !!getToken() && !!getUser();
}

// ─────────────────────────────────────────────
// UPDATE NAVBAR — tampilkan nama user / tombol login
// Panggil fungsi ini di setiap halaman
// ─────────────────────────────────────────────
function updateNavbar() {
  const navAuth = document.getElementById('nav-auth');
  if (!navAuth) return;

  if (isLoggedIn()) {
    const user = getUser();
    navAuth.innerHTML = `
      <div class="flex items-center gap-3">
        <span class="text-sm font-medium text-gray-700">
          👋 Halo, <span class="text-indigo-600 font-semibold">${user.nama}</span>
        </span>
        <button onclick="logout()"
          class="text-sm bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors font-medium">
          Keluar
        </button>
      </div>
    `;
  } else {
    navAuth.innerHTML = `
      <a href="login.html"
        class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm font-medium">
        Login
      </a>
    `;
  }
}

// ─────────────────────────────────────────────
// LOGOUT
// ─────────────────────────────────────────────
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}

// ─────────────────────────────────────────────
// REDIRECT JIKA SUDAH LOGIN
// Panggil di halaman login & register
// ─────────────────────────────────────────────
function redirectIfLoggedIn() {
  if (isLoggedIn()) {
    window.location.href = 'index.html';
  }
}

// Jalankan updateNavbar otomatis saat halaman dimuat
document.addEventListener('DOMContentLoaded', updateNavbar);