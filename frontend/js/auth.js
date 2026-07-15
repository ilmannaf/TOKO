// frontend/js/auth.js

// Mengambil token dari localStorage
function getToken() {
  return localStorage.getItem('token');
}

// Mengambil data user dari localStorage
function getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// Cek apakah user sudah login
function isLoggedIn() {
  return !!getToken();
}

// Fungsi untuk logout
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('ecoData'); // Bersihkan juga data gamifikasi lokal
  window.location.href = 'index.html';
}

// Redirect ke index jika user sudah login (dipakai di login.html / register.html)
function redirectIfLoggedIn() {
  if (isLoggedIn()) {
    window.location.href = 'index.html';
  }
}

// Redirect ke login jika user belum login (dipakai di halaman transaksi/dashboard privat)
function redirectIfNotLoggedIn() {
  if (!isLoggedIn()) {
    window.location.href = 'login.html';
  }
}

// Mengupdate UI Navbar berdasarkan status login
function updateNavbar() {
  const token = getToken();
  const user = getUser();

  // Desktop Navbar Elements
  const menuList = document.querySelector('nav ul');
  const desktopAuthContainer = document.querySelector('nav div.hidden.md\\:block');

  // Mobile Navbar Elements
  const mobileAuthContainer = document.querySelector('nav div.md\\:hidden');

  if (token && user) {
    // 1. Tampilan Navbar Desktop jika Login
    if (desktopAuthContainer) {
      desktopAuthContainer.innerHTML = `
        <div class="flex items-center gap-4">
          <a href="profile.html" style="font-size:0.875rem;font-weight:500;color:var(--text-secondary);">
            Halo, <strong style="font-weight:600;color:var(--primary);">${user.nama}</strong>
          </a>
          <button onclick="logout()" class="modern-btn modern-btn-danger modern-btn-sm">
            Logout
          </button>
        </div>
      `;
    }
  } else {
    // 2. Tampilan Navbar Desktop jika Belum Login
    if (desktopAuthContainer) {
      desktopAuthContainer.innerHTML = `
        <a href="login.html" class="modern-btn modern-btn-primary">
          Login
        </a>
      `;
    }
  }
}

// ─── Admin Auth Helpers ───────────────────
function getAdminToken() {
  return localStorage.getItem('admin_token');
}

function getAdminUser() {
  const u = localStorage.getItem('admin_user');
  return u ? JSON.parse(u) : null;
}

function isAdminLoggedIn() {
  return !!getAdminToken();
}

function adminLogout() {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
  window.location.href = 'admin/login.html';
}

// Panggil updateNavbar saat dokumen selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
  updateNavbar();
});
